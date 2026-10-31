import { describe, expect, it, vi } from 'vitest'
import {
  buildMailto,
  emptyContact,
  submitContact,
  validateContact,
  type ContactValues,
} from './contact'

const valid: ContactValues = {
  name: 'Lucía Ferreyra',
  email: 'lucia@empresa.com',
  company: 'Ferreyra Logística',
  budget: '10k-30k',
  message: 'Necesitamos una app para coordinar entregas en tres ciudades.',
}

describe('validateContact', () => {
  it('accepts a complete submission', () => {
    expect(validateContact(valid)).toEqual({})
  })

  it('flags every required field on an empty form', () => {
    expect(Object.keys(validateContact(emptyContact)).sort()).toEqual([
      'budget',
      'email',
      'message',
      'name',
    ])
  })

  it('rejects malformed emails', () => {
    expect(validateContact({ ...valid, email: 'lucia@empresa' }).email).toBeDefined()
    expect(validateContact({ ...valid, email: 'lucia empresa.com' }).email).toBeDefined()
  })

  it('ignores surrounding whitespace when measuring the message', () => {
    expect(validateContact({ ...valid, message: '   corto   ' }).message).toBeDefined()
  })

  it('treats company as optional', () => {
    expect(validateContact({ ...valid, company: '' })).toEqual({})
  })
})

describe('buildMailto', () => {
  it('encodes subject and body', () => {
    const link = buildMailto('hola@massive.dev', valid)
    expect(link.startsWith('mailto:hola@massive.dev?subject=')).toBe(true)
    const body = decodeURIComponent(link.split('&body=')[1] ?? '')
    expect(body).toContain('Empresa: Ferreyra Logística')
    expect(body).toContain('Presupuesto: 10.000 a 30.000 USD')
  })
})

describe('submitContact', () => {
  it('posts JSON to the configured endpoint', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 200 }))
    const result = await submitContact(valid, {
      endpoint: 'https://forms.example/submit',
      fallbackEmail: 'hola@massive.dev',
      fetcher,
    })
    expect(result).toEqual({ ok: true, via: 'endpoint' })
    expect(fetcher).toHaveBeenCalledWith(
      'https://forms.example/submit',
      expect.objectContaining({ method: 'POST', body: JSON.stringify(valid) }),
    )
  })

  it('reports server errors', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 500 }))
    const result = await submitContact(valid, {
      endpoint: 'https://forms.example/submit',
      fallbackEmail: 'hola@massive.dev',
      fetcher,
    })
    expect(result).toEqual({ ok: false, error: 'HTTP 500' })
  })

  it('reports network failures', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('offline'))
    const result = await submitContact(valid, {
      endpoint: 'https://forms.example/submit',
      fallbackEmail: 'hola@massive.dev',
      fetcher,
    })
    expect(result).toEqual({ ok: false, error: 'offline' })
  })
})
