"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Question } from "@/lib/types";
import { passThreshold } from "@/lib/curriculum";

type Phase = "playing" | "done";

export default function Quiz({
  questions,
  accentText,
  onResult,
  onExit,
  onRetry,
}: {
  questions: Question[];
  accentText: string;
  /** Persist the attempt; returns XP gained. */
  onResult: (score: number, masteredIds: string[]) => number;
  onExit: () => void;
  onRetry: () => void;
}) {
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [correctIds, setCorrectIds] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("playing");
  const [showHint, setShowHint] = useState(false);
  const [xpGained, setXpGained] = useState(0);

  const q = questions[i];
  const total = questions.length;

  const finish = (ids: string[]) => {
    const score = ids.length / total;
    const gained = onResult(score, ids);
    setXpGained(gained);
    setPhase("done");
  };

  const choose = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    if (idx === q.correct) {
      if (!correctIds.includes(q.id)) setCorrectIds((p) => [...p, q.id]);
    } else {
      setHearts((h) => Math.max(0, h - 1));
    }
  };

  const next = () => {
    const isLast = i === total - 1;
    // capture latest correctIds including this question
    const latest =
      selected === q.correct && !correctIds.includes(q.id)
        ? [...correctIds, q.id]
        : correctIds;
    if (isLast) {
      finish(latest);
    } else {
      setI((n) => n + 1);
      setSelected(null);
      setRevealed(false);
      setShowHint(false);
    }
  };

  const progressPct = Math.round(((i + (revealed ? 1 : 0)) / total) * 100);

  if (phase === "done") {
    const score = correctIds.length / total;
    const passed = score >= passThreshold;
    return (
      <ResultCard
        passed={passed}
        correct={correctIds.length}
        total={total}
        xpGained={xpGained}
        accentText={accentText}
        onExit={onExit}
        onRetry={() => {
          setI(0);
          setSelected(null);
          setRevealed(false);
          setHearts(5);
          setCorrectIds([]);
          setPhase("playing");
          setShowHint(false);
          onRetry();
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* progress + hearts */}
      <div className="flex items-center gap-3">
        <div className="h-3 flex-1 overflow-hidden rounded-full border border-line bg-panel2">
          <div
            className="h-full bg-gradient-to-r from-gold to-goldlt transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="font-pixel text-[10px] text-heart">
          {"♥".repeat(hearts)}
          <span className="text-line">{"♥".repeat(5 - hearts)}</span>
        </span>
      </div>
      <p className="font-pixel text-[9px] text-muted">
        QUESTION {i + 1} / {total}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-xl leading-snug text-parchment sm:text-2xl">{q.prompt}</h3>

          {q.hint && !revealed && (
            <button
              onClick={() => setShowHint((s) => !s)}
              className="font-pixel text-[9px] text-sky underline-offset-2 hover:underline"
            >
              {showHint ? "▾ hide hint" : "▸ need a hint?"}
            </button>
          )}
          {showHint && q.hint && (
            <p className="rounded border-l-4 border-sky bg-panel2 p-3 text-sm text-muted">{q.hint}</p>
          )}

          <div className="grid gap-3">
            {q.options.map((opt, idx) => {
              const isCorrect = idx === q.correct;
              const isChosen = idx === selected;
              let cls =
                "border-line bg-panel2 hover:border-gold/70 hover:bg-line/60";
              if (revealed) {
                if (isCorrect) cls = "border-quest bg-quest/15 text-quest";
                else if (isChosen) cls = "border-ember bg-ember/15 text-ember";
                else cls = "border-line bg-panel2 opacity-60";
              }
              return (
                <button
                  key={idx}
                  disabled={revealed}
                  onClick={() => choose(idx)}
                  className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-left text-[1.05rem] transition-all ${cls} ${
                    revealed ? "cursor-default" : "active:translate-y-0.5"
                  }`}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded border-2 border-current font-pixel text-[10px]">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                  {revealed && isCorrect && <span className="ml-auto">✓</span>}
                  {revealed && isChosen && !isCorrect && <span className="ml-auto">✕</span>}
                </button>
              );
            })}
          </div>

          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg border-2 p-4 ${
                selected === q.correct ? "border-quest bg-quest/10" : "border-ember bg-ember/10"
              }`}
            >
              <p className="font-pixel text-[10px] uppercase">
                {selected === q.correct ? (
                  <span className="text-quest">✓ Correct!</span>
                ) : (
                  <span className="text-ember">✕ Not quite</span>
                )}
              </p>
              <p className="mt-2 text-parchment/90">{q.explanation}</p>
              <button onClick={next} className="pixel-btn-gold mt-4 w-full sm:w-auto">
                {i === total - 1 ? "Finish ▸" : "Continue ▸"}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ResultCard({
  passed,
  correct,
  total,
  xpGained,
  accentText,
  onExit,
  onRetry,
}: {
  passed: boolean;
  correct: number;
  total: number;
  xpGained: number;
  accentText: string;
  onExit: () => void;
  onRetry: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-5 text-center"
    >
      <div className="text-6xl animate-floaty">{passed ? "🏆" : "💪"}</div>
      <h2 className={`h-pixel text-xl ${passed ? accentText : "text-parchment"}`}>
        {passed ? "World Cleared!" : "Almost there!"}
      </h2>
      <p className="text-xl text-parchment/90">
        You scored <span className="font-pixel text-base text-gold">{correct}/{total}</span>
      </p>
      {xpGained > 0 && (
        <p className="font-pixel text-xs text-goldlt animate-popin">+{xpGained} XP</p>
      )}
      {!passed && (
        <p className="text-muted">
          You need {Math.ceil(passThreshold * total)}/{total} to clear this world. Review the
          lesson and try again — the concepts you got right are already banked.
        </p>
      )}
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button onClick={onRetry} className="pixel-btn-dark">
          ↻ Try again
        </button>
        <button onClick={onExit} className="pixel-btn-gold">
          {passed ? "Back to map ▸" : "Back to map"}
        </button>
      </div>
    </motion.div>
  );
}
