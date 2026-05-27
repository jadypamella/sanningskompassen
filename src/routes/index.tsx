import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { CompassMark } from "@/components/CompassMark";
import { ArrowRight, BookOpen, Sparkles, Loader2, Hand } from "lucide-react";
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
            Paste any political claim. See the trick behind it.
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
            You know valkompassen. This is the compass for what is true. Every check shows you the verdict
            and the playbook the lie used, so you start spotting them on your own.
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
                    Check this claim <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <Link
                to="/spot"
                className="inline-flex items-center gap-2 rounded-md border border-navy/30 bg-paper px-5 py-3 font-semibold text-navy hover:bg-navy/5 transition"
              >
                <Hand className="h-4 w-4" /> Or try the Spot game
              </Link>
            </div>

            {error && <div className="mt-3 text-sm text-lie">{error}</div>}

            {examples.length > 0 && (
              <div className="mt-5 pt-4 border-t border-border">
                <div className="text-[10px] uppercase tracking-[2px] text-muted-foreground font-semibold mb-2">
                  Try one of these
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
          <div className="text-xs uppercase tracking-[4px] text-gold font-semibold mb-2">Why it works</div>
          <h2 className="font-display font-extrabold text-navy text-3xl md:text-4xl mb-8 max-w-2xl">
            Every check shows you the verdict AND the trick. After 3 checks, you do not need us anymore.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-lg bg-background border border-border p-6">
              <Sparkles className="h-6 w-6 text-gold mb-3" />
              <h3 className="font-display font-bold text-navy text-lg mb-2">Labelled in real claims</h3>
              <p className="text-sm text-muted-foreground">
                Paste anything. We highlight which of 5 manipulation tactics it used and how.
              </p>
            </div>
            <div className="rounded-lg bg-background border border-border p-6">
              <BookOpen className="h-6 w-6 text-gold mb-3" />
              <h3 className="font-display font-bold text-navy text-lg mb-2">Cambridge inoculation research</h3>
              <p className="text-sm text-muted-foreground">
                Roozenbeek and van der Linden (2019, 2022) show that seeing the playbook builds lasting resistance.
              </p>
            </div>
            <div className="rounded-lg bg-navy text-paper p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-halftone-gold opacity-20" />
              <p className="font-display font-bold text-lg leading-snug relative">
                This is passive inoculation. You build resistance by seeing the playbook labelled inside every check.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 text-center">
        <h2 className="font-display font-extrabold text-navy text-2xl md:text-3xl mb-4">
          Three ways to use the compass.
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mt-8 text-left">
          <Link to="/" className="rounded-lg border border-border bg-background p-5 hover:border-gold transition">
            <div className="text-[10px] uppercase tracking-[2px] text-gold font-semibold">Default</div>
            <div className="font-display font-bold text-navy mt-1">Paste and check</div>
            <p className="text-sm text-muted-foreground mt-2">2 seconds. Verdict + tactic X-ray.</p>
          </Link>
          <Link to="/spot" className="rounded-lg border border-border bg-background p-5 hover:border-gold transition">
            <div className="text-[10px] uppercase tracking-[2px] text-gold font-semibold">Game</div>
            <div className="font-display font-bold text-navy mt-1">Spot the Fake</div>
            <p className="text-sm text-muted-foreground mt-2">Swipe 10 cards. Fact or fake. See your score.</p>
          </Link>
          <Link to="/workshop" className="rounded-lg border border-border bg-background p-5 hover:border-gold transition">
            <div className="text-[10px] uppercase tracking-[2px] text-gold font-semibold">Deep</div>
            <div className="font-display font-bold text-navy mt-1">Workshop</div>
            <p className="text-sm text-muted-foreground mt-2">Build a fake yourself in 5 guided steps.</p>
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
