# 🌻 Habit Garden

A habit tracker where consistency grows a visual garden instead of just
checking off boxes. Each habit is a plant that sprouts, buds, and blooms as
its streak lengthens — and wilts if you miss a day.

## Stack

- React 18 + Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- State persisted to `localStorage`, no backend

## Getting started

```bash
npm install
npm run dev
```

## How it works

- **`src/hooks/useHabits.js`** — single source of truth: habit list, streak
  math, derived stats, persisted via `useLocalStorage`.
- **`src/utils/dates.js`** — streak calculation (with a same-day grace period)
  and longest-streak tracking, keyed on local calendar days.
- **`src/utils/plant.js`** — maps a streak length to a growth stage (seed →
  sprout → seedling → budding → blooming → flourishing) and assigns each
  habit a stable color palette.
- **`src/components/Plant.jsx`** — renders the SVG plant for a given growth
  stage and animates stem/leaf/bloom growth when the stage advances.
- **`src/components/Garden.jsx`** — the grid of plants; click one to check in
  for today.

## License

GNU General Public License v3.0 © Rajarsi Saha — see [LICENSE](LICENSE).
