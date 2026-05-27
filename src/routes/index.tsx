import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { CompassMark } from "@/components/CompassMark";
import { ArrowRight, BookOpen, Sparkles, Loader2, Hand, Zap, Target, Flame } from "lucide-react";
import { analyzeClaim, listExampleClaims } from "@/lib/analyze.functions";
import { getSessionId } from "@/lib/session";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sanningskompassen, The Truth Compass" },
      {
        name: "description",
        content:
          "Paste any political claim. See the verdict, the manipulation tactics behind it, and learn to spot the next lie on your own. Built for young voters in Järva.",
      },
      { property: "og:title", content: "Sanningskompassen, The Truth Compass" },
      {
        property: "og:description",
        content: "Paste any political claim. See the trick behind it. Built at Järvaveckan 2026.",
      },
    ],
  }),
  loader: async () => {
    try {
      const examples = await listExampleClaims();
      return { examples };
    } catch {
      return { examples: [] as { slug: string; label: string; claim_text: string; demo_default: boolean }[] };
    }
  },
  component: LandingPage,
});

function LandingPage() {
  const { examples } = Route.useLoaderData();
  const navigate = useNavigate();
  const analyze = useServerFn(analyzeClaim);
  const { t } = useT();

  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(0);

  const messages = [t("index.loading.0"), t("index.loading.1"), t("index.loading.2")];

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setLoadingMsg((m) => (m + 1) % 3), 1500);
    return () => clearInterval(id);
  }, [loading]);

  const count = claim.trim().length;
  const tooShort = count > 0 && count < 10;
  const tooLong = count > 1000;
  const disabled = loading || count < 10 || tooLong;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;
    setError(null);
    setLoading(true);
    try {
      const { checkId } = await analyze({ data: { claim: claim.trim(), session_id: getSessionId() } });
      navigate({ to: "/result/$checkId", params: { checkId } });
    } catch (err) {
      console.error(err);
      setError(t("index.error"));
      setLoading(false);
    }
  }

  return (
    <AppShell>
      {/* Hero with paste input */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-halftone opacity-50 pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 py-12 md:py-20">
          <div className="flex items-center gap-4 mb-6">
            <CompassMark size={72} className="drop-shadow-md shrink-0" />
            <div>
              <div className="text-[10px] md:text-xs uppercase tracking-[4px] text-gold font-semibold">
                {t("brand.tagline")}
              </div>
              <div className="text-xs text-muted-foreground">{t("index.eventLine")}</div>
            </div>
          </div>

          <h1 className="font-display font-extrabold text-navy text-4xl md:text-6xl leading-[1.05]">
            {t("index.h1")}
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
            {t("index.lead.before")}
            <span className="font-semibold text-navy">{t("index.lead.badge")}</span>
            {t("index.lead.after")}
          </p>

          <form onSubmit={onSubmit} className="mt-8 rounded-xl border border-border bg-background p-4 md:p-5 shadow-sm">
            <textarea
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              disabled={loading}
              rows={5}
              placeholder={t("index.placeholder")}
              className="w-full resize-none bg-transparent text-navy placeholder:text-muted-foreground focus:outline-none text-base"
              maxLength={1200}
            />
            <div className="flex items-center justify-between mt-2 text-xs">
              <div className="text-muted-foreground">
                {tooShort ? (
                  <span className="text-lie">{t("index.tooShort")}</span>
                ) : (
                  <span className={tooLong ? "text-lie" : ""}>{t("index.chars", { count })}</span>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={disabled}
                className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 font-semibold text-navy hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> {messages[loadingMsg]}
                  </>
                ) : (
                  <>
                    {t("index.cta.scan")} <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <Link
                to="/spot"
                className="inline-flex items-center gap-2 rounded-md border border-navy/30 bg-paper px-5 py-3 font-semibold text-navy hover:bg-navy/5 transition"
              >
                <Hand className="h-4 w-4" /> {t("index.cta.swipe")}
              </Link>
            </div>

            {error && <div className="mt-3 text-sm text-lie">{error}</div>}

            {examples.length > 0 && (
              <div className="mt-5 pt-4 border-t border-border">
                <div className="text-[10px] uppercase tracking-[2px] text-muted-foreground font-semibold mb-2">
                  {t("index.starterQuests")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {examples.map((ex: { slug: string; label: string; claim_text: string; demo_default: boolean }) => (
                    <button
                      key={ex.slug}
                      type="button"
                      onClick={() => setClaim(ex.claim_text)}
                      className="rounded-full border border-gold/50 bg-paper px-3 py-1.5 text-xs text-navy hover:bg-gold/10 hover:scale-[1.02] transition"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Why it works */}
      <section className="bg-paper border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="text-xs uppercase tracking-[4px] text-gold font-semibold mb-2">{t("index.whyItWorks")}</div>
          <h2 className="font-display font-extrabold text-navy text-3xl md:text-4xl mb-8 max-w-2xl">
            {t("index.whyHeadline")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-lg bg-background border border-border p-6">
              <Sparkles className="h-6 w-6 text-gold mb-3" />
              <h3 className="font-display font-bold text-navy text-lg mb-2">{t("index.feature1.h")}</h3>
              <p className="text-sm text-muted-foreground">{t("index.feature1.p")}</p>
            </div>
            <div className="rounded-lg bg-background border border-border p-6">
              <BookOpen className="h-6 w-6 text-gold mb-3" />
              <h3 className="font-display font-bold text-navy text-lg mb-2">{t("index.feature2.h")}</h3>
              <p className="text-sm text-muted-foreground">{t("index.feature2.p")}</p>
            </div>
            <div className="rounded-lg bg-navy text-paper p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-halftone-gold opacity-20" />
              <p className="font-display font-bold text-lg leading-snug relative">{t("index.feature3.p")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 text-center">
        <div className="text-xs uppercase tracking-[4px] text-gold font-semibold mb-2">{t("index.modes.kicker")}</div>
        <h2 className="font-display font-extrabold text-navy text-2xl md:text-3xl mb-2">{t("index.modes.h")}</h2>
        <p className="text-sm text-muted-foreground">{t("index.modes.sub")}</p>
        <div className="grid md:grid-cols-3 gap-4 mt-8 text-left">
          <Link to="/" className="group rounded-lg border border-border bg-background p-5 hover:border-gold hover:-translate-y-0.5 transition">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[2px] text-gold font-semibold"><Zap className="h-3 w-3" /> {t("index.modes.quick.kicker")}</div>
              <span className="rounded-sm bg-gold/15 text-gold text-[9px] font-bold tracking-wider px-1.5 py-0.5">LVL 0 · +5 XP</span>
            </div>
            <div className="font-display font-bold text-navy mt-2 text-lg">{t("index.modes.quick.h")}</div>
            <p className="text-sm text-muted-foreground mt-2">{t("index.modes.quick.p")}</p>
            <div className="mt-3 text-xs text-gold font-semibold opacity-0 group-hover:opacity-100 transition">{t("index.modes.quick.cta")}</div>
          </Link>
          <Link to="/spot" className="group rounded-lg border border-border bg-background p-5 hover:border-gold hover:-translate-y-0.5 transition">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[2px] text-gold font-semibold"><Target className="h-3 w-3" /> {t("index.modes.arena.kicker")}</div>
              <span className="rounded-sm bg-gold/15 text-gold text-[9px] font-bold tracking-wider px-1.5 py-0.5">LVL 1 · +50 XP</span>
            </div>
            <div className="font-display font-bold text-navy mt-2 text-lg">{t("index.modes.arena.h")}</div>
            <p className="text-sm text-muted-foreground mt-2">{t("index.modes.arena.p")}</p>
            <div className="mt-3 text-xs text-gold font-semibold opacity-0 group-hover:opacity-100 transition">{t("index.modes.arena.cta")}</div>
          </Link>
          <Link to="/workshop" className="group rounded-lg border border-navy bg-navy text-paper p-5 hover:brightness-110 hover:-translate-y-0.5 transition relative overflow-hidden">
            <div className="absolute inset-0 bg-halftone-gold opacity-10 pointer-events-none" />
            <div className="relative flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[2px] text-gold font-semibold"><Flame className="h-3 w-3" /> {t("index.modes.boss.kicker")}</div>
              <span className="rounded-sm bg-gold text-navy text-[9px] font-bold tracking-wider px-1.5 py-0.5">LVL 2 · +200 XP</span>
            </div>
            <div className="font-display font-bold mt-2 text-lg relative">{t("index.modes.boss.h")}</div>
            <p className="text-sm text-paper/80 mt-2 relative">{t("index.modes.boss.p")}</p>
            <div className="mt-3 text-xs text-gold font-semibold opacity-0 group-hover:opacity-100 transition relative">{t("index.modes.boss.cta")}</div>
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
