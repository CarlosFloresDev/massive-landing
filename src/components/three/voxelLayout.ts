/**
 * Voxel layout for the Massive "M". Pure data, no Three.js objects, so it can
 * be unit tested and reused by any renderer.
 */

// Two-voxel-wide strokes. Rows read top to bottom.
const M_PATTERN = [
  'XX.......XX',
  'XXX.....XXX',
  'XXXX...XXXX',
  'XX.XX.XX.XX',
  'XX..XXX..XX',
  'XX...X...XX',
  'XX.......XX',
  'XX.......XX',
  'XX.......XX',
] as const

const DEPTH_LAYERS = [-0.5, 0.5]

export type Voxel = {
  /** Assembled position. */
  hx: number
  hy: number
  hz: number
  /** Position before the intro assembles the letter. */
  sx: number
  sy: number
  sz: number
  /** Position the voxel drifts to as the hero scrolls away. */
  ox: number
  oy: number
  oz: number
  /** Random spin axis weights used while scattered. */
  rx: number
  ry: number
  rz: number
  /** Intro delay in seconds. */
  delay: number
  /** 0 at the left edge of the letter, 1 at the right. Drives the brand gradient. */
  gradient: number
  /** Whether the voxel glows. */
  accent: boolean
}

/** Small deterministic PRNG so the composition is identical on every load. */
export function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pointOnSphere(random: () => number, radius: number) {
  const u = random() * 2 - 1
  const theta = random() * Math.PI * 2
  const r = Math.sqrt(1 - u * u)
  return [r * Math.cos(theta) * radius, r * Math.sin(theta) * radius, u * radius] as const
}

export function buildMonogram(seed = 7, accentRatio = 0.2): Voxel[] {
  const random = mulberry32(seed)
  const rows = M_PATTERN.length
  const cols = M_PATTERN[0].length
  const voxels: Voxel[] = []

  M_PATTERN.forEach((row, rowIndex) => {
    for (let col = 0; col < cols; col++) {
      if (row[col] !== 'X') continue
      for (const z of DEPTH_LAYERS) {
        const hx = col - (cols - 1) / 2
        const hy = (rows - 1) / 2 - rowIndex
        const [sx, sy, sz] = pointOnSphere(random, 9 + random() * 6)
        // Fly outward from the center of the letter, biased toward the camera.
        const len = Math.hypot(hx, hy) || 1
        const push = 6 + random() * 8
        voxels.push({
          hx,
          hy,
          hz: z,
          sx,
          sy,
          sz,
          ox: hx + (hx / len) * push,
          oy: hy + (hy / len) * push + (random() - 0.5) * 4,
          oz: z + 2 + random() * 8,
          rx: random() * 2 - 1,
          ry: random() * 2 - 1,
          rz: random() * 2 - 1,
          // Assemble from the bottom up with a little jitter.
          delay: (rows - rowIndex) * 0.07 + random() * 0.35,
          gradient: col / (cols - 1),
          accent: z > 0 && random() < accentRatio,
        })
      }
    }
  })

  return voxels
}
