# Hand Betting Game

A web-based betting game using Mahjong tiles.

**Live demo:** https://hand-betting-game-ten.vercel.app/

## Run locally

Requires Node 18+.

```bash
npm install
npm run dev
```

Open http://localhost:5173 — play.

For a production build:

```bash
npm run build
npm run preview
```

---

## How the project is structured

```
src/
  engine/       Pure game logic — no React, no UI
  store/        Zustand store + leaderboard persistence
  components/   Reusable UI pieces (Tile, History)
  pages/        Landing, Game, End
  App.tsx       Tiny router based on derived store state
```

The engine is the heart. It's a set of pure functions: `createNewGame()` returns a `GameState`, `placeBet(state, direction)` returns a new `GameState`. No mutation. No framework. The store calls the engine and stores the result. The UI reads from the store and dispatches actions. Each layer has one job.

---

## Design decisions

The spec left a few things open. My choices:

**Tile values are tracked per type, not per copy.**
All four "Red Dragon" tiles share one value, mapped by `typeKey`. Per-copy tracking would barely move values during a session, most tiles get drawn 0–1 times in a 136-tile deck, so the game would always end via the reshuffle limit rather than via the value boundary. Per-type makes the boundary condition reachable and the game more dynamic.

**A tie counts as a loss.**
The player must guess strictly higher or lower. Simpler to reason about than retry/skip rules and keeps the game moving.

**Hand size: 2 tiles.**
Configurable via `HAND_SIZE` in `src/engine/tiles.ts`. The spec didn't specify, and 2 felt like the right balance between variety and bet predictability.

**Standard 136-tile mahjong deck.**
3 suits × 9 numbers × 4 copies = 108 number tiles, plus 3 dragons × 4 = 12, plus 4 winds × 4 = 16.

**Player names on the leaderboard.**
The spec said "top 5 high scores" without specifying names. I added an optional name field on the end screen because a leaderboard with just numbers felt incomplete. Empty names default to "Anonymous".

**No router library for three pages.**
Landing/Game/End is derived from store state (`game === null`, `game.isGameOver`). React Router would be overhead for this size. If the app grew to many pages with deep linking, I'd add it.

**Leaderboard in `localStorage`.**
The spec didn't ask for persistence but a leaderboard that resets on refresh isn't a leaderboard. Wrapped in try/catch because Safari private mode throws on `setItem`.

---

## Tech stack

- **React + Vite + TypeScript** - fast setup, strict types.
- **Zustand** - minimal state management, ~1KB. Plays well with the pure-engine pattern.
- **Tailwind CSS** - quick to style without writing a separate stylesheet. Custom keyframe animations in `index.css`.

No backend. No router. No test framework (see "What I'd do with more time" below).

---

## What I'd do with more time

- **Unit tests for the engine** with Vitest. The engine being pure makes this straightforward.
- **Sound effects** on bet outcomes - small touch that elevates the feel further.
- **Animated tile-value changes** - currently they update silently after a bet; a quick "+1" / "-1" floater would make the rule visible.
- **Accessibility pass** - keyboard nav across the main actions, ARIA labels on tiles, focus rings on all interactive elements.

---

## Note on AI usage

I used AI (Claude) as a pair-programming partner throughout this project.

**What AI helped with:**
- Typing out repetitive code (deck generation, Tailwind class lists, boilerplate components).
- Suggesting edge cases I then verified (duplicate tile types in one hand, tie handling, reshuffle timing).
- Speeding up syntax I don't write daily (Zustand patterns, CSS keyframes).

**What I owned:**
- All architectural decisions: separating the pure engine from React, the reducer pattern in `placeBet`, tracking values by `typeKey` instead of per copy, the layer structure.
- Every gameplay rule decision where the spec was ambiguous (documented above).
- Build sanity checks during development (TypeScript strict mode, smoke testing the engine before merging).
- Code review on every line - I rejected suggestions that were over-engineered, over-commented, or didn't fit the codebase style.

If you ask me about any file in this repo during the onsite, I can walk through what it does and why it's structured that way.
