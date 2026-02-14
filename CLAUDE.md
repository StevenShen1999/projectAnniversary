# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # Production build
npm run preview  # Preview production build
```

## Deployment

Two separate git repos:
- **This repo** (`master`) — source code, pushed to `origin` (StevenShen1999/projectAnniversary)
- **`buildFiles/`** — separate repo (`main`), hosts the GitHub Pages site (forElizabeth/forElizabeth.github.io)

Deploy workflow: `npm run build` → copy `dist/*` into `buildFiles/` → commit & push both repos. Remember to remove stale hashed asset files in `buildFiles/` when new ones are generated.

## Architecture

Vue 3 + Vite + Tailwind CSS webapp with two parts:

### Part 1: Treasure Hunt (`/`)
Intro screen with identity verification message, then **9 sequential puzzles** that must be solved in order. Completing all 9 unlocks Part 2.

#### Puzzle Order (as displayed)
The display order differs from component numbering. `PuzzleContainer.vue` maps puzzle index → component:

| # | Component | Type | Title | Question summary |
|---|-----------|------|-------|-----------------|
| 1 | Puzzle1 | colour-select | Eye Candy | Favourite colour → Blue |
| 2 | Puzzle3 | text-input | What's In a Name? | Nickname she calls me → Himbo |
| 3 | Puzzle4 | word-scramble | Bonding Moments | Favourite past time → ageofmythology |
| 4 | Puzzle5 | text-input | Not From Russia With Love | City in Belarus → Baranovichi (accepts English/Cyrillic, Russian/Belarusian spellings) |
| 5 | Puzzle9 | cryptex | A City Asleep | What she rides at dawn in summer → motorbike (rotating letter dials) |
| 6 | Puzzle8 | concert-ticket | For Her Eyes (And Ears) Only | Band she saw live → Звери (Cyrillic letter picker) |
| 7 | Puzzle7 | emoji-select | Non-Negotiable | Daily routine → Workout |
| 8 | Puzzle2 | three-part-input | Classified Intel | `__-__-__` format → 85-65-90 |
| 9 | Puzzle6 | multi-select | The Full Package | Virtues → all four: Empathy, Intelligence, Mental Fortitude, Loving |

Answers are stored as SHA-256 hashes in `src/data/puzzles.js`. The `checkAnswer()` function hashes user input and compares.

### Part 2: Wrapped Slideshow (`/wrapped`)
Spotify Wrapped-style celebration with swipe/click navigation through slides. Protected by route guard — only accessible after all puzzles are solved. Ends with `EnvelopeFinale.vue` (animated envelope with Valentine's question and "start from beginning" restart).

### State Management
`src/stores/gameStore.js` — Composable store using Vue reactivity (not Pinia/Vuex). Syncs to localStorage under key `elizabeth-valentine-progress`. Exports `useGameStore()` which provides:
- `state.puzzlesCompleted[]` — Array of 8 booleans
- `state.currentPuzzle` / `state.currentSlide` — Navigation state
- `state.wrappedUnlocked` — Whether wrapped section is accessible
- `completePuzzle(index)` — Mark puzzle solved, auto-advance
- `canAccessPuzzle(index)` — Sequential unlock logic
- `unlockAll()` / `resetProgress()` — Dev helpers (dev controls hidden in production)

### Data Files
- `src/data/puzzles.js` — Puzzle configuration, SHA-256 answer hashes, and `checkAnswer()` validation
- `src/data/wrapped-content.js` — Messages, images, statistics for slideshow

### Key Components
- `PuzzleContainer.vue` — Orchestrates puzzle display, maps puzzle index to component
- `SlideContainer.vue` — Handles slide transitions, swipe gestures, keyboard nav
- `EnvelopeFinale.vue` — Animated envelope finale with restart option

### Routing
Vue Router with hash-based routing (`createWebHashHistory`) for GitHub Pages compatibility. Navigation guard on `/wrapped` checks `store.allPuzzlesCompleted.value`.

### Known Mobile Considerations
- The "All Puzzles Complete!" overlay is tappable (mobile browsers can throttle setTimeout)
- `resetProgress()` explicitly sets each reactive property (not Object.assign) for reliable reactivity
