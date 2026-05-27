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

const TacticSchema = z.object({
  id: z.enum(TACTIC_IDS),
  detected: z.boolean(),
  how_used: z.string(),
  spot_lesson: z.string(),
});

const LlmSchema = z.object({
  claim: z.string(),
  verdict: z.enum(["true", "uncertain", "false"]),
  confidence: z.enum(["high", "medium", "low"]),
  explanation: z.string().min(1),
  tactics: z.array(TacticSchema).length(5),
});

const InputSchema = z.object({
  claim: z.string().min(10).max(1000),
  session_id: z.string().min(1).max(64).optional(),
});

const SYSTEM_PROMPT = `You are the analysis engine for Sanningskompassen, an educational app that helps young Swedish voters in Järva spot manipulation in political content. Given a single political claim, return a strict JSON object containing a verdict, a confidence level, a short explanation, and a tactic-by-tactic X-ray.

The 5 manipulation tactics to check for:
1. clickbait, headline that screams or asks an emotional rhetorical question
2. false_authority, invented or vague source that sounds credible but cannot be verified
3. out_of_context_image, real image with a fabricated caption that does not match its real context (only detectable if the claim references an image or photo)
4. fear_outrage_hook, sentence designed to trigger fear or anger before reasoning
5. us_vs_them, framing that divides good-us against bad-them

For each tactic, decide detected = true or false. If detected = true, write a one-sentence how_used explaining how this specific claim applied the tactic, and a one-sentence spot_lesson teaching the reader to recognise that tactic in the wild. If detected = false, leave how_used and spot_lesson as empty strings.

Verdict rules:
- "true": factually accurate, no manipulation tactics detected, supported by widely-known facts.
- "uncertain": partially true, or unverifiable from general knowledge.
- "false": contradicts widely-known facts, OR uses manipulation tactics that make it functionally misleading.

Confidence:
- "high": LLM is confident based on general knowledge.
- "medium": reasonable but with limits.
- "low": cannot fully verify, best effort.

Tone for explanation, how_used, and spot_lesson: direct, curious, slightly irreverent, no moralism, no exclamation marks. Write for a 19-year-old in Tensta who is sharp and short on patience. Use plain English, never jargon.

Return ONLY valid JSON in this exact shape, no markdown:

{
  "claim": "<echo the input claim, trimmed>",
  "verdict": "<true | uncertain | false>",
  "confidence": "<high | medium | low>",
  "explanation": "<one or two sentences>",
  "tactics": [
    { "id": "clickbait", "detected": <bool>, "how_used": "<string>", "spot_lesson": "<string>" },
    { "id": "false_authority", "detected": <bool>, "how_used": "<string>", "spot_lesson": "<string>" },
    { "id": "out_of_context_image", "detected": <bool>, "how_used": "<string>", "spot_lesson": "<string>" },
    { "id": "fear_outrage_hook", "detected": <bool>, "how_used": "<string>", "spot_lesson": "<string>" },
    { "id": "us_vs_them", "detected": <bool>, "how_used": "<string>", "spot_lesson": "<string>" }
  ]
}`;

function sanitize(s: string): string {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x09\x0B-\x1F]/g, "")
    .trim()
    .slice(0, 1000);
}

async function callLLM(claim: string): Promise<z.infer<typeof LlmSchema>> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify({ claim }) },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) throw new Error(`AI gateway ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  const text = typeof content === "string" ? content : JSON.stringify(content);
  const cleaned = text.replace(/^```json\s*|\s*```$/g, "").trim();
  return LlmSchema.parse(JSON.parse(cleaned));
}

export const analyzeClaim = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const claim = sanitize(data.claim);
    if (claim.length < 10) throw new Error("input_too_short");

    let result: z.infer<typeof LlmSchema> | null = null;
    let lastErr: unknown = null;
    for (let i = 0; i < 2; i++) {
      try {
        result = await callLLM(claim);
        break;
      } catch (e) {
        lastErr = e;
        console.error(`[analyze] attempt ${i + 1} failed`, e);
      }
    }
    if (!result) throw new Error("analysis_failed: " + String(lastErr));

    const { data: row, error } = await supabaseAdmin
      .from("checks")
      .insert({
        session_id: data.session_id ?? null,
        claim_text: claim,
        verdict: result.verdict,
        confidence: result.confidence,
        explanation: result.explanation,
        tactics: result.tactics,
      })
      .select("id")
      .single();
    if (error || !row) throw new Error("Could not save check");

    return { checkId: row.id };
  });

export const getCheck = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ checkId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: check, error } = await supabaseAdmin
      .from("checks")
      .select("id, claim_text, verdict, confidence, explanation, tactics, created_at")
      .eq("id", data.checkId)
      .maybeSingle();
    if (error || !check) throw new Error("Check not found");

    const { count } = await supabaseAdmin
      .from("checks")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

    return { check, checksToday: count ?? 0 };
  });

export const listExampleClaims = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("example_claims")
    .select("slug, label, claim_text, demo_default")
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});
