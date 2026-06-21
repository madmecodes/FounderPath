"use client";

import Link from "next/link";
import { WORLDS } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";

export default function Landing() {
  const { player, ready } = useProgress();
  const cleared = ready ? Object.values(player.worlds).filter((w) => w.completed).length : 0;
  const started = ready && (player.onboarded || cleared > 0 || player.xp > 0);
  const allDone = cleared >= WORLDS.length;

  const shadow = { textShadow: "0 2px 8px rgba(0,0,0,0.85)" };
  const ctaLabel = allDone
    ? "▶ Play again"
    : started
    ? `▶ Continue · Level ${Math.min(cleared + 1, WORLDS.length)}`
    : "▶ Play";

  const Title = (
    <>
      <p className="label-quest text-quest" style={shadow}>The startup founder RPG</p>
      <h1 className="h-pixel mt-3 text-4xl leading-[1.18] sm:text-5xl" style={{ textShadow: "0 3px 0 rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.7)" }}>
        <span className="text-parchment">LEVEL UP</span>
        <br />
        <span className="text-gold">YOUR STARTUP</span>
      </h1>
    </>
  );

  const PlayBtn = (
    <Link href="/play" className="pixel-btn-gold block w-full !py-4 text-sm">
      {ctaLabel}
    </Link>
  );

  const Stats = (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-pixel text-[9px] text-parchment/85 md:justify-start" style={shadow}>
      {started && <span className="text-goldlt">★ {player.xp} XP</span>}
      <span>{WORLDS.length} levels</span>
      <span className="text-muted">·</span>
      <span>free</span>
      <span className="text-muted">·</span>
      <span>no sign-up</span>
    </div>
  );

  return (
    <main className="relative h-[100dvh] overflow-hidden bg-ink">
      {/* clean panoramic hero background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/landing-bg.png" alt="" className="pixelated absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/5 via-ink/25 to-ink/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/25" />

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

      {/* founder gazing at the city — bottom-left */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/hero-founder.png"
        alt="The founder gazing at the startup city"
        className="pointer-events-none absolute bottom-0 left-[-8%] z-0 h-[46%] animate-floaty object-contain object-left-bottom pixelated drop-shadow-[0_10px_24px_rgba(0,0,0,0.55)] md:left-[4%] md:h-[82%]"
      />

      {/* MOBILE: title top-center, PLAY beside the founder (bottom-right) */}
      <div className="relative z-10 h-full md:hidden">
        <div className="absolute inset-x-5 top-[12%] text-center">{Title}</div>
        <div className="absolute bottom-[20%] right-3 w-[56%] text-center">
          {PlayBtn}
          {Stats}
        </div>
      </div>

      {/* DESKTOP: title + CTA stacked center-right, founder left */}
      <div className="relative z-10 hidden h-full items-center justify-end pr-[8%] md:flex">
        <div className="w-full max-w-md text-left">
          {Title}
          <div className="mt-7 max-w-sm">
            {PlayBtn}
            {Stats}
          </div>
        </div>
      </div>
    </main>
  );
}
