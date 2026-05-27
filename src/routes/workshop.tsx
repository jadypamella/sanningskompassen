import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TACTICS, type TacticId } from "@/lib/tactics";
import { listTopics } from "@/lib/topics.functions";
import { scoreSubmission } from "@/lib/score.functions";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/workshop")({
  head: () => ({
    meta: [
      { title: "Workshop · Sanningskompassen" },
      {
        name: "description",
        content: "Pick a Järva election topic and write your own fake news in 5 guided steps.",
      },
    ],
  }),
  component: WorkshopPage,
});

type Answers = Record<TacticId, string>;
const EMPTY: Answers = {
  clickbait: "",
  false_authority: "",
  out_of_context_image: "",
  fear_outrage_hook: "",
  us_vs_them: "",
};

function WorkshopPage() {
  const navigate = useNavigate();
  const fetchTopics = useServerFn(listTopics);
  const submit = useServerFn(scoreSubmission);
  const { t } = useT();

  const LOADING_LINES = [
    t("workshop.loading.0"),
    t("workshop.loading.1"),
    t("workshop.loading.2"),
    t("workshop.loading.3"),
  ];

  const { data: topics, isLoading: topicsLoading, error: topicsError } =
    useQuery({ queryKey: ["topics"], queryFn: () => fetchTopics() });

  const [topicId, setTopicId] = useState<string | null>(null);
  const [step, setStep] = useState(0); // 0..4
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingLine, setLoadingLine] = useState(0);

  useEffect(() => {
    if (!submitting) return;
    const id = setInterval(() => setLoadingLine((i) => (i + 1) % 4), 1500);
    return () => clearInterval(id);
  }, [submitting]);

  const tactic = TACTICS[step];
  const value = answers[tactic.id];
  const valid = value.trim().length >= 5 && value.trim().length <= 280;

  async function handleSubmit() {
    if (!topicId) return;
    setSubmitting(true);
    setError(null);
    try {
      const { runId } = await submit({ data: { topic_id: topicId, answers } });
      navigate({ to: "/result/$runId", params: { runId } });
    } catch (e) {
      console.error(e);
      setError(t("workshop.error"));
      setSubmitting(false);
    }
  }

  // Topic select
  if (!topicId) {
    return (
      <AppShell>
        <section className="mx-auto max-w-5xl px-4 py-12">
          <div className="text-xs uppercase tracking-[4px] text-gold font-semibold mb-2">{t("workshop.step0.kicker")}</div>
          <h1 className="font-display font-extrabold text-navy text-4xl mb-2">{t("workshop.step0.h")}</h1>
          <p className="text-muted-foreground mb-8">{t("workshop.step0.p")}</p>

          {topicsLoading && <div className="text-muted-foreground">{t("workshop.step0.loading")}</div>}
          {topicsError && (
            <div className="rounded-md border border-border bg-background p-4 text-sm">
              {t("workshop.step0.empty")}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {topics?.map((tp) => (
              <button
                key={tp.id}
                onClick={() => {
                  setTopicId(tp.id);
                  setStep(0);
                  setAnswers(EMPTY);
                }}
                className="text-left rounded-lg border border-border bg-background p-6 hover:border-gold hover:shadow-md transition group"
              >
                {tp.demo_default && (
                  <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[2px] text-gold font-semibold mb-2">
                    <Sparkles className="h-3 w-3" /> {t("workshop.step0.recommended")}
                  </div>
                )}
                <h3 className="font-display font-extrabold text-navy text-xl mb-1">{tp.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{tp.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-navy group-hover:text-gold">
                  {t("workshop.step0.start")} <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>
        </section>
      </AppShell>
    );
  }

  // Submitting state
  if (submitting) {
    return (
      <AppShell>
        <section className="mx-auto max-w-2xl px-4 py-24 text-center">
          <Loader2 className="mx-auto h-10 w-10 text-gold animate-spin" />
          <p className="mt-6 font-display font-bold text-navy text-2xl">{LOADING_LINES[loadingLine]}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("workshop.submitting.tagline")}</p>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-3xl px-4 py-10">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {TACTICS.map((tt, i) => (
            <div
              key={tt.id}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < step ? "bg-navy" : i === step ? "bg-gold" : "bg-border"
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-lie/30 bg-lie/10 p-4 text-sm text-navy">
            <p className="font-semibold mb-2">{error}</p>
            <div className="flex gap-2">
              <button onClick={handleSubmit} className="rounded-md bg-navy px-3 py-1.5 text-paper text-sm font-medium">
                {t("workshop.tryAgain")}
              </button>
              <button
                onClick={() => {
                  setTopicId(null);
                  setError(null);
                }}
                className="rounded-md border border-border px-3 py-1.5 text-navy text-sm font-medium"
              >
                {t("workshop.pickAnother")}
              </button>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border bg-background p-6 md:p-8">
          <div className="mb-5 flex items-start justify-between gap-3 rounded-lg border border-gold/30 bg-gold/5 px-4 py-3">
            <div>
              <div className="text-[10px] uppercase tracking-[2px] text-gold font-semibold">{t("workshop.topicLabel")}</div>
              <div className="font-display font-bold text-navy text-sm md:text-base">
                {topics?.find((tp) => tp.id === topicId)?.title ?? "—"}
              </div>
            </div>
            <button
              onClick={() => {
                setTopicId(null);
                setStep(0);
                setAnswers(EMPTY);
                setError(null);
              }}
              className="text-xs font-semibold text-navy underline-offset-4 hover:underline shrink-0"
            >
              {t("workshop.changeTopic")}
            </button>
          </div>
          <div className="text-xs uppercase tracking-[4px] text-gold font-semibold mb-2">
            {t("workshop.tacticOf", { step: step + 1 })}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <tactic.icon className="h-6 w-6 text-navy" />
            <h1 className="font-display font-extrabold text-navy text-2xl md:text-3xl">{tactic.name}</h1>
          </div>
          <p className="text-muted-foreground mb-4 leading-relaxed">{tactic.intro}</p>
          <p className="text-sm text-navy italic mb-5 border-l-2 border-gold pl-3">[ {tactic.example} ]</p>

          <textarea
            value={value}
            onChange={(e) => setAnswers({ ...answers, [tactic.id]: e.target.value.slice(0, 280) })}
            placeholder={tactic.placeholder}
            rows={5}
            className="w-full rounded-md border border-border bg-paper p-3 text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{value.trim().length < 5 ? t("workshop.minChars") : <>&nbsp;</>}</span>
            <span className="tabular-nums">{value.length} / 280</span>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => {
                if (step === 0) {
                  setTopicId(null);
                  setAnswers(EMPTY);
                  setError(null);
                } else {
                  setStep((s) => s - 1);
                }
              }}

              className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground disabled:opacity-40 hover:text-navy"
            >
              <ArrowLeft className="h-4 w-4" /> {t("workshop.back")}
            </button>
            {step < 4 ? (
              <button
                onClick={() => valid && setStep((s) => s + 1)}
                disabled={!valid}
                className="inline-flex items-center gap-2 rounded-md bg-navy px-5 py-2.5 font-semibold text-paper disabled:opacity-40 hover:bg-navy/90"
              >
                {t("workshop.next")} <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!valid || !Object.values(answers).every((v) => v.trim().length >= 5)}
                className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-2.5 font-semibold text-navy disabled:opacity-40 hover:brightness-95"
              >
                {t("workshop.submit")} <CheckCircle2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
