import { useRef } from 'react'
import { Code, Lightning, UsersThree } from '@phosphor-icons/react'
import { Container } from '@/components/ui/Container'
import { useReveal } from '@/hooks/useReveal'
import { gsap, MOTION_OK, SplitText, useGSAP } from '@/lib/gsap'

const principles = [
  {
    icon: UsersThree,
    title: 'Equipo senior',
    text: 'Personas con oficio que ya resolvieron problemas como el tuyo.',
  },
  {
    icon: Lightning,
    title: 'Entregas cada dos semanas',
    text: 'Software funcionando que puedes probar, no reportes de avance.',
  },
  {
    icon: Code,
    title: 'El código es tuyo',
    text: 'Repositorios, diseños y accesos a tu nombre desde el primer día.',
  },
]

/** Statement that lights up word by word as it scrolls through the viewport. */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        SplitText.create('[data-manifesto]', {
          type: 'words',
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.16 },
              {
                opacity: 1,
                ease: 'none',
                stagger: 0.1,
                scrollTrigger: {
                  trigger: '[data-manifesto]',
                  start: 'top 80%',
                  end: 'bottom 50%',
                  scrub: true,
                },
              },
            ),
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} aria-labelledby="manifesto-title" className="py-24 sm:py-36">
      <Container>
        <h2 id="manifesto-title" className="sr-only">
          Por qué Massive
        </h2>
        <p
          data-manifesto
          className="max-w-5xl text-[1.75rem] leading-[1.22] font-medium tracking-[-0.025em] sm:text-4xl lg:text-[3.1rem]"
        >
          No somos una agencia más. Somos el equipo de ingeniería que tu empresa necesita. Tratamos
          tu producto como <span className="text-accent-bright">propio</span> y entregamos software
          que funciona desde la primera semana.
        </p>

        <ul className="mt-20 grid gap-10 border-t border-line pt-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
          {principles.map(({ icon: Icon, title, text }) => (
            <li key={title} data-reveal className="md:px-8 md:first:pl-0 md:last:pr-0">
              <Icon weight="duotone" className="size-6 text-accent-bright" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 max-w-[34ch] text-[0.95rem] leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
