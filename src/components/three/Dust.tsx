import { useLayoutEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, MathUtils, Object3D, type Group, type InstancedMesh } from 'three'
import { mulberry32 } from './voxelLayout'
import type { SceneSignals } from './signals'

const COUNT = 140

/** Sparse field of tiny cubes that gives the scene depth and parallax. */
export function Dust({ signals, animate }: { signals: RefObject<SceneSignals>; animate: boolean }) {
  const groupRef = useRef<Group>(null)
  const meshRef = useRef<InstancedMesh>(null)

  const particles = useMemo(() => {
    const random = mulberry32(21)
    return Array.from({ length: COUNT }, () => ({
      x: (random() - 0.5) * 26,
      y: (random() - 0.5) * 15,
      z: -9 + random() * 11,
      s: 0.5 + random() * 1.2,
      r: random() * Math.PI,
      tint: random(),
    }))
  }, [])

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const dummy = new Object3D()
    const color = new Color()
    const neutral = new Color('#8b8b94')
    const blue = new Color('#3d6bff')
    const red = new Color('#ff4a1c')

    particles.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z)
      dummy.rotation.set(p.r, p.r * 0.7, 0)
      dummy.scale.setScalar(p.s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      color.copy(p.tint > 0.92 ? red : p.tint > 0.84 ? blue : neutral)
      mesh.setColorAt(i, color)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [particles])

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group || !animate) return
    const input = signals.current
    group.rotation.y += delta * 0.015
    group.position.y = MathUtils.damp(group.position.y, input.scroll * 3, 4, delta)
    group.position.x = MathUtils.damp(group.position.x, input.pointerX * -0.4, 2, delta)
  })

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshBasicMaterial transparent opacity={0.55} />
      </instancedMesh>
    </group>
  )
}
