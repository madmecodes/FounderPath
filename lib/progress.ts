"use client";

import { useCallback, useEffect, useState } from "react";
import type { PlayerState, WorldProgress } from "./types";
import { WORLDS, passThreshold } from "./curriculum";

const KEY = "founderpath:player:v1";
const LEGACY_KEYS = ["foundrquest:player:v1"]; // migrate older saves
const MAX_HEARTS = 5;

export const emptyPlayer = (): PlayerState => ({
  name: "Founder",
  xp: 0,
  hearts: MAX_HEARTS,
  streak: 0,
  worlds: {},
  badges: [],
  onboarded: false,
});

function load(): PlayerState {
  if (typeof window === "undefined") return emptyPlayer();
  try {
    let raw = localStorage.getItem(KEY);
    if (!raw) {
      // one-time migration from an older storage key
      for (const k of LEGACY_KEYS) {
        const old = localStorage.getItem(k);
        if (old) {
          raw = old;
          localStorage.setItem(KEY, old);
          break;
        }
      }
    }
    if (!raw) return emptyPlayer();
    return { ...emptyPlayer(), ...JSON.parse(raw) };
  } catch {
    return emptyPlayer();
  }
}

function save(p: PlayerState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore quota errors */
  }
}

/** Level from XP — gentle curve: 100 XP for L1, growing ~20% each level. */
export function levelFromXp(xp: number): { level: number; into: number; need: number } {
  let level = 1;
  let need = 100;
  let acc = 0;
  while (xp >= acc + need) {
    acc += need;
    level += 1;
    need = Math.round(need * 1.2);
  }
  return { level, into: xp - acc, need };
}

/** A world is unlocked when the previous world (by index) is completed. */
export function isWorldUnlocked(worldId: string, player: PlayerState): boolean {
  const w = WORLDS.find((x) => x.id === worldId);
  if (!w) return false;
  if (w.index === 0) return true;
  const prev = WORLDS.find((x) => x.index === w.index - 1);
  if (!prev) return true;
  return !!player.worlds[prev.id]?.completed;
}

export function useProgress() {
  const [player, setPlayer] = useState<PlayerState>(emptyPlayer);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPlayer(load());
    setReady(true);
  }, []);

  const update = useCallback((fn: (p: PlayerState) => PlayerState) => {
    setPlayer((prev) => {
      const next = fn(structuredClone(prev));
      save(next);
      return next;
    });
  }, []);

  const setName = useCallback(
    (name: string) =>
      update((p) => {
        p.name = name.trim() || "Founder";
        p.onboarded = true;
        return p;
      }),
    [update]
  );

  /** Record a completed quiz attempt for a world. Returns XP gained. */
  const recordResult = useCallback(
    (
      worldId: string,
      score: number,
      masteredIds: string[],
      chosenPath?: string
    ): number => {
      let gained = 0;
      update((p) => {
        const prev: WorldProgress =
          p.worlds[worldId] ?? { best: 0, completed: false, mastered: [] };
        const wasComplete = prev.completed;
        const nowComplete = score >= passThreshold;

        const mergedMastered = Array.from(
          new Set([...prev.mastered, ...masteredIds])
        );
        // XP: 10 per newly mastered question + 50 first-clear bonus.
        const newlyMastered = mergedMastered.length - prev.mastered.length;
        gained = newlyMastered * 10;
        if (nowComplete && !wasComplete) gained += 50;
        p.xp += gained;

        p.worlds[worldId] = {
          best: Math.max(prev.best, score),
          completed: prev.completed || nowComplete,
          mastered: mergedMastered,
          chosenPath: chosenPath ?? prev.chosenPath,
        };

        // streak
        const today = new Date().toISOString().slice(0, 10);
        if (p.lastPlayed !== today) {
          const yest = new Date(Date.now() - 86400000)
            .toISOString()
            .slice(0, 10);
          p.streak = p.lastPlayed === yest ? p.streak + 1 : 1;
          p.lastPlayed = today;
        }

        // badges
        if (nowComplete) addBadge(p, `world:${worldId}`);
        const clears = Object.values(p.worlds).filter((w) => w.completed).length;
        if (clears >= 1) addBadge(p, "first-blood");
        if (clears >= Math.ceil(WORLDS.length / 2)) addBadge(p, "halfway");
        if (clears >= WORLDS.length) addBadge(p, "unicorn");
        if (p.streak >= 3) addBadge(p, "streak-3");

        return p;
      });
      return gained;
    },
    [update]
  );

  const reset = useCallback(() => update(() => emptyPlayer()), [update]);

  return { player, ready, setName, recordResult, reset, update };
}

function addBadge(p: PlayerState, id: string) {
  if (!p.badges.includes(id)) p.badges.push(id);
}
