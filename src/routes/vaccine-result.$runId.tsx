import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CompassMark } from "@/components/CompassMark";
import { getRunResult } from "@/lib/score.functions";
import { TACTICS, reachBand } from "@/lib/tactics";
import { Award, ArrowRight, RotateCcw, MapPin, BookOpen } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/vaccine-result/$runId")({
  head: () => ({
    meta: [
      { title: "Your X-ray · Sanningskompassen" },
      { name: "description", content: "Your manipulation score and tactic breakdown." },
    ],
  }),
  component: ResultPage,
});

function useCountUp(target: number, duration = 1500) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (ts: number) => {
      const p = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

function ResultPage() {
  const { runId } = Route.useParams();
  const navigate = useNavigate();
  const fetchRun = useServerFn(getRunResult);
  const { t } = useT();

  const { data, isLoading, error } = useQuery({
    queryKey: ["run", runId],
    queryFn: () => fetchRun({ data: { runId } }),
    retry: false,
  });

  useEffect(() => {
    if (error) {
      const id = setTimeout(() => navigate({ to: "/" }), 1500);
      return () => clearTimeout(id);
    }
  }, [error, navigate]);

  const score = data?.run?.manipulation_score ?? 0;
  const animatedScore = useCountUp(score);

  if (isLoading) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted-foreground">{t("run.loading")}</div>
      </AppShell>
    );
  }

  if (error || !data?.run) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted-foreground">
          {t("run.notFound")}
        </div>
      </AppShell>
    );
  }

  const band = reachBand(score);
  const bandLabel = t(`run.band.${band}`);

  return (
    <AppShell>
      <section className="mx-auto max-w-3xl px-4 py-10">
        <nav className="text-xs uppercase tracking-[3px] text-muted-foreground mb-6">
          <Link to="/workshop" className="hover:text-gold">{t("run.crumb.workshop")}</Link>
          <span className="mx-2">/</span>
          <span className="text-navy">{t("run.crumb.your")}</span>
        </nav>

        {/* Score hero */}
        <div className="text-center py-6">
          <div className="text-xs uppercase tracking-[4px] text-gold font-semibold mb-2">{t("run.score.kicker")}</div>
          <div className="font-display font-extrabold text-navy text-[120px] md:text-[160px] leading-none tabular-nums">
            {animatedScore}
          </div>
          <div className="mx-auto mt-2 h-1 w-24 rounded bg-gold" />
          <p className="mt-5 text-lg text-navy">
            {t("run.score.before")}
            <span className={`font-semibold ${band === "high" ? "text-lie" : band === "medium" ? "text-gold" : "text-truth"}`}>
              {bandLabel}
            </span>
            {t("run.score.after")}
          </p>
        </div>

        {/* Breakdown */}
        <div className="mt-8 space-y-3">
          {TACTICS.map((tt, i) => {
            const r = data.tactics.find((x) => x.tactic_id === tt.id);
            const detected = !!r?.detected;
            return (
              <div
                key={tt.id}
                style={{ animationDelay: `${i * 80}ms` }}
                className="rounded-lg border border-border bg-background p-5 animate-in fade-in slide-in-from-bottom-2"
              >
                <div className="flex items-start gap-4">
                  <tt.icon className={`h-6 w-6 mt-0.5 ${detected ? "text-gold" : "text-muted-foreground/50"}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <h3 className={`font-display font-bold text-navy text-lg ${!detected ? "line-through decoration-muted-foreground/40" : ""}`}>
                        {tt.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] uppercase tracking-[2px] font-semibold px-2 py-0.5 rounded ${
                            detected ? "bg-gold/20 text-gold" : "bg-border text-muted-foreground"
                          }`}
                        >
                          {detected ? t("run.detected") : t("run.missed")}
                        </span>
                        <span className="tabular-nums text-sm font-semibold text-navy">{r?.tactic_score ?? 0}/20</span>
                      </div>
                    </div>
                    {r?.feedback && <p className="text-sm text-muted-foreground mt-2">{r.feedback}</p>}
                    {r?.spot_lesson && (
                      <div className="mt-3 rounded-md bg-paper border border-border p-3 text-sm text-navy">
                        <span className="font-semibold text-gold">{t("run.spotIt")}</span> {r.spot_lesson}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Badge */}
        <div className="mt-10 rounded-xl border border-gold/40 bg-paper p-6 md:p-8 text-center animate-in fade-in zoom-in-95 duration-700">
          <div className="flex justify-center mb-3">
            <Award className="h-10 w-10 text-gold" />
          </div>
          <div className="text-xs uppercase tracking-[3px] text-gold font-semibold mb-1">{t("run.badge.unlocked")}</div>
          <h2 className="font-display font-extrabold text-navy text-3xl">{data.badge?.name ?? t("spot.badge.apprentice")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{data.badge?.description}</p>
          {data.run.closing_takeaway && (
            <p className="mt-5 font-display text-lg text-navy italic max-w-xl mx-auto">
              "{data.run.closing_takeaway}"
            </p>
          )}
        </div>

        {/* Closing CTA */}
        <div className="mt-10 relative overflow-hidden rounded-xl bg-navy text-paper p-8 md:p-10">
          <div className="absolute inset-0 bg-halftone-gold opacity-20 pointer-events-none" />
          <div className="relative">
            <CompassMark size={64} className="mb-4" />
            <h2 className="font-display font-extrabold text-3xl md:text-4xl leading-tight">
              {t("run.cta.h")}
            </h2>
            <p className="mt-3 text-paper/85">{t("run.cta.p")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://val.se/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-3 font-semibold text-navy hover:brightness-95"
              >
                <MapPin className="h-4 w-4" /> {t("run.cta.polling")}
              </a>
              <Link
                to="/workshop"
                className="inline-flex items-center gap-2 rounded-md border border-paper/30 px-5 py-3 font-semibold text-paper hover:bg-paper/10"
              >
                <RotateCcw className="h-4 w-4" /> {t("run.cta.another")}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground">
          <Link to="/research" className="inline-flex items-center gap-1 hover:text-gold">
            <BookOpen className="h-3 w-3" /> {t("run.readResearch")} <ArrowRight className="h-3 w-3" />
          </Link>
          <span>{t("run.workshopsToday")} <span className="tabular-nums text-navy font-semibold">{data.workshopsToday}</span></span>
        </div>
      </section>
    </AppShell>
  );
}
