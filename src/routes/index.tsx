import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CompassMark } from "@/components/CompassMark";
import { ArrowRight, BookOpen, Compass, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sanningskompassen, The Truth Compass" },
      {
        name: "description",
        content:
          "Write your own fake election story in 5 guided steps and learn the manipulation tactics from the inside. Inoculation training for young voters in Järva.",
      },
      { property: "og:title", content: "Sanningskompassen, The Truth Compass" },
      {
        property: "og:description",
        content: "Learn to spot political manipulation by writing it yourself. Built at Järvaveckan 2026.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-halftone opacity-60 pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center md:justify-start">
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
              <CompassMark size={320} className="drop-shadow-xl" />
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[4px] text-gold font-semibold mb-3">
              Järvaveckan · 2026 · Challenge 2
            </div>
            <h1 className="font-display font-extrabold text-navy text-5xl md:text-6xl leading-[1.05]">
              Your compass for what is true.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              You know valkompassen, the voter compass. This is Sanningskompassen, the truth compass.
              Write your own fake election story, learn the 5 manipulation tactics from the inside,
              and you will spot them everywhere from now on.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/workshop"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 font-semibold text-navy hover:brightness-95 transition"
              >
                Start the workshop <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/research"
                className="inline-flex items-center gap-2 rounded-md border border-navy/20 bg-paper px-6 py-3 font-semibold text-navy hover:bg-navy/5 transition"
              >
                <BookOpen className="h-4 w-4" /> See the research
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-xs uppercase tracking-[4px] text-gold font-semibold mb-2">How it works</div>
        <h2 className="font-display font-extrabold text-navy text-3xl md:text-4xl mb-8">Five steps. One skill for life.</h2>
        <ol className="grid md:grid-cols-5 gap-4">
          {[
            "Pick a real election topic from Järva.",
            "Write a fake story step by step, using 5 manipulation tactics.",
            "See your manipulation score from 0 to 100.",
            "Get a personal X-ray of every tactic you used.",
            "Earn a badge. Carry the skill out.",
          ].map((step, i) => (
            <li key={i} className="rounded-lg border border-border bg-background p-5">
              <div className="font-display font-extrabold text-gold text-3xl tabular-nums">0{i + 1}</div>
              <p className="mt-2 text-sm text-navy">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Why it works */}
      <section className="bg-paper border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-3 gap-8">
          <div>
            <Sparkles className="h-6 w-6 text-gold mb-3" />
            <h3 className="font-display font-bold text-navy text-xl mb-2">Inoculation, not correction</h3>
            <p className="text-sm text-muted-foreground">
              Cambridge research (Roozenbeek and van der Linden, 2019, 2022) shows that practising the tactics in a
              weakened form builds durable resistance, the same way a vaccine works.
            </p>
          </div>
          <div>
            <ShieldCheck className="h-6 w-6 text-gold mb-3" />
            <h3 className="font-display font-bold text-navy text-xl mb-2">Same idea as anti-phishing training</h3>
            <p className="text-sm text-muted-foreground">
              Cybersecurity teams already use this: you spot phishing better after sending a fake one yourself.
              We apply that to political content.
            </p>
          </div>
          <div className="rounded-lg bg-navy text-paper p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-halftone-gold opacity-25" />
            <Compass className="h-6 w-6 text-gold mb-3 relative" />
            <p className="font-display font-bold text-lg leading-snug relative">
              This is psychological vaccination. You build resistance by handling a weakened version of the
              manipulation.
            </p>
          </div>
        </div>
      </section>

      {/* Who for */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display font-extrabold text-navy text-3xl md:text-4xl mb-6">Who it is for.</h2>
        <ul className="grid md:grid-cols-3 gap-4 text-navy">
          <li className="rounded-lg border border-border p-5 bg-background">
            Young voters in Järva who want to trust their own judgement on political content.
          </li>
          <li className="rounded-lg border border-border p-5 bg-background">
            Teachers and youth workers who need a 5-minute activity that actually changes how students read the news.
          </li>
          <li className="rounded-lg border border-border p-5 bg-background">
            Anyone tired of seeing their family share things that turned out to be fake.
          </li>
        </ul>
        <div className="mt-10 flex justify-center">
          <Link
            to="/workshop"
            className="inline-flex items-center gap-2 rounded-md bg-navy px-6 py-3 font-semibold text-paper hover:bg-navy/90 transition"
          >
            Step into the workshop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
