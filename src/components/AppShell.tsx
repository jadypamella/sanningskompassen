import { Link } from "@tanstack/react-router";
import { CompassMark } from "./CompassMark";

export function Header() {
  return (
    <header className="border-b border-border bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3 group">
          <CompassMark size={42} />
          <div className="leading-tight">
            <div className="font-display font-extrabold text-navy text-lg">Sanningskompassen</div>
            <div className="text-[10px] uppercase tracking-[3px] text-muted-foreground">The Truth Compass</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-navy">
          <Link to="/workshop" className="hover:text-gold transition-colors">Workshop</Link>
          <Link to="/research" className="hover:text-gold transition-colors">Research</Link>
          <Link to="/about" className="hover:text-gold transition-colors">About</Link>
        </nav>
        <Link
          to="/workshop"
          className="md:inline-flex hidden items-center rounded-md bg-navy px-4 py-2 text-sm font-semibold text-paper hover:bg-navy/90 transition-colors"
        >
          Start the workshop
        </Link>
      </div>
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
          Built at Järvaveckan Hackathon 2026 on Lovable. <Link to="/research" className="underline decoration-gold underline-offset-4">See the research</Link>.
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
