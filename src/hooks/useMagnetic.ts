import { useRef } from 'react'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'

/**
 * Pulls an element a few pixels toward the pointer. Only on devices with a
 * precise hovering pointer and when motion is allowed. Uses quickTo so a
 * pointer move never allocates a new tween.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const mm = gsap.matchMedia()
      mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.5)' })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.5)' })

        const onMove = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect()
          xTo((event.clientX - (rect.left + rect.width / 2)) * strength)
          yTo((event.clientY - (rect.top + rect.height / 2)) * strength)
        }
        const onLeave = () => {
          xTo(0)
          yTo(0)
        }

        el.addEventListener('pointermove', onMove)
        el.addEventListener('pointerleave', onLeave)
        return () => {
          el.removeEventListener('pointermove', onMove)
          el.removeEventListener('pointerleave', onLeave)
        }
      })

      return () => mm.revert()
    },
    { scope: ref },
  )

  return ref
}
