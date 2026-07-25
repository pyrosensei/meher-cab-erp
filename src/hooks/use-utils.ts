'use client'

import { useEffect, useRef, useState } from 'react'
import { useMotionValue, useSpring, useInView } from 'framer-motion'

export function useAnimatedCounter(
  target: number,
  duration: number = 1.5,
  delay: number = 0
) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLParagraphElement>(null)
  const isInView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  })

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        motionValue.set(target)
      }, delay * 1000)
      return () => clearTimeout(timeout)
    }
  }, [isInView, target, motionValue, delay])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplay(Math.round(latest))
    })
    return unsubscribe
  }, [springValue])

  return { display, ref }
}

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query, matches])

  return matches
}
