# wortklar

Fast, tap-first German vocabulary trainer for nouns and verb + preposition frames. Stateless server; all progress stays in the browser (IndexedDB).

## Features
- Home → Train → Settings flow; session size and filters for types (nouns, verb+prep) and difficulty (easy/medium/hard).
- Reveal-based cards with big “I got it” / “I did not remember it” actions.
- Progress stored locally; reset available in Settings plus simple stats and “hard words” highlights.
- Weighted selection algorithm (more reds → higher weight) with cooldowns and anti-repeat.

## Getting started
- Install: `npm install`
- Dev server: `npm run dev` (Vite 5; Node 18+)
- Tests: `npm test -- --run`
- Build: `npm run build` then `npm run preview`

## Project structure
- `src/content/cards.json` — shipped deck (30 cards min; stable IDs)
- `src/types/` — shared types
- `src/lib/` — IndexedDB wrapper (`db.ts`) and picker logic (`picker.ts`)
- `src/components/cards/` — card renderers
- `src/views/` — Home/Train/Settings screens
- `src/App.tsx` — simple view state shell
- `src/index.css` — global styles

## Tech stack
- React + TypeScript + Vite
- IndexedDB via `idb`

## Notes for contributors
- Keep card IDs stable; prefer `active:false` to removals.
- Follow the selection logic as specified in `SPEC.md`.
- Progress keys: `g`, `r`, `lastSeen`, `cooldownUntil` (ms epoch).
