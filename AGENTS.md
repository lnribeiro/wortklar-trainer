# Repository Guidelines

## Project Structure & Module Organization
- Frontend lives under `src/` (React + Vite + TypeScript). Suggested layout: `src/content/cards.json` (deck data), `src/types/` (shared types), `src/lib/` (IndexedDB wrapper + selection logic), `src/components/cards/` (card renderers), `src/views/` (Home/Train/Settings), `src/App.tsx` (shell).
- Public/static assets belong in `public/`. Build output is `dist/`.
- Keep card IDs stable; prefer `active:false` over deleting entries.

## Build, Test, and Development Commands
- `npm install` — install dependencies.
- `npm run dev` — start Vite dev server with hot reload.
- `npm run build` — production build (static assets for Netlify/Vercel/etc.).
- `npm run preview` — serve the built app locally.
- `npm test` — run unit tests (add Vitest tests in `src/**/*.test.ts` as needed).

## Coding Style & Naming Conventions
- TypeScript, ES modules, and functional React components. Prefer hooks over classes.
- Use 2-space indentation, single quotes, trailing commas in multi-line literals.
- Name React components in `PascalCase`; helper functions/constants in `camelCase`; filenames mirror exports (`Train.tsx`, `picker.ts`).
- Keep card patterns consistent (`"warten ___"` on front, `"warten auf + Akk."` on reveal).
- Run format/lint scripts before pushing (add `npm run lint` if missing).

## Testing Guidelines
- Use Vitest for unit tests and lightweight algorithm checks (e.g., selection weights in `src/lib/picker.ts`).
- Test data validation around `cards.json` (ID uniqueness, required fields).
- Prefer test names that state behavior (`selects higher weight for red-heavy cards`).
- Aim for coverage on selection logic, storage wrapper, and rendering edge cases (empty decks, cooldown fallback).

## Commit & Pull Request Guidelines
- Commits: imperative mood, scoped and focused (`Add picker weight clamp`, `Fix cooldown fallback`). Squash fixups before review.
- Pull requests: include purpose, notable decisions, and testing performed. Link related issues. Add screenshots/GIFs for UI changes (home, train flow, settings dialog).
- Keep changes small; separate content updates (`cards.json`) from code changes when possible.
