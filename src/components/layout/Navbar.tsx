import { useCallback, useEffect, useRef, useState } from 'react'
import { List, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { site } from '@/config/site'
import { cn } from '@/lib/cn'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { lockScroll, unlockScroll } from '@/lib/scroll'

export function Navbar() {
  const headerRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuOpenRef = useRef(menuOpen)
  useEffect(() => {
    menuOpenRef.current = menuOpen
  }, [menuOpen])

  // Hide on scroll down, reveal on scroll up. Background appears after leaving the top.
  useGSAP(() => {
    const header = headerRef.current
    if (!header) return
    const show = gsap.quickTo(header, 'yPercent', { duration: 0.45, ease: 'power3.out' })

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate(self) {
        setScrolled(self.scroll() > 24)
        if (menuOpenRef.current) return
        const goingDown = self.direction === 1 && self.scroll() > 240
        show(goingDown ? -110 : 0)
      },
    })
    return () => trigger.kill()
  })

  // Unlock before the anchor click reaches Lenis, otherwise a stopped Lenis ignores the jump.
  const closeMenu = useCallback(() => {
    unlockScroll()
    setMenuOpen(false)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    lockScroll()
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && closeMenu()
    window.addEventListener('keydown', onKey)
    return () => {
      unlockScroll()
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen, closeMenu])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-(--z-menu) focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-ink-950"
      >
        Saltar al contenido
      </a>

      <header
        ref={headerRef}
        className={cn(
          'fixed inset-x-0 top-0 z-(--z-nav) transition-[background-color,border-color,backdrop-filter] duration-300',
          'border-b',
          scrolled || menuOpen
            ? 'border-line bg-ink-950/75 backdrop-blur-xl'
            : 'border-transparent bg-transparent',
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-6">
          <a href="#top" aria-label="Massive, volver al inicio" className="rounded-md">
            <Logo />
          </a>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors duration-200 hover:text-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Button href={site.contactCta.href} arrow className="hidden sm:inline-flex">
              {site.contactCta.short}
            </Button>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong text-fg md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="size-5" /> : <List className="size-5" />}
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu open={menuOpen} onNavigate={closeMenu} />
    </>
  )
}

function MobileMenu({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const links = [...site.nav, { label: site.contactCta.short, href: site.contactCta.href }]

  return (
    <div
      id="mobile-menu"
      data-open={open}
      inert={!open}
      data-lenis-prevent
      className={cn(
        'fixed inset-0 z-(--z-menu) flex flex-col bg-ink-950/95 px-4 pt-6 pb-10 backdrop-blur-2xl md:hidden',
        'transition-[opacity,visibility] duration-300 ease-out',
        open ? 'visible opacity-100' : 'invisible opacity-0',
      )}
      style={{ top: 64 }}
    >
      <nav aria-label="Móvil">
        <ul className="flex flex-col gap-1">
          {links.map((item, index) => (
            <li
              key={item.href}
              className={cn(
                'transition-[opacity,transform] duration-500 ease-(--ease-out-expo)',
                open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
              )}
              style={{ transitionDelay: open ? `${60 + index * 45}ms` : '0ms' }}
            >
              <a
                href={item.href}
                onClick={onNavigate}
                className="block border-b border-line py-4 text-3xl font-medium tracking-tight"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <p className="mt-auto text-sm text-muted">{site.email}</p>
    </div>
  )
}
