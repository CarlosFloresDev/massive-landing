/**
 * Values the DOM writes and the WebGL loop reads every frame.
 * Kept in a plain mutable object so updates never trigger React renders.
 */
export type SceneSignals = {
  /** Hero scroll progress, 0 at the top of the page, 1 when the hero has left. */
  scroll: number
  /** Pointer in normalized device coordinates relative to the canvas (-1..1). */
  pointerX: number
  pointerY: number
  /** True while the pointer is over the hero. */
  pointerActive: boolean
}

export const createSignals = (): SceneSignals => ({
  scroll: 0,
  pointerX: 0,
  pointerY: 0,
  pointerActive: false,
})
