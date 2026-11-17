import type {
  BreakdownLine,
  CarQuoteParams,
  CommercialQuoteParams,
  DraftStatus,
  Frequency,
  HygieneMartCartItem,
  HygieneMartQuoteParams,
  LeadBase,
  LeadData,
  LeadDraft,
  OfficeQuoteParams,
  QuoteResult,
  QuoteState,
  ResidentialQuoteParams,
  Vertical,
} from '../types'
import {
  calculateCar,
  calculateCommercial,
  calculateHygieneMart,
  calculateOffice,
  calculateResidential,
} from '../utils/pricing'

export const VERTICALS = [
  'commercial',
  'residential',
  'office',
  'car',
  'hygienemart',
] as const satisfies readonly Vertical[]

export function isVertical(value: unknown): value is Vertical {
  return typeof value === 'string' && (VERTICALS as readonly string[]).includes(value)
}

export function defaultQuoteState(vertical: Vertical): QuoteState {
  switch (vertical) {
    case 'commercial':
      return { vertical, params: { floorArea: 100, frequency: 'weekly' } }
    case 'residential':
      return { vertical, params: { rooms: 3, windowDeepClean: false } }
    case 'office':
      return { vertical, params: { floorArea: 50, frequency: 'weekly' } }
    case 'car':
      return { vertical, params: { carSize: 'sedan' } }
    case 'hygienemart':
      return {
        vertical,
        params: {
          items: [
            { itemId: 'det-5l', quantity: 2 },
            { itemId: 'san-5l', quantity: 1 },
            { itemId: 'glove-box', quantity: 1 },
          ],
        },
      }
  }
}

export type QuoteAction =
  | { type: 'setVertical'; vertical: Vertical }
  | { type: 'reset' }
  | { type: 'updateCommercial'; patch: Partial<CommercialQuoteParams> }
  | { type: 'updateResidential'; patch: Partial<ResidentialQuoteParams> }
  | { type: 'updateOffice'; patch: Partial<OfficeQuoteParams> }
  | { type: 'updateCar'; patch: Partial<CarQuoteParams> }
  | { type: 'updateHygieneMart'; patch: Partial<HygieneMartQuoteParams> }

export function quoteReducer(state: QuoteState, action: QuoteAction): QuoteState {
  switch (action.type) {
    case 'setVertical':
      return defaultQuoteState(action.vertical)
    case 'reset':
      return defaultQuoteState(state.vertical)
    case 'updateCommercial':
      return state.vertical === 'commercial'
        ? { vertical: 'commercial', params: { ...state.params, ...action.patch } }
        : state
    case 'updateResidential':
      return state.vertical === 'residential'
        ? { vertical: 'residential', params: { ...state.params, ...action.patch } }
        : state
    case 'updateOffice':
      return state.vertical === 'office'
        ? { vertical: 'office', params: { ...state.params, ...action.patch } }
        : state
    case 'updateCar':
      return state.vertical === 'car'
        ? { vertical: 'car', params: { ...state.params, ...action.patch } }
        : state
    case 'updateHygieneMart':
      return state.vertical === 'hygienemart'
        ? { vertical: 'hygienemart', params: { ...state.params, ...action.patch } }
        : state
  }
}

export function calculateQuote(state: QuoteState): QuoteResult {
  switch (state.vertical) {
    case 'commercial':
      return calculateCommercial(state.params)
    case 'residential':
      return calculateResidential(state.params)
    case 'office':
      return calculateOffice(state.params)
    case 'car':
      return calculateCar(state.params)
    case 'hygienemart':
      return state.params.items.length === 0
        ? { subtotal: 0, discount: 0, total: 0, breakdown: [] }
        : calculateHygieneMart(state.params)
  }
}

