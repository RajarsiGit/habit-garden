# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start the Vite dev server (HMR)
- `npm run build` — production build to `dist/` (also generates the PWA
  service worker + manifest via `vite-plugin-pwa`)
- `npm run preview` — serve the built `dist/` locally
- `npm test` — run the vitest suite once (`vitest.config.js`)
- `npx vitest` — watch mode
- `npx vitest run src/utils/dates.test.js` — run a single test file

There is no linter configured in this project currently. Tests cover
`src/utils/dates.js`, `src/utils/plant.js`, and `src/utils/heatmap.js` only —
no component/rendering tests yet (would need jsdom + Testing Library, not
currently installed).

## Toolchain constraint

`vite` and `vitest` are pinned below their latest majors (currently 6.x/3.x,
not 7/8) in `package.json`, and `@vitejs/plugin-react`/`@types/react*` are
held to the 4.x/18.x line to match. Vite 7+'s default rolldown engine (and
vitest 4, which pulls it in transitively) ships prebuilt native bindings that
fail to resolve on Node < 20.19, and this environment runs an older Node 20.
Do not bump `vite` or `vitest` past a major without confirming the Node
version supports it first — `npx vite --version` (or running `npm test`)
failing with "Cannot find native binding" is the symptom. When bumping within
the allowed majors, prefer the latest patch (currently vite 6.4.3, vitest
3.2.7) since earlier patches in this line have known CVEs (path traversal in
optimized-deps `.map` handling, `server.fs.deny` bypass, NTLMv2 hash
disclosure via UNC paths on Windows, vitest UI arbitrary file read) —
`npm audit` should read zero vulnerabilities.

## Architecture

Single-page React app, no backend, no router — everything lives under `src/`.

**State flows one way, from one hook.** `src/hooks/useHabits.js` is the only
place habit state is read or written. It wraps `useLocalStorage` (persists to
`localStorage` under the key `habit-garden:habits`) and derives, via
`useMemo`, everything the UI needs per habit — streak, growth stage, palette,
wilted status, 7-day history — so components never compute streak logic
themselves. It also owns rename/reorder/delete-with-undo:
`deleteHabit` doesn't remove data permanently on the spot — it stashes the
removed habit + its original index in `pendingDelete` state (with a 6s
timer), and `undoDelete()` re-splices it back in. `App.jsx` renders
`<UndoToast pendingDelete={...} onUndo={...} />` for this. `App.jsx` calls
`useHabits()` once and passes the derived list + callbacks down as props —
no other component touches `localStorage` or recomputes streaks.

**Streak math lives in `src/utils/dates.js`.** `computeStreak(completions)`
gives today's check-in a grace period: if today isn't marked done yet but
yesterday was, the streak still counts as alive (`atRisk: true`) rather than
resetting to zero at midnight. A streak only truly breaks (`wilted: true`)
once both today and yesterday are missed. Date keys are local `YYYY-MM-DD`
strings (via `toDateKey`), not UTC or timestamps, so streaks match the user's
own calendar day. Because none of this state changes on its own at midnight,
`src/hooks/useTodayKey.js` re-renders the app when the calendar day actually
rolls over (polls every 60s, plus `visibilitychange`/`focus` listeners for
laptop sleep/wake) — `useHabits` includes its value as a `useMemo` dependency
purely to force recomputation, the value itself isn't otherwise used.

**Growth stage is a pure function of streak length**, in `src/utils/plant.js`
(`stageForStreak`): seed → sprout → seedling → budding → blooming →
flourishing at streak thresholds 0/1/3/7/14/30. `paletteForId` hashes a
habit's id to deterministically pick one of a fixed set of flower colors, so
the same habit always renders the same color without storing it.

**`src/components/Plant.jsx` is the only component that draws a plant.** It's
a pure SVG built from `stageIndex` (stem height, leaf count, bloom radius all
scale with stage) plus a `wilted` flag that shrinks/browns/bends it.
`src/hooks/useGrowthPulse.js` is a small reusable "did this number just go up"
hook — `Plant.jsx` uses it to apply CSS grow-animation classes
(`plant-stem-grow`, `plant-leaf-pop`, `plant-bloom-pop`, in `src/index.css`),
and `PlantTile.jsx` uses a separate instance of the same hook to fire a
`Confetti` burst on the same stage-up event. All motion (grow animations,
confetti) is skipped under `prefers-reduced-motion: reduce` — see the media
query in `index.css` and the check in `Confetti.jsx`. `Garden.jsx` is a
layout-only wrapper; none of `Plant`/`PlantTile`/`Garden` know about each
other's rendering.

**Stats view** (`StatsView.jsx`, tab-switched in `App.jsx`) is read-only and
derives everything from the same `habits` list `useHabits` already produces:
`HeatmapGrid.jsx` calls `src/utils/heatmap.js#buildHeatmap` to sum
completions per day across all habits into calendar-aligned week columns, and
`StreakLeaderboard.jsx` just sorts the existing list client-side. Neither
introduces new persisted state.

Styling is Tailwind CSS v4 via the `@tailwindcss/vite` plugin (no
`tailwind.config.js` — v4 is CSS-first, configured through the `@import
"tailwindcss"` in `src/index.css`).

**PWA.** `vite-plugin-pwa` (configured in `vite.config.js`) generates the
manifest and a Workbox service worker at build time only (`npm run dev` does
not register one — `devOptions.enabled` is not set). The service worker
precaches the app shell/assets; there's no network data to cache since
everything lives in `localStorage`. Icons in `public/icons/` are pre-generated
PNGs — the editable source is `design/icon-source.svg` (see
`design/README.md` for the regeneration steps; the rasterizer isn't kept as a
project dependency).
