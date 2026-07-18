// Growth stages a plant passes through as a habit's streak lengthens.
export const GROWTH_STAGES = [
  { id: 'seed', min: 0, label: 'Seed' },
  { id: 'sprout', min: 1, label: 'Sprout' },
  { id: 'seedling', min: 3, label: 'Seedling' },
  { id: 'budding', min: 7, label: 'Budding' },
  { id: 'blooming', min: 14, label: 'Blooming' },
  { id: 'flourishing', min: 30, label: 'Flourishing' },
]

export function stageForStreak(streak) {
  let stage = GROWTH_STAGES[0]
  for (const candidate of GROWTH_STAGES) {
    if (streak >= candidate.min) stage = candidate
  }
  return stage
}

export function stageIndexForStreak(streak) {
  return GROWTH_STAGES.indexOf(stageForStreak(streak))
}

// A friendly, varied palette so a garden of many habits doesn't look uniform.
export const PLANT_PALETTE = [
  { id: 'rose', stem: '#4d7c4a', leaf: '#5fa557', bloom: '#f472b6', center: '#fde047' },
  { id: 'sun', stem: '#4d7c4a', leaf: '#5fa557', bloom: '#fb923c', center: '#facc15' },
  { id: 'violet', stem: '#4d7c4a', leaf: '#5fa557', bloom: '#a78bfa', center: '#fde047' },
  { id: 'sky', stem: '#4d7c4a', leaf: '#5fa557', bloom: '#60a5fa', center: '#fde047' },
  { id: 'coral', stem: '#4d7c4a', leaf: '#5fa557', bloom: '#f87171', center: '#fde047' },
  { id: 'mint', stem: '#4d7c4a', leaf: '#5fa557', bloom: '#34d399', center: '#fef3c7' },
]

export function paletteForId(id) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return PLANT_PALETTE[hash % PLANT_PALETTE.length]
}
