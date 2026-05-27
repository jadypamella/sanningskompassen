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
    <footer className="border-t border-border bg-paper mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground space-y-2">
        <p>
          Tactic taxonomy adapted from Bad News (DROG and Cambridge). Inoculation logic based on Roozenbeek and van der Linden,
          2019 and 2022.
        </p>
        <p className="text-xs">
          Built at Järvaveckan Hackathon 2026 on Lovable.{" "}
          <Link to="/research" className="underline decoration-gold underline-offset-4">
            See the research
          </Link>
          .
        </p>
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
