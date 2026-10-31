import { useRef } from 'react'
import { ArrowUp } from '@phosphor-icons/react'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { site } from '@/config/site'
import { gsap, MOTION_OK, SplitText, useGSAP } from '@/lib/gsap'

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const year = new Date().getFullYear()

  // The oversized wordmark rises letter by letter as the page ends.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        SplitText.create('[data-wordmark]', {
          type: 'chars',
          mask: 'chars',
          charsClass: 'text-wordmark',
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 100,
              ease: 'power3.out',
              stagger: 0.04,
              scrollTrigger: {
                trigger: '[data-wordmark]',
                start: 'top bottom',
                end: 'bottom bottom',
                scrub: 0.6,
              },
            }),
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-line pt-16">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-muted">
              {site.description}
            </p>
          </div>

          <nav aria-label="Pie de página">
            <h2 className="text-sm font-medium text-fg">Navegación</h2>
            <ul className="mt-4 space-y-2.5">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted transition-colors duration-200 hover:text-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-medium text-fg">Contacto</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-sm text-muted transition-colors duration-200 hover:text-fg"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.contactCta.href}
                  className="text-sm text-muted transition-colors duration-200 hover:text-fg"
                >
                  {site.contactCta.label}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between gap-4 border-t border-line py-6 text-xs text-subtle">
          <p>
            © {year} {site.name}. Todos los derechos reservados.
          </p>
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-fg"
          >
            Volver arriba
            <ArrowUp className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </Container>

      <p
        data-wordmark
        aria-hidden="true"
        className="text-wordmark pointer-events-none -mb-[0.12em] text-center text-[25vw] leading-[0.95] font-semibold tracking-[-0.06em] select-none"
      >
        Massive
      </p>
    </footer>
  )
}
