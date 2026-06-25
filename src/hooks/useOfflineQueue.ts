import { useState, useCallback, useEffect } from 'react'
import type { LeadData, QueuedLead } from '../types'
import { useOnlineStatus } from './useOnlineStatus'

const STORAGE_KEY = 'shine_offline_queue'

function readQueue(): QueuedLead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeQueue(queue: QueuedLead[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
  } catch {
    // Storage full — silently fail
  }
}

function sendLead(data: LeadData): Promise<Response> {
  return fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function useOfflineQueue() {
  const isOnline = useOnlineStatus()
  const [queue, setQueue] = useState<QueuedLead[]>(readQueue)
  const [flushing, setFlushing] = useState(false)

  const enqueue = useCallback((data: LeadData) => {
    const entry: QueuedLead = {
      id: crypto.randomUUID(),
      data,
      queuedAt: new Date().toISOString(),
      retryCount: 0,
    }
    const updated = [...readQueue(), entry]
    writeQueue(updated)
    setQueue(updated)
  }, [])

  const flush = useCallback(async () => {
    const current = readQueue()
    if (current.length === 0) return

    setFlushing(true)
    const remaining: QueuedLead[] = []

    for (const entry of current) {
      try {
        await sendLead(entry.data)
      } catch {
        remaining.push({ ...entry, retryCount: entry.retryCount + 1 })
      }
    }

    writeQueue(remaining)
    setQueue(remaining)
    setFlushing(false)
  }, [])

  useEffect(() => {
    if (isOnline && queue.length > 0) {
      flush()
    }
  }, [isOnline, queue.length, flush])

  const clearQueue = useCallback(() => {
    writeQueue([])
    setQueue([])
  }, [])

  return { queue, enqueue, flush, flushing, clearQueue }
}
