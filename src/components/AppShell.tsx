import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Zap, Target, Hammer, BookOpen, Users, Mail, Github, ExternalLink, Compass, Vote } from "lucide-react";
import { CompassMark } from "./CompassMark";

const NAV_LINKS = [
  { to: "/spot", label: "Swipe Arena", badge: "LVL 1" },
  { to: "/workshop", label: "Fake Forge", badge: "LVL 2" },
  { to: "/research", label: "Research", badge: null },
  { to: "/about", label: "The Crew", badge: null },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b border-border bg-paper sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <CompassMark size={42} />
          <div className="leading-tight">
            <div className="font-display font-extrabold text-navy text-lg">Sanningskompassen</div>
            <div className="text-[10px] uppercase tracking-[3px] text-muted-foreground">The Truth Compass</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-navy">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="inline-flex items-center gap-1.5 hover:text-gold transition-colors">
              {l.label}
              {l.badge && (
                <span className="rounded-sm bg-gold/20 text-gold text-[9px] font-bold tracking-wider px-1.5 py-0.5">
                  {l.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <Link
          to="/"
          className="hidden md:inline-flex items-center rounded-md bg-navy px-4 py-2 text-sm font-semibold text-paper hover:bg-navy/90 transition-colors"
        >
          Quick Scan
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden inline-flex items-center justify-center rounded-md border border-border p-2 text-navy"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-paper">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-md text-navy font-medium hover:bg-navy/5 flex items-center justify-between"
              >
                <span>{l.label}</span>
                {l.badge && (
                  <span className="rounded-sm bg-gold/20 text-gold text-[9px] font-bold tracking-wider px-1.5 py-0.5">
                    {l.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex justify-center rounded-md bg-navy px-4 py-3 text-sm font-semibold text-paper"
            >
              Quick Scan
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t-2 border-navy/10 bg-navy text-paper mt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-halftone-gold opacity-[0.06] pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 py-12">
        {/* Top: brand + columns */}
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <CompassMark size={44} />
              <div className="leading-tight">
                <div className="font-display font-extrabold text-paper text-lg">Sanningskompassen</div>
                <div className="text-[10px] uppercase tracking-[3px] text-gold">The Truth Compass</div>
              </div>
            </Link>
            <p className="text-sm text-paper/70 max-w-sm">
              The vaccine against political disinformation. Paste any claim, see the trick behind it, and
              train your eye to spot the next lie on your own. Built for young voters in Järva.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1.5 text-[10px] uppercase tracking-[2px] text-gold font-bold">
              <Compass className="h-3 w-3" /> Järvaveckan · 2026 · Challenge 2
            </div>
          </div>

          {/* Modes */}
          <div className="md:col-span-3">
            <h4 className="font-display font-bold text-paper text-sm uppercase tracking-[2px] mb-4">Play Modes</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="inline-flex items-center gap-2 text-paper/80 hover:text-gold transition">
                  <Zap className="h-4 w-4 text-gold" />
                  <span>Quick Scan</span>
                  <span className="rounded-sm bg-gold/15 text-gold text-[9px] font-bold px-1.5 py-0.5">LVL 0</span>
                </Link>
              </li>
              <li>
                <Link to="/spot" className="inline-flex items-center gap-2 text-paper/80 hover:text-gold transition">
                  <Target className="h-4 w-4 text-gold" />
                  <span>Swipe Arena</span>
                  <span className="rounded-sm bg-gold/15 text-gold text-[9px] font-bold px-1.5 py-0.5">LVL 1</span>
                </Link>
              </li>
              <li>
                <Link to="/workshop" className="inline-flex items-center gap-2 text-paper/80 hover:text-gold transition">
                  <Hammer className="h-4 w-4 text-gold" />
                  <span>Fake Forge</span>
                  <span className="rounded-sm bg-gold/15 text-gold text-[9px] font-bold px-1.5 py-0.5">LVL 2</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn */}
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-paper text-sm uppercase tracking-[2px] mb-4">Learn</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/research" className="inline-flex items-center gap-2 text-paper/80 hover:text-gold transition">
                  <BookOpen className="h-4 w-4 text-gold" /><span>Research</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="inline-flex items-center gap-2 text-paper/80 hover:text-gold transition">
                  <Users className="h-4 w-4 text-gold" /><span>The Crew</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://val.se"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-paper/80 hover:text-gold transition"
                >
                  <Vote className="h-4 w-4 text-gold" /><span>How To Vote</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-3">
            <h4 className="font-display font-bold text-paper text-sm uppercase tracking-[2px] mb-4">Connect</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:hello@sanningskompassen.se"
                  className="inline-flex items-center gap-2 text-paper/80 hover:text-gold transition"
                >
                  <Mail className="h-4 w-4 text-gold" /><span>hello@sanningskompassen.se</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Jakubs-Hackathons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-paper/80 hover:text-gold transition"
                >
                  <Github className="h-4 w-4 text-gold" /><span>Source On GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.cam.ac.uk/stories/inoculatingagainstfakenews"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-paper/80 hover:text-gold transition"
                >
                  <ExternalLink className="h-4 w-4 text-gold" /><span>Cambridge Study</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* The 5 tactics strip */}
        <div className="mt-10 pt-6 border-t border-paper/10">
          <div className="text-[10px] uppercase tracking-[3px] text-gold font-bold mb-3">The 5 Tactics We Label</div>
          <div className="flex flex-wrap gap-2">
            {["Clickbait", "False Authority", "Emotion Bait", "Polarisation", "Fake Expert"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-gold/40 bg-gold/5 px-3 py-1 text-xs text-paper/90 font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-paper/10 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs text-paper/60">
          <p>
            © 2026 Sanningskompassen. Built at Järvaveckan Hackathon on Lovable.
          </p>
          <p>
            Tactic taxonomy adapted from Bad News (DROG &amp; Cambridge). Inoculation logic based on Roozenbeek &amp; van
            der Linden, 2019 &amp; 2022.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
