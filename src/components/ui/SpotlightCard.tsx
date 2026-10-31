import type { ComponentPropsWithoutRef, PointerEvent } from 'react'
import { cn } from '@/lib/cn'

/**
 * Card whose border and surface light up under the pointer. The pointer
 * position is written straight to CSS variables, so moving never re-renders.
 */
export function SpotlightCard({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) {
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = event.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    el.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <div
      onPointerMove={onPointerMove}
      className={cn(
        'group/spot relative isolate overflow-hidden rounded-(--radius-card) border border-line bg-ink-900',
        // Surface glow
        'before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:opacity-0 before:transition-opacity before:duration-500',
        'before:bg-[radial-gradient(420px_circle_at_var(--mx)_var(--my),rgb(255_74_28/0.10),transparent_60%)]',
        // Border glow, masked to the 1px ring
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:p-px after:opacity-0 after:transition-opacity after:duration-500',
        'after:bg-[radial-gradient(260px_circle_at_var(--mx)_var(--my),rgb(255_255_255/0.35),transparent_70%)]',
        'after:[mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]',
        'hover:before:opacity-100 hover:after:opacity-100',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
