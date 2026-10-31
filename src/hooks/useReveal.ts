import type { RefObject } from 'react'
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '@/lib/gsap'

/**
 * Fades and lifts every `[data-reveal]` element inside `scope` as it enters
 * the viewport. Elements entering together are staggered as one batch.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const targets = gsap.utils.toArray<HTMLElement>('[data-reveal]')
        if (!targets.length) return
        gsap.set(targets, { autoAlpha: 0, y: 28 })
        ScrollTrigger.batch(targets, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, overwrite: true }),
        })
      })
      return () => mm.revert()
    },
    { scope },
  )
}
