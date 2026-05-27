import { CompassMark } from "./CompassMark";

export function MilestoneCard() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700 rounded-2xl bg-navy text-paper p-8 ring-2 ring-gold/60 relative overflow-hidden">
      <div className="absolute inset-0 bg-halftone-gold opacity-15 pointer-events-none" />
      <div className="relative flex flex-col md:flex-row items-center gap-6">
        <div className="shrink-0 grayscale brightness-150 contrast-75">
          <CompassMark size={120} />
        </div>
        <div>
          <h3 className="font-display font-extrabold text-2xl md:text-3xl">The compass is yours now.</h3>
          <p className="mt-2 text-paper/80">
            You spotted 5 manipulation tactics across 3 claims. From here, you do not need this app to see the next one.
          </p>
        </div>
      </div>
    </div>
  );
}
