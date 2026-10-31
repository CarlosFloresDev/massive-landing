import { SmoothScroll } from '@/app/SmoothScroll'
import { Navbar } from '@/components/layout/Navbar'

export function App() {
  return (
    <SmoothScroll>
      <Navbar />
      <main id="main" className="min-h-[300dvh] pt-16">
        Massive
      </main>
    </SmoothScroll>
  )
}
