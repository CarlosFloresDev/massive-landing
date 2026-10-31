import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export const controlClass =
  'w-full rounded-xl border bg-ink-850 px-4 text-[0.95rem] text-fg placeholder:text-subtle ' +
  'transition-[border-color,box-shadow] duration-200 outline-none ' +
  'focus-visible:border-accent-bright focus-visible:shadow-[0_0_0_3px_rgb(255_74_28/0.18)] focus-visible:outline-none'

type FieldProps = {
  label: string
  error?: string
  hint?: ReactNode
  optional?: boolean
  className?: string
  /** Receives the ids the control must wire to stay accessible. */
  children: (props: {
    id: string
    'aria-invalid': boolean
    'aria-describedby': string | undefined
    className: string
  }) => ReactNode
}

/** Label above, control, then hint or error below. Error text replaces the hint. */
export function Field({ label, error, hint, optional, className, children }: FieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const hasMessage = Boolean(error || hint)

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-sm font-medium text-fg/90">
        {label}
        {optional && <span className="ml-1.5 font-normal text-subtle">(opcional)</span>}
      </label>
      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': hasMessage ? messageId : undefined,
        className: cn(controlClass, error ? 'border-accent-bright/70' : 'border-line-strong'),
      })}
      {hasMessage && (
        <p
          id={messageId}
          className={cn('text-[0.8rem]', error ? 'text-accent-bright' : 'text-subtle')}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  )
}
