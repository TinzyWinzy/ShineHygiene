import type { LeadData } from '../types'

export interface LeadReceipt {
  reference: string
  totalCents: number
  duplicate: boolean
}

export class LeadApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'LeadApiError'
    this.status = status
  }
}

function messageForStatus(status: number): string {
  if (status === 400) return 'Please check your details and try again.'
  if (status === 413) return 'That request was too large to send.'
  if (status === 429) return 'Too many requests. Please wait a moment and try again.'
  if (status === 503) return 'Our office is temporarily unavailable. Please try again shortly.'
  return 'Our office could not save your request. Please try again.'
}

export async function submitLead(lead: LeadData): Promise<LeadReceipt> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 15_000)

  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      signal: controller.signal,
      body: JSON.stringify({
        clientRequestId: lead.id,
        name: lead.name,
        phone: lead.phone,
        preferredDate: lead.preferredDate ?? '',
        preferredTime: lead.preferredTime ?? '',
        vertical: lead.vertical,
        params: lead.params,
      }),
    })

    if (!response.ok) {
      throw new LeadApiError(messageForStatus(response.status), response.status)
    }

    const body: unknown = await response.json()
    if (
      typeof body !== 'object' ||
      body === null ||
      !('reference' in body) ||
      typeof (body as { reference: unknown }).reference !== 'string'
    ) {
      throw new LeadApiError('Our office sent an unexpected response. Please try again.', 500)
    }

    const receipt = body as { reference: string; totalCents?: unknown; duplicate?: unknown }
    return {
      reference: receipt.reference,
      totalCents: typeof receipt.totalCents === 'number' ? receipt.totalCents : Math.round(lead.quote.total * 100),
      duplicate: receipt.duplicate === true,
    }
  } catch (error) {
    if (error instanceof LeadApiError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new LeadApiError('The request timed out. Your quote is still saved on this device.', 0)
    }
    throw new LeadApiError('You appear to be offline. Your quote is saved on this device.', 0)
  } finally {
    window.clearTimeout(timeout)
  }
}
