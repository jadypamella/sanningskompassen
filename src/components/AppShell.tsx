import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Menu,
  X,
  Zap,
  Target,
  Hammer,
  BookOpen,
  Users,
  Github,
  ExternalLink,
  Compass,
  Vote,
  Languages,
} from "lucide-react";
import { CompassMark } from "./CompassMark";
import { useT, type Lang } from "@/lib/i18n";

type NavItem = { to: "/" | "/workshop" | "/spot" | "/research" | "/about"; key: string; badge: string | null };

const NAV_ITEMS: NavItem[] = [
  { to: "/", key: "nav.quickScan", badge: "LVL 0" },
  { to: "/workshop", key: "nav.vaccine", badge: "LVL 1" },
  { to: "/spot", key: "nav.swipeArena", badge: "LVL 2" },
  { to: "/research", key: "nav.research", badge: null },
  { to: "/about", key: "nav.theCrew", badge: null },
];

function LangSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useT();
  const options: Lang[] = ["sv", "en"];
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/5 p-0.5 ${
        compact ? "" : ""
      }`}
      role="group"
      aria-label={t("nav.language")}
    >
      <Languages className="h-3.5 w-3.5 text-gold ml-1.5" />
      {options.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition ${
            lang === l ? "bg-gold text-navy" : "text-navy/70 hover:text-navy"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useT();
  return (
    <header className="border-b border-border bg-paper sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <CompassMark size={42} />
          <div className="leading-tight">
            <div className="font-display font-extrabold text-navy text-lg">Sanningskompassen</div>
            <div className="text-[10px] uppercase tracking-[3px] text-muted-foreground">{t("brand.tagline")}</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-navy">
          {NAV_ITEMS.map((l) => (
            <Link key={l.to} to={l.to} className="inline-flex items-center gap-1.5 hover:text-gold transition-colors">
              {t(l.key)}
              {l.badge && (
                <span className="rounded-sm bg-gold/20 text-gold text-[9px] font-bold tracking-wider px-1.5 py-0.5">
                  {l.badge}
                </span>
              )}
            </Link>
          ))}
          <LangSwitcher />
        </nav>


        <button
          type="button"
          aria-label={open ? t("menu.close") : t("menu.open")}
          className="md:hidden inline-flex items-center justify-center rounded-md border border-border p-2 text-navy"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-paper">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-md text-navy font-medium hover:bg-navy/5 flex items-center justify-between"
              >
                <span>{t(l.key)}</span>
                {l.badge && (
                  <span className="rounded-sm bg-gold/20 text-gold text-[9px] font-bold tracking-wider px-1.5 py-0.5">
                    {l.badge}
                  </span>
                )}
              </Link>
            ))}
            <div className="px-3 py-3 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[2px] text-muted-foreground font-semibold">
                {t("nav.language")}
              </span>
              <LangSwitcher compact />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { t } = useT();
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
                <div className="text-[10px] uppercase tracking-[3px] text-gold">{t("brand.tagline")}</div>
              </div>
            </Link>
            <p className="text-sm text-paper/70 max-w-sm">{t("footer.about")}</p>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] uppercase tracking-[2px] font-bold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold text-navy px-2.5 py-1">
                <Compass className="h-3 w-3" /> {t("footer.team")}
              </span>
              <span className="rounded-full bg-gold/15 text-gold px-2.5 py-1">{t("footer.event")}</span>
              <span className="rounded-full bg-gold/15 text-gold px-2.5 py-1">{t("footer.challenge")}</span>
            </div>
          </div>

          {/* Modes */}
          <div className="md:col-span-3">
            <h4 className="font-display font-bold text-paper text-sm uppercase tracking-[2px] mb-4">
              {t("footer.playModes")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="inline-flex items-center gap-2 text-paper/80 hover:text-gold transition">
                  <Zap className="h-4 w-4 text-gold" />
                  <span>{t("nav.quickScan")}</span>
                  <span className="rounded-sm bg-gold/15 text-gold text-[9px] font-bold px-1.5 py-0.5">LVL 0</span>
                </Link>
              </li>
              <li>
                <Link to="/workshop" className="inline-flex items-center gap-2 text-paper/80 hover:text-gold transition">
                  <Hammer className="h-4 w-4 text-gold" />
                  <span>{t("nav.vaccine")}</span>
                  <span className="rounded-sm bg-gold/15 text-gold text-[9px] font-bold px-1.5 py-0.5">LVL 1</span>
                </Link>
              </li>
              <li>
                <Link to="/spot" className="inline-flex items-center gap-2 text-paper/80 hover:text-gold transition">
                  <Target className="h-4 w-4 text-gold" />
                  <span>{t("nav.swipeArena")}</span>
                  <span className="rounded-sm bg-gold/15 text-gold text-[9px] font-bold px-1.5 py-0.5">LVL 2</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn */}
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-paper text-sm uppercase tracking-[2px] mb-4">
              {t("footer.learn")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/research" className="inline-flex items-center gap-2 text-paper/80 hover:text-gold transition">
                  <BookOpen className="h-4 w-4 text-gold" />
                  <span>{t("nav.research")}</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="inline-flex items-center gap-2 text-paper/80 hover:text-gold transition">
                  <Users className="h-4 w-4 text-gold" />
                  <span>{t("nav.theCrew")}</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://val.se"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-paper/80 hover:text-gold transition"
                >
                  <Vote className="h-4 w-4 text-gold" />
                  <span>{t("footer.howToVote")}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-3">
            <h4 className="font-display font-bold text-paper text-sm uppercase tracking-[2px] mb-4">
              {t("footer.connect")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://github.com/jadypamella/sanningskompassen.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-paper/80 hover:text-gold transition"
                >
                  <Github className="h-4 w-4 text-gold" />
                  <span>{t("footer.sourceGithub")}</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.nature.com/articles/s41599-019-0279-9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-paper/80 hover:text-gold transition"
                >
                  <ExternalLink className="h-4 w-4 text-gold" />
                  <span>{t("footer.cambridgeStudy")}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* The 5 tactics strip */}
        <div className="mt-10 pt-6 border-t border-paper/10">
          <div className="text-[10px] uppercase tracking-[3px] text-gold font-bold mb-3">
            {t("footer.tacticsLabel")}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "footer.tactic.clickbait",
              "footer.tactic.falseAuthority",
              "footer.tactic.emotionBait",
              "footer.tactic.polarisation",
              "footer.tactic.fakeExpert",
            ].map((k) => (
              <span
                key={k}
                className="rounded-full border border-gold/40 bg-gold/5 px-3 py-1 text-xs text-paper/90 font-medium"
              >
                {t(k)}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-paper/10 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs text-paper/60">
          <p>{t("footer.copyright")}</p>
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
