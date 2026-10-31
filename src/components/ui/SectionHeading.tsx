import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type SectionHeadingProps = {
  id: string
  /** Optional small label above the title. Use sparingly (at most one in three sections). */
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  className?: string
}

/** Headline stack used by sections: optional eyebrow, title, then body below it. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-3xl', className)}>
      {eyebrow && (
        <p
          data-reveal
          className="mb-4 font-mono text-xs tracking-[0.16em] text-accent-bright uppercase"
        >
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        data-reveal
        className="text-[2.1rem] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-5xl"
      >
        {title}
      </h2>
      {description && (
        <p
          data-reveal
          className="mt-5 max-w-[60ch] text-base leading-relaxed text-muted sm:text-lg"
        >
          {description}
        </p>
      )}
    </div>
  )
}
