import { useRef } from 'react'
import { Check } from '@phosphor-icons/react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { projects, type Project } from '@/content/projects'
import { useReveal } from '@/hooks/useReveal'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'

/** Distance from the viewport top where cards stick, plus a step per card. */
const STICK_TOP = 96
const STICK_STEP = 18

function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      data-card
      aria-labelledby={`project-${project.slug}`}
      className="relative grid origin-top overflow-hidden rounded-[1.75rem] border border-line bg-ink-900 shadow-[0_-24px_60px_-30px_rgb(0_0_0/0.8)] lg:min-h-[34rem] lg:grid-cols-[1fr_1.1fr]"
    >
      <div className="flex flex-col p-7 sm:p-10">
        <p className="font-mono text-xs text-subtle">{project.industry}</p>
        <h3
          id={`project-${project.slug}`}
          className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          {project.name}
        </h3>
        <p className="mt-4 max-w-[42ch] leading-relaxed text-muted">{project.summary}</p>

        <ul className="mt-8 space-y-2.5" aria-label="Lo que construimos">
          {project.highlights.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-fg/85">
              <Check weight="bold" className="size-3.5 text-accent-bright" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <ul className="mt-auto flex flex-wrap gap-2 pt-10" aria-label="Tecnologías">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.7rem] text-subtle"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative min-h-64 overflow-hidden border-t border-line lg:border-t-0 lg:border-l">
        <img
          src={project.image}
          alt={project.imageAlt}
          width={1200}
          height={900}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
        {/* Brand duotone so placeholder and real imagery share one look. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-br from-brand-blue/45 via-transparent to-accent/55 mix-blend-color"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-ink-900/70 via-transparent to-transparent"
        />
      </div>

      {/* Dims the card as the next one covers it (opacity is cheaper than a filter). */}
      <div
        data-card-shade
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-ink-950 opacity-0"
      />
    </article>
  )
}

/**
 * Cards stick near the top and stack; each one recedes slightly as the next
 * slides over it. Sticky positioning does the stacking, GSAP only scrubs the
 * scale and dimming, so the layout still works without motion.
 */
export function Work() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        const wrappers = gsap.utils.toArray<HTMLElement>('[data-card-wrapper]')
        wrappers.forEach((wrapper, i) => {
          const next = wrappers[i + 1]
          const card = wrapper.querySelector('[data-card]')
          const shade = wrapper.querySelector('[data-card-shade]')
          if (!next || !card || !shade) return
          gsap
            .timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: next,
                start: 'top bottom',
                end: `top ${STICK_TOP + (i + 1) * STICK_STEP}px`,
                scrub: true,
              },
            })
            .to(card, { scale: 0.94 }, 0)
            .to(shade, { opacity: 0.5 }, 0)
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section
      id="portafolio"
      ref={ref}
      aria-labelledby="portafolio-title"
      className="py-24 sm:py-32"
    >
      <Container>
        <SectionHeading
          id="portafolio-title"
          eyebrow="Portafolio"
          title="Productos que ya están en manos de usuarios"
          description="Una muestra de lo que construimos para empresas de logística, salud, finanzas y retail."
        />

        <ol className="mt-14 space-y-6 lg:space-y-10">
          {projects.map((project, i) => (
            <li
              key={project.slug}
              data-card-wrapper
              className="lg:sticky"
              style={{ top: STICK_TOP + i * STICK_STEP }}
            >
              <ProjectCard project={project} />
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
