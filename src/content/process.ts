import type { Icon } from '@phosphor-icons/react'
import { ChartLineUp, Code, Compass, MagnifyingGlass, RocketLaunch } from '@phosphor-icons/react'

export type ProcessStep = {
  title: string
  duration: string
  description: string
  deliverables: string[]
  icon: Icon
}

export const processSteps: ProcessStep[] = [
  {
    title: 'Descubrimiento',
    duration: '1 a 2 semanas',
    description:
      'Entendemos tu negocio, tus usuarios y tus objetivos para decidir qué construir primero.',
    deliverables: ['Mapa de producto', 'Alcance priorizado', 'Propuesta con plazos y precio'],
    icon: MagnifyingGlass,
  },
  {
    title: 'Diseño',
    duration: '2 a 3 semanas',
    description: 'Prototipos navegables que validas con usuarios antes de escribir código.',
    deliverables: ['Flujos de usuario', 'Prototipo en Figma', 'Sistema de diseño'],
    icon: Compass,
  },
  {
    title: 'Desarrollo',
    duration: 'Sprints de 2 semanas',
    description:
      'Ciclos cortos con una demo al final de cada sprint. Ves el avance y opinas siempre.',
    deliverables: ['Demo por sprint', 'Código revisado y con tests', 'Entorno de pruebas'],
    icon: Code,
  },
  {
    title: 'Lanzamiento',
    duration: '1 semana',
    description: 'Salimos a producción con monitoreo, analítica y un plan de despliegue claro.',
    deliverables: ['Despliegue a producción', 'Monitoreo y alertas', 'Documentación'],
    icon: RocketLaunch,
  },
  {
    title: 'Evolución',
    duration: 'Continuo',
    description: 'Medimos, iteramos y escalamos el producto junto a tu equipo.',
    deliverables: ['Soporte y mantenimiento', 'Nuevas funcionalidades', 'Optimización de costos'],
    icon: ChartLineUp,
  },
]
