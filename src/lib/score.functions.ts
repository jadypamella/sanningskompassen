import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const TACTIC_IDS = [
  "clickbait",
  "false_authority",
  "out_of_context_image",
  "fear_outrage_hook",
  "us_vs_them",
] as const;

const InputSchema = z.object({
  topic_id: z.string().uuid(),
  answers: z.object({
    clickbait: z.string().min(5).max(280),
    false_authority: z.string().min(5).max(280),
    out_of_context_image: z.string().min(5).max(280),
    fear_outrage_hook: z.string().min(5).max(280),
    us_vs_them: z.string().min(5).max(280),
  }),
});

const TacticResult = z.object({
  id: z.enum(TACTIC_IDS),
  used: z.boolean(),
  tactic_score: z.number().int().min(0).max(20),
  feedback: z.string().min(1),
  spot_lesson: z.string().min(1),
});

const LlmSchema = z.object({
  manipulation_score: z.number().int().min(0).max(100),
  tactics: z.array(TacticResult).length(5),
  badge: z.object({ slug: z.string(), name: z.string(), min_score: z.number().int() }),
  closing_takeaway: z.string().min(1),
});

const SYSTEM_PROMPT = `You are the scoring engine for Sanningskompassen, an educational app that teaches young Swedish voters to spot manipulation in political content by having them WRITE fake news in 5 guided steps. Evaluate how well the user used each of 5 manipulation tactics and return a strict JSON object.

The 5 tactics:
1. clickbait
2. false_authority
3. out_of_context_image
4. fear_outrage_hook
5. us_vs_them

For each tactic, score 0 to 20 points (intensity 0-12, clarity 0-5, originality 0-3). Sum into manipulation_score 0-100.

Map score to badge:
- 0-39 unsure_apprentice "Unsure Apprentice"
- 40-69 apprentice_liar "Apprentice of the Lie"
- 70-89 journeyman_of_deceit "Journeyman of Deceit"
- 90-100 master_manipulator "Master Manipulator"

For each tactic write a one-sentence feedback explaining what the user did, and a one-sentence spot_lesson teaching how to recognise that tactic in the wild.

Tone: direct, curious, slightly irreverent, no moralism, no exclamation marks. Write for a sharp 19-year-old in Tensta.

Return ONLY valid JSON in this exact shape:

{
  "manipulation_score": <int>,
  "tactics": [
    { "id": "clickbait", "used": <bool>, "tactic_score": <int>, "feedback": "<sentence>", "spot_lesson": "<sentence>" },
    { "id": "false_authority", "used": <bool>, "tactic_score": <int>, "feedback": "<sentence>", "spot_lesson": "<sentence>" },
    { "id": "out_of_context_image", "used": <bool>, "tactic_score": <int>, "feedback": "<sentence>", "spot_lesson": "<sentence>" },
    { "id": "fear_outrage_hook", "used": <bool>, "tactic_score": <int>, "feedback": "<sentence>", "spot_lesson": "<sentence>" },
    { "id": "us_vs_them", "used": <bool>, "tactic_score": <int>, "feedback": "<sentence>", "spot_lesson": "<sentence>" }
  ],
  "badge": { "slug": "<slug>", "name": "<name>", "min_score": <int> },
  "closing_takeaway": "<sentence>"
}`;

function sanitize(s: string): string {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x09\x0B-\x1F]/g, "")
    .trim()
    .slice(0, 280);
}

function badgeFor(score: number) {
  if (score >= 90) return { slug: "master_manipulator", name: "Master Manipulator", min_score: 90 };
  if (score >= 70) return { slug: "journeyman_of_deceit", name: "Journeyman of Deceit", min_score: 70 };
  if (score >= 40) return { slug: "apprentice_liar", name: "Apprentice of the Lie", min_score: 40 };
  return { slug: "unsure_apprentice", name: "Unsure Apprentice", min_score: 0 };
}

