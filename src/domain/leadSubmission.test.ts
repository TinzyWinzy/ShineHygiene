import { describe, expect, it } from 'vitest'
import { parseLeadSubmission } from '../../api/_lib/lead'
import { calculateQuote, defaultQuoteState } from './quoteState'

function tomorrow(): string {
  return new Date(Date.now() + 86_400_000).toISOString().slice(0, 10)
}

function base(overrides: Record<string, unknown> = {}) {
  return {
    clientRequestId: 'request_12345678',
    name: '  Rudo   Test ',
    phone: '+263 77 123 4567',
    preferredDate: tomorrow(),
    preferredTime: '09:30',
    vertical: 'commercial',
    params: { floorArea: 100, frequency: 'weekly' },
    ...overrides,
  }
}

describe('parseLeadSubmission', () => {
  it('normalises the customer fields and recomputes the canonical total', () => {
    const result = parseLeadSubmission({
      ...base(),
      // A tampered client-side quote must be ignored.
      quote: { subtotal: 1, discount: 0, total: 1, breakdown: [] },
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.lead.name).toBe('Rudo Test')
    expect(result.lead.phone).toBe('+263 77 123 4567')
    expect(result.lead.quote.total).toBe(135)
    expect(result.lead.totalCents).toBe(13_500)
  })

  it('applies the same HygieneMart bulk discount as the client', () => {
    const result = parseLeadSubmission(
      base({
        vertical: 'hygienemart',
        params: { items: [{ itemId: 'det-5l', quantity: 10 }] },
      }),
    )

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.lead.quote.total).toBe(171)
    expect(result.lead.totalCents).toBe(17_100)
  })

  it.each([
    ['missing request id', base({ clientRequestId: 'short' })],
    ['empty name', base({ name: '   ' })],
    ['control characters in name', base({ name: 'Rudo\u0000Test' })],
    ['letters in phone', base({ phone: 'call-me' })],
    ['too few phone digits', base({ phone: '1234' })],
    ['unknown vertical', base({ vertical: 'spaceship' })],
    ['zero floor area', base({ params: { floorArea: 0, frequency: 'weekly' } })],
    ['huge floor area', base({ params: { floorArea: 10_001, frequency: 'weekly' } })],
    ['bad frequency', base({ params: { floorArea: 10, frequency: 'hourly' } })],
    ['bad date', base({ preferredDate: '2026-02-30' })],
    ['past date', base({ preferredDate: '2020-01-01' })],
    ['bad time', base({ preferredTime: '24:00' })],
    ['unknown catalog item', base({ vertical: 'hygienemart', params: { items: [{ itemId: 'free-money', quantity: 1 }] } })],
    [
      'duplicate catalog item',
      base({
        vertical: 'hygienemart',
        params: { items: [{ itemId: 'det-5l', quantity: 1 }, { itemId: 'det-5l', quantity: 2 }] },
      }),
    ],
    ['zero quantity', base({ vertical: 'hygienemart', params: { items: [{ itemId: 'det-5l', quantity: 0 }] } })],
    ['missing params', base({ params: null })],
    ['array body', []],
  ])('rejects %s', (_label, input) => {
    expect(parseLeadSubmission(input).ok).toBe(false)
  })

  it('accepts an omitted preferred date and time', () => {
    const result = parseLeadSubmission(base({ preferredDate: '', preferredTime: '' }))
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.lead.preferredDate).toBeNull()
    expect(result.lead.preferredTime).toBeNull()
  })

  it.each(['commercial', 'residential', 'office', 'car', 'hygienemart'] as const)(
    'server and client totals agree for %s',
    vertical => {
      const state = defaultQuoteState(vertical)
      const result = parseLeadSubmission({ ...base(), vertical, params: state.params })

      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.lead.quote).toEqual(calculateQuote(state))
    },
  )
})
