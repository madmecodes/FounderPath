#!/usr/bin/env bash
# Generates the parallax scene layers (transparent PNGs) via gpt-image-1.
set -u
GEN="$HOME/.claude/skills/gen-image.js"
OUT="/Users/themadme/Projects/foundrquest/public/assets/build"
mkdir -p "$OUT"

gen () { # name size prompt
  local name="$1"; local size="$2"; local prompt="$3"
  echo ">>> $name"
  node "$GEN" "$prompt" "$OUT/$name.png" "$size" high transparent || echo "FAILED $name"
}

gen sky_city_skyline 1536x1024 "Pixel art distant city skyline silhouette, flat front elevation, distant skyscrapers layered front to back in dark teal and deep indigo colors #24405a #2a4d63 and #2f5a6e, tiny scattered lit windows in warm gold #f5b424 and pale gold #ffd35c, buildings bottom-aligned along a single ground line, fully transparent above the rooftops, no foreground, no ground plate, 8-bit retro game art, crisp hard pixels, dark navy night mood, no text, no watermark"

gen clouds_far 1024x512 "Pixel art chunky stylized clouds arranged as a wide horizontal strip, soft blocky cloud forms spaced sparsely so the dark sky shows between them, cool desaturated indigo and slate blue tones #1c2540 and #243156, 8-bit retro game art, crisp hard pixels, fully transparent background, no ground, no buildings, no text, no watermark"

gen hero_tower 1024x1536 "Pixel art single tall modern skyscraper, flat front elevation, perfectly vertical and centered, about twelve distinctly stacked floors each clearly separated by a horizontal slab line so the building can be revealed floor by floor from the bottom, dark navy and steel blue body in #171c28 and #24405a, rows of warm gold lit windows #f5b424 with a few teal accent windows #7CFFB2, slim teal trim, flat rooftop with a small antenna and a beacon mast and a flag, glowing gold glass ground-floor lobby at the base with two tiny founders, clean construction detail, building fills full width and height edge to edge, 8-bit retro game art, crisp hard pixels, fully transparent background, no ground, no sky, no shadow, no text, no watermark"

gen crane 1024x1536 "Pixel art construction tower crane, flat front elevation, tall vertical lattice mast with a horizontal jib arm reaching right and a hanging hook block on a cable, steel grey with warm gold #f5b424 safety stripes, a small red beacon light at the top of the mast, 8-bit retro game art, crisp hard pixels, fully transparent background, no ground, no sky, no building behind it, no text, no watermark"

gen ground_plate 1536x512 "Pixel art foreground city street plinth, flat front elevation, wide horizontal strip, dark navy asphalt #0b0e14 with a muted teal sidewalk edge line #7CFFB2, two ornate pixel street lamps with small warm gold glowing lamp heads #f5b424, a low construction scaffold with striped barriers at the center, fully transparent above the street line, 8-bit retro game art, crisp hard pixels, transparent background, no buildings, no sky, no text, no watermark"

echo "=== scene assets done ==="
ls -la "$OUT"
