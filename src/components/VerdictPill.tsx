import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";
import { useT } from "@/lib/i18n";

type Verdict = "true" | "uncertain" | "false";
type Confidence = "high" | "medium" | "low";

const STYLES: Record<Verdict, { bg: string; text: string; key: string; Icon: typeof CheckCircle2 }> = {
  true: { bg: "bg-truth", text: "text-paper", key: "result.verdict.TRUE", Icon: CheckCircle2 },
  uncertain: { bg: "bg-gold", text: "text-navy", key: "result.verdict.UNCERTAIN", Icon: HelpCircle },
  false: { bg: "bg-lie", text: "text-paper", key: "result.verdict.FALSE", Icon: XCircle },
};

export function VerdictPill({ verdict, confidence }: { verdict: Verdict; confidence: Confidence }) {
  const { t } = useT();
  const s = STYLES[verdict];
  return (
    <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-top-3 zoom-in-95 duration-500">
      <div
        className={`${s.bg} ${s.text} inline-flex items-center gap-3 rounded-full px-7 py-4 font-display font-extrabold text-2xl md:text-3xl shadow-lg`}
      >
        <s.Icon className="h-7 w-7" />
        {t(s.key)}
      </div>
      <div className="text-xs uppercase tracking-[2px] font-semibold text-muted-foreground">
        {t("result.confidence", { value: confidence })}
      </div>
    </div>
  );
}
