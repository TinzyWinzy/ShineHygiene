import type { QuoteResult, QuoteState, Vertical } from '../types'
import { HYGIENE_MART_CATALOG } from '../types'
import { calculateQuote, isVertical, reviveQuoteState } from './quoteState'

export const MAX_LEAD_BODY_BYTES = 16 * 1024
const MAX_TOTAL_CENTS = 10_000_000

export interface ValidatedLead {
  clientRequestId: string
  name: string
  phone: string
  preferredDate: string | null
  preferredTime: string | null
  state: QuoteState
  quote: QuoteResult
  totalCents: number
}

export type LeadValidation =
  | { ok: true; lead: ValidatedLead }
  | { ok: false; errors: string[] }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isControlFree(value: string): boolean {
  for (const character of value) {
    const code = character.codePointAt(0) ?? 0
    if (code < 32 || code === 127) return false
  }
  return true
}

function normaliseName(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const name = value.replace(/\s+/g, ' ').trim()
  if (name.length < 1 || name.length > 80 || !isControlFree(name)) return null
  return name
}

function normalisePhone(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const phone = value.trim()
  if (phone.length < 5 || phone.length > 20 || !isControlFree(phone)) return null
  if (!/^[+0-9()\s.-]+$/.test(phone)) return null
  if ((phone.match(/\d/g) ?? []).length < 5) return null
  return phone
}

function normaliseDate(value: unknown): string | null | undefined {
  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined

  const parsed = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) return undefined

  const today = new Date()
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  const day = parsed.getTime()
  const oneDay = 86_400_000
  if (day < todayUtc - oneDay || day > todayUtc + 366 * oneDay) return undefined
  return value
}

function normaliseTime(value: unknown): string | null | undefined {
  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return undefined
  return value
}

function clientRequestId(value: unknown): string | null {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{8,64}$/.test(value)) return null
  return value
}

function stateWithinBounds(state: QuoteState): boolean {
  switch (state.vertical) {
    case 'commercial':
    case 'office':
      return state.params.floorArea >= 1 && state.params.floorArea <= 10_000
    case 'residential':
      return state.params.rooms >= 1 && state.params.rooms <= 50
    case 'car':
      return state.params.carSize === 'sedan' || state.params.carSize === 'suv_truck'
    case 'hygienemart': {
      if (state.params.items.length < 1 || state.params.items.length > 50) return false
      const seen = new Set<string>()
      for (const item of state.params.items) {
        if (!HYGIENE_MART_CATALOG.some(candidate => candidate.id === item.itemId)) return false
        if (seen.has(item.itemId)) return false
        seen.add(item.itemId)
        if (item.quantity < 1 || item.quantity > 999) return false
      }
      return true
    }
  }
}

/**
 * Validates a lead from an untrusted request body and recomputes the quote
 * from the parameters. The client's own total is never trusted or stored.
 */
export function parseLeadSubmission(input: unknown): LeadValidation {
  if (!isRecord(input)) return { ok: false, errors: ['body'] }

  const errors: string[] = []
  const id = clientRequestId(input.clientRequestId)
  const name = normaliseName(input.name)
  const phone = normalisePhone(input.phone)
  const date = normaliseDate(input.preferredDate)
  const time = normaliseTime(input.preferredTime)
  const vertical = input.vertical
  const params = input.params

  if (!id) errors.push('clientRequestId')
  if (!name) errors.push('name')
  if (!phone) errors.push('phone')
  if (date === undefined) errors.push('preferredDate')
  if (time === undefined) errors.push('preferredTime')
  if (!isVertical(vertical)) errors.push('vertical')

  if (errors.length > 0 || !id || !name || !phone || date === undefined || time === undefined) {
    return { ok: false, errors }
  }

  const state = reviveQuoteState(vertical as Vertical, params)
  if (!state || !stateWithinBounds(state)) {
    return { ok: false, errors: ['params'] }
  }

  const quote = calculateQuote(state)
  const totalCents = Math.round(quote.total * 100)
  if (!Number.isFinite(totalCents) || totalCents < 0 || totalCents > MAX_TOTAL_CENTS) {
    return { ok: false, errors: ['total'] }
  }

  return {
    ok: true,
    lead: {
      clientRequestId: id,
      name,
      phone,
      preferredDate: date,
      preferredTime: time,
      state,
      quote,
      totalCents,
    },
  }
}
