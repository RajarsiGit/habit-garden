// All dates are keyed as local YYYY-MM-DD strings so streaks line up with the
// user's own calendar day rather than UTC.

export function toDateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayKey() {
  return toDateKey(new Date())
}

export function addDays(dateKey, delta) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + delta)
  return toDateKey(date)
}

export function yesterdayKey() {
  return addDays(todayKey(), -1)
}

// 0 (Sunday) - 6 (Saturday), for aligning calendar grids.
export function dayOfWeek(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d).getDay()
}

// The last `n` date keys ending today, oldest first.
export function lastNDays(n) {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    days.push(addDays(todayKey(), -i))
  }
  return days
}

// Walks backward from today through a set of completed date keys and returns
// the current streak length, plus whether today still needs a check-in to
// keep that streak alive.
export function computeStreak(completedDates) {
  const completed = new Set(completedDates)
  const today = todayKey()
  const yesterday = yesterdayKey()

  const doneToday = completed.has(today)
  const doneYesterday = completed.has(yesterday)

  if (!doneToday && !doneYesterday) {
    return { streak: 0, doneToday, atRisk: false, wilted: completed.size > 0 }
  }

  let streak = 0
  let cursor = doneToday ? today : yesterday
  while (completed.has(cursor)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }

  return { streak, doneToday, atRisk: !doneToday, wilted: false }
}

// Last 7 days (oldest first) as {key, done} pairs, for a mini history strip.
export function lastSevenDays(completedDates) {
  const completed = new Set(completedDates)
  return lastNDays(7).map((key) => ({ key, done: completed.has(key) }))
}

export function longestStreak(completedDates) {
  const sorted = [...completedDates].sort()
  let longest = 0
  let current = 0
  let prev = null
  for (const key of sorted) {
    if (prev && addDays(prev, 1) === key) {
      current += 1
    } else {
      current = 1
    }
    longest = Math.max(longest, current)
    prev = key
  }
  return longest
}
