export type FaqItem = { question: string; answer: string }

export const faq: FaqItem[] = [
  {
    question: '¿Cuánto cuesta desarrollar un proyecto?',
    answer:
      'Depende del alcance. Tras una llamada de descubrimiento te enviamos una propuesta con alcance, plazos y precio, ya sea cerrado o por iteraciones, para que decidas con números claros.',
  },
  {
    question: '¿Cuánto tiempo toma tener algo funcionando?',
    answer:
      'Un MVP suele estar listo entre 8 y 12 semanas. Desde el primer sprint ves avances que puedes probar, y los productos más grandes se entregan por fases.',
  },
  {
    question: '¿El código y los diseños son míos?',
    answer:
      'Sí. Repositorios, diseños, infraestructura y accesos quedan a nombre de tu empresa desde el primer día.',
  },
  {
    question: '¿Cómo es la comunicación durante el proyecto?',
    answer:
      'Tienes un canal directo con el equipo, una demo al final de cada sprint y acceso al tablero de trabajo para ver qué se está construyendo.',
  },
  {
    question: '¿Pueden sumarse a un proyecto que ya existe?',
    answer:
      'Sí. Empezamos con una auditoría técnica corta para entender el código y la infraestructura, y a partir de ahí proponemos cómo continuar.',
  },
  {
    question: '¿Ofrecen soporte después del lanzamiento?',
    answer:
      'Sí. Tenemos planes de mantenimiento y evolución con tiempos de respuesta acordados, monitoreo y mejoras continuas.',
  },
]
