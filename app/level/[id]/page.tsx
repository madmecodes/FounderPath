"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { worldById } from "@/lib/curriculum";
import { useProgress, isWorldUnlocked } from "@/lib/progress";
import { accentClasses } from "@/lib/theme";
import type { Question, Lesson, GrowthPath } from "@/lib/types";
import TopBar from "@/components/TopBar";
import LessonView from "@/components/Lesson";
import Quiz from "@/components/Quiz";
import Sprite from "@/components/Sprite";

type Phase = "choose" | "lesson" | "quiz";

export default function LevelPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);
  const { player, ready, recordResult, update } = useProgress();
  const world = worldById(id);

  const [phase, setPhase] = useState<Phase>("lesson");
  const [chosen, setChosen] = useState<string | undefined>(undefined);
  const [init, setInit] = useState(false);

  // Initialise phase / chosen path once player data is ready.
  useEffect(() => {
    if (!ready || !world || init) return;
    const prog = player.worlds[world.id];
    if (world.branching) {
      if (prog?.chosenPath) {
        setChosen(prog.chosenPath);
        setPhase("lesson");
      } else {
        setPhase("choose");
      }
    } else {
      setPhase("lesson");
    }
    setInit(true);
  }, [ready, world, init, player]);

  // Redirect if the world is locked.
  useEffect(() => {
    if (ready && world && !isWorldUnlocked(world.id, player)) {
      router.replace("/map");
    }
  }, [ready, world, player, router]);

  if (!ready) {
    return (
      <main className="grid min-h-screen place-items-center">
        <span className="animate-floaty text-4xl">🛡️</span>
      </main>
    );
  }

  if (!world) {
    return (
      <main className="grid min-h-screen place-items-center p-6 text-center">
        <div>
          <p className="text-2xl text-parchment">This world doesn&apos;t exist.</p>
          <Link href="/map" className="pixel-btn-gold mt-4 inline-block">
            Back to map
          </Link>
        </div>
      </main>
    );
  }

  const a = accentClasses[world.accent];
  const path: GrowthPath | undefined = world.branching?.find((p) => p.id === chosen);

  // Combined lessons & questions (base world + chosen path, if any).
  const lessons: Lesson[] = [...world.lessons, ...(path?.lessons ?? [])];
  const questions: Question[] = [...world.questions, ...(path?.questions ?? [])];

  const pickPath = (pid: string) => {
    setChosen(pid);
    // persist choice immediately so the map reflects it
    update((p) => {
      const prev = p.worlds[world.id] ?? { best: 0, completed: false, mastered: [] };
      p.worlds[world.id] = { ...prev, chosenPath: pid };
      return p;
    });
    setPhase("lesson");
    window.scrollTo({ top: 0 });
  };

  return (
    <main className="min-h-screen pb-20">
      <TopBar player={player} />

      <div className="mx-auto max-w-2xl px-4 pt-6">
        {/* world header */}
        <div className="flex items-center gap-4">
          <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-xl border-2 ${a.border} bg-panel2`}>
            <Sprite src={`/assets/${world.id}.png`} emoji={world.icon} alt={world.title} className="h-12 w-12" />
          </div>
          <div>
            <p className={`label-quest ${a.text}`}>
              World {world.index + 1} · {world.subtitle}
            </p>
            <h1 className="h-pixel mt-1 text-base text-parchment sm:text-lg">{world.title}</h1>
          </div>
        </div>
        <p className="mt-3 text-muted">{world.objective}</p>

        <div className="mt-6">
          {phase === "choose" && world.branching && (
            <PathChooser paths={world.branching} onPick={pickPath} accentText={a.text} />
          )}

          {phase === "lesson" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {path && (
                <div className="rounded-lg border-2 border-quest/50 bg-quest/10 p-3">
                  <p className="font-pixel text-[9px] text-quest">
                    🧭 PATH: {path.name} {path.emoji}
                  </p>
                  <button
                    onClick={() => setPhase("choose")}
                    className="mt-1 text-sm text-sky underline-offset-2 hover:underline"
                  >
                    change path
                  </button>
                </div>
              )}

              {lessons.map((l) => (
                <div key={l.id} className="pixel-card p-5">
                  <LessonView lesson={l} />
                </div>
              ))}

              <button
                onClick={() => {
                  setPhase("quiz");
                  window.scrollTo({ top: 0 });
                }}
                className="pixel-btn-gold w-full"
              >
                ▸ Take the Quiz ({questions.length} questions)
              </button>
            </motion.div>
          )}

          {phase === "quiz" && (
            <div className="pixel-card p-5 sm:p-6">
              <Quiz
                questions={questions}
                accentText={a.text}
                onResult={(score, mastered) =>
                  recordResult(world.id, score, mastered, chosen)
                }
                onExit={() => router.push("/map")}
                onRetry={() => window.scrollTo({ top: 0 })}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function PathChooser({
  paths,
  onPick,
  accentText,
}: {
  paths: GrowthPath[];
  onPick: (id: string) => void;
  accentText: string;
}) {
  return (
    <div className="space-y-4">
      <div className="pixel-card p-5">
        <p className={`font-pixel text-[10px] uppercase ${accentText}`}>🧭 Choose your path</p>
        <p className="mt-2 text-parchment/85">
          Every startup grows differently. Pick the go-to-market motion you want to master — you
          can change it later. Each path teaches its own metrics and has its own challenges.
        </p>
      </div>
      <div className="grid gap-3">
        {paths.map((p) => (
          <button
            key={p.id}
            onClick={() => onPick(p.id)}
            className="flex items-center gap-4 rounded-xl border-2 border-line bg-panel p-4 text-left transition-all hover:border-gold hover:bg-panel2 active:translate-y-0.5"
          >
            <span className="text-4xl">{p.emoji}</span>
            <div>
              <p className="h-pixel text-sm text-parchment">{p.name}</p>
              <p className="mt-1 text-sm text-muted">{p.blurb}</p>
            </div>
            <span className="ml-auto text-gold">▸</span>
          </button>
        ))}
      </div>
    </div>
  );
}
