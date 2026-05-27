import { getTactic, type TacticId } from "@/lib/tactics";

export interface TacticAnalysis {
  id: TacticId;
  detected: boolean;
  how_used: string;
  spot_lesson: string;
}

export function TacticXrayCard({ tactic, index }: { tactic: TacticAnalysis; index: number }) {
  const def = getTactic(tactic.id);
  const Icon = def.icon;
  const delay = `${index * 80}ms`;

  if (!tactic.detected) {
    return (
      <div
        style={{ animationDelay: delay }}
        className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both rounded-lg border border-dashed border-gold/40 bg-paper p-4 flex items-center gap-3"
      >
        <Icon className="h-5 w-5 text-navy/40" />
        <div className="flex-1">
          <div className="font-display font-semibold text-navy/60">{def.name}</div>
          <div className="text-sm text-muted-foreground">Not used in this claim.</div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ animationDelay: delay }}
      className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both rounded-lg bg-background border border-border border-l-4 border-l-gold p-5 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon className="h-6 w-6 text-gold" />
        <h3 className="font-display font-extrabold text-navy text-lg">{def.name}</h3>
      </div>
      {tactic.how_used && <p className="text-sm text-navy/80 mb-3">{tactic.how_used}</p>}
      {tactic.spot_lesson && (
        <div className="rounded-md bg-paper border border-border p-3">
          <div className="text-[10px] uppercase tracking-[2px] font-semibold text-gold mb-1">
            Spot it in the wild
          </div>
          <p className="text-sm text-navy">{tactic.spot_lesson}</p>
        </div>
      )}
    </div>
  );
}
