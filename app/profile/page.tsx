"use client";

import Link from "next/link";
import { useState } from "react";
import { WORLDS, passThreshold } from "@/lib/curriculum";
import { useProgress, levelFromXp } from "@/lib/progress";
import { BADGES } from "@/lib/theme";
import TopBar from "@/components/TopBar";

const totalQuestions = WORLDS.reduce(
  (n, w) => n + w.questions.length + (w.branching?.[0]?.questions.length ?? 0),
  0
);

export default function ProfilePage() {
  const { player, ready, reset, setName } = useProgress();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  if (!ready) {
    return (
      <main className="grid min-h-screen place-items-center">
        <span className="animate-floaty text-4xl">🛡️</span>
      </main>
    );
  }

  const { level, into, need } = levelFromXp(player.xp);
  const cleared = Object.values(player.worlds).filter((w) => w.completed).length;
  const mastered = Object.values(player.worlds).reduce((n, w) => n + w.mastered.length, 0);

  const stats = [
    { icon: "⚔️", n: level, l: "Level" },
    { icon: "⭐", n: player.xp, l: "Total XP" },
    { icon: "🗺️", n: `${cleared}/${WORLDS.length}`, l: "Worlds cleared" },
    { icon: "🔥", n: player.streak, l: "Day streak" },
  ];

  return (
    <main className="min-h-screen pb-20">
      <TopBar player={player} />
      <div className="mx-auto max-w-2xl px-4 pt-6">
        <div className="pixel-card flex items-center gap-4 p-5">
          <span className="text-5xl">🧑‍🚀</span>
          <div className="flex-1">
            {editing ? (
              <div className="flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={18}
                  placeholder={player.name}
                  className="w-full rounded border-2 border-line bg-panel2 px-3 py-1 text-parchment outline-none focus:border-gold"
                />
                <button
                  onClick={() => {
                    setName(draft || player.name);
                    setEditing(false);
                  }}
                  className="pixel-btn-gold !px-3 !py-1"
                >
                  save
                </button>
              </div>
            ) : (
              <h1
                className="h-pixel cursor-pointer text-base text-gold sm:text-lg"
                onClick={() => {
                  setDraft(player.name);
                  setEditing(true);
                }}
                title="Tap to rename"
              >
                {player.name} ✎
              </h1>
            )}
            <p className="mt-1 text-sm text-muted">
              {mastered}/{totalQuestions} concepts mastered · {into}/{need} XP to next level
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="pixel-card p-4 text-center">
              <div className="text-2xl">{s.icon}</div>
              <p className="font-pixel mt-2 text-sm text-gold">{s.n}</p>
              <p className="text-xs text-muted">{s.l}</p>
            </div>
          ))}
        </div>

        {/* badges */}
        <h2 className="h-pixel mt-8 text-sm text-parchment">🏅 Badges</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(BADGES).map(([id, b]) => {
            const earned = player.badges.includes(id);
            return (
              <div
                key={id}
                className={`pixel-card p-4 text-center ${earned ? "" : "opacity-40 grayscale"}`}
                title={b.desc}
              >
                <div className="text-3xl">{earned ? b.icon : "🔒"}</div>
                <p className="mt-2 text-sm text-parchment">{b.name}</p>
              </div>
            );
          })}
        </div>

        {/* world progress */}
        <h2 className="h-pixel mt-8 text-sm text-parchment">🗺️ World progress</h2>
        <ul className="mt-3 space-y-2">
          {WORLDS.map((w, i) => {
            const prog = player.worlds[w.id];
            const best = Math.round((prog?.best ?? 0) * 100);
            return (
              <li
                key={w.id}
                className="flex items-center gap-3 rounded-lg border-2 border-line bg-panel p-3"
              >
                <span className="text-xl">{w.icon}</span>
                <span className="flex-1 truncate text-parchment">
                  {i + 1}. {w.title}
                </span>
                {prog?.completed ? (
                  <span className="font-pixel text-[9px] text-quest">✓ {best}%</span>
                ) : prog ? (
                  <span className="font-pixel text-[9px] text-gold">{best}%</span>
                ) : (
                  <span className="font-pixel text-[9px] text-muted">—</span>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/map" className="pixel-btn-gold">
            ▸ Continue Quest
          </Link>
          <button
            onClick={() => {
              if (confirm("Reset all progress? This cannot be undone.")) reset();
            }}
            className="pixel-btn-dark !text-ember"
          >
            Reset progress
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          Progress is saved locally in your browser. Pass mark per world: {Math.round(passThreshold * 100)}%.
        </p>
      </div>
    </main>
  );
}
