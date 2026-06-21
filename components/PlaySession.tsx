"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { WORLDS } from "@/lib/curriculum";
import { levelFromXp } from "@/lib/progress";
import type { GrowthPath, PlayerState, Question, World } from "@/lib/types";
import CityScene from "./CityScene";

type Phase = "choose" | "question" | "levelup" | "victory";

function questionsFor(world: World, pathId?: string): Question[] {
  const path = world.branching?.find((p) => p.id === pathId);
  return [...world.questions, ...(path?.questions ?? [])];
}

export default function PlaySession({
  player,
  recordResult,
  update,
}: {
  player: PlayerState;
  recordResult: (worldId: string, score: number, mastered: string[], chosenPath?: string) => number;
  update: (fn: (p: PlayerState) => PlayerState) => void;
}) {
  // Where to resume: first not-yet-finished world (computed once on mount).
  const startIdx = useMemo(() => {
    const i = WORLDS.findIndex((w) => !player.worlds[w.id]?.completed);
    return i === -1 ? 0 : i;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [levelIdx, setLevelIdx] = useState(startIdx);
  const world = WORLDS[levelIdx];
  const [chosenPath, setChosenPath] = useState<string | undefined>(player.worlds[world.id]?.chosenPath);
  const [phase, setPhase] = useState<Phase>(
    world.branching && !player.worlds[world.id]?.chosenPath ? "choose" : "question"
  );
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctIds, setCorrectIds] = useState<string[]>([]);
  const [hearts, setHearts] = useState(3);
  const [lastXp, setLastXp] = useState(0);
  // founder reaction sprite: idle while answering, random happy on correct, random introspective on wrong
  const [reaction, setReaction] = useState<{ mood: "idle" | "happy" | "think"; n: number }>({ mood: "idle", n: 0 });
  const [guideOpen, setGuideOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const introInit = useRef(false);
  useEffect(() => {
    if (introInit.current) return;
    introInit.current = true;
    if (!player.introSeen) setShowIntro(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dismissIntro = () => {
    update((p) => {
      p.introSeen = true;
      return p;
    });
    setShowIntro(false);
  };

  // Re-entrancy guard: advancing must happen exactly once per question, even if
  // the player double-taps Continue during the transition animation.
  const lockRef = useRef(false);
  useEffect(() => {
    lockRef.current = false;
  }, [qIdx, levelIdx, phase]);


  const questions = questionsFor(world, chosenPath);
  const q = questions[Math.min(qIdx, questions.length - 1)];
  const { level } = levelFromXp(player.xp);

  // How much of the startup tower is built (0..1 of the whole journey).
  const total = WORLDS.length;
  const buildFraction =
    phase === "victory"
      ? 1
      : phase === "levelup"
      ? (levelIdx + 1) / total
      : phase === "choose"
      ? levelIdx / total
      : (levelIdx + qIdx / Math.max(1, questions.length)) / total;
  const floorsBuilt = phase === "victory" ? total : phase === "levelup" ? levelIdx + 1 : levelIdx;

  const goToLevel = (nextIdx: number) => {
    if (nextIdx >= WORLDS.length) {
      setPhase("victory");
      return;
    }
    const w = WORLDS[nextIdx];
    const cp = player.worlds[w.id]?.chosenPath;
    setLevelIdx(nextIdx);
    setChosenPath(cp);
    setQIdx(0);
    setCorrectIds([]);
    setSelected(null);
    setRevealed(false);
    setHearts(3);
    setReaction({ mood: "idle", n: 0 });
    setPhase(w.branching && !cp ? "choose" : "question");
    window.scrollTo({ top: 0 });
  };

  const pickPath = (pid: string) => {
    setChosenPath(pid);
    update((p) => {
      const prev = p.worlds[world.id] ?? { best: 0, completed: false, mastered: [] };
      p.worlds[world.id] = { ...prev, chosenPath: pid };
      return p;
    });
    setQIdx(0);
    setCorrectIds([]);
    setSelected(null);
    setRevealed(false);
    setPhase("question");
  };

  const choose = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    const ok = idx === q.correct;
    setReaction({ mood: ok ? "happy" : "think", n: Math.floor(Math.random() * 3) });
    if (ok) {
      if (!correctIds.includes(q.id)) setCorrectIds((p) => [...p, q.id]);
    } else {
      setHearts((h) => Math.max(0, h - 1));
    }
  };

  const next = () => {
    if (lockRef.current) return;
    lockRef.current = true;
    setReaction({ mood: "idle", n: 0 });
    const latest =
      selected === q.correct && !correctIds.includes(q.id) ? [...correctIds, q.id] : correctIds;
    if (qIdx === questions.length - 1) {
      const score = latest.length / questions.length;
      const gained = recordResult(world.id, score, latest, chosenPath);
      // In continuous play, finishing a level always advances/unlocks it.
      update((p) => {
        const w = p.worlds[world.id];
        if (w) w.completed = true;
        return p;
      });
      setLastXp(gained);
      setPhase("levelup");
      window.scrollTo({ top: 0 });
    } else {
      setQIdx((n) => n + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  return (
    <main className="relative h-[100dvh] overflow-hidden">
      {/* ambient scene: sky-city + the tower rising on the left */}
      <CityScene fraction={buildFraction} floors={floorsBuilt} totalFloors={total} />

      {/* One-time intro: what kind of startup this game is about */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm">
          <div className="no-scrollbar max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-xl border-2 border-gold bg-panel p-5 shadow-pixel-gold sm:max-w-3xl sm:p-6">
            <p className="font-pixel text-[10px] uppercase text-quest">🚀 First, the basics</p>
            <h2 className="h-pixel mt-2 text-base text-gold">What kind of startup?</h2>
            <p className="mt-3 text-parchment/90">
              This game is about <span className="text-goldlt">venture-backed</span> startups —
              high-growth companies built to scale fast and exit big. That&apos;s different from a
              lifestyle or small business (great too, just a different game).
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border-2 border-gold/50 bg-panel2 p-3">
                <p className="font-pixel text-[9px] uppercase text-gold">Venture-backed</p>
                <ul className="mt-2 space-y-1 text-sm text-parchment/85">
                  <li>◆ Huge market ($100M+)</li>
                  <li>◆ Scales on tech/software/AI</li>
                  <li>◆ Raises VC, spends to grow</li>
                  <li>◆ Exits or IPOs in ~7–10 yrs</li>
                </ul>
              </div>
              <div className="rounded-lg border-2 border-line bg-panel2 p-3">
                <p className="font-pixel text-[9px] uppercase text-muted">Lifestyle / small biz</p>
                <ul className="mt-2 space-y-1 text-sm text-parchment/70">
                  <li>◇ Steady &amp; profitable</li>
                  <li>◇ Runs for income</li>
                  <li>◇ Bootstrapped / LLC</li>
                  <li>◇ Keep &amp; operate, no exit</li>
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted">
              Its core: a strong founding team + a big, executable idea — funded by issuing new
              shares to investors round after round, from idea → exit. That&apos;s what these {total}{" "}
              levels teach.
            </p>
            <button onClick={dismissIntro} className="pixel-btn-gold mt-5 w-full">
              Start your journey ▸
            </button>
          </div>
        </div>
      )}

      {/* Levels guide button (side) */}
      <button
        onClick={() => setGuideOpen(true)}
        className="absolute left-3 top-3 z-40 flex items-center gap-1.5 rounded-lg border-2 border-gold bg-ink/80 px-3 py-2 font-pixel text-[10px] text-gold shadow-pixel-sm backdrop-blur transition-colors hover:bg-gold hover:text-ink"
      >
        📖 LEVELS
      </button>

      {/* Levels guide modal — what each level teaches */}
      {guideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
          onClick={() => setGuideOpen(false)}
        >
          <div
            className="no-scrollbar max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-xl border-2 border-line bg-panel p-5 shadow-pixel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="h-pixel text-sm text-gold">The Founder&apos;s Journey</h2>
              <button onClick={() => setGuideOpen(false)} className="font-pixel text-xs text-muted hover:text-parchment">✕</button>
            </div>
            <p className="mt-1 text-sm text-muted">All {total} levels — what each one teaches you.</p>
            <ol className="mt-4 space-y-2">
              {WORLDS.map((w, i) => {
                const done = !!player.worlds[w.id]?.completed;
                const current = i === levelIdx;
                return (
                  <li
                    key={w.id}
                    className={`flex gap-3 rounded-lg border-2 p-3 ${current ? "border-gold bg-gold/10" : "border-line bg-panel2"}`}
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded border-2 border-line font-pixel text-[9px] text-goldlt">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-pixel text-[10px] text-parchment">
                        {w.icon} {w.title}
                        {done && <span className="ml-1 text-quest">✓</span>}
                        {current && <span className="ml-1 text-gold">▸ now</span>}
                      </p>
                      <p className="mt-1 text-sm text-muted">{w.objective}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <button onClick={() => setGuideOpen(false)} className="pixel-btn-gold mt-4 w-full">
              Got it ▸
            </button>
          </div>
        </div>
      )}

      {/* the founder reacts on the right — happy on correct, introspective on wrong */}
      <div className="pointer-events-none absolute bottom-0 right-0 z-10" style={{ width: "clamp(150px, 42vw, 250px)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={`${reaction.mood}-${reaction.n}`}
          src={`/assets/char/${reaction.mood === "idle" ? "idle" : `${reaction.mood}-${reaction.n}`}.png`}
          alt=""
          className="pixelated h-auto w-full animate-popin"
          style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.55))" }}
          onError={(e) => ((e.currentTarget.style.visibility = "hidden"))}
          onLoad={(e) => ((e.currentTarget.style.visibility = "visible"))}
        />
      </div>

      {/* compact quiz card — top-aligned on mobile so the bottom is a scene stage; centered on desktop */}
      <div className="relative z-20 flex h-full items-start justify-center px-3 pb-2 pt-12 md:items-center md:py-4">
        <div
          className="no-scrollbar flex max-h-[68dvh] w-full max-w-md flex-col overflow-y-auto rounded-xl p-5 backdrop-blur-md md:max-h-[90dvh]"
          style={{
            backgroundColor: "rgba(28,39,71,0.82)",
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 3px)",
            boxShadow:
              "inset 0 0 0 2px #0b0e14, inset 0 0 0 4px #3b4a72, 0 14px 50px rgba(0,0,0,0.75)",
          }}
        >
          {/* compact header */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-pixel text-[9px] leading-relaxed text-quest">
              LV {levelIdx + 1}/{total} · {world.title}
            </span>
            <span className="flex shrink-0 items-center gap-2 font-pixel text-[9px]">
              <span className="text-heart">
                {"♥".repeat(hearts)}
                <span className="text-line">{"♥".repeat(3 - hearts)}</span>
              </span>
              <span className="text-goldlt">{"★"}{player.xp}</span>
            </span>
          </div>
          {phase === "question" && (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full border border-line bg-panel2">
                <div
                  className="h-full bg-gradient-to-r from-gold to-goldlt transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round((Math.min(qIdx, questions.length) / questions.length) * 100))}%` }}
                />
              </div>
              <span className="font-pixel text-[8px] text-muted">
                {Math.min(qIdx + 1, questions.length)}/{questions.length}
              </span>
            </div>
          )}
          <div className="mt-4">
          <AnimatePresence mode="wait">
            {phase === "choose" && world.branching && (
              <motion.div
                key="choose"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <PathChooser world={world} paths={world.branching} onPick={pickPath} />
              </motion.div>
            )}

            {phase === "question" && q && (
              <motion.div
                key={`${world.id}-${q.id}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.2 }}
              >
                <QuestionCard
                  q={q}
                  selected={selected}
                  revealed={revealed}
                  onChoose={choose}
                  onNext={next}
                  isLast={qIdx === questions.length - 1}
                />
              </motion.div>
            )}

            {phase === "levelup" && (
              <motion.div
                key="levelup"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <LevelUp
                  score={correctIds.length}
                  total={questions.length}
                  xp={lastXp}
                  cleared={world.title}
                  nextWorld={WORLDS[levelIdx + 1]}
                  onContinue={() => goToLevel(levelIdx + 1)}
                />
              </motion.div>
            )}

            {phase === "victory" && (
              <motion.div key="victory" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <Victory xp={player.xp} />
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------------------------------------------------------- HUD */
function Hud({
  level,
  xp,
  levelIdx,
  worldTitle,
  hearts,
  qIdx,
  total,
  showProgress,
}: {
  level: number;
  xp: number;
  levelIdx: number;
  worldTitle: string;
  hearts: number;
  qIdx: number;
  total: number;
  showProgress: boolean;
}) {
  return (
    <div className="rounded-xl border-2 border-line bg-ink/70 p-3 backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        <Link href="/" className="font-pixel text-[10px] text-gold" aria-label="Home">
          🛡️
        </Link>
        <span className="font-pixel text-[9px] text-quest">
          LEVEL {levelIdx + 1}/{WORLDS.length} · {worldTitle}
        </span>
        <span className="flex items-center gap-2 font-pixel text-[9px]">
          <span className="text-heart">
            {"♥".repeat(hearts)}
            <span className="text-line">{"♥".repeat(3 - hearts)}</span>
          </span>
          <span className="text-goldlt">⭐{xp}</span>
        </span>
      </div>
      {showProgress && (
        <div className="mt-2 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full border border-line bg-panel2">
            <div
              className="h-full bg-gradient-to-r from-gold to-goldlt transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round((Math.min(qIdx, total) / total) * 100))}%` }}
            />
          </div>
          <span className="font-pixel text-[8px] text-muted">
            {Math.min(qIdx + 1, total)}/{total}
          </span>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Question */
function QuestionCard({
  q,
  selected,
  revealed,
  onChoose,
  onNext,
  isLast,
}: {
  q: Question;
  selected: number | null;
  revealed: boolean;
  onChoose: (i: number) => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const [hint, setHint] = useState(false);
  return (
    <div className="px-1">
      <h2 className="text-2xl leading-snug text-parchment">{q.prompt}</h2>

      {q.hint && !revealed && (
        <button
          onClick={() => setHint((s) => !s)}
          className="mt-2 font-pixel text-[9px] text-sky hover:underline"
        >
          {hint ? "▾ hide hint" : "▸ hint"}
        </button>
      )}
      {hint && q.hint && (
        <p className="mt-2 rounded border-l-4 border-sky bg-panel2 p-2 text-sm text-muted">{q.hint}</p>
      )}

      <div className="mt-4 grid gap-2.5">
        {q.options.map((opt, idx) => {
          const isCorrect = idx === q.correct;
          const isChosen = idx === selected;
          let cls = "border-line bg-panel2 hover:border-gold/70 active:translate-y-0.5";
          if (revealed) {
            if (isCorrect) cls = "border-quest bg-quest/15 text-quest";
            else if (isChosen) cls = "border-ember bg-ember/15 text-ember";
            else cls = "border-line bg-panel2 opacity-60";
          }
          return (
            <button
              key={idx}
              disabled={revealed}
              onClick={() => onChoose(idx)}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-[1.22rem] leading-snug transition-all ${cls}`}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded border-2 border-current font-pixel text-[9px]">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{opt}</span>
              {revealed && isCorrect && <span>✓</span>}
              {revealed && isChosen && !isCorrect && <span>✕</span>}
            </button>
          );
        })}
      </div>

      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 rounded-xl border-2 p-3 ${
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
          <p className="mt-2 text-lg text-parchment/90">{q.explanation}</p>
          <button onClick={onNext} className="pixel-btn-gold mt-4 w-full">
            {isLast ? "Finish Level ▸" : "Continue ▸"}
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Path chooser */
function PathChooser({
  world,
  paths,
  onPick,
}: {
  world: World;
  paths: GrowthPath[];
  onPick: (id: string) => void;
}) {
  return (
    <div className="px-1">
      <p className="font-pixel text-[10px] uppercase text-quest">🧭 {world.title}</p>
      <h2 className="mt-2 text-xl text-parchment">Choose your growth path</h2>
      <p className="mt-1 text-sm text-muted">Each motion teaches its own metrics. Pick one to continue.</p>
      <div className="mt-4 grid gap-2.5">
        {paths.map((p) => (
          <button
            key={p.id}
            onClick={() => onPick(p.id)}
            className="flex items-center gap-3 rounded-xl border-2 border-line bg-panel2 p-3 text-left transition-all hover:border-gold active:translate-y-0.5"
          >
            <span className="text-3xl">{p.emoji}</span>
            <div>
              <p className="h-pixel text-xs text-parchment">{p.name}</p>
              <p className="mt-1 text-sm text-muted">{p.blurb}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Level up */
function LevelUp({
  score,
  total,
  xp,
  cleared,
  nextWorld,
  onContinue,
}: {
  score: number;
  total: number;
  xp: number;
  cleared: string;
  nextWorld?: World;
  onContinue: () => void;
}) {
  return (
    <div className="rounded-2xl border-2 border-gold bg-ink/90 p-6 text-center shadow-pixel-gold backdrop-blur">
      <div className="text-6xl animate-floaty">⭐</div>
      <h2 className="h-pixel mt-3 text-lg text-gold">Level Cleared!</h2>
      <p className="mt-2 text-parchment/90">
        {cleared} — you scored{" "}
        <span className="font-pixel text-sm text-goldlt">
          {score}/{total}
        </span>
      </p>
      {xp > 0 && <p className="mt-2 font-pixel text-xs text-quest animate-popin">+{xp} XP</p>}
      {nextWorld ? (
        <>
          <p className="mt-4 text-sm text-muted">Next up</p>
          <p className="font-pixel text-xs text-sky">
            {nextWorld.icon} {nextWorld.title}
          </p>
          <button onClick={onContinue} className="pixel-btn-gold mt-5 w-full">
            Next Level ▸
          </button>
        </>
      ) : (
        <button onClick={onContinue} className="pixel-btn-gold mt-5 w-full">
          See your result ▸
        </button>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Victory */
function Victory({ xp }: { xp: number }) {
  return (
    <div className="rounded-2xl border-2 border-gold bg-ink/90 p-6 text-center shadow-pixel-gold backdrop-blur">
      <div className="text-7xl animate-floaty">🦄</div>
      <h2 className="h-pixel mt-3 text-xl text-gold">Unicorn Founder!</h2>
      <p className="mt-3 text-parchment/90">
        You cleared all {WORLDS.length} levels — from your first share to the exit. You now speak
        founder fluently.
      </p>
      <p className="mt-3 font-pixel text-sm text-goldlt">⭐ {xp} XP</p>
      <div className="mt-6 flex flex-col gap-3">
        <Link href="/profile" className="pixel-btn-gold">
          View your trophies ▸
        </Link>
        <Link href="/" className="pixel-btn-dark">
          Home
        </Link>
      </div>
    </div>
  );
}
