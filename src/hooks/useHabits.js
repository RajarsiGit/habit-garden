import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { computeStreak, lastSevenDays, longestStreak, todayKey } from '../utils/dates'
import { stageForStreak, stageIndexForStreak, paletteForId } from '../utils/plant'

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useHabits() {
  const [habits, setHabits] = useLocalStorage('habit-garden:habits', [])

  const addHabit = useCallback((name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setHabits((prev) => [
      ...prev,
      { id: makeId(), name: trimmed, createdAt: todayKey(), completions: [] },
    ])
  }, [setHabits])

  const deleteHabit = useCallback((id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }, [setHabits])

  const toggleToday = useCallback((id) => {
    const today = todayKey()
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const has = h.completions.includes(today)
        return {
          ...h,
          completions: has
            ? h.completions.filter((d) => d !== today)
            : [...h.completions, today],
        }
      })
    )
  }, [setHabits])

  const garden = useMemo(() => {
    return habits.map((habit) => {
      const { streak, doneToday, atRisk, wilted } = computeStreak(habit.completions)
      const stage = stageForStreak(streak)
      const stageIndex = stageIndexForStreak(streak)
      return {
        ...habit,
        streak,
        doneToday,
        atRisk,
        wilted,
        longest: longestStreak(habit.completions),
        totalCompletions: habit.completions.length,
        week: lastSevenDays(habit.completions),
        stage,
        stageIndex,
        palette: paletteForId(habit.id),
      }
    })
  }, [habits])

  const stats = useMemo(() => {
    const totalStreakDays = garden.reduce((sum, h) => sum + h.streak, 0)
    const doneToday = garden.filter((h) => h.doneToday).length
    const bloomingCount = garden.filter((h) => h.streak >= 14).length
    return {
      habitCount: garden.length,
      doneToday,
      totalStreakDays,
      bloomingCount,
    }
  }, [garden])

  return { habits: garden, addHabit, deleteHabit, toggleToday, stats }
}
