import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { ArrowRight } from '@phosphor-icons/react'
import { useMagnetic } from '@/hooks/useMagnetic'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary'
type Size = 'md' | 'lg'

const base =
  'group relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium ' +
  'transition-[background-color,border-color,color,transform] duration-200 ease-out active:scale-[0.97] ' +
  'disabled:pointer-events-none disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_8px_24px_-8px_rgb(219_53_18/0.55)] hover:bg-accent-hover',
  secondary:
    'border border-line-strong bg-white/[0.03] text-fg hover:border-white/25 hover:bg-white/[0.07]',
}

const sizes: Record<Size, string> = {
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-[0.95rem]',
}

type CommonProps = {
  variant?: Variant
  size?: Size
  /** Show the trailing arrow that nudges forward on hover. */
  arrow?: boolean
  /** Enable the magnetic pull on fine pointers. */
  magnetic?: boolean
  children: ReactNode
  className?: string
}

type ButtonAsLink = CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<'a'>,
    keyof CommonProps
  >
type ButtonAsButton = CommonProps & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<'button'>,
    keyof CommonProps
  >

export type ButtonProps = ButtonAsLink | ButtonAsButton

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    arrow = false,
    magnetic = false,
    children,
    className,
    ...rest
  } = props
  const magnetRef = useMagnetic<HTMLSpanElement>(magnetic ? 0.25 : 0)
  const classes = cn(base, variants[variant], sizes[size], className)

  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowRight
          weight="bold"
          aria-hidden="true"
          className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
        />
      )}
    </>
  )

  // The magnetic wrapper moves; the inner control keeps its own press scale.
  const element =
    'href' in rest && typeof rest.href === 'string' ? (
      <a className={classes} {...(rest as ComponentPropsWithoutRef<'a'>)}>
        {content}
      </a>
    ) : (
      <button type="button" className={classes} {...(rest as ComponentPropsWithoutRef<'button'>)}>
        {content}
      </button>
    )

  if (!magnetic) return element
  return (
    <span ref={magnetRef} className="inline-flex will-change-transform">
      {element}
    </span>
  )
}
