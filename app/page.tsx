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
      {/* full-bleed pixel scene */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/scene.png"
          alt="A pixel-art founder gazing at a startup city at sunrise"
          className="pixelated h-full w-full object-cover"
        />
        {/* readability: darken bottom + a gentle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-transparent" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 30%, transparent 30%, rgba(11,14,20,0.5) 100%)" }} />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        {/* top bar */}
        <div className="flex items-center justify-between px-5 py-4">
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

        <div className="flex-1" />

        {/* hero — anchored lower, over the dark gradient so it's always readable */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-xl px-6 pb-10 text-center"
        >
          <p className="label-quest text-quest" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.8)" }}>
            The startup founder RPG
          </p>
          <h1
            className="h-pixel mt-3 text-3xl leading-[1.18] sm:text-4xl"
            style={{ textShadow: "0 3px 0 rgba(0,0,0,0.55), 0 6px 16px rgba(0,0,0,0.6)" }}
          >
            <span className="text-parchment">LEVEL UP</span>
            <br />
            <span className="text-gold">YOUR STARTUP</span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-lg text-parchment/90" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
            Answer your way from <span className="text-goldlt">idea</span> to{" "}
            <span className="text-goldlt">exit</span>. Master equity, fundraising, growth & the exit —
            one quick question at a time.
          </p>

          <Link href="/play" className="pixel-btn-gold mx-auto mt-7 block w-full max-w-sm !py-5 text-sm">
            {allDone ? "▶ Play again" : started ? `▶ Continue · Level ${Math.min(cleared + 1, WORLDS.length)}` : "▶ Play"}
          </Link>

          <div className="mt-4 flex items-center justify-center gap-4 font-pixel text-[9px] text-parchment/80">
            {started && (
              <span className="text-goldlt">★ {player.xp} XP</span>
            )}
            <span>{WORLDS.length} levels</span>
            <span className="text-muted">·</span>
            <span>free</span>
            <span className="text-muted">·</span>
            <span>no sign-up</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
