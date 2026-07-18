# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start the Vite dev server (HMR)
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the built `dist/` locally

There is no test suite or linter configured in this project currently.

## Toolchain constraint

`vite`, `@vitejs/plugin-react`, and `@types/react*` are pinned to the v5/v18
line in `package.json` (not the latest majors). Vite 8's default rolldown
engine ships prebuilt native bindings that fail to resolve on Node < 20.19,
and this environment runs an older Node 20. Do not bump these past the
pinned majors without confirming the Node version supports it — `npx vite
--version` failing with "Cannot find native binding" is the symptom.

## Architecture

Single-page React app, no backend, no router — everything lives under `src/`.

**State flows one way, from one hook.** `src/hooks/useHabits.js` is the only
place habit state is read or written. It wraps `useLocalStorage` (persists
to `localStorage` under the key `habit-garden:habits`) and derives, via
`useMemo`, everything the UI needs per habit — streak, growth stage, palette,
wilted status — so components never compute streak logic themselves. `App.jsx`
calls this hook once and passes the derived list + `toggleToday`/`addHabit`/
`deleteHabit` down as props.

**Streak math lives in `src/utils/dates.js`.** `computeStreak(completions)`
gives today's check-in a grace period: if today isn't marked done yet but
yesterday was, the streak still counts as alive (`atRisk: true`) rather than
resetting to zero at midnight. A streak only truly breaks (`wilted: true`)
once both today and yesterday are missed. Date keys are local `YYYY-MM-DD`
strings (via `toDateKey`), not UTC or timestamps, so streaks match the user's
own calendar day.

**Growth stage is a pure function of streak length**, in `src/utils/plant.js`
(`stageForStreak`): seed → sprout → seedling → budding → blooming →
flourishing at streak thresholds 0/1/3/7/14/30. `paletteForId` hashes a
habit's id to deterministically pick one of a fixed set of flower colors, so
the same habit always renders the same color without storing it.

**`src/components/Plant.jsx` is the only component that draws a plant.** It's
a pure SVG built from `stageIndex` (stem height, leaf count, bloom radius all
scale with stage) plus a `wilted` flag that shrinks/browns/bends it. It
detects stage increases via a `prevStage` ref and applies CSS animation
classes (`plant-stem-grow`, `plant-leaf-pop`, `plant-bloom-pop`, defined in
`src/index.css`) for one render cycle to animate growth. `PlantTile.jsx` and
`Garden.jsx` are just layout/interaction wrappers around it — neither knows
about growth-stage rendering.

Styling is Tailwind CSS v4 via the `@tailwindcss/vite` plugin (no
`tailwind.config.js` — v4 is CSS-first, configured through the `@import
"tailwindcss"` in `src/index.css`).
