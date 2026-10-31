# Massive · Landing page

Landing page de **Massive**, fábrica de software a medida.

React 19 + TypeScript + Vite, Tailwind CSS v4, GSAP (ScrollTrigger y SplitText), Lenis y una escena 3D en React Three Fiber.

## Requisitos

- Node.js 20.19 o superior
- npm 10 o superior

## Scripts

| Comando                | Qué hace                                       |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo                         |
| `npm run build`        | Chequeo de tipos y build de producción         |
| `npm run preview`      | Sirve el build localmente                      |
| `npm run lint`         | ESLint                                         |
| `npm run format`       | Formatea con Prettier (ordena clases Tailwind) |
| `npm run format:check` | Verifica formato sin escribir                  |
| `npm run typecheck`    | Solo chequeo de tipos                          |
| `npm test`             | Tests unitarios con Vitest                     |

## Estructura

```
src/
  app/            Raíz de la app y scroll suave (Lenis + GSAP ticker)
  components/
    layout/       Navbar y footer
    three/        Escena 3D del hero (carga diferida)
    ui/           Primitivas reutilizables: Button, Container, Field, Accordion...
  config/site.ts  Datos del sitio: navegación, correo, CTA
  content/        Textos de cada sección (servicios, proceso, proyectos, FAQ, stack)
  hooks/          useReveal, useMagnetic, usePrefersReducedMotion
  lib/            GSAP centralizado, servicio de contacto, utilidades
  sections/       Una sección de la página por archivo
  styles/         Tokens de diseño (Tailwind @theme) y estilos base
```

Para cambiar textos no hace falta tocar componentes: todo el contenido vive en `src/content` y `src/config/site.ts`.

## Formulario de contacto

Copia `.env.example` a `.env` y define `VITE_CONTACT_ENDPOINT` con cualquier endpoint que acepte JSON (Formspree, una función serverless, etc.). Sin endpoint, el formulario abre el cliente de correo del visitante con el mensaje listo y dirigido a `site.email`.

## Movimiento y rendimiento

- Toda la animación respeta `prefers-reduced-motion`: sin scroll suave, sin pin horizontal, escena 3D estática.
- La escena 3D se descarga después del primer render, se pausa fuera de pantalla y se omite si no hay WebGL2 o si el usuario activó ahorro de datos.
- Solo se animan `transform` y `opacity`.

## Antes de publicar

- Reemplazar los proyectos de ejemplo y sus imágenes de `picsum.photos` en `src/content/projects.ts`.
- Confirmar el dominio y el correo en `src/config/site.ts`, `index.html`, `public/robots.txt` y `public/sitemap.xml`.
