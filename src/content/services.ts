import type { Icon } from '@phosphor-icons/react'
import {
  Brain,
  CloudArrowUp,
  DeviceMobile,
  Browsers,
  PenNib,
  TreeStructure,
} from '@phosphor-icons/react'

export type ServiceVisual = 'layers' | 'orb' | 'dots' | 'plain'

export type Service = {
  id: string
  title: string
  description: string
  icon: Icon
  tags: string[]
  /** Background treatment for the bento cell. */
  visual: ServiceVisual
  /** Grid placement on large screens (12 column grid). */
  layout: string
}

export const services: Service[] = [
  {
    id: 'web',
    title: 'Plataformas web y SaaS',
    description:
      'Productos web rápidos, accesibles y preparados para crecer: desde un MVP hasta plataformas con miles de usuarios.',
    icon: Browsers,
    tags: ['React', 'Next.js', 'Node'],
    visual: 'layers',
    layout: 'md:col-span-2 lg:col-span-7 lg:row-span-2',
  },
  {
    id: 'mobile',
    title: 'Apps móviles',
    description: 'iOS y Android, nativas o multiplataforma, con la misma calidad en cada pantalla.',
    icon: DeviceMobile,
    tags: ['Flutter', 'Swift', 'Kotlin'],
    visual: 'dots',
    layout: 'lg:col-span-5',
  },
  {
    id: 'ai',
    title: 'IA y automatización',
    description:
      'Integramos modelos de lenguaje y flujos automáticos donde ahorran horas reales de trabajo.',
    icon: Brain,
    tags: ['LLMs', 'RAG', 'Agentes'],
    visual: 'orb',
    layout: 'lg:col-span-5',
  },
  {
    id: 'custom',
    title: 'Software a medida',
    description: 'ERPs, CRMs y herramientas internas que se adaptan a tu operación, no al revés.',
    icon: TreeStructure,
    tags: ['Integraciones', 'APIs'],
    visual: 'plain',
    layout: 'lg:col-span-5',
  },
  {
    id: 'cloud',
    title: 'Cloud y DevOps',
    description: 'Infraestructura con CI/CD, monitoreo y costos bajo control.',
    icon: CloudArrowUp,
    tags: ['GCP', 'Docker', 'K8s'],
    visual: 'plain',
    layout: 'lg:col-span-3',
  },
  {
    id: 'design',
    title: 'Diseño UX/UI',
    description: 'Investigación, prototipos y sistemas de diseño que convierten.',
    icon: PenNib,
    tags: ['Figma', 'Design systems'],
    visual: 'plain',
    layout: 'lg:col-span-4',
  },
]
