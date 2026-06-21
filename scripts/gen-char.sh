#!/usr/bin/env bash
# Founder character expression sprites (transparent) for play-screen reactions.
set -u
GEN="$HOME/.claude/skills/gen-image.js"
OUT="/Users/themadme/Projects/foundrquest/public/assets/char"
mkdir -p "$OUT"

BASE="Pixel-art front-facing upper-body portrait of a young startup founder character, messy spiky auburn hair with a red bandana headband, green t-shirt, blue backpack straps on the shoulders, youthful friendly face, 8-bit retro game sprite, bold clean crisp pixels, vibrant saturated colors, single centered character, fully transparent background, no ground, no text, no watermark"

gen () { node "$GEN" "$BASE, $2" "$OUT/$1.png" 1024x1024 medium transparent || echo "FAILED $1"; echo "ok $1"; }

gen idle    "calm confident neutral expression with a slight smile, arms relaxed at sides"
gen happy-0 "overjoyed huge open grin, both fists raised up in celebration, eyes bright and sparkling, excited"
gen happy-1 "big cheerful smile giving an enthusiastic thumbs up with one hand, winking one eye"
gen happy-2 "laughing with pure joy, both arms thrown up in the air, eyes happy, triumphant"
gen think-0 "thoughtful introspective expression, one hand resting on the chin, eyes looking up and to the side pondering"
gen think-1 "puzzled confused expression, scratching the back of the head with one hand, slight worried frown"
gen think-2 "disappointed but determined expression, looking down with a small sigh, eyebrows furrowed, one hand on hip"

echo "=== char sprites done ==="
ls -la "$OUT"
