import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

// Register once, in one place. Every component imports GSAP from here.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

gsap.defaults({ ease: 'expo.out', duration: 1 })

/** Media query shared by every GSAP matchMedia block. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

export { gsap, ScrollTrigger, SplitText, useGSAP }
