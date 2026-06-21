# FounderPath

A pixel-art RPG that teaches the entire startup-founder journey — equity, valuations,
convertible notes, SAFEs, fundraising, growth, retention and the exit — by playing through
13 unlockable worlds. Learn a concept, beat the quiz, bank XP, unlock the next world.

Built with Next.js (App Router), TypeScript, Tailwind CSS and Framer Motion. Progress is
saved locally in the browser (no backend, no login).

## The journey (idea → exit)

1. **The Foundry** — bricks not pies: shares vs percentages, C-corp vs LLC, dilution
2. **City Hall** — register a Delaware C-corp, name it, founder stock, vesting, the 83(b)
3. **The Oracle** — pre/post-money valuation, the 15–20% standard, 409A
4. **The Bridge** — convertible notes (cap, discount, maturity) and SAFEs
5. **The Vault** — common vs preferred, options, strike price, option pool, anti-dilution
6. **The Negotiation** — the term sheet, leverage, lead investors
7. **The Audit** — due diligence and the data room
8. **The Scribes** — legal docs, fees, capital calls, the 4–6 month timeline
9. **The Academy** — accelerators (YC, 500 Startups), demo day, traction
10. **The Crossroads** — *choose a growth path*: Product-Led / Sales-Led / Marketing-Led
11. **The Kingdom** — churn, retention curves, GRR vs NRR, expansion
12. **The Summit** — exit types (acquihire / financial / strategic / rockstar), M&A, LOI → close

(World 10 branches: pick a go-to-market motion and learn its own metrics.)

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Generate the pixel-art assets

Sprites live in `public/assets/`. Each world shows a generated medallion and falls back to an
emoji if the image is missing. To (re)generate the whole family:

```bash
bash scripts/gen-assets.sh
```

(Uses the local `gen-image.js` image skill; one image per world plus the hero.)

## Structure

- `lib/curriculum.ts` — all worlds, lessons and quiz questions (the content)
- `lib/progress.ts` — XP/level/streak/badge engine, localStorage persistence, unlock logic
- `lib/types.ts` / `lib/theme.ts` — domain model and per-world theming
- `components/` — `WorldMap`, `Quiz`, `Lesson`, `TopBar`, `Onboarding`, `Sprite`
- `app/` — `/` landing, `/map` journey, `/level/[id]` lesson+quiz, `/profile` stats & badges
