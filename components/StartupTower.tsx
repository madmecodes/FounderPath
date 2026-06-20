"use client";

import { motion } from "framer-motion";

/**
 * The player's startup, built block-by-block. We show the bottom `fraction` of a
 * tall tower sprite scaled to fill the frame — so at the start you see the lobby
 * up close, and as you clear levels the "camera" pulls back to reveal more floors
 * rising into view. The rooftop flag + rocket appear only when the quest is done.
 */
export default function StartupTower({
  fraction,
  floors,
  totalFloors,
}: {
  fraction: number;
  floors: number;
  totalFloors: number;
}) {
  const f = Math.max(0.08, Math.min(1, fraction));
  const building = f < 0.999;
  // Image height as a % of the frame so its bottom `f` portion exactly fills it.
  const imgHeightPct = 100 / f;

  return (
    <div className="relative h-full w-full select-none overflow-hidden">
      {/* the tower: bottom-anchored, scaled so the built portion fills the frame */}
      <motion.div
        className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-end justify-center"
        style={{ height: `${imgHeightPct}%` }}
        animate={{ height: `${imgHeightPct}%` }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/build/tower.png"
          alt="Your startup, under construction"
          className="pixelated h-full w-auto drop-shadow-[0_0_18px_rgba(245,180,36,0.15)]"
          draggable={false}
        />
      </motion.div>

      {/* glowing construction line at the top of the built section */}
      {building && (
        <div className="pointer-events-none absolute left-0 right-0 top-1">
          <div className="mx-auto h-[3px] w-3/5 bg-gold shadow-[0_0_14px_3px_rgba(245,180,36,0.8)]" />
          <div className="mx-auto -mt-1 h-2 w-2 animate-floaty rounded-sm bg-goldlt shadow-[0_0_10px_2px_rgba(245,180,36,0.9)]" />
        </div>
      )}

      {/* ground shadow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-6 w-3/4 -translate-x-1/2 rounded-[100%] bg-black/40 blur-md" />

      {/* floor counter */}
      <div className="absolute left-0 top-0 rounded-md border border-line bg-ink/70 px-2 py-1 backdrop-blur">
        <span className="font-pixel text-[8px] text-goldlt">
          🏗 {floors}/{totalFloors} floors
        </span>
      </div>
    </div>
  );
}
