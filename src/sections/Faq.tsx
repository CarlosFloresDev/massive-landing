import { useRef } from 'react'
import { Accordion } from '@/components/ui/Accordion'
import { Container } from '@/components/ui/Container'
import { site } from '@/config/site'
import { faq } from '@/content/faq'
import { useReveal } from '@/hooks/useReveal'

const structuredData = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
})

export function Faq() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  return (
    <section id="faq" ref={ref} aria-labelledby="faq-title" className="py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2
            id="faq-title"
            data-reveal
            className="text-[2.1rem] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-5xl"
          >
            Preguntas frecuentes
          </h2>
          <p data-reveal className="mt-5 max-w-[40ch] leading-relaxed text-muted">
            ¿No encuentras lo que buscas? Escríbenos a{' '}
            <a
              href={`mailto:${site.email}`}
              className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent-bright"
            >
              {site.email}
            </a>
            .
          </p>
        </div>

        <Accordion items={faq} />
      </Container>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
    </section>
  )
}
