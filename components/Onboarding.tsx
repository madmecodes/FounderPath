"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Onboarding({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/95 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="pixel-card w-full max-w-md p-6 text-center"
      >
        <div className="text-5xl animate-floaty">🧙</div>
        <h2 className="h-pixel mt-4 text-lg text-gold">Welcome, Founder</h2>
        <p className="mt-3 text-parchment/85">
          Your quest: go from a raw idea to a venture-backed exit — learning every concept of
          equity, fundraising, growth and the cap table along the way. Each world you clear unlocks
          the next.
        </p>
        <p className="mt-3 text-sm text-muted">What should we call you on the leaderboard?</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onStart(name)}
          maxLength={18}
          placeholder="Your founder name"
          autoFocus
          className="mt-3 w-full rounded-lg border-2 border-line bg-panel2 px-4 py-3 text-center text-lg text-parchment outline-none focus:border-gold"
        />
        <button onClick={() => onStart(name)} className="pixel-btn-gold mt-5 w-full">
          Begin the Quest ▸
        </button>
      </motion.div>
    </div>
  );
}
