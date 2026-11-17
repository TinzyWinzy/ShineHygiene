import { beforeEach, describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useLeadDrafts } from './useLeadDrafts'
import { calculateQuote, createLead, defaultQuoteState } from '../domain/quoteState'

const lead = createLead(
  defaultQuoteState('residential'),
  {
    id: 'lead-1234-5678-9012',
    name: 'Draft User',
    phone: '0771234567',
    createdAt: '2026-03-01T08:00:00.000Z',
  },
  calculateQuote(defaultQuoteState('residential')),
)

describe('useLeadDrafts', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('keys the draft by the lead id so handoff and delete can find it', () => {
    const { result } = renderHook(() => useLeadDrafts())

    act(() => {
      result.current.saveDraft(lead)
    })

    expect(result.current.drafts).toHaveLength(1)
    expect(result.current.drafts[0].id).toBe(lead.id)
    expect(result.current.drafts[0].status).toBe('pending')
  })

  it('records the office reference and allows WhatsApp handoff afterwards', () => {
    const { result } = renderHook(() => useLeadDrafts())

    act(() => {
      result.current.saveDraft(lead)
    })
    act(() => {
      result.current.markSubmitted(lead.id, 'SH-20260301-ABCD1234')
    })

    expect(result.current.drafts[0].status).toBe('submitted')
    expect(result.current.drafts[0].serverReference).toBe('SH-20260301-ABCD1234')

    act(() => {
      result.current.markHandedOff(lead.id)
    })

    expect(result.current.drafts[0].status).toBe('handed_off')
    expect(result.current.drafts[0].handedOffAt).toBeTypeOf('string')
  })

  it('does not duplicate a draft when the same lead is retried', () => {
    const { result } = renderHook(() => useLeadDrafts())

    act(() => {
      result.current.saveDraft(lead)
    })
    act(() => {
      result.current.saveDraft(lead)
    })

    expect(result.current.drafts).toHaveLength(1)
  })

  it('persists drafts across a remount', () => {
    const first = renderHook(() => useLeadDrafts())
    act(() => {
      first.result.current.saveDraft(lead)
    })
    first.unmount()

    const second = renderHook(() => useLeadDrafts())
    expect(second.result.current.drafts[0]?.id).toBe(lead.id)
  })
})
