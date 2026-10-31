/**
 * Site-wide settings. Copy that changes per deployment (contact details,
 * canonical URL) lives here so sections never hard-code it.
 */
export const site = {
  name: 'Massive',
  description:
    'Fábrica de software a medida. Diseñamos, desarrollamos y escalamos productos digitales de alto rendimiento.',
  url: 'https://massive.dev',
  email: 'hola@massive.dev',
  responseTime: 'Respondemos en menos de 24 horas hábiles.',
  nav: [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Proceso', href: '#proceso' },
    { label: 'Portafolio', href: '#portafolio' },
    { label: 'FAQ', href: '#faq' },
  ],
  /** One label for the contact intent, reused everywhere on the page. */
  contactCta: { label: 'Hablemos de tu proyecto', short: 'Hablemos', href: '#contacto' },
} as const

export type NavItem = (typeof site.nav)[number]
