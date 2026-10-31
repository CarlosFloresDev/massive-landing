import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { registerLenis } from '@/lib/scroll'

/** Height of the fixed navbar, used to offset anchor jumps. */
const NAV_OFFSET = -72

/**
 * Smooth scrolling driven by GSAP's ticker so Lenis and ScrollTrigger
 * share a single animation frame. Disabled under reduced motion, where
 * the browser's native scroll is kept untouched.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reduceMotion) return

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      anchors: { offset: NAV_OFFSET },
    })

    registerLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      registerLenis(null)
      lenis.destroy()
    }
  }, [reduceMotion])

  return children
}
