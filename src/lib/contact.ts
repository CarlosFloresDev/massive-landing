export const budgetOptions = [
  { value: 'lt-10k', label: 'Menos de 10.000 USD' },
  { value: '10k-30k', label: '10.000 a 30.000 USD' },
  { value: '30k-60k', label: '30.000 a 60.000 USD' },
  { value: 'gt-60k', label: 'Más de 60.000 USD' },
  { value: 'unsure', label: 'Aún no lo sé' },
] as const

export type Budget = (typeof budgetOptions)[number]['value']

export type ContactValues = {
  name: string
  email: string
  company: string
  budget: Budget | ''
  message: string
}

export type ContactErrors = Partial<Record<keyof ContactValues, string>>

export const emptyContact: ContactValues = {
  name: '',
  email: '',
  company: '',
  budget: '',
  message: '',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const MESSAGE_MIN = 20
export const MESSAGE_MAX = 2000

/** Returns one message per invalid field. An empty object means the form is valid. */
export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const message = values.message.trim()

  if (name.length < 2) errors.name = 'Escribe tu nombre.'
  if (!email) errors.email = 'Escribe tu correo.'
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Revisa el formato del correo.'
  if (!values.budget) errors.budget = 'Elige un rango aproximado.'
  if (message.length < MESSAGE_MIN)
    errors.message = `Cuéntanos un poco más (mínimo ${MESSAGE_MIN} caracteres).`
  else if (message.length > MESSAGE_MAX)
    errors.message = `El mensaje supera los ${MESSAGE_MAX} caracteres.`

  return errors
}

/** Builds a prefilled mailto link, used when no form endpoint is configured. */
export function buildMailto(to: string, values: ContactValues): string {
  const budget = budgetOptions.find((option) => option.value === values.budget)?.label ?? ''
  const subject = `Nuevo proyecto: ${values.company.trim() || values.name.trim()}`
  const details = [`Nombre: ${values.name.trim()}`, `Correo: ${values.email.trim()}`]
  if (values.company.trim()) details.push(`Empresa: ${values.company.trim()}`)
  if (budget) details.push(`Presupuesto: ${budget}`)
  const body = `${details.join('\n')}\n\n${values.message.trim()}`
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export type SubmitResult = { ok: true; via: 'endpoint' | 'mailto' } | { ok: false; error: string }

/**
 * Sends the form to `VITE_CONTACT_ENDPOINT` (any JSON form backend such as
 * Formspree or a serverless function). Without one, opens the user's email
 * client with the message prefilled so leads are never silently lost.
 */
export async function submitContact(
  values: ContactValues,
  options: { endpoint?: string; fallbackEmail: string; fetcher?: typeof fetch },
): Promise<SubmitResult> {
  const { endpoint, fallbackEmail, fetcher = fetch } = options

  if (!endpoint) {
    window.location.href = buildMailto(fallbackEmail, values)
    return { ok: true, via: 'mailto' }
  }

  try {
    const response = await fetcher(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(values),
    })
    if (!response.ok) return { ok: false, error: `HTTP ${response.status}` }
    return { ok: true, via: 'endpoint' }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Network error' }
  }
}
