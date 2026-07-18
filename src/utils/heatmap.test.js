import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildHeatmap, heatLevel } from './heatmap'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-07-18T12:00:00'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('buildHeatmap', () => {
  it('pads the first week so day 0 lines up with Sunday', () => {
    const weeks = buildHeatmap([], 1)
    expect(weeks[0]).toHaveLength(7)
    // 2026-07-18 is a Saturday six days into a week starting on 2026-07-12
    // (a Sunday), so the single requested week should have no leading blanks.
    expect(weeks[0].every((cell) => cell !== null)).toBe(true)
  })

  it('sums completions across all habits per day', () => {
    const habits = [
      { completions: ['2026-07-18', '2026-07-17'] },
      { completions: ['2026-07-18'] },
    ]
    const weeks = buildHeatmap(habits, 1)
    const flat = weeks.flat().filter(Boolean)
    const today = flat.find((c) => c.key === '2026-07-18')
    const yesterday = flat.find((c) => c.key === '2026-07-17')
    expect(today.count).toBe(2)
    expect(yesterday.count).toBe(1)
  })

  it('ignores completion dates outside the requested window', () => {
    const habits = [{ completions: ['2020-01-01'] }]
    const weeks = buildHeatmap(habits, 1)
    const total = weeks.flat().filter(Boolean).reduce((sum, c) => sum + c.count, 0)
    expect(total).toBe(0)
  })
})

describe('heatLevel', () => {
  it('buckets counts into 5 levels', () => {
    expect(heatLevel(0)).toBe(0)
    expect(heatLevel(1)).toBe(1)
    expect(heatLevel(2)).toBe(2)
    expect(heatLevel(3)).toBe(3)
    expect(heatLevel(4)).toBe(3)
    expect(heatLevel(5)).toBe(4)
    expect(heatLevel(100)).toBe(4)
  })
})
