import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Cube } from '@phosphor-icons/react'
import { SceneBoundary } from '@/components/three/SceneBoundary'
import { createSignals, type SceneSignals } from '@/components/three/signals'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { site } from '@/config/site'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, MOTION_OK, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap'
import { canRenderWebGL } from '@/lib/webgl'

// Three.js is the heaviest dependency; it loads after the copy has painted.
const HeroScene = lazy(() => import('@/components/three/HeroScene'))

export function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const signals = useRef<SceneSignals>(createSignals())
  const reduceMotion = usePrefersReducedMotion()
  const [webgl] = useState(canRenderWebGL)
  const [visible, setVisible] = useState(true)

  // Stop the render loop while the hero is off screen.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(Boolean(entry?.isIntersecting)),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Pointer position relative to the hero (the canvas covers it exactly).
  useEffect(() => {
    const el = rootRef.current
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const s = signals.current
      s.pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1
      s.pointerY = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
      s.pointerActive = true
    }
    const onLeave = () => {
      signals.current.pointerActive = false
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  useGSAP(
    () => {
      const progress = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          signals.current.scroll = self.progress
        },
      })

      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        SplitText.create('[data-hero-title]', {
          type: 'lines,words',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) => {
            // A transformed child escapes its parent's background-clip, so the
            // highlighted word carries the gradient itself.
            self.words.forEach((word) => {
              if (word.closest('[data-gradient]')) word.classList.add('text-brand-gradient')
            })
            return gsap.from(self.words, {
              yPercent: 115,
              duration: 1.3,
              stagger: 0.045,
              delay: 0.1,
            })
          },
        })

        gsap.from('[data-hero-fade]', {
          y: 20,
          autoAlpha: 0,
          duration: 1.1,
          stagger: 0.09,
          delay: 0.45,
        })

        // Copy drifts up and dims as the letter breaks apart behind it.
        gsap.to('[data-hero-content]', {
          yPercent: -14,
          autoAlpha: 0.15,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      })

      return () => {
        progress.kill()
        mm.revert()
      }
    },
    { scope: rootRef },
  )

  return (
    <section
      id="top"
      ref={rootRef}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100dvh] items-end overflow-hidden lg:items-center"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {webgl && (
          <SceneBoundary>
            <Suspense fallback={null}>
              <HeroScene signals={signals} animate={!reduceMotion} active={visible} />
            </Suspense>
          </SceneBoundary>
        )}
      </div>

      {/* Brand light spill and a fade into the next section, layered above the canvas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            'radial-gradient(60% 50% at 85% 40%, rgb(219 53 18 / 0.16), transparent 70%), radial-gradient(45% 45% at 10% 10%, rgb(61 107 255 / 0.12), transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-ink-950"
      />

      <Container className="relative pt-28 pb-14 sm:pb-20 lg:py-24">
        <div data-hero-content className="max-w-[44rem]">
          <p
            data-hero-fade
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/[0.04] py-1.5 pr-3.5 pl-2.5 text-[0.8rem] text-fg/90 backdrop-blur-md"
          >
            <Cube weight="duotone" className="size-4 text-accent-bright" aria-hidden="true" />
            Software factory a medida
          </p>

          <h1
            id="hero-title"
            data-hero-title
            className="mt-6 text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.035em] sm:text-6xl lg:text-[3.6rem] xl:text-[4rem]"
          >
            Construimos el{' '}
            <span data-gradient className="text-brand-gradient">
              software
            </span>{' '}
            que impulsa tu negocio
          </h1>

          <p
            data-hero-fade
            className="mt-6 max-w-[34rem] text-base leading-relaxed text-muted sm:text-lg"
          >
            Diseñamos, desarrollamos y escalamos productos digitales de alto rendimiento. Del
            concepto al lanzamiento, con un equipo senior.
          </p>

          <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={site.contactCta.href} size="lg" arrow magnetic>
              {site.contactCta.label}
            </Button>
            <Button href="#servicios" size="lg" variant="secondary">
              Ver servicios
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
