import { useCallback, useEffect, useState } from 'react'
import type { LeadData, LeadDraft } from '../types'
import { reviveLeadDraft } from '../domain/quoteState'

const STORAGE_KEY = 'shine_lead_drafts'
const LEGACY_KEY = 'shine_offline_queue'

function readRaw(key: string): unknown[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function readDrafts(): LeadDraft[] {
  const current = readRaw(STORAGE_KEY)
    .map(reviveLeadDraft)
    .filter((d): d is LeadDraft => d !== null)
  if (current.length > 0) return current

  // Migrate the old offline-queue shape without discarding saved leads.
  return readRaw(LEGACY_KEY)
    .map(reviveLeadDraft)
    .filter((d): d is LeadDraft => d !== null)
}

function persist(drafts: LeadDraft[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
    return true
  } catch {
    return false
  }
}

/**
 * Local draft store. A draft is saved before any network call, marked
 * submitted only after the API confirms it, and handed off only when the
 * customer opens WhatsApp. Nothing is deleted automatically.
 */
export function useLeadDrafts() {
  const [drafts, setDrafts] = useState<LeadDraft[]>(readDrafts)
  const [storageError, setStorageError] = useState(false)

  useEffect(() => {
    setStorageError(!persist(drafts))
  }, [drafts])

  const saveDraft = useCallback((data: LeadData) => {
    const draft: LeadDraft = {
      id: data.id,
      data,
      savedAt: new Date().toISOString(),
      status: 'pending',
    }
    setDrafts(prev => {
      const withoutExisting = prev.filter(existing => existing.id !== draft.id)
      return [draft, ...withoutExisting]
    })
    return draft
  }, [])

  const markSubmitted = useCallback((id: string, reference: string) => {
    setDrafts(prev =>
      prev.map(draft =>
        draft.id === id
          ? {
              ...draft,
              status: 'submitted',
              serverReference: reference,
              submittedAt: new Date().toISOString(),
            }
          : draft,
      ),
    )
  }, [])

  const markHandedOff = useCallback((id: string) => {
    setDrafts(prev =>
      prev.map(draft =>
        draft.id === id && draft.status !== 'handed_off'
          ? { ...draft, status: 'handed_off', handedOffAt: new Date().toISOString() }
          : draft,
      ),
    )
  }, [])

  const removeDraft = useCallback((id: string) => {
    setDrafts(prev => prev.filter(draft => draft.id !== id))
  }, [])

  const clearHandedOff = useCallback(() => {
    setDrafts(prev => prev.filter(draft => draft.status !== 'handed_off'))
  }, [])

  return { drafts, saveDraft, markSubmitted, markHandedOff, removeDraft, clearHandedOff, storageError }
}
