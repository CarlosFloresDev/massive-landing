import { Component, type ReactNode } from 'react'

type State = { failed: boolean }

/**
 * WebGL is an enhancement. If the context cannot be created or a shader
 * fails to compile, drop the scene and keep the page usable.
 */
export class SceneBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) console.warn('[hero-scene] disabled:', error)
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