export function createLead(
  state: QuoteState,
  base: Omit<LeadBase, 'quote'>,
  quote: QuoteResult,
): LeadData {
  switch (state.vertical) {
    case 'commercial':
      return { ...base, vertical: 'commercial', params: state.params, quote }
    case 'residential':
      return { ...base, vertical: 'residential', params: state.params, quote }
    case 'office':
      return { ...base, vertical: 'office', params: state.params, quote }
    case 'car':
      return { ...base, vertical: 'car', params: state.params, quote }
    case 'hygienemart':
      return { ...base, vertical: 'hygienemart', params: state.params, quote }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

const FREQUENCIES: readonly Frequency[] = ['one_off', 'daily', 'weekly', 'biweekly', 'monthly']

function isFrequency(value: unknown): value is Frequency {
  return typeof value === 'string' && (FREQUENCIES as readonly string[]).includes(value)
}

export function reviveQuoteState(vertical: Vertical, params: unknown): QuoteState | null {
  if (!isRecord(params)) return null

  switch (vertical) {
    case 'commercial':
    case 'office': {
      const floorArea = params.floorArea
      const frequency = params.frequency
      if (typeof floorArea !== 'number' || !Number.isFinite(floorArea) || !isFrequency(frequency)) return null
      return vertical === 'commercial'
        ? { vertical: 'commercial', params: { floorArea, frequency } }
        : { vertical: 'office', params: { floorArea, frequency } }
    }
    case 'residential': {
      const rooms = params.rooms
      const windowDeepClean = params.windowDeepClean
      if (typeof rooms !== 'number' || !Number.isFinite(rooms) || typeof windowDeepClean !== 'boolean') return null
      return { vertical: 'residential', params: { rooms, windowDeepClean } }
    }
    case 'car': {
      const carSize = params.carSize
      if (carSize !== 'sedan' && carSize !== 'suv_truck') return null
      return { vertical: 'car', params: { carSize } }
    }
    case 'hygienemart': {
      if (!Array.isArray(params.items)) return null
      const items: HygieneMartCartItem[] = []
      for (const raw of params.items) {
        if (!isRecord(raw) || typeof raw.itemId !== 'string') return null
        const quantity = raw.quantity
        if (typeof quantity !== 'number' || !Number.isFinite(quantity) || quantity < 1) return null
        items.push({ itemId: raw.itemId, quantity: Math.floor(quantity) })
      }
      return { vertical: 'hygienemart', params: { items } }
    }
  }
}

function reviveQuote(value: unknown): QuoteResult | null {
  if (!isRecord(value)) return null
  const { subtotal, discount, total, breakdown } = value
  if (typeof subtotal !== 'number' || typeof discount !== 'number' || typeof total !== 'number') return null
  if (!Array.isArray(breakdown)) return null

  const lines: BreakdownLine[] = []
  for (const line of breakdown) {
    if (!isRecord(line) || typeof line.label !== 'string' || typeof line.amount !== 'number') return null
    lines.push({ label: line.label, amount: line.amount })
  }

  return { subtotal, discount, total, breakdown: lines }
}

/**
 * Validates a draft read from localStorage. Legacy entries (queuedAt/retryCount)
 * are migrated in place so no saved lead is discarded.
 */
export function reviveLeadDraft(raw: unknown): LeadDraft | null {
  if (!isRecord(raw)) return null
  const data = raw.data
  if (!isRecord(data)) return null

  const vertical = data.vertical
  if (!isVertical(vertical)) return null
  if (typeof data.id !== 'string' || typeof data.name !== 'string' || typeof data.phone !== 'string') return null

  const state = reviveQuoteState(vertical, data.params)
  if (!state) return null
  const quote = reviveQuote(data.quote)
  if (!quote) return null

  const savedAt =
    typeof raw.savedAt === 'string'
      ? raw.savedAt
      : typeof raw.queuedAt === 'string'
        ? raw.queuedAt
        : new Date().toISOString()

  const status: DraftStatus =
    raw.status === 'handed_off' ? 'handed_off' : raw.status === 'submitted' ? 'submitted' : 'pending'

  const lead = createLead(
    state,
    {
      id: data.id,
      name: data.name,
      phone: data.phone,
      preferredDate: typeof data.preferredDate === 'string' ? data.preferredDate : undefined,
      preferredTime: typeof data.preferredTime === 'string' ? data.preferredTime : undefined,
      createdAt: typeof data.createdAt === 'string' ? data.createdAt : savedAt,
    },
    quote,
  )

  return {
    id: typeof raw.id === 'string' ? raw.id : lead.id,
    data: lead,
    savedAt,
    status,
    serverReference: typeof raw.serverReference === 'string' ? raw.serverReference : undefined,
    submittedAt: typeof raw.submittedAt === 'string' ? raw.submittedAt : undefined,
    handedOffAt: typeof raw.handedOffAt === 'string' ? raw.handedOffAt : undefined,
  }
}
