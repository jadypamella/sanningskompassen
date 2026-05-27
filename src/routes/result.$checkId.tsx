import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { VerdictPill } from "@/components/VerdictPill";
import { TacticXrayCard, type TacticAnalysis } from "@/components/TacticXrayCard";
import { MilestoneCard } from "@/components/MilestoneCard";
import { ClosingCTA } from "@/components/ClosingCTA";
import { getCheck } from "@/lib/analyze.functions";
import { TACTICS } from "@/lib/tactics";
import { incrementChecksCount } from "@/lib/session";
import { Loader2, Hand, Wrench } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/result/$checkId")({
  head: ({ params }) => ({
    meta: [
      { title: `Check result · Sanningskompassen` },
      { name: "description", content: `Verdict and manipulation tactic X-ray for check ${params.checkId}.` },
    ],
  }),
  component: ResultPage,
});

type CheckRow = {
  id: string;
  claim_text: string;
  verdict: "true" | "uncertain" | "false";
  confidence: "high" | "medium" | "low";
  explanation: string;
  tactics: TacticAnalysis[];
  created_at: string;
};

function ResultPage() {
  const { checkId } = Route.useParams();
  const navigate = useNavigate();
  const fetchCheck = useServerFn(getCheck);
  const { t } = useT();

  const [data, setData] = useState<{ check: CheckRow; checksToday: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    setSessionCount(incrementChecksCount());
  }, [checkId]);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setErr(null);
    fetchCheck({ data: { checkId } })
      .then((d) => {
        if (!cancelled) setData(d as unknown as { check: CheckRow; checksToday: number });
      })
      .catch((e) => {
        console.error(e);
        if (!cancelled) {
          setErr(t("result.notFound"));
          setTimeout(() => navigate({ to: "/" }), 1500);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [checkId, fetchCheck, navigate, t]);

  if (err) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center text-navy">{err}</div>
      </AppShell>
    );
  }

  if (!data) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-20 flex flex-col items-center gap-4 text-navy">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
          <p className="text-sm text-muted-foreground">{t("result.loading")}</p>
        </div>
      </AppShell>
    );
  }

  // Normalise tactics array to always show all 5 in canonical order
  const orderedTactics: TacticAnalysis[] = TACTICS.map((tt) => {
    const found = data.check.tactics.find((x) => x.id === tt.id);
    return (
      found ?? { id: tt.id, detected: false, how_used: "", spot_lesson: "" }
    );
  });

  const milestoneUnlocked = sessionCount >= 3;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-14 space-y-8">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-gold">
            {t("result.crumb.home")}
          </Link>{" "}
          / {t("result.crumb.your")}
        </nav>

        {/* Claim */}
        <div className="rounded-xl bg-paper border border-border p-5">
          <div className="text-[10px] uppercase tracking-[3px] text-gold font-semibold mb-2">{t("result.claim")}</div>
          <p className="font-display font-semibold text-navy text-lg italic">
            &ldquo;{data.check.claim_text}&rdquo;
          </p>
        </div>

        {/* Verdict */}
        <div className="flex justify-center py-2">
          <VerdictPill verdict={data.check.verdict} confidence={data.check.confidence} />
        </div>

        {/* Explanation */}
        <p className="text-navy text-base md:text-lg text-center max-w-2xl mx-auto">{data.check.explanation}</p>

        {/* X-ray */}
        <section>
          <h2 className="font-display font-bold text-navy text-xl md:text-2xl mb-4">
            {t("result.tacticsTitle")}
          </h2>
          <div className="space-y-3">
            {orderedTactics.map((tt, i) => (
              <TacticXrayCard key={tt.id} tactic={tt} index={i} />
            ))}
          </div>
        </section>

        {milestoneUnlocked && <MilestoneCard />}

        <ClosingCTA />

        <div className="text-center text-sm text-muted-foreground space-y-2">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/spot" className="inline-flex items-center gap-1.5 underline decoration-gold underline-offset-4">
              <Hand className="h-3.5 w-3.5" /> {t("result.cta.spot")}
            </Link>
            <Link to="/workshop" className="inline-flex items-center gap-1.5 underline decoration-gold underline-offset-4">
              <Wrench className="h-3.5 w-3.5" /> {t("result.cta.workshop")}
            </Link>
          </div>
          <div className="text-xs">{t("result.checksToday", { n: data.checksToday })}</div>
        </div>
      </div>
    </AppShell>
  );
}
