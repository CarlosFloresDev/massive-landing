import { SmoothScroll } from '@/app/SmoothScroll'
import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/sections/Hero'
import { Services } from '@/sections/Services'
import { StackMarquee } from '@/sections/StackMarquee'

export function App() {
  return (
    <SmoothScroll>
      <Navbar />
      <main id="main">
        <Hero />
        <StackMarquee />
        <Services />
        <div className="h-[100dvh]" />
      </main>
    </SmoothScroll>
  )
}
