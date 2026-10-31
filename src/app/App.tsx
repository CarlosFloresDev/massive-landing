import { SmoothScroll } from '@/app/SmoothScroll'
import { Navbar } from '@/components/layout/Navbar'
import { Faq } from '@/sections/Faq'
import { Hero } from '@/sections/Hero'
import { Manifesto } from '@/sections/Manifesto'
import { Process } from '@/sections/Process'
import { Services } from '@/sections/Services'
import { StackMarquee } from '@/sections/StackMarquee'
import { Work } from '@/sections/Work'

export function App() {
  return (
    <SmoothScroll>
      <Navbar />
      <main id="main">
        <Hero />
        <StackMarquee />
        <Services />
        <Process />
        <Manifesto />
        <Work />
        <Faq />
        <div className="h-[100dvh]" />
      </main>
    </SmoothScroll>
  )
}
