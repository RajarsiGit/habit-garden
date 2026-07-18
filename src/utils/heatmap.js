import { dayOfWeek, lastNDays } from './dates'

// Combined completion counts across all habits, one entry per day, oldest
// first. `leadingBlanks` pads the front so day 0 of the grid always lines up
// with Sunday, ready to be chunked into 7-row week columns.
export function buildHeatmap(habits, weeks = 12) {
  const days = lastNDays(weeks * 7)
  const counts = new Map(days.map((key) => [key, 0]))

  for (const habit of habits) {
    for (const date of habit.completions) {
      if (counts.has(date)) counts.set(date, counts.get(date) + 1)
    }
  }

  const cells = days.map((key) => ({ key, count: counts.get(key) }))
  const leadingBlanks = Array.from({ length: dayOfWeek(days[0]) }, () => null)
  const padded = [...leadingBlanks, ...cells]

  const weekColumns = []
  for (let i = 0; i < padded.length; i += 7) {
    weekColumns.push(padded.slice(i, i + 7))
  }
  return weekColumns
}

export function heatLevel(count) {
  if (!count) return 0
  if (count === 1) return 1
  if (count === 2) return 2
  if (count <= 4) return 3
  return 4
}
