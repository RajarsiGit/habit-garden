import { useMemo } from 'react'

const PARTICLE_COUNT = 14

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

// A small one-shot particle burst, mounted only while `active` is true.
// Purely decorative — skipped entirely for users who've asked for less motion.
export default function Confetti({ active, colors }) {
  const particles = useMemo(() => {
    if (!active || prefersReducedMotion()) return []
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (i / PARTICLE_COUNT) * 360 + Math.random() * 20
      const distance = 40 + Math.random() * 30
      const rad = (angle * Math.PI) / 180
      return {
        id: i,
        color: colors[i % colors.length],
        tx: Math.cos(rad) * distance,
        ty: Math.sin(rad) * distance,
        rot: Math.random() * 360,
        delay: Math.random() * 80,
      }
    })
  }, [active])

  if (particles.length === 0) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="confetti-particle"
          style={{
            backgroundColor: p.color,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            '--rot': `${p.rot}deg`,
            animationDelay: `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  )
}
