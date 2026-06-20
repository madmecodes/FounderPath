#!/usr/bin/env bash
# Generates the FoundrQuest pixel-art asset family (sequential = reliable).
set -u
# Uses the provider-fallback runner: OpenAI gpt-image-1 -> OpenRouter Gemini.
GEN="$HOME/.claude/skills/gen-image.sh"
OUT="/Users/themadme/Projects/foundrquest/public/assets"
mkdir -p "$OUT"

STYLE="16-bit retro isometric pixel-art game icon, crisp clean pixels, dark navy game background, warm golden rim lighting, vibrant saturated palette, single centered subject, cohesive fantasy RPG art style, no text, no words, no watermark"

gen () { # name  prompt  [size]
  local name="$1"; local prompt="$2"; local size="${3:-1024x1024}"
  if [ -f "$OUT/$name.png" ]; then echo "skip $name (exists)"; return; fi
  echo ">>> $name"
  bash "$GEN" "$prompt" "$OUT/$name.png" "$size" medium || echo "FAILED $name"
}

# Hero (portrait) — FitQuest-style adventurer overlooking a startup world
gen hero "Heroic pixel-art founder adventurer character standing on a grassy cliff platform, blue tunic and backpack and headband, gazing over a vast fantasy landscape of rolling mountains, a rising sun and pixel clouds, distant glowing city of startups, $STYLE" 1024x1536

# 13 world medallions
gen equity-basics "a glowing stack of golden building-block bricks assembled into a small fortress foundation, $STYLE"
gen company-formation "a stately government city-hall building with white columns, dome and a small flag, official and grand, $STYLE"
gen valuation "a mystical glowing crystal ball on a stand with golden coins and a tiny rising chart swirling inside, $STYLE"
gen funding-instruments "a sturdy stone bridge arching over a deep chasm with a glowing golden walkway, $STYLE"
gen shares-and-options "an ornate treasure vault door open with a giant golden key, stacked gold coins and share certificates spilling out, $STYLE"
gen the-pitch "a grand colosseum arena with crossed silver swords under a dramatic golden spotlight, $STYLE"
gen term-sheet "an unfurled glowing parchment contract scroll with a feather quill and red wax seal on a wooden table, $STYLE"
gen due-diligence "a large magnifying glass hovering over neat stacks of documents and an open ledger book, investigative, $STYLE"
gen legal-and-close "a writing desk with a feather quill, an official rubber stamp, and an open treasure chest of glowing gold beside it, $STYLE"
gen accelerators "a tall wizard academy tower with banners and a graduation cap on top, magical and prestigious, $STYLE"
gen growth-engine "a fantasy wooden signpost at a forked crossroads splitting into three glowing paths, a brass compass in front, $STYLE"
gen retention-expansion "a thriving fortified castle kingdom with a golden crown floating above it and a growing prosperous town, $STYLE"
gen the-exit "a triumphant mountain summit with a planted victory flag at the peak, sunrise glow and a small treasure chest, $STYLE"

echo "=== asset generation complete ==="
ls -la "$OUT"
