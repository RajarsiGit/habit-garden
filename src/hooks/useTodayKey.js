import { useEffect, useState } from 'react'
import { todayKey } from '../utils/dates'

// Keeps a `today` value in sync with the real calendar day. Habit state
// itself doesn't change at midnight, so anything derived from "today" (like
// streaks) would otherwise stay stale until the user next interacts —
// this re-renders that derived state when the day actually rolls over,
// whether the tab was open the whole time or just woke from sleep/background.
export function useTodayKey() {
  const [today, setToday] = useState(todayKey)

  useEffect(() => {
    const sync = () => setToday((prev) => {
      const next = todayKey()
      return next === prev ? prev : next
    })

    const interval = setInterval(sync, 60_000)
    document.addEventListener('visibilitychange', sync)
    window.addEventListener('focus', sync)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('focus', sync)
    }
  }, [])

  return today
}
