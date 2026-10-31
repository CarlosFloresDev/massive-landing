import { useId } from 'react'
import { cn } from '@/lib/cn'

type LogoProps = {
  className?: string
  /** Hide the wordmark and keep only the monogram. */
  markOnly?: boolean
}

/** Massive monogram: a single M stroke running from brand blue to brand red. */
export function Logo({ className, markOnly = false }: LogoProps) {
  const gradientId = useId()

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 32 32" className="size-7 shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-brand-blue)" />
            <stop offset="100%" stopColor="var(--color-accent-bright)" />
          </linearGradient>
        </defs>
        <path
          d="M5 26V7l11 11L27 7v19"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="4.5"
          strokeLinejoin="miter"
          strokeLinecap="square"
        />
      </svg>
      {!markOnly && <span className="text-[1.05rem] font-semibold tracking-tight">Massive</span>}
    </span>
  )
}
