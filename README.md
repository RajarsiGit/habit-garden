# 🌻 Habit Garden

A habit tracker where consistency grows a visual garden instead of just
checking off boxes. Each habit is a plant that sprouts, buds, and blooms as
its streak lengthens — and wilts if you miss a day.

## Features

- **A garden that grows with you.** Every habit is an animated plant that
  advances through six growth stages (seed → sprout → seedling → budding →
  blooming → flourishing) as its streak lengthens, with a confetti burst on
  every stage-up.
- **A same-day grace period.** Today's check-in doesn't have to happen before
  midnight to keep a streak alive — it only breaks after a full day is
  missed.
- **Stats view.** A 12-week completion heatmap and a streak leaderboard
  across all your habits.
- **Rename, reorder, undo.** Drag (or use arrow keys on the handle) to
  reorder habits, click a name to rename it, and deleting shows a 6-second
  undo toast instead of a confirm dialog.
- **Installable.** Works as a PWA — install it to your home screen or
  desktop; the app shell is cached for offline use (your data lives in
  `localStorage`, not a server, so there's nothing else to sync).
- **Respects `prefers-reduced-motion`.** All grow animations and confetti are
  skipped for users who've asked for less motion.

## Stack

- React 18 + Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Vitest for the streak/growth-stage/heatmap logic
- `vite-plugin-pwa` for the manifest + service worker
- State persisted to `localStorage`, no backend

## Getting started

```bash
npm install
npm run dev
```

```bash
npm test          # run the test suite once
npm run build     # production build (also generates the PWA assets)
npm run preview   # serve the production build locally
```

## How it works

- **`src/hooks/useHabits.js`** — single source of truth: habit list, streak
  math, derived stats, rename/reorder/delete-with-undo, persisted via
  `useLocalStorage`.
- **`src/hooks/useTodayKey.js`** — keeps the app's notion of "today" in sync
  with the real calendar day, so streaks don't go stale if the tab is left
  open across midnight.
- **`src/utils/dates.js`** — streak calculation (with the same-day grace
  period) and longest-streak tracking, keyed on local calendar days.
- **`src/utils/plant.js`** — maps a streak length to a growth stage and
  assigns each habit a stable color palette.
- **`src/utils/heatmap.js`** — builds the calendar-aligned completion
  heatmap for the Stats view.
- **`src/components/Plant.jsx`** — renders the SVG plant for a given growth
  stage and animates stem/leaf/bloom growth when the stage advances (via the
  shared `useGrowthPulse` hook, also used to trigger confetti).
- **`src/components/Garden.jsx`** — the grid of plants; click one to check in
  for today.
- **`src/components/StatsView.jsx`** — the heatmap + streak leaderboard tab.

See [CLAUDE.md](CLAUDE.md) for the full architecture notes, and
[design/README.md](design/README.md) for how the app icons are generated.

## License

GNU General Public License v3.0 © Rajarsi Saha — see [LICENSE](LICENSE).
