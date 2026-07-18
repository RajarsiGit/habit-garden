import { useEffect, useRef, useState } from 'react'

const STEM_HEIGHT = [0, 26, 44, 62, 78, 92]
const LEAF_PAIRS = [0, 1, 1, 2, 2, 3]
const BLOOM_RADIUS = [0, 0, 0, 0, 13, 18]

// Renders one garden plant as an SVG that grows taller, sprouts more leaves,
// and eventually blooms as `stageIndex` increases (driven by streak length).
export default function Plant({ stageIndex, wilted, palette, size = 96 }) {
  const prevStage = useRef(stageIndex)
  const [justGrew, setJustGrew] = useState(false)

  useEffect(() => {
    if (stageIndex > prevStage.current) {
      setJustGrew(true)
      const t = setTimeout(() => setJustGrew(false), 700)
      prevStage.current = stageIndex
      return () => clearTimeout(t)
    }
    prevStage.current = stageIndex
  }, [stageIndex])

  const stemHeight = wilted ? STEM_HEIGHT[Math.min(stageIndex, 2)] : STEM_HEIGHT[stageIndex]
  const leafPairs = wilted ? Math.min(LEAF_PAIRS[stageIndex], 1) : LEAF_PAIRS[stageIndex]
  const bloomRadius = wilted ? 0 : BLOOM_RADIUS[stageIndex]

  const stemColor = wilted ? '#a3866b' : palette.stem
  const leafColor = wilted ? '#c2a878' : palette.leaf
  const baseX = 50
  const baseY = 118
  const tipY = baseY - stemHeight
  const bend = wilted ? 14 : 0

  const leaves = []
  for (let i = 0; i < leafPairs; i++) {
    const t = leafPairs === 1 ? 0.85 : 0.4 + (i / Math.max(leafPairs - 1, 1)) * 0.5
    const y = baseY - stemHeight * t
    const x = baseX + bend * t
    const spread = 12 + i * 3
    leaves.push(
      <g key={i} className={justGrew ? 'plant-leaf-pop' : ''} style={{ transformOrigin: `${x}px ${y}px` }}>
        <path
          d={`M ${x} ${y} q ${-spread} ${-6} ${-spread - 4} ${wilted ? 8 : -4}`}
          stroke={leafColor}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M ${x} ${y} q ${spread} ${-6} ${spread + 4} ${wilted ? 8 : -4}`}
          stroke={leafColor}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    )
  }

  return (
    <svg
      viewBox="0 0 100 130"
      width={size}
      height={size * 1.3}
      className="overflow-visible"
      role="img"
      aria-label={wilted ? 'Wilted plant' : `Plant at growth stage ${stageIndex}`}
    >
      <ellipse cx="50" cy="122" rx="26" ry="6" fill="#8a5a35" opacity="0.35" />

      {stemHeight > 0 && (
        <path
          d={`M ${baseX} ${baseY} Q ${baseX + bend / 2} ${(baseY + tipY) / 2} ${baseX + bend} ${tipY}`}
          stroke={stemColor}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          className={justGrew ? 'plant-stem-grow' : ''}
        />
      )}

      {leaves}

      {stageIndex === 0 && !wilted && (
        <circle cx={baseX} cy={baseY - 2} r="4" fill="#8a5a35" />
      )}

      {bloomRadius > 0 && (
        <g
          className={justGrew ? 'plant-bloom-pop' : ''}
          style={{ transformOrigin: `${baseX + bend}px ${tipY}px` }}
        >
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse
              key={angle}
              cx={baseX + bend}
              cy={tipY}
              rx={bloomRadius * 0.55}
              ry={bloomRadius}
              fill={palette.bloom}
              transform={`rotate(${angle} ${baseX + bend} ${tipY})`}
              opacity="0.92"
            />
          ))}
          <circle cx={baseX + bend} cy={tipY} r={bloomRadius * 0.4} fill={palette.center} />
        </g>
      )}

      {wilted && (
        <text x="72" y="34" fontSize="16" textAnchor="middle">
          💧
        </text>
      )}
    </svg>
  )
}
