"use client";

import Link from "next/link";
import type { PlayerState } from "@/lib/types";
import { levelFromXp } from "@/lib/progress";

export default function TopBar({ player }: { player: PlayerState }) {
  const { level, into, need } = levelFromXp(player.xp);
  const pct = Math.min(100, Math.round((into / need) * 100));

  return (
    <header className="sticky top-0 z-40 border-b-2 border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2 sm:gap-4 sm:px-5 sm:py-3">
        <Link href="/map" className="flex shrink-0 items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <span className="hidden font-pixel text-xs text-gold sm:inline">FounderPath</span>
        </Link>

        {/* XP / level */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="font-pixel text-[10px] text-goldlt shrink-0">LV {level}</span>
          <div className="relative h-3 min-w-0 flex-1 overflow-hidden rounded-full border border-line bg-panel2">
            <div
              className="h-full bg-gradient-to-r from-gold to-goldlt transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="hidden font-pixel text-[9px] text-muted sm:inline shrink-0">
            {player.xp} XP
          </span>
        </div>

        {/* streak + hearts */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {player.streak > 0 && (
            <span className="font-pixel text-[10px] text-ember" title="Daily streak">
              🔥{player.streak}
            </span>
          )}
          <span className="font-pixel text-[10px] text-heart" title="Hearts">
            {"♥".repeat(player.hearts)}
            <span className="text-line">{"♥".repeat(Math.max(0, 5 - player.hearts))}</span>
          </span>
          <Link
            href="/profile"
            className="hidden rounded border-2 border-line px-2 py-1 font-pixel text-[9px] text-parchment hover:border-gold hover:text-gold sm:inline"
          >
            {player.name}
          </Link>
        </div>
      </div>
    </header>
  );
}
