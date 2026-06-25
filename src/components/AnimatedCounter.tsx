import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  decimals?: number
  className?: string
}

export default function AnimatedCounter({ value, prefix = '', suffix = '', duration = 600, decimals = 2, className }: Props) {
  const [display, setDisplay] = useState(0)
  const startTime = useRef<number>(0)
  const raf = useRef<number>(0)

  useEffect(() => {
    startTime.current = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(value * eased)

      if (progress < 1) {
        raf.current = requestAnimationFrame(animate)
      }
    }

    raf.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf.current)
  }, [value, duration])

  return (
    <span className={className}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  )
}
