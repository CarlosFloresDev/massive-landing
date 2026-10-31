import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  Color,
  MathUtils,
  Matrix4,
  Object3D,
  Ray,
  Raycaster,
  Vector2,
  Vector3,
  type Group,
  type InstancedMesh,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { buildMonogram, type Voxel } from './voxelLayout'
import type { SceneSignals } from './signals'

const BLUE = new Color('#3d6bff')
const RED = new Color('#ff4a1c')
/** Pushes accent colors above the bloom threshold so only they glow. */
const GLOW_BOOST = 1.45
const INTRO_DURATION = 1.4

type Layout = { x: number; y: number; scale: number; yaw: number }

/** Places the letter beside the copy on wide screens and above it on tall ones. */
function computeLayout(width: number, height: number): Layout {
  if (width / height > 1.05) {
    return {
      x: width * 0.27,
      y: -height * 0.02,
      scale: Math.min(height * 0.05, width * 0.027),
      yaw: -0.32,
    }
  }
  return { x: 0, y: height * 0.24, scale: Math.min(width * 0.055, height * 0.03), yaw: -0.18 }
}

type FrameState = {
  time: number
  scroll: number
  hover: number
  px: number
  py: number
}

function writeInstances(
  mesh: InstancedMesh,
  voxels: Voxel[],
  frame: FrameState,
  animate: boolean,
  dummy: Object3D,
) {
  const explode = frame.scroll ** 1.6

  for (let i = 0; i < voxels.length; i++) {
    const v = voxels[i]!
    const t = MathUtils.clamp((frame.time - v.delay) / INTRO_DURATION, 0, 1)
    const e = 1 - (1 - t) ** 4

    const wave = animate ? Math.sin(frame.time * 1.4 + v.hx * 0.55 + v.hy * 0.35) * 0.1 * e : 0
    const dx = v.hx - frame.px
    const dy = v.hy - frame.py
    const push = frame.hover * 1.5 * Math.exp(-(dx * dx + dy * dy) / 2.5) * e

    dummy.position.set(
      v.sx + (v.hx - v.sx) * e + (v.ox - v.hx) * explode,
      v.sy + (v.hy - v.sy) * e + (v.oy - v.hy) * explode,
      v.sz + (v.hz - v.sz) * e + (v.oz - v.hz) * explode + wave + push,
    )

    const spin = (1 - e) * 3 + explode * 2.5
    dummy.rotation.set(v.rx * spin + push * 0.35, v.ry * spin, v.rz * spin)
    dummy.scale.setScalar((0.35 + 0.65 * e) * (1 - explode * 0.4))
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
  }
  mesh.instanceMatrix.needsUpdate = true
}

type MonogramProps = {
  signals: RefObject<SceneSignals>
  /** False under reduced motion: the letter renders assembled and still. */
  animate: boolean
}

export function Monogram({ signals, animate }: MonogramProps) {
  const groupRef = useRef<Group>(null)
  const solidRef = useRef<InstancedMesh>(null)
  const glowRef = useRef<InstancedMesh>(null)

  const camera = useThree((state) => state.camera)
  const viewport = useThree((state) => state.viewport)
  const invalidate = useThree((state) => state.invalidate)
  const layout = computeLayout(viewport.width, viewport.height)

  const { solid, glow } = useMemo(() => {
    const voxels = buildMonogram()
    return { solid: voxels.filter((v) => !v.accent), glow: voxels.filter((v) => v.accent) }
  }, [])

  // Shared geometry is created here, so this component owns its disposal.
  const geometry = useMemo(() => new RoundedBoxGeometry(0.9, 0.9, 0.9, 2, 0.09), [])
  useEffect(() => () => geometry.dispose(), [geometry])

  const scratch = useMemo(
    () => ({
      dummy: new Object3D(),
      raycaster: new Raycaster(),
      ndc: new Vector2(),
      inverse: new Matrix4(),
      ray: new Ray(),
      hit: new Vector3(),
    }),
    [],
  )

  const frame = useRef<FrameState>({ time: animate ? 0 : 99, scroll: 0, hover: 0, px: 0, py: 0 })

  useLayoutEffect(() => {
    const mesh = glowRef.current
    if (!mesh) return
    const color = new Color()
    glow.forEach((v, i) => {
      color.copy(BLUE).lerp(RED, v.gradient).multiplyScalar(GLOW_BOOST)
      mesh.setColorAt(i, color)
    })
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [glow])

  // Under reduced motion the loop runs on demand: draw the final pose once.
  useEffect(() => {
    if (!animate) invalidate()
  }, [animate, invalidate, layout.x, layout.y, layout.scale])

  useFrame((_, delta) => {
    const group = groupRef.current
    const solidMesh = solidRef.current
    const glowMesh = glowRef.current
    if (!group || !solidMesh || !glowMesh) return

    const dt = Math.min(delta, 1 / 30)
    const input = signals.current
    const f = frame.current
    // The intro follows wall-clock time so slow devices still finish it on schedule.
    f.time += Math.min(delta, 0.25)
    f.scroll = MathUtils.damp(f.scroll, animate ? input.scroll : 0, 6, dt)
    f.hover = MathUtils.damp(f.hover, animate && input.pointerActive ? 1 : 0, 4, dt)

    const yaw = layout.yaw + (animate ? input.pointerX * 0.35 : 0)
    const pitch = animate ? -input.pointerY * 0.18 : 0
    group.rotation.y = animate ? MathUtils.damp(group.rotation.y, yaw, 3, dt) : yaw
    group.rotation.x = animate ? MathUtils.damp(group.rotation.x, pitch, 3, dt) : pitch
    group.updateMatrixWorld()

    // Project the pointer onto the letter's plane, in the letter's own space.
    if (f.hover > 0.001) {
      const { raycaster, ndc, inverse, ray, hit } = scratch
      ndc.set(input.pointerX, input.pointerY)
      raycaster.setFromCamera(ndc, camera)
      inverse.copy(group.matrixWorld).invert()
      ray.copy(raycaster.ray).applyMatrix4(inverse)
      const distance = -ray.origin.z / ray.direction.z
      if (Number.isFinite(distance) && distance > 0) {
        ray.at(distance, hit)
        f.px = MathUtils.damp(f.px, hit.x, 10, dt)
        f.py = MathUtils.damp(f.py, hit.y, 10, dt)
      }
    }

    writeInstances(solidMesh, solid, f, animate, scratch.dummy)
    writeInstances(glowMesh, glow, f, animate, scratch.dummy)
  })

  return (
    <group ref={groupRef} position={[layout.x, layout.y, 0]} scale={layout.scale}>
      <instancedMesh
        ref={solidRef}
        args={[geometry, undefined, solid.length]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#3a3a46"
          metalness={0.7}
          roughness={0.3}
          envMapIntensity={1.6}
        />
      </instancedMesh>
      <instancedMesh ref={glowRef} args={[geometry, undefined, glow.length]} frustumCulled={false}>
        <meshBasicMaterial color="white" toneMapped={false} />
      </instancedMesh>
    </group>
  )
}
