type NetworkInformation = { saveData?: boolean }

/** True when WebGL2 is available and the user has not asked to save data. */
export function canRenderWebGL(): boolean {
  if (typeof window === 'undefined') return false
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
  if (connection?.saveData) return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2'))
  } catch {
    return false
  }
}
