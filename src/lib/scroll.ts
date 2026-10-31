import type Lenis from 'lenis'

/**
 * Tiny registry so UI (menus, dialogs) can pause smooth scroll without
 * prop drilling. Falls back to native overflow locking when Lenis is off.
 */
let instance: Lenis | null = null

export function registerLenis(lenis: Lenis | null) {
  instance = lenis
}

export function lockScroll() {
  instance?.stop()
  document.documentElement.style.overflow = 'hidden'
}

export function unlockScroll() {
  instance?.start()
  document.documentElement.style.overflow = ''
}