async function callLLM(payload: unknown): Promise<z.infer<typeof LlmSchema>> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify(payload) },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    console.error(`[score] AI gateway ${res.status}: ${t.slice(0, 500)}`);
    throw new Error("AI service unavailable");
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  const jsonText = typeof content === "string" ? content : JSON.stringify(content);
  const cleaned = jsonText.replace(/^```json\s*|\s*```$/g, "").trim();
  const parsed = JSON.parse(cleaned);
  return LlmSchema.parse(parsed);
}

export const scoreSubmission = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const cleanedAnswers = {
      clickbait: sanitize(data.answers.clickbait),
      false_authority: sanitize(data.answers.false_authority),
      out_of_context_image: sanitize(data.answers.out_of_context_image),
      fear_outrage_hook: sanitize(data.answers.fear_outrage_hook),
      us_vs_them: sanitize(data.answers.us_vs_them),
    };

    const { data: topic, error: topicErr } = await supabaseAdmin
      .from("topics")
      .select("id, title")
      .eq("id", data.topic_id)
      .maybeSingle();
    if (topicErr || !topic) throw new Error("Topic not found");

    const { data: run, error: runErr } = await supabaseAdmin
      .from("runs")
      .insert({ topic_id: topic.id, status: "in_progress" })
      .select("id")
      .single();
    if (runErr || !run) throw new Error("Could not start run");

    let llm: z.infer<typeof LlmSchema> | null = null;
    let lastErr: unknown = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        llm = await callLLM({ topic: topic.title, answers: cleanedAnswers });
        break;
      } catch (e) {
        lastErr = e;
        console.error(`[score] attempt ${attempt + 1} failed`, e);
      }
    }

    if (!llm) {
      await supabaseAdmin.from("runs").update({ status: "failed" }).eq("id", run.id);
      throw new Error("Scoring failed: " + String(lastErr));
    }

    // Re-derive badge defensively (in case the model picked an off-band slug)
    const correctedBadge = badgeFor(llm.manipulation_score);
    const tacticsUsed = llm.tactics.filter((t) => t.used).length;

    await supabaseAdmin.from("tactic_results").insert(
      llm.tactics.map((t) => ({
        run_id: run.id,
        tactic_id: t.id,
        user_text: cleanedAnswers[t.id as keyof typeof cleanedAnswers],
        detected: t.used,
        tactic_score: t.tactic_score,
        feedback: t.feedback,
        spot_lesson: t.spot_lesson,
      })),
    );

    await supabaseAdmin
      .from("runs")
      .update({
        status: "scored",
        manipulation_score: llm.manipulation_score,
        tactics_used: tacticsUsed,
        badge_slug: correctedBadge.slug,
        closing_takeaway: llm.closing_takeaway,
        completed_at: new Date().toISOString(),
      })
      .eq("id", run.id);

    return { runId: run.id };
  });

export const getRunResult = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ runId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: run, error: runErr } = await supabaseAdmin
      .from("runs")
      .select("id, manipulation_score, tactics_used, badge_slug, status, closing_takeaway, topic_id, created_at")
      .eq("id", data.runId)
      .maybeSingle();
    if (runErr || !run) throw new Error("Run not found");

    const [{ data: tactics }, { data: badge }, { data: topic }, { count }] = await Promise.all([
      supabaseAdmin.from("tactic_results").select("*").eq("run_id", run.id),
      run.badge_slug
        ? supabaseAdmin.from("badges").select("*").eq("slug", run.badge_slug).maybeSingle()
        : Promise.resolve({ data: null }),
      run.topic_id
        ? supabaseAdmin.from("topics").select("title, slug").eq("id", run.topic_id).maybeSingle()
        : Promise.resolve({ data: null }),
      supabaseAdmin
        .from("runs")
        .select("id", { count: "exact", head: true })
        .eq("status", "scored")
        .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    ]);

    return {
      run,
      tactics: tactics ?? [],
      badge: badge ?? null,
      topic: topic ?? null,
      workshopsToday: count ?? 0,
    };
  });
