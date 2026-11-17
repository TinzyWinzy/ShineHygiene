import { describe, expect, it } from 'vitest'
import type { LeadData } from '../types'
import {
  calculateQuote,
  createLead,
  defaultQuoteState,
  quoteReducer,
  reviveLeadDraft,
} from './quoteState'

describe('quoteReducer', () => {
  it('replaces vertical and params atomically', () => {
    const commercial = defaultQuoteState('commercial')
    const next = quoteReducer(commercial, { type: 'setVertical', vertical: 'hygienemart' })

    expect(next.vertical).toBe('hygienemart')
    if (next.vertical !== 'hygienemart') throw new Error('unreachable')
    expect(Array.isArray(next.params.items)).toBe(true)
    expect(next.params.items.length).toBeGreaterThan(0)
  })

  it('ignores an update aimed at a different vertical', () => {
    const state = defaultQuoteState('car')
    const next = quoteReducer(state, {
      type: 'updateCommercial',
      patch: { floorArea: 999 },
    })

    expect(next).toBe(state)
  })

  it('reset keeps the selected vertical and restores its defaults', () => {
    const dirty = quoteReducer(defaultQuoteState('residential'), {
      type: 'updateResidential',
      patch: { rooms: 9, windowDeepClean: true },
    })
    const reset = quoteReducer(dirty, { type: 'reset' })

    expect(reset.vertical).toBe('residential')
    if (reset.vertical !== 'residential') throw new Error('unreachable')
    expect(reset.params).toEqual({ rooms: 3, windowDeepClean: false })
  })
})

describe('calculateQuote', () => {
  it.each(['commercial', 'residential', 'office', 'car', 'hygienemart'] as const)(
    'returns a positive estimate for %s',
    vertical => {
      const quote = calculateQuote(defaultQuoteState(vertical))
      expect(quote.total).toBeGreaterThan(0)
      expect(quote.breakdown.length).toBeGreaterThan(0)
    },
  )

  it('returns an empty quote for an empty HygieneMart cart', () => {
    const quote = calculateQuote({ vertical: 'hygienemart', params: { items: [] } })
    expect(quote).toEqual({ subtotal: 0, discount: 0, total: 0, breakdown: [] })
  })
})

describe('createLead', () => {
  it('locks the lead to the vertical of the params it received', () => {
    const state = defaultQuoteState('office')
    const lead = createLead(
      state,
      {
        id: 'lead-1',
        name: 'Test User',
        phone: '0771000000',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      calculateQuote(state),
    )

    expect(lead.vertical).toBe('office')
    if (lead.vertical !== 'office') throw new Error('unreachable')
    expect(lead.params.floorArea).toBe(50)
    expect(lead.quote.total).toBe(67.5)
  })
})

describe('reviveLeadDraft', () => {
  const state = defaultQuoteState('commercial')
  const lead: LeadData = createLead(
    state,
    {
      id: 'lead-2',
      name: 'Saved User',
      phone: '0771222333',
      createdAt: '2026-02-01T08:00:00.000Z',
    },
    calculateQuote(state),
  )

  it('migrates a legacy queued lead without discarding it', () => {
    const draft = reviveLeadDraft({
      id: lead.id,
      data: lead,
      queuedAt: '2026-02-01T09:00:00.000Z',
      retryCount: 3,
    })

    expect(draft).not.toBeNull()
    expect(draft?.status).toBe('pending')
    expect(draft?.savedAt).toBe('2026-02-01T09:00:00.000Z')
    expect(draft?.data.name).toBe('Saved User')
  })

  it('keeps a handed-off draft flagged as handed off', () => {
    const draft = reviveLeadDraft({
      id: lead.id,
      data: lead,
      savedAt: '2026-02-01T09:00:00.000Z',
      status: 'handed_off',
      handedOffAt: '2026-02-01T09:05:00.000Z',
    })

    expect(draft?.status).toBe('handed_off')
    expect(draft?.handedOffAt).toBe('2026-02-01T09:05:00.000Z')
  })

  it('rejects a corrupt draft instead of rendering it', () => {
    const corrupt = {
      ...lead,
      params: { floorArea: 100, frequency: 'weekly' },
      quote: { total: 'not-a-number' },
    }

    expect(reviveLeadDraft({ id: 'x', data: { ...corrupt, vertical: 'hygienemart' } })).toBeNull()
    expect(reviveLeadDraft({ id: 'x', data: { ...corrupt, vertical: 'commercial' } })).toBeNull()
    expect(reviveLeadDraft(null)).toBeNull()
  })
})
