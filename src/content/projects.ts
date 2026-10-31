/**
 * Portfolio entries.
 *
 * NOTE: these are sample projects with placeholder photography from
 * picsum.photos. Replace `image` with real screenshots (1200x900, WebP or
 * AVIF in /public/work) and the copy with real case studies before launch.
 */
export type Project = {
  slug: string
  name: string
  industry: string
  summary: string
  highlights: string[]
  stack: string[]
  image: string
  /** Describe the real screenshot once it replaces the placeholder. */
  imageAlt: string
}

const placeholder = (seed: string) => `https://picsum.photos/seed/${seed}/1200/900?grayscale`

export const projects: Project[] = [
  {
    slug: 'ruta-viva',
    name: 'Ruta Viva',
    industry: 'Logística',
    summary:
      'Plataforma de rastreo de flotas en tiempo real, con rutas optimizadas y una app para conductores.',
    highlights: ['Tracking en vivo', 'App para conductores', 'Panel de operaciones'],
    stack: ['React', 'Node.js', 'Flutter', 'GCP'],
    image: placeholder('massive-logistics'),
    imageAlt: '',
  },
  {
    slug: 'clinica-aurora',
    name: 'Clínica Aurora',
    industry: 'Salud',
    summary:
      'Agenda de citas, historia clínica digital y teleconsulta en una sola app para pacientes y médicos.',
    highlights: ['Teleconsulta', 'Historia clínica digital', 'Recordatorios automáticos'],
    stack: ['Flutter', 'Supabase', 'PostgreSQL'],
    image: placeholder('massive-health'),
    imageAlt: '',
  },
  {
    slug: 'nodo-pagos',
    name: 'Nodo Pagos',
    industry: 'Fintech',
    summary:
      'Onboarding digital con verificación de identidad y billetera para pequeños comercios.',
    highlights: ['Verificación de identidad', 'Billetera digital', 'Conciliación automática'],
    stack: ['Kotlin', 'Swift', 'Go'],
    image: placeholder('massive-fintech'),
    imageAlt: '',
  },
  {
    slug: 'mercado-central',
    name: 'Mercado Central',
    industry: 'Retail',
    summary:
      'E-commerce headless con inventario sincronizado entre las tiendas físicas y el canal online.',
    highlights: ['Inventario unificado', 'Checkout optimizado', 'Panel de ventas'],
    stack: ['Next.js', 'GraphQL', 'PostgreSQL'],
    image: placeholder('massive-retail'),
    imageAlt: '',
  },
]
