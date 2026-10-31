import { useId, useState } from 'react'
import { Plus } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'

export type AccordionItem = { question: string; answer: string }

/**
 * Single-open disclosure list. Height animates through a 0fr to 1fr grid
 * row, so content never needs measuring and stays interruptible.
 */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const baseId = useId()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, index) => {
        const isOpen = open === index
        const buttonId = `${baseId}-button-${index}`
        const panelId = `${baseId}-panel-${index}`

        return (
          <div key={item.question} data-reveal>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium tracking-tight transition-colors duration-200 hover:text-fg sm:text-xl"
              >
                <span className={cn(isOpen ? 'text-fg' : 'text-fg/85')}>{item.question}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'inline-flex size-9 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color] duration-300 ease-(--ease-out-quart)',
                    isOpen
                      ? 'rotate-45 border-accent bg-accent text-white'
                      : 'border-line-strong text-fg group-hover:border-white/30',
                  )}
                >
                  <Plus weight="bold" className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                'grid transition-[grid-template-rows,opacity] duration-400 ease-(--ease-out-quart)',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p className="max-w-[62ch] pr-12 pb-6 leading-relaxed text-muted">{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
