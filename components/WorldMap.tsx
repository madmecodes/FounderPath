"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { PlayerState } from "@/lib/types";
import { WORLDS } from "@/lib/curriculum";
import { isWorldUnlocked } from "@/lib/progress";
import { accentClasses } from "@/lib/theme";
import Sprite from "./Sprite";

export default function WorldMap({ player }: { player: PlayerState }) {
  return (
    <div className="relative mx-auto max-w-3xl px-4 py-6">
      {/* winding path spine */}
      <div className="pointer-events-none absolute bottom-10 left-1/2 top-10 w-1 -translate-x-1/2 bg-gradient-to-b from-line via-line to-transparent sm:left-[60px] sm:translate-x-0" />

      <ol className="space-y-4">
        {WORLDS.map((w, idx) => {
          const unlocked = isWorldUnlocked(w.id, player);
          const prog = player.worlds[w.id];
          const completed = !!prog?.completed;
          const a = accentClasses[w.accent];
          const side = idx % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse";

          const node = (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-4 ${side}`}
            >
              {/* node medallion */}
              <div className="relative shrink-0">
                <div
                  className={`grid h-20 w-20 place-items-center rounded-2xl border-2 sm:h-24 sm:w-24 ${
                    unlocked ? `${a.border} bg-panel2 ${completed ? a.glow : ""}` : "border-line bg-panel opacity-70"
                  }`}
                >
                  {unlocked ? (
                    <Sprite src={`/assets/${w.id}.png`} emoji={w.icon} alt={w.title} className="h-16 w-16 sm:h-20 sm:w-20" />
                  ) : (
                    <span className="text-3xl">🔒</span>
                  )}
                </div>
                {completed && (
                  <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full border-2 border-ink bg-quest text-xs">
                    ✓
                  </span>
                )}
                <span className="absolute -left-1 -top-2 grid h-6 w-6 place-items-center rounded-full border-2 border-ink bg-gold font-pixel text-[9px] text-ink">
                  {idx + 1}
                </span>
              </div>

              {/* card */}
              <div
                className={`flex-1 rounded-xl border-2 p-4 ${
                  unlocked ? "border-line bg-panel" : "border-line/60 bg-panel/60"
                }`}
              >
                <p className={`label-quest ${unlocked ? a.text : "text-muted"}`}>
                  {w.subtitle}
                </p>
                <h3 className="h-pixel mt-1 text-sm text-parchment sm:text-base">{w.title}</h3>
                <p className="mt-2 text-sm text-muted">{w.objective}</p>
                {prog?.chosenPath && (
                  <p className="mt-1 font-pixel text-[8px] text-quest">PATH: {prog.chosenPath.toUpperCase()}</p>
                )}
                <div className="mt-3">
                  {!unlocked ? (
                    <span className="font-pixel text-[9px] text-muted">🔒 Clear the previous world</span>
                  ) : completed ? (
                    <span className="font-pixel text-[9px] text-quest">
                      ★ Best {Math.round((prog?.best ?? 0) * 100)}% — replay?
                    </span>
                  ) : (
                    <span className="font-pixel text-[9px] text-gold">▸ Tap to enter</span>
                  )}
                </div>
              </div>
            </motion.div>
          );

          return (
            <li key={w.id}>
              {unlocked ? (
                <Link href={`/level/${w.id}`} className="block transition-transform hover:scale-[1.01]">
                  {node}
                </Link>
              ) : (
                <div className="cursor-not-allowed">{node}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
