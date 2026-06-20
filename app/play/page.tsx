"use client";

import { useProgress } from "@/lib/progress";
import PlaySession from "@/components/PlaySession";

export default function PlayPage() {
  const { player, ready, recordResult, update } = useProgress();

  if (!ready) {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-ink">
        <span className="animate-floaty text-4xl">🛡️</span>
      </main>
    );
  }

  return <PlaySession player={player} recordResult={recordResult} update={update} />;
}
