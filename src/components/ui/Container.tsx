import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

/** Horizontal page rhythm: one max width and one gutter scale for every section. */
export function Container({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10', className)}
      {...props}
    />
  )
}
