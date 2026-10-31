import type { RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { Bloom, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { Dust } from './Dust'
import { Monogram } from './Monogram'
import type { SceneSignals } from './signals'

const BACKGROUND = '#0b0b0e'

type HeroSceneProps = {
  signals: RefObject<SceneSignals>
  animate: boolean
  /** Pauses rendering entirely while the hero is off screen. */
  active: boolean
}

export default function HeroScene({ signals, animate, active }: HeroSceneProps) {
  const frameloop = !active ? 'never' : animate ? 'always' : 'demand'

  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, 1.75]}
      frameloop={frameloop}
      camera={{ position: [0, 0, 16], fov: 32, near: 0.1, far: 60 }}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
      style={{ pointerEvents: 'none' }}
    >
      <color attach="background" args={[BACKGROUND]} />
      <fog attach="fog" args={[BACKGROUND, 15, 32]} />

      <ambientLight intensity={0.12} />
      <directionalLight position={[4, 6, 8]} intensity={1.1} />

      {/* Procedural studio lighting: no HDR download, brand colors in the reflections. */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#ffffff"
          position={[0, 6, -2]}
          scale={[12, 2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={4}
          color="#3d6bff"
          position={[-7, 0, 3]}
          rotation-y={Math.PI / 2}
          scale={[8, 6, 1]}
        />
        <Lightformer
          form="rect"
          intensity={5}
          color="#ff4a1c"
          position={[7, -1, 3]}
          rotation-y={-Math.PI / 2}
          scale={[8, 6, 1]}
        />
        <Lightformer form="ring" intensity={1.5} color="#ffffff" position={[0, 0, 9]} scale={4} />
      </Environment>

      <Monogram signals={signals} animate={animate} />
      <Dust signals={signals} animate={animate} />

      <EffectComposer multisampling={4}>
        <Bloom
          mipmapBlur
          luminanceThreshold={1}
          luminanceSmoothing={0.2}
          intensity={0.85}
          radius={0.7}
        />
        <Vignette offset={0.3} darkness={0.55} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </Canvas>
  )
}
