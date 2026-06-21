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

  const shadow = { textShadow: "0 2px 8px rgba(0,0,0,0.85)" };

  return (
    <main className="relative h-[100dvh] overflow-hidden bg-ink">
      {/* clean panoramic hero background (no floating bits to crop) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/landing-bg.png" alt="" className="pixelated absolute inset-0 h-full w-full object-cover" />
      {/* scrims: darker on the right (where the text lives) + bottom for mobile */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/5 via-ink/25 to-ink/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/20" />

      {/* top bar */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <span className="font-pixel text-sm text-gold" style={shadow}>FounderPath</span>
        </div>
        {started && (
          <Link href="/profile" className="grid h-9 w-9 place-items-center rounded-lg border-2 border-line bg-ink/60 text-lg backdrop-blur" aria-label="Profile">
            ⚙️
          </Link>
        )}
      </div>

      {/* founder gazing at the city, standing in the foreground on the left (desktop) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/hero-founder.png"
        alt="The founder gazing at the startup city"
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-[64%] -translate-x-1/2 animate-floaty object-contain object-bottom pixelated drop-shadow-[0_10px_24px_rgba(0,0,0,0.55)] md:left-[4%] md:h-[82%] md:translate-x-0"
      />

      {/* hero content — centered on mobile, center-right on desktop */}
      <div className="relative z-10 flex h-full items-center justify-center px-6 md:justify-end md:pr-[8%]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md text-center md:text-left"
        >
          <p className="label-quest text-quest" style={shadow}>The startup founder RPG</p>
          <h1 className="h-pixel mt-3 text-4xl leading-[1.18] sm:text-5xl" style={{ textShadow: "0 3px 0 rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.7)" }}>
            <span className="text-parchment">LEVEL UP</span>
            <br />
            <span className="text-gold">YOUR STARTUP</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-parchment/90 md:mx-0" style={shadow}>
            Answer your way from <span className="text-goldlt">idea</span> to{" "}
            <span className="text-goldlt">exit</span> — equity, fundraising, growth & the exit, one
            quick question at a time.
          </p>

          <Link href="/play" className="pixel-btn-gold mx-auto mt-7 block w-full max-w-sm !py-5 text-sm md:mx-0">
            {allDone ? "▶ Play again" : started ? `▶ Continue · Level ${Math.min(cleared + 1, WORLDS.length)}` : "▶ Play"}
          </Link>

          <div className="mt-4 flex items-center justify-center gap-3 font-pixel text-[9px] text-parchment/85 md:justify-start" style={shadow}>
            {started && <span className="text-goldlt">★ {player.xp} XP</span>}
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
