import { useRef, type CSSProperties } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { services, type Service, type ServiceVisual } from '@/content/services'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/cn'

/** Isometric stack of layers that separate on hover: frontend, API, data, infra. */
function LayersVisual() {
  const layers = ['Interfaz', 'API', 'Datos', 'Infraestructura']
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-12 bottom-36 flex items-center justify-center [perspective:1200px] sm:bottom-40"
    >
      <div className="relative h-40 w-56 [transform:rotateX(58deg)_rotateZ(-38deg)] [transform-style:preserve-3d] sm:h-48 sm:w-72">
        {layers.map((label, i) => (
          <div
            key={label}
            className={cn(
              'absolute inset-0 rounded-2xl border backdrop-blur-sm',
              'transition-transform duration-700 ease-(--ease-out-expo)',
              '[transform:translateZ(var(--z))] group-hover/spot:[transform:translateZ(var(--z-open))]',
              i === 0 ? 'border-accent-bright/60 bg-accent/15' : 'border-white/15 bg-white/[0.035]',
            )}
            style={
              {
                '--z': `${(layers.length - 1 - i) * 26}px`,
                '--z-open': `${(layers.length - 1 - i) * 36}px`,
              } as CSSProperties
            }
          >
            <span className="absolute bottom-3 left-4 font-mono text-[0.7rem] text-fg/70">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Visual({ type }: { type: ServiceVisual }) {
  switch (type) {
    case 'layers':
      return <LayersVisual />
    case 'orb':
      return (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full opacity-70 blur-2xl motion-safe:animate-[spin_14s_linear_infinite]"
          style={{
            background:
              'conic-gradient(from 0deg, var(--color-brand-blue), #8a5cff, var(--color-accent-bright), var(--color-brand-blue))',
          }}
        />
      )
    case 'dots':
      return (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle_at_85%_15%,black,transparent_65%)] opacity-60"
          style={{
            backgroundImage: 'radial-gradient(rgb(255 255 255 / 0.22) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }}
        />
      )
    default:
      return null
  }
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon
  const isFeature = service.visual === 'layers'

  return (
    <SpotlightCard
      data-reveal
      className={cn(
        'flex min-h-64 flex-col justify-end p-6 sm:p-8',
        isFeature && 'min-h-[30rem] bg-linear-to-b from-ink-850 to-ink-900',
        service.layout,
      )}
    >
      <Visual type={service.visual} />
      <div className="relative">
        <Icon weight="duotone" className="size-7 text-accent-bright" aria-hidden="true" />
        <h3
          className={cn(
            'mt-5 font-semibold tracking-tight',
            isFeature ? 'text-2xl sm:text-3xl' : 'text-xl',
          )}
        >
          {service.title}
        </h3>
        <p className="mt-2 max-w-[46ch] text-[0.95rem] leading-relaxed text-muted">
          {service.description}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tecnologías">
          {service.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.7rem] text-subtle"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </SpotlightCard>
  )
}

export function Services() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  return (
    <section id="servicios" ref={ref} aria-labelledby="servicios-title" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="servicios-title"
          eyebrow="Servicios"
          title="Todo lo que tu producto necesita, en un solo equipo"
          description="Diseño, ingeniería e infraestructura trabajando juntos desde el primer día, sin pasarse la pelota entre proveedores."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Container>
    </section>
  )
}
