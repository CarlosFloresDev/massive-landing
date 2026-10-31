import { useRef } from 'react'
import { Check } from '@phosphor-icons/react'
import { processSteps, type ProcessStep } from '@/content/process'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'

const DESKTOP_MOTION = `(min-width: 1024px) and ${MOTION_OK}`

function StepCard({ step }: { step: ProcessStep }) {
  const Icon = step.icon
  return (
    <li
      data-step
      className="flex flex-col rounded-(--radius-card) border border-line bg-ink-900 p-6 sm:p-8 lg:w-[23rem] lg:shrink-0"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong bg-white/[0.03]">
          <Icon weight="duotone" className="size-5 text-accent-bright" aria-hidden="true" />
        </span>
        <span className="font-mono text-xs text-subtle">{step.duration}</span>
      </div>
      <h3 className="mt-8 text-2xl font-semibold tracking-tight">{step.title}</h3>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{step.description}</p>
      <ul className="mt-8 space-y-2.5 border-t border-line pt-6" aria-label="Entregables">
        {step.deliverables.map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-sm text-fg/85">
            <Check
              weight="bold"
              className="size-3.5 shrink-0 text-accent-bright"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </li>
  )
}

/**
 * Vertical scroll drives a horizontal pan on large screens: the section pins
 * at the top, the track slides by exactly its overflow, and a progress line
 * fills alongside. Small screens and reduced motion get a plain stacked list.
 */
export function Process() {
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(DESKTOP_MOTION, () => {
        const track = trackRef.current
        if (!track) return
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

        const pan = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })

        gsap.fromTo(
          '[data-process-progress]',
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: pinRef.current,
              start: 'top top',
              end: () => `+=${distance()}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )

        // Each card settles in as it travels into view.
        gsap.utils.toArray<HTMLElement>('[data-step]').forEach((card) => {
          gsap.from(card, {
            autoAlpha: 0.25,
            y: 48,
            rotate: 2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: pan,
              start: 'left 95%',
              end: 'left 60%',
              scrub: true,
            },
          })
        })
      })

      mm.add(`(max-width: 1023px) and ${MOTION_OK}`, () => {
        gsap.utils.toArray<HTMLElement>('[data-step]').forEach((card) => {
          gsap.from(card, {
            autoAlpha: 0,
            y: 32,
            duration: 0.9,
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          })
        })
      })

      return () => mm.revert()
    },
    { scope: pinRef },
  )

  return (
    <section id="proceso" aria-labelledby="proceso-title" className="relative">
      <div
        ref={pinRef}
        className="relative py-24 sm:py-32 motion-safe:lg:flex motion-safe:lg:h-[100dvh] motion-safe:lg:items-center motion-safe:lg:overflow-hidden motion-safe:lg:py-0"
      >
        <div
          ref={trackRef}
          className="flex flex-col gap-4 px-4 will-change-transform sm:px-6 lg:flex-row lg:items-stretch lg:gap-5 lg:pr-[12vw] lg:pl-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))] motion-reduce:lg:flex-wrap"
        >
          <div className="mb-8 max-w-xl lg:mr-14 lg:mb-0 lg:w-[26rem] lg:shrink-0 lg:self-center">
            <h2
              id="proceso-title"
              className="text-[2.1rem] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-5xl"
            >
              Un proceso claro, de la idea a producción
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
              Sabes en qué estamos trabajando, qué sigue y cuándo lo verás funcionando.
            </p>
          </div>

          <ol role="list" className="contents">
            {processSteps.map((step) => (
              <StepCard key={step.title} step={step} />
            ))}
          </ol>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-12 mx-auto hidden h-px max-w-[1240px] px-10 motion-safe:lg:block"
        >
          <div
            data-process-progress
            className="h-px origin-left bg-linear-to-r from-brand-blue to-accent-bright"
          />
        </div>
      </div>
    </section>
  )
}
