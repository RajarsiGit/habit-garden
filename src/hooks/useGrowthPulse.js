import { useEffect, useRef, useState } from 'react'

// True for `durationMs` after `value` increases, false otherwise (including
// on first render and when `value` decreases/stays the same). Used to pulse
// a one-off animation — plant growth, confetti — exactly when a habit's
// growth stage advances.
export function useGrowthPulse(value, durationMs = 700) {
  const prev = useRef(value)
  const [pulsing, setPulsing] = useState(false)

  useEffect(() => {
    if (value > prev.current) {
      setPulsing(true)
      const t = setTimeout(() => setPulsing(false), durationMs)
      prev.current = value
      return () => clearTimeout(t)
    }
    prev.current = value
  }, [value, durationMs])

  return pulsing
}
