import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { CompassMark } from "@/components/CompassMark";
import { ArrowRight, BookOpen, Sparkles, Loader2, Hand, Zap, Target, Flame } from "lucide-react";
import { analyzeClaim, listExampleClaims } from "@/lib/analyze.functions";
import { getSessionId } from "@/lib/session";

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

  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(0);

  const messages = ["Analysing the claim...", "Scanning for the 5 tactics...", "Building your X-ray..."];

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setLoadingMsg((m) => (m + 1) % messages.length), 1500);
    return () => clearInterval(t);
  }, [loading, messages.length]);

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
      setError("Something went wrong. Try again.");
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
                The Truth Compass
              </div>
              <div className="text-xs text-muted-foreground">Järvaveckan · 2026 · Challenge 2</div>
            </div>
          </div>

          <h1 className="font-display font-extrabold text-navy text-4xl md:text-6xl leading-[1.05]">
            Paste Any Political Claim. See The Trick Behind It.
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
            You know valkompassen. This is the compass for what is true. Every check earns you XP toward the
            <span className="font-semibold text-navy"> Truth Hunter</span> badge, and shows you the playbook the lie used.
          </p>

          <form onSubmit={onSubmit} className="mt-8 rounded-xl border border-border bg-background p-4 md:p-5 shadow-sm">
            <textarea
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              disabled={loading}
              rows={5}
              placeholder="Paste a headline, a TikTok caption, a friend's message. We will show you what is true, what is uncertain, what is false, and which tactics it used to deceive."
              className="w-full resize-none bg-transparent text-navy placeholder:text-muted-foreground focus:outline-none text-base"
              maxLength={1200}
            />
            <div className="flex items-center justify-between mt-2 text-xs">
              <div className="text-muted-foreground">
                {tooShort ? (
                  <span className="text-lie">Add at least 10 characters.</span>
                ) : (
                  <span className={tooLong ? "text-lie" : ""}>{count} / 1000 characters</span>
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
                    Run Quick Scan <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <Link
                to="/spot"
                className="inline-flex items-center gap-2 rounded-md border border-navy/30 bg-paper px-5 py-3 font-semibold text-navy hover:bg-navy/5 transition"
              >
                <Hand className="h-4 w-4" /> Or Enter The Swipe Arena
              </Link>
            </div>

            {error && <div className="mt-3 text-sm text-lie">{error}</div>}

            {examples.length > 0 && (
              <div className="mt-5 pt-4 border-t border-border">
                <div className="text-[10px] uppercase tracking-[2px] text-muted-foreground font-semibold mb-2">
                  Starter Quests · Tap To Load
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
          <div className="text-xs uppercase tracking-[4px] text-gold font-semibold mb-2">Why It Works</div>
          <h2 className="font-display font-extrabold text-navy text-3xl md:text-4xl mb-8 max-w-2xl">
            Every Check Shows You The Verdict AND The Trick. After 3 Checks, You Do Not Need Us Anymore.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-lg bg-background border border-border p-6">
              <Sparkles className="h-6 w-6 text-gold mb-3" />
              <h3 className="font-display font-bold text-navy text-lg mb-2">Tactics Labelled In Real Claims</h3>
              <p className="text-sm text-muted-foreground">
                Paste anything. We highlight which of 5 manipulation tactics it used and how.
              </p>
            </div>
            <div className="rounded-lg bg-background border border-border p-6">
              <BookOpen className="h-6 w-6 text-gold mb-3" />
              <h3 className="font-display font-bold text-navy text-lg mb-2">Cambridge Inoculation Research</h3>
              <p className="text-sm text-muted-foreground">
                Roozenbeek and van der Linden (2019, 2022) show that seeing the playbook builds lasting resistance.
              </p>
            </div>
            <div className="rounded-lg bg-navy text-paper p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-halftone-gold opacity-20" />
              <p className="font-display font-bold text-lg leading-snug relative">
                This Is Passive Inoculation. You Build Resistance By Seeing The Playbook Labelled Inside Every Check.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 text-center">
        <div className="text-xs uppercase tracking-[4px] text-gold font-semibold mb-2">Choose Your Mode</div>
        <h2 className="font-display font-extrabold text-navy text-2xl md:text-3xl mb-2">
          Three Ways To Train Your Eye.
        </h2>
        <p className="text-sm text-muted-foreground">Earn XP. Unlock badges. Become a Truth Hunter.</p>
        <div className="grid md:grid-cols-3 gap-4 mt-8 text-left">
          <Link to="/" className="group rounded-lg border border-border bg-background p-5 hover:border-gold hover:-translate-y-0.5 transition">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[2px] text-gold font-semibold"><Zap className="h-3 w-3" /> Quick Mode</div>
              <span className="rounded-sm bg-gold/15 text-gold text-[9px] font-bold tracking-wider px-1.5 py-0.5">LVL 0 · +5 XP</span>
            </div>
            <div className="font-display font-bold text-navy mt-2 text-lg">Quick Scan</div>
            <p className="text-sm text-muted-foreground mt-2">2 Seconds. Verdict + Tactic X-Ray.</p>
            <div className="mt-3 text-xs text-gold font-semibold opacity-0 group-hover:opacity-100 transition">Start scan →</div>
          </Link>
          <Link to="/spot" className="group rounded-lg border border-border bg-background p-5 hover:border-gold hover:-translate-y-0.5 transition">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[2px] text-gold font-semibold"><Target className="h-3 w-3" /> Arena Mode</div>
              <span className="rounded-sm bg-gold/15 text-gold text-[9px] font-bold tracking-wider px-1.5 py-0.5">LVL 1 · +50 XP</span>
            </div>
            <div className="font-display font-bold text-navy mt-2 text-lg">Swipe Arena</div>
            <p className="text-sm text-muted-foreground mt-2">Swipe 10 Cards. Fact Or Fake. Earn The Sharp Eye Badge.</p>
            <div className="mt-3 text-xs text-gold font-semibold opacity-0 group-hover:opacity-100 transition">Enter arena →</div>
          </Link>
          <Link to="/workshop" className="group rounded-lg border border-navy bg-navy text-paper p-5 hover:brightness-110 hover:-translate-y-0.5 transition relative overflow-hidden">
            <div className="absolute inset-0 bg-halftone-gold opacity-10 pointer-events-none" />
            <div className="relative flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[2px] text-gold font-semibold"><Flame className="h-3 w-3" /> Boss Mode</div>
              <span className="rounded-sm bg-gold text-navy text-[9px] font-bold tracking-wider px-1.5 py-0.5">LVL 2 · +200 XP</span>
            </div>
            <div className="font-display font-bold mt-2 text-lg relative">Vaccine</div>
            <p className="text-sm text-paper/80 mt-2 relative">Build A Fake Yourself In 5 Guided Steps. Final Boss Of Inoculation.</p>
            <div className="mt-3 text-xs text-gold font-semibold opacity-0 group-hover:opacity-100 transition relative">Take the challenge →</div>
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
