import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addDays,
  computeStreak,
  dayOfWeek,
  lastNDays,
  lastSevenDays,
  longestStreak,
  toDateKey,
  todayKey,
  yesterdayKey,
} from './dates'

function setToday(isoDate) {
  vi.setSystemTime(new Date(`${isoDate}T12:00:00`))
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('toDateKey / todayKey / yesterdayKey', () => {
  it('formats a Date as local YYYY-MM-DD', () => {
    expect(toDateKey(new Date(2026, 2, 5))).toBe('2026-03-05')
  })

  it('pads single-digit months and days', () => {
    expect(toDateKey(new Date(2026, 0, 1))).toBe('2026-01-01')
  })

  it('todayKey/yesterdayKey track the mocked system clock', () => {
    setToday('2026-06-15')
    expect(todayKey()).toBe('2026-06-15')
    expect(yesterdayKey()).toBe('2026-06-14')
  })
})

describe('addDays', () => {
  it('adds positive and negative deltas', () => {
    expect(addDays('2026-01-15', 5)).toBe('2026-01-20')
    expect(addDays('2026-01-15', -5)).toBe('2026-01-10')
  })

  it('crosses a month boundary', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01')
  })

  it('crosses a year boundary', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
  })

  it('handles Feb 29 on a leap year', () => {
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29')
    expect(addDays('2028-02-29', 1)).toBe('2028-03-01')
  })
})

describe('computeStreak', () => {
  it('is zero with no history', () => {
    setToday('2026-06-15')
    expect(computeStreak([])).toEqual({
      streak: 0,
      doneToday: false,
      atRisk: false,
      wilted: false,
    })
  })

  it('counts today plus consecutive prior days when today is done', () => {
    setToday('2026-06-15')
    const completions = ['2026-06-13', '2026-06-14', '2026-06-15']
    expect(computeStreak(completions)).toEqual({
      streak: 3,
      doneToday: true,
      atRisk: false,
      wilted: false,
    })
  })

  it('gives a grace period: streak survives if yesterday was done but today is not yet', () => {
    setToday('2026-06-15')
    const completions = ['2026-06-13', '2026-06-14']
    expect(computeStreak(completions)).toEqual({
      streak: 2,
      doneToday: false,
      atRisk: true,
      wilted: false,
    })
  })

  it('wilts once both today and yesterday are missed', () => {
    setToday('2026-06-15')
    const completions = ['2026-06-10', '2026-06-11', '2026-06-12']
    expect(computeStreak(completions)).toEqual({
      streak: 0,
      doneToday: false,
      atRisk: false,
      wilted: true,
    })
  })

  it('does not wilt a habit with no history at all', () => {
    setToday('2026-06-15')
    expect(computeStreak([]).wilted).toBe(false)
  })

  it('breaks the streak count at the first gap while walking backward', () => {
    setToday('2026-06-15')
    // gap on the 13th breaks the chain that would otherwise reach the 10th
    const completions = ['2026-06-10', '2026-06-11', '2026-06-14', '2026-06-15']
    expect(computeStreak(completions).streak).toBe(2)
  })

  it('ignores completion dates in the future relative to today', () => {
    setToday('2026-06-15')
    const completions = ['2026-06-15', '2026-06-20']
    expect(computeStreak(completions).streak).toBe(1)
  })
})

describe('dayOfWeek', () => {
  it('returns 0 for Sunday and 6 for Saturday', () => {
    expect(dayOfWeek('2026-07-19')).toBe(0) // a known Sunday
    expect(dayOfWeek('2026-07-25')).toBe(6) // the following Saturday
  })
})

describe('lastNDays', () => {
  it('returns n date keys, oldest first, ending today', () => {
    setToday('2026-06-15')
    const days = lastNDays(5)
    expect(days).toEqual([
      '2026-06-11',
      '2026-06-12',
      '2026-06-13',
      '2026-06-14',
      '2026-06-15',
    ])
  })
})

describe('lastSevenDays', () => {
  it('returns 7 days oldest-first ending on today', () => {
    setToday('2026-06-15')
    const days = lastSevenDays(['2026-06-14', '2026-06-15'])
    expect(days).toHaveLength(7)
    expect(days[0].key).toBe('2026-06-09')
    expect(days[6].key).toBe('2026-06-15')
    expect(days[5].done).toBe(true)
    expect(days[6].done).toBe(true)
    expect(days[0].done).toBe(false)
  })
})

describe('longestStreak', () => {
  it('is zero for no completions', () => {
    expect(longestStreak([])).toBe(0)
  })

  it('finds the longest run among several, regardless of input order', () => {
    const completions = [
      '2026-06-01',
      '2026-06-05',
      '2026-06-06',
      '2026-06-07',
      '2026-06-08',
      '2026-06-10',
    ]
    // shuffle order to prove sorting inside the function matters
    const shuffled = [...completions].reverse()
    expect(longestStreak(shuffled)).toBe(4)
  })

  it('treats a single completion as a streak of 1', () => {
    expect(longestStreak(['2026-06-01'])).toBe(1)
  })

  it('does not count duplicate same-day entries as extending the streak', () => {
    expect(longestStreak(['2026-06-01', '2026-06-01', '2026-06-02'])).toBe(2)
  })
})
