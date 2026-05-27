import { Link } from "@tanstack/react-router";
import { ExternalLink, RotateCcw } from "lucide-react";

export function ClosingCTA({ secondaryLabel = "Check another claim", secondaryTo = "/" }: { secondaryLabel?: string; secondaryTo?: "/" | "/spot" | "/workshop" }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-navy text-paper p-8 md:p-12">
      <div className="absolute inset-0 bg-halftone-gold opacity-20 pointer-events-none" />
      <div className="relative max-w-3xl">
        <h2 className="font-display font-extrabold text-2xl md:text-4xl leading-tight">
          You can now spot 5 manipulation tactics. Use them to navigate the next weeks of election news. Then vote.
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://www.val.se/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 font-semibold text-navy hover:brightness-95 transition"
          >
            Find your polling station in Järva <ExternalLink className="h-4 w-4" />
          </a>
          <Link
            to={secondaryTo}
            className="inline-flex items-center gap-2 rounded-md border border-paper/40 bg-transparent px-6 py-3 font-semibold text-paper hover:bg-paper/10 transition"
          >
            <RotateCcw className="h-4 w-4" /> {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
