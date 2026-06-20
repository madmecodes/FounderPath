import type { World } from "./types";

export const accentClasses: Record<
  World["accent"],
  { text: string; bg: string; border: string; glow: string; ring: string }
> = {
  gold: {
    text: "text-gold",
    bg: "bg-gold",
    border: "border-gold",
    glow: "shadow-[0_0_24px_-4px_rgba(245,180,36,0.6)]",
    ring: "ring-gold",
  },
  sky: {
    text: "text-sky",
    bg: "bg-sky",
    border: "border-sky",
    glow: "shadow-[0_0_24px_-4px_rgba(90,169,230,0.6)]",
    ring: "ring-sky",
  },
  quest: {
    text: "text-quest",
    bg: "bg-quest",
    border: "border-quest",
    glow: "shadow-[0_0_24px_-4px_rgba(124,255,178,0.5)]",
    ring: "ring-quest",
  },
  ember: {
    text: "text-ember",
    bg: "bg-ember",
    border: "border-ember",
    glow: "shadow-[0_0_24px_-4px_rgba(255,107,74,0.6)]",
    ring: "ring-ember",
  },
  heart: {
    text: "text-heart",
    bg: "bg-heart",
    border: "border-heart",
    glow: "shadow-[0_0_24px_-4px_rgba(255,77,109,0.6)]",
    ring: "ring-heart",
  },
};

export const BADGES: Record<string, { name: string; icon: string; desc: string }> = {
  "first-blood": { name: "First Quest", icon: "🗡️", desc: "Cleared your first world." },
  halfway: { name: "Halfway Hero", icon: "⛰️", desc: "Cleared half the journey." },
  unicorn: { name: "Unicorn", icon: "🦄", desc: "Cleared every world." },
  "streak-3": { name: "On Fire", icon: "🔥", desc: "3-day learning streak." },
};
