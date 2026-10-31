import type { SimpleIcon } from 'simple-icons'
import { Container } from '@/components/ui/Container'
import { stack } from '@/content/stack'

function StackLogo({ icon }: { icon: SimpleIcon }) {
  return (
    <li className="flex shrink-0 items-center gap-3 px-7 text-subtle transition-colors duration-300 hover:text-fg">
      <svg role="img" viewBox="0 0 24 24" className="size-6 fill-current" aria-label={icon.title}>
        <path d={icon.path} />
      </svg>
      <span className="text-sm font-medium" aria-hidden="true">
        {icon.title}
      </span>
    </li>
  )
}

/**
 * The page's single marquee. The list is rendered twice so the loop is
 * seamless; the copy is hidden from assistive tech. Under reduced motion
 * it becomes a static, wrapped row.
 */
export function StackMarquee() {
  return (
    <section aria-labelledby="stack-title" className="border-y border-line py-10">
      <Container>
        <h2 id="stack-title" className="text-center text-sm text-muted">
          Tecnologías con las que construimos
        </h2>
      </Container>

      <div
        className="group relative mt-7 flex overflow-hidden motion-reduce:justify-center"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
        }}
      >
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:animate-none">
          <ul className="flex motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4">
            {stack.map((icon) => (
              <StackLogo key={icon.slug} icon={icon} />
            ))}
          </ul>
          <ul className="flex motion-reduce:hidden" aria-hidden="true">
            {stack.map((icon) => (
              <StackLogo key={icon.slug} icon={icon} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
