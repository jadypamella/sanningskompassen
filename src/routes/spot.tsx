import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { ClosingCTA } from "@/components/ClosingCTA";
import { SPOT_DECK, TACTIC_LABELS, type SpotCard } from "@/lib/tactics";
import { Check, X, RotateCcw, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/spot")({
  head: () => ({
    meta: [
      { title: "Spot the Fake · Sanningskompassen" },
      { name: "description", content: "Swipe 10 cards. Fact or fake. See how sharp your eye is for political manipulation." },
    ],
  }),
  component: SpotPage,
});

type Phase = "intro" | "playing" | "done";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Answer {
  card: SpotCard;
  guess: "TRUE" | "FALSE";
  correct: boolean;
}

function SpotPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [deck, setDeck] = useState<SpotCard[]>(() => shuffle(SPOT_DECK));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [lastGuess, setLastGuess] = useState<"TRUE" | "FALSE" | null>(null);

  const current = deck[index];

  function start() {
    setDeck(shuffle(SPOT_DECK));
    setIndex(0);
    setRevealed(false);
    setAnswers([]);
    setLastGuess(null);
    setPhase("playing");
  }

  function answer(guess: "TRUE" | "FALSE") {
    if (revealed) return;
    setLastGuess(guess);
    setRevealed(true);
    setAnswers((a) => [...a, { card: current, guess, correct: guess === current.truth }]);
  }

  function next() {
    if (index + 1 >= deck.length) {
      setPhase("done");
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
    setLastGuess(null);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
        {phase === "intro" && <SpotIntro onStart={start} />}
        {phase === "playing" && current && (
          <SpotRound
            card={current}
            index={index}
            total={deck.length}
            revealed={revealed}
            lastGuess={lastGuess}
            onAnswer={answer}
            onNext={next}
          />
        )}
        {phase === "done" && <SpotResults answers={answers} onRestart={start} />}
      </div>
    </AppShell>
  );
}

function SpotIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="text-xs uppercase tracking-[4px] text-gold font-semibold">Spot the Fake</div>
      <h1 className="font-display font-extrabold text-navy text-4xl md:text-5xl">
        10 cards. Fact or fake.
      </h1>
      <p className="text-muted-foreground max-w-md mx-auto">
        Tap Fact or Fake on each card. See how sharp your eye is for political manipulation. Same 5 tactics
        appear here as in the X-ray.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="inline-flex items-center gap-2 rounded-md bg-gold px-8 py-3 font-semibold text-navy hover:brightness-95 transition"
      >
        Start <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function SpotRound({
  card,
  index,
  total,
  revealed,
  lastGuess,
  onAnswer,
  onNext,
}: {
  card: SpotCard;
  index: number;
  total: number;
  revealed: boolean;
  lastGuess: "TRUE" | "FALSE" | null;
  onAnswer: (g: "TRUE" | "FALSE") => void;
  onNext: () => void;
}) {
  const correct = lastGuess === card.truth;
  return (
    <div className="space-y-6">
      {/* progress dots */}
      <div className="flex justify-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-gold" : i < index ? "w-3 bg-navy" : "w-3 bg-border"
            }`}
          />
        ))}
      </div>

      {!revealed ? (
        <SwipeCard card={card} index={index} total={total} onAnswer={onAnswer} />
      ) : (
        <div
          key={card.id + "-back"}
          className="relative rounded-2xl border border-border bg-background shadow-lg min-h-[340px] p-6 md:p-8 flex flex-col animate-in fade-in zoom-in-95 duration-300"
        >
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display font-extrabold text-sm ${
                  card.truth === "TRUE" ? "bg-truth text-paper" : "bg-lie text-paper"
                }`}
              >
                {card.truth === "TRUE" ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                {card.truth}
              </div>
              <div
                className={`text-xs font-semibold uppercase tracking-[2px] ${
                  correct ? "text-truth" : "text-lie"
                }`}
              >
                {correct ? "You got this right" : "Caught you"}
              </div>
            </div>
            <p className="text-navy text-sm md:text-base flex-1">{card.explanation}</p>
            {card.tactics.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {card.tactics.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-gold/20 border border-gold/50 text-navy text-xs px-3 py-1 font-medium"
                  >
                    {TACTIC_LABELS[t]}
                  </span>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={onNext}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-navy px-6 py-3 font-semibold text-paper hover:bg-navy/90 transition"
            >
              {index + 1 >= total ? "See results" : "Next card"} <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function SpotResults({ answers, onRestart }: { answers: Answer[]; onRestart: () => void }) {
  const score = answers.filter((a) => a.correct).length;
  const total = answers.length;
  const skill = useMemo(() => {
    if (score >= 8) return "Sharp Eye";
    if (score >= 5) return "Getting There";
    if (score >= 2) return "Apprentice";
    return "Need Practice";
  }, [score]);

  const tacticStats = useMemo(() => {
    const map = new Map<string, { spotted: number; missed: number }>();
    for (const a of answers) {
      for (const t of a.card.tactics) {
        const cur = map.get(t) ?? { spotted: 0, missed: 0 };
        if (a.correct) cur.spotted += 1;
        else cur.missed += 1;
        map.set(t, cur);
      }
    }
    return Array.from(map.entries());
  }, [answers]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[4px] text-gold font-semibold mb-2">Your score</div>
        <div className="font-display font-extrabold text-navy text-7xl md:text-8xl tabular-nums">
          {score}
          <span className="text-muted-foreground"> / {total}</span>
        </div>
        <div className="mt-3 inline-block rounded-full bg-navy text-paper px-5 py-2 font-display font-bold">
          {skill}
        </div>
      </div>

      {tacticStats.length > 0 && (
        <div className="rounded-xl border border-border bg-background p-5">
          <h3 className="font-display font-bold text-navy mb-3">Tactic breakdown</h3>
          <ul className="text-sm text-navy space-y-2">
            {tacticStats.map(([id, s]) => (
              <li key={id} className="flex justify-between gap-4">
                <span className="font-medium">{TACTIC_LABELS[id as keyof typeof TACTIC_LABELS]}</span>
                <span className="text-muted-foreground tabular-nums">
                  Spotted {s.spotted} · Fooled {s.missed}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ClosingCTA secondaryLabel="Paste a claim of your own" secondaryTo="/" />

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-md border border-navy/30 bg-background px-5 py-2.5 text-sm font-semibold text-navy hover:bg-navy/5 transition"
        >
          <RotateCcw className="h-4 w-4" /> Play again
        </button>
        <Link
          to="/workshop"
          className="inline-flex items-center gap-2 rounded-md border border-navy/30 bg-background px-5 py-2.5 text-sm font-semibold text-navy hover:bg-navy/5 transition"
        >
          Try the Workshop
        </Link>
      </div>
    </div>
  );
}
