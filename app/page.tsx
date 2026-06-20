"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WORLDS } from "@/lib/curriculum";
import { useProgress, levelFromXp } from "@/lib/progress";
import { accentClasses } from "@/lib/theme";
import Sprite from "@/components/Sprite";

const totalQuestions = WORLDS.reduce(
  (n, w) =>
    n +
    w.questions.length +
    (w.branching?.reduce((m, p) => m + p.questions.length, 0) ?? 0),
  0
);

const STEPS = [
  { n: 1, icon: "🗺️", title: "Pick a World", text: "Start at 'The Foundry' and follow the startup lifecycle." },
  { n: 2, icon: "📖", title: "Learn the Concept", text: "Short, plain-English lessons — bricks not pies, caps, NRR." },
  { n: 3, icon: "🎯", title: "Beat the Quiz", text: "Answer to bank XP. Wrong answers teach you instantly." },
  { n: 4, icon: "🏆", title: "Unlock & Climb", text: "Clear a world to unlock the next, all the way to the exit." },
];

export default function Landing() {
  const { player, ready } = useProgress();
  const started = ready && player.onboarded;
  const { level } = levelFromXp(player.xp);
  const cleared = Object.values(player.worlds).filter((w) => w.completed).length;

  return (
    <main className="min-h-screen">
      {/* nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <span className="font-pixel text-sm text-gold">FoundrQuest</span>
        </div>
        <Link href="/map" className="pixel-btn-gold !py-2 text-[10px]">
          {started ? "Continue ▸" : "Start ▸"}
        </Link>
      </nav>

      {/* hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-10 pt-6 sm:grid-cols-2 sm:pt-12">
        <div>
          <p className="label-quest text-quest">The startup founder RPG</p>
          <h1 className="h-pixel mt-4 text-3xl leading-[1.15] sm:text-4xl lg:text-5xl">
            <span className="text-parchment">LEVEL UP</span>
            <br />
            <span className="text-gold drop-shadow-[0_4px_0_#a6790f]">YOUR STARTUP</span>
          </h1>
          <p className="mt-5 max-w-md text-xl text-parchment/85">
            Master equity, valuations, convertible notes, SAFEs, fundraising, growth, retention
            and the exit — by playing through the real founder journey.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/map" className="pixel-btn-gold">
              {started ? "Resume Quest ▸" : "Start Your Quest ▸"}
            </Link>
            <a href="#worlds" className="pixel-btn-dark">
              See the worlds
            </a>
          </div>
          {started && (
            <p className="mt-4 font-pixel text-[9px] text-muted">
              ⚔️ Level {level} · {cleared}/{WORLDS.length} worlds cleared
            </p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="relative overflow-hidden rounded-2xl border-2 border-line bg-gradient-to-b from-sky/25 via-panel2 to-panel shadow-pixel">
            <Sprite
              src="/assets/hero.png"
              emoji="🧑‍🚀"
              alt="A pixel-art founder hero overlooking a startup landscape"
              className="relative z-10 aspect-[4/5] w-full"
              emojiClassName="text-[6.5rem] sm:text-[8.5rem] animate-floaty"
            />
            {/* decorative pixel scene behind the hero glyph (shows when art is absent) */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center gap-1 pb-3 text-3xl opacity-80">
              🌲🏔️🏰🏔️🌲
            </div>
            <div className="pointer-events-none absolute right-5 top-5 text-3xl opacity-80">☀️</div>
          </div>
        </motion.div>
      </section>

      {/* stats strip */}
      <section className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border-2 border-line bg-panel p-5 sm:grid-cols-4">
          {[
            { icon: "🗺️", n: `${WORLDS.length}`, l: "Worlds" },
            { icon: "🎯", n: `${totalQuestions}+`, l: "Quiz challenges" },
            { icon: "🧭", n: "3", l: "Growth paths" },
            { icon: "⭐", n: "100%", l: "Free to play" },
          ].map((s) => (
            <div key={s.l} className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="font-pixel text-sm text-gold">{s.n}</p>
                <p className="text-sm text-muted">{s.l}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="mx-auto max-w-5xl px-4 py-12 text-center">
        <p className="label-quest text-quest">How it works</p>
        <h2 className="h-pixel mt-3 text-xl text-parchment sm:text-2xl">Your quest, your rules.</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="pixel-card p-5 text-center">
              <div className="text-4xl">{s.icon}</div>
              <p className="font-pixel mt-3 text-lg text-gold">{s.n}</p>
              <h3 className="h-pixel mt-2 text-xs text-parchment">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* worlds preview */}
      <section id="worlds" className="mx-auto max-w-5xl px-4 pb-16">
        <p className="label-quest text-quest text-center">The journey</p>
        <h2 className="h-pixel mt-3 text-center text-xl text-parchment sm:text-2xl">
          13 worlds, idea → exit
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {WORLDS.map((w, i) => {
            const a = accentClasses[w.accent];
            return (
              <div key={w.id} className="flex items-center gap-3 rounded-xl border-2 border-line bg-panel p-4">
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg border-2 ${a.border} bg-panel2`}>
                  <span className="text-2xl">{w.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className={`label-quest ${a.text}`}>World {i + 1}</p>
                  <p className="truncate text-lg text-parchment">{w.title}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Link href="/map" className="pixel-btn-gold">
            {started ? "Resume Quest ▸" : "Start Your Quest ▸"}
          </Link>
        </div>
      </section>

      <footer className="border-t-2 border-line py-6 text-center text-sm text-muted">
        FoundrQuest — learn the founder game by playing it. Built for aspiring founders.
      </footer>
    </main>
  );
}
