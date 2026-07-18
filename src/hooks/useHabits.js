import { useCallback, useMemo, useRef, useState } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useTodayKey } from './useTodayKey'
import { computeStreak, lastSevenDays, longestStreak, todayKey } from '../utils/dates'
import { stageForStreak, stageIndexForStreak, paletteForId } from '../utils/plant'

const UNDO_WINDOW_MS = 6000

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useHabits() {
  const [habits, setHabits] = useLocalStorage('habit-garden:habits', [])
  const today = useTodayKey()
  const [pendingDelete, setPendingDelete] = useState(null)
  const undoTimer = useRef(null)

  const addHabit = useCallback((name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setHabits((prev) => [
      ...prev,
      { id: makeId(), name: trimmed, createdAt: todayKey(), completions: [] },
    ])
  }, [setHabits])

  const renameHabit = useCallback((id, name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, name: trimmed } : h)))
  }, [setHabits])

  const deleteHabit = useCallback((id) => {
    const index = habits.findIndex((h) => h.id === id)
    if (index === -1) return
    clearTimeout(undoTimer.current)
    setPendingDelete({ habit: habits[index], index })
    undoTimer.current = setTimeout(() => setPendingDelete(null), UNDO_WINDOW_MS)
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }, [habits, setHabits])

  const undoDelete = useCallback(() => {
    if (!pendingDelete) return
    clearTimeout(undoTimer.current)
    setHabits((prev) => {
      const next = [...prev]
      next.splice(Math.min(pendingDelete.index, next.length), 0, pendingDelete.habit)
      return next
    })
    setPendingDelete(null)
  }, [pendingDelete, setHabits])

  const reorderHabits = useCallback((fromId, toId) => {
    if (fromId === toId) return
    setHabits((prev) => {
      const fromIndex = prev.findIndex((h) => h.id === fromId)
      const toIndex = prev.findIndex((h) => h.id === toId)
      if (fromIndex === -1 || toIndex === -1) return prev
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
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
  }, [habits, today])

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

  return {
    habits: garden,
    addHabit,
    renameHabit,
    deleteHabit,
    undoDelete,
    pendingDelete,
    reorderHabits,
    toggleToday,
    stats,
  }
}
