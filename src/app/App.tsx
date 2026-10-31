import { SmoothScroll } from '@/app/SmoothScroll'
import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/sections/Hero'

export function App() {
  return (
    <SmoothScroll>
      <Navbar />
      <main id="main">
        <Hero />
        <div className="h-[150dvh]" />
      </main>
    </SmoothScroll>
  )
}
