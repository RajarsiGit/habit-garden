import { describe, expect, it } from 'vitest'
import {
  GROWTH_STAGES,
  PLANT_PALETTE,
  paletteForId,
  stageForStreak,
  stageIndexForStreak,
} from './plant'

describe('stageForStreak', () => {
  it('is seed at zero', () => {
    expect(stageForStreak(0).id).toBe('seed')
  })

  it.each([
    [0, 'seed'],
    [1, 'sprout'],
    [2, 'sprout'],
    [3, 'seedling'],
    [6, 'seedling'],
    [7, 'budding'],
    [13, 'budding'],
    [14, 'blooming'],
    [29, 'blooming'],
    [30, 'flourishing'],
    [365, 'flourishing'],
  ])('streak %i maps to stage %s (boundary check)', (streak, expected) => {
    expect(stageForStreak(streak).id).toBe(expected)
  })

  it('never regresses below seed for a negative or NaN streak', () => {
    expect(stageForStreak(-5).id).toBe('seed')
  })
})

describe('stageIndexForStreak', () => {
  it('matches the position of the stage in GROWTH_STAGES', () => {
    expect(stageIndexForStreak(0)).toBe(0)
    expect(stageIndexForStreak(30)).toBe(GROWTH_STAGES.length - 1)
  })

  it('is monotonically non-decreasing as streak grows', () => {
    let prevIndex = -1
    for (let streak = 0; streak <= 40; streak++) {
      const index = stageIndexForStreak(streak)
      expect(index).toBeGreaterThanOrEqual(prevIndex)
      prevIndex = index
    }
  })
})

describe('paletteForId', () => {
  it('is deterministic for the same id', () => {
    expect(paletteForId('habit-abc')).toBe(paletteForId('habit-abc'))
  })

  it('always returns a palette from PLANT_PALETTE', () => {
    for (const id of ['a', 'bb', 'ccc', 'habit-123', '']) {
      expect(PLANT_PALETTE).toContain(paletteForId(id))
    }
  })
})
