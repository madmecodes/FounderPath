"use client";

import { useProgress } from "@/lib/progress";
import { WORLDS } from "@/lib/curriculum";
import TopBar from "@/components/TopBar";
import WorldMap from "@/components/WorldMap";
import Onboarding from "@/components/Onboarding";

export default function MapPage() {
  const { player, ready, setName } = useProgress();

  if (!ready) {
    return (
      <main className="grid min-h-screen place-items-center">
        <span className="animate-floaty text-4xl">🛡️</span>
      </main>
    );
  }

  const cleared = Object.values(player.worlds).filter((w) => w.completed).length;

  return (
    <main className="min-h-screen pb-16">
      <TopBar player={player} />
      {!player.onboarded && <Onboarding onStart={setName} />}

      <div className="mx-auto max-w-3xl px-4 pt-6 text-center">
        <h1 className="h-pixel text-lg text-gold sm:text-xl">The Founder&apos;s Journey</h1>
        <p className="mt-2 text-muted">
          {cleared === WORLDS.length
            ? "🦄 You cleared every world — you're a Unicorn founder!"
            : `Cleared ${cleared} of ${WORLDS.length} worlds. Climb from idea to exit.`}
        </p>
      </div>

      <WorldMap player={player} />
    </main>
  );
}
