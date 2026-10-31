import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  CaretDown,
  CheckCircle,
  CircleNotch,
  EnvelopeSimple,
  WarningCircle,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Field } from '@/components/ui/Field'
import { site } from '@/config/site'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/cn'
import {
  budgetOptions,
  emptyContact,
  MESSAGE_MAX,
  submitContact,
  validateContact,
  type ContactErrors,
  type ContactValues,
} from '@/lib/contact'

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; via: 'endpoint' | 'mailto' }
  | { kind: 'error' }

const FIELD_ORDER: (keyof ContactValues)[] = ['name', 'email', 'company', 'budget', 'message']

function ContactForm() {
  const [values, setValues] = useState<ContactValues>(emptyContact)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [attempted, setAttempted] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const update =
    (field: keyof ContactValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const next = { ...values, [field]: event.target.value }
      setValues(next)
      // Validate live only after the first submit, so typing is never interrupted early.
      if (attempted) setErrors(validateContact(next))
    }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setAttempted(true)

    // Honeypot: real people never see or fill this field.
    if ((form.elements.namedItem('website') as HTMLInputElement | null)?.value) {
      setStatus({ kind: 'success', via: 'endpoint' })
      return
    }

    const found = validateContact(values)
    setErrors(found)
    const firstInvalid = FIELD_ORDER.find((field) => found[field])
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setStatus({ kind: 'submitting' })
    const result = await submitContact(values, {
      endpoint: import.meta.env.VITE_CONTACT_ENDPOINT,
      fallbackEmail: site.email,
    })
    setStatus(result.ok ? { kind: 'success', via: result.via } : { kind: 'error' })
  }

  const reset = () => {
    setValues(emptyContact)
    setErrors({})
    setAttempted(false)
    setStatus({ kind: 'idle' })
  }

  if (status.kind === 'success') {
    return (
      <div role="status" className="flex min-h-[28rem] flex-col items-start justify-center">
        <CheckCircle weight="duotone" className="size-10 text-accent-bright" aria-hidden="true" />
        <h3 className="mt-5 text-2xl font-semibold tracking-tight">
          {status.via === 'mailto' ? 'Tu correo está listo' : 'Mensaje recibido'}
        </h3>
        <p className="mt-3 max-w-[40ch] leading-relaxed text-muted">
          {status.via === 'mailto'
            ? 'Abrimos tu aplicación de correo con el mensaje preparado. Solo falta enviarlo.'
            : `Gracias, ${values.name.trim().split(' ')[0]}. ${site.responseTime}`}
        </p>
        <Button variant="secondary" className="mt-8" onClick={reset}>
          Enviar otro mensaje
        </Button>
      </div>
    )
  }

  const submitting = status.kind === 'submitting'

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Nombre" error={errors.name}>
        {(props) => (
          <input
            {...props}
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={update('name')}
            className={cn(props.className, 'h-12')}
          />
        )}
      </Field>

      <Field label="Correo de trabajo" error={errors.email}>
        {(props) => (
          <input
            {...props}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={update('email')}
            className={cn(props.className, 'h-12')}
          />
        )}
      </Field>

      <Field label="Empresa" optional>
        {(props) => (
          <input
            {...props}
            name="company"
            autoComplete="organization"
            value={values.company}
            onChange={update('company')}
            className={cn(props.className, 'h-12')}
          />
        )}
      </Field>

      <Field label="Presupuesto estimado" error={errors.budget}>
        {(props) => (
          <div className="relative">
            <select
              {...props}
              name="budget"
              value={values.budget}
              onChange={update('budget')}
              className={cn(
                props.className,
                'h-12 cursor-pointer appearance-none pr-10',
                !values.budget && 'text-subtle',
              )}
            >
              <option value="" disabled>
                Selecciona un rango
              </option>
              {budgetOptions.map((option) => (
                <option key={option.value} value={option.value} className="text-fg">
                  {option.label}
                </option>
              ))}
            </select>
            <CaretDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-subtle"
            />
          </div>
        )}
      </Field>

      <Field
        label="Cuéntanos sobre tu proyecto"
        error={errors.message}
        hint={`${values.message.length}/${MESSAGE_MAX}`}
        className="sm:col-span-2"
      >
        {(props) => (
          <textarea
            {...props}
            name="message"
            rows={5}
            maxLength={MESSAGE_MAX}
            placeholder="Qué quieres construir, para quién y para cuándo."
            value={values.message}
            onChange={update('message')}
            className={cn(props.className, 'resize-y py-3 leading-relaxed')}
          />
        )}
      </Field>

      {/* Honeypot, hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Sitio web
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status.kind === 'error' && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-accent-bright/40 bg-accent/10 px-4 py-3 text-sm text-fg sm:col-span-2"
        >
          <WarningCircle className="mt-0.5 size-4 shrink-0 text-accent-bright" aria-hidden="true" />
          No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos a {site.email}.
        </p>
      )}

      <div className="flex flex-col-reverse items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-subtle">{site.responseTime}</p>
        <Button type="submit" size="lg" disabled={submitting} aria-busy={submitting}>
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <CircleNotch className="size-4 animate-spin" aria-hidden="true" />
              Enviando
            </span>
          ) : (
            'Enviar mensaje'
          )}
        </Button>
      </div>
    </form>
  )
}

export function Contact() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  return (
    <section id="contacto" ref={ref} aria-labelledby="contacto-title" className="py-24 sm:py-32">
      <Container>
        <div
          data-reveal
          className="relative isolate overflow-hidden rounded-[2rem] border border-line bg-ink-900 p-6 sm:p-10 lg:p-14"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 -left-40 -z-10 size-[36rem] rounded-full opacity-60 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgb(219 53 18 / 0.35), rgb(61 107 255 / 0.12) 55%, transparent 70%)',
            }}
          />

          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <h2
                id="contacto-title"
                className="text-[2.1rem] leading-[1.06] font-semibold tracking-[-0.03em] sm:text-5xl"
              >
                ¿Tienes un proyecto en mente?
              </h2>
              <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-muted sm:text-lg">
                Cuéntanos qué quieres construir. Te respondemos con preguntas concretas y una
                propuesta para empezar.
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-10 inline-flex items-center gap-3 text-lg font-medium text-fg transition-colors hover:text-accent-bright"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong">
                  <EnvelopeSimple className="size-5" aria-hidden="true" />
                </span>
                {site.email}
              </a>
            </div>

            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  )
}
