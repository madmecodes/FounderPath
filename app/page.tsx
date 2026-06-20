"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WORLDS } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";

export default function Landing() {
  const { player, ready } = useProgress();
  const cleared = ready ? Object.values(player.worlds).filter((w) => w.completed).length : 0;
  const started = ready && (player.onboarded || cleared > 0 || player.xp > 0);
  const allDone = cleared >= WORLDS.length;

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-ink">
      {/* full-bleed pixel scene + character */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/scene.png"
          alt="A pixel-art founder gazing at a startup city at sunrise"
          className="pixelated h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-transparent" />
      </div>

      {/* content column — mobile-first */}
      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-md flex-col px-6 py-7">
        {/* top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <span className="font-pixel text-sm text-gold">FoundrQuest</span>
          </div>
          {started && (
            <Link
              href="/profile"
              className="grid h-9 w-9 place-items-center rounded-lg border-2 border-line bg-ink/60 text-lg backdrop-blur"
              aria-label="Profile"
            >
              ⚙️
            </Link>
          )}
        </div>

        {/* title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8"
        >
          <p className="label-quest text-quest">The startup founder RPG</p>
          <h1 className="h-pixel mt-3 text-3xl leading-[1.2]">
            <span className="text-parchment">LEVEL UP</span>
            <br />
            <span className="text-gold drop-shadow-[0_3px_0_#a6790f]">YOUR STARTUP</span>
          </h1>
        </motion.div>

        <div className="flex-1" />

        {/* play */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="space-y-4 text-center"
        >
          <p className="text-lg text-parchment/90">
            Answer your way from <span className="text-gold">idea</span> to{" "}
            <span className="text-gold">exit</span>. Each level you clear unlocks the next.
          </p>

          <Link href="/play" className="pixel-btn-gold block w-full !py-5 text-sm">
            {allDone ? "▶ Play again" : started ? `▶ Continue · Level ${Math.min(cleared + 1, WORLDS.length)}` : "▶ Play"}
          </Link>

          {started && (
            <p className="font-pixel text-[9px] text-parchment/70">
              ⭐ {player.xp} XP · {cleared}/{WORLDS.length} levels cleared
            </p>
          )}
          <p className="font-pixel text-[8px] text-muted">{WORLDS.length} levels · free · no sign-up</p>
        </motion.div>
      </div>
    </main>
  );
}
