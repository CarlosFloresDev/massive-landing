import { SmoothScroll } from '@/app/SmoothScroll'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { Contact } from '@/sections/Contact'
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
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main id="main">
        <Hero />
        <StackMarquee />
        <Services />
        <Process />
        <Manifesto />
        <Work />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
