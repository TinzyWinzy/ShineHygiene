/**
 * Server-side lead validation and canonical pricing.
 *
 * This module is intentionally self-contained: Vercel deploys `api/` as plain
 * Node ESM without a bundler, so relative imports must not pull in files whose
 * extensionless imports Node cannot resolve. Keep the formulas in sync with
 * `src/utils/pricing.ts`; parity tests cover both implementations.
 */

export const MAX_LEAD_BODY_BYTES = 16 * 1024
const MAX_TOTAL_CENTS = 10_000_000

export type ServerVertical = 'commercial' | 'residential' | 'office' | 'car' | 'hygienemart'

interface BreakdownLine {
  label: string
  amount: number
}

export interface ServerQuoteResult {
  subtotal: number
  discount: number
  total: number
  breakdown: BreakdownLine[]
}

type Frequency = 'one_off' | 'daily' | 'weekly' | 'biweekly' | 'monthly'

export type ServerQuoteState =
  | { vertical: 'commercial'; params: { floorArea: number; frequency: Frequency } }
  | { vertical: 'office'; params: { floorArea: number; frequency: Frequency } }
  | { vertical: 'residential'; params: { rooms: number; windowDeepClean: boolean } }
  | { vertical: 'car'; params: { carSize: 'sedan' | 'suv_truck' } }
  | { vertical: 'hygienemart'; params: { items: Array<{ itemId: string; quantity: number }> } }

export interface ValidatedLead {
  clientRequestId: string
  name: string
  phone: string
  preferredDate: string | null
  preferredTime: string | null
  state: ServerQuoteState
  quote: ServerQuoteResult
  totalCents: number
}

export type LeadValidation =
  | { ok: true; lead: ValidatedLead }
  | { ok: false; errors: string[] }

const FREQUENCIES: readonly Frequency[] = ['one_off', 'daily', 'weekly', 'biweekly', 'monthly']
const VERTICALS: readonly ServerVertical[] = ['commercial', 'residential', 'office', 'car', 'hygienemart']

const CATALOG = [
  { id: 'det-5l', name: 'Multi-Surface Detergent (5L)', unitPrice: 18.0 },
  { id: 'det-20l', name: 'Industrial Degreaser (20L)', unitPrice: 45.0 },
  { id: 'san-5l', name: 'Hospital-Grade Sanitiser (5L)', unitPrice: 22.0 },
  { id: 'disp-1', name: 'Wall-Mounted Soap Dispenser', unitPrice: 12.5 },
  { id: 'disp-2', name: 'Touchless Hand Sanitiser Stand', unitPrice: 35.0 },
  { id: 'mop-pro', name: 'Professional Microfibre Mop Set', unitPrice: 28.0 },
  { id: 'glove-box', name: 'Nitrile Gloves (Box of 100)', unitPrice: 9.5 },
  { id: 'mask-box', name: 'Surgical Masks (Box of 50)', unitPrice: 6.0 },
] as const

const FREQUENCY_MULTIPLIER: Record<Frequency, number> = {
  one_off: 1.0,
  daily: 0.85,
  weekly: 0.9,
  biweekly: 0.95,
  monthly: 1.0,
}

const FREQUENCY_LABEL: Record<Frequency, string> = {
  one_off: 'One-off',
  daily: 'Daily (×0.85)',
  weekly: 'Weekly (×0.90)',
  biweekly: 'Bi-weekly (×0.95)',
  monthly: 'Monthly (×1.0)',
}

function round(value: number): number {
  return Math.round(value * 100) / 100
}

function calculateAreaQuote(floorArea: number, frequency: Frequency): ServerQuoteResult {
  const base = floorArea * 1.5
  const multiplier = FREQUENCY_MULTIPLIER[frequency]
  const subtotal = base * multiplier
  const discount = round(base - subtotal)
  return {
    subtotal: round(subtotal),
    discount: discount > 0 ? discount : 0,
    total: round(subtotal),
    breakdown: [
      { label: `${floorArea} sqm @ $1.50/sqm`, amount: round(base) },
      { label: FREQUENCY_LABEL[frequency], amount: -discount },
    ],
  }
}

function calculateResidential(rooms: number, windowDeepClean: boolean): ServerQuoteResult {
  const breakdown: BreakdownLine[] = [{ label: `${rooms} room(s) @ $40.00/room`, amount: rooms * 40 }]
  if (windowDeepClean) breakdown.push({ label: 'Window Deep Clean add-on', amount: 25 })
  const total = breakdown.reduce((sum, line) => sum + line.amount, 0)
  return { subtotal: round(total), discount: 0, total: round(total), breakdown }
}

function calculateCar(carSize: 'sedan' | 'suv_truck'): ServerQuoteResult {
  const price = carSize === 'suv_truck' ? 50 : 35
  const label = carSize === 'suv_truck' ? 'SUV / 4×4 Truck' : 'Sedan'
  return {
    subtotal: price,
    discount: 0,
    total: price,
    breakdown: [
      {
        label: `${label} — ${carSize === 'suv_truck' ? 'Full interior & exterior' : 'Standard detail'}`,
        amount: price,
      },
    ],
  }
}

function calculateHygieneMart(items: Array<{ itemId: string; quantity: number }>): ServerQuoteResult {
  const breakdown: BreakdownLine[] = []
  let subtotal = 0
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0)

  for (const item of items) {
    const catalog = CATALOG.find(candidate => candidate.id === item.itemId)
    if (!catalog) continue
    const lineTotal = catalog.unitPrice * item.quantity
    subtotal += lineTotal
    breakdown.push({ label: `${catalog.name} × ${item.quantity}`, amount: lineTotal })
  }

  const discount = totalQty >= 10 ? round(subtotal * 0.05) : 0
  const total = round(subtotal - discount)
  if (discount > 0) breakdown.push({ label: 'Bulk discount (5% — 10+ units)', amount: -discount })

  return { subtotal: round(subtotal), discount, total: round(total), breakdown }
}

export function calculateServerQuote(state: ServerQuoteState): ServerQuoteResult {
  switch (state.vertical) {
    case 'commercial':
    case 'office':
      return calculateAreaQuote(state.params.floorArea, state.params.frequency)
    case 'residential':
      return calculateResidential(state.params.rooms, state.params.windowDeepClean)
    case 'car':
      return calculateCar(state.params.carSize)
    case 'hygienemart':
      return calculateHygieneMart(state.params.items)
  }
}

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

function reviveState(vertical: ServerVertical, params: unknown): ServerQuoteState | null {
  if (!isRecord(params)) return null

  switch (vertical) {
    case 'commercial':
    case 'office': {
      const floorArea = params.floorArea
      const frequency = params.frequency
      if (typeof floorArea !== 'number' || !Number.isFinite(floorArea)) return null
      if (typeof frequency !== 'string' || !FREQUENCIES.includes(frequency as Frequency)) return null
      return vertical === 'commercial'
        ? { vertical: 'commercial', params: { floorArea, frequency: frequency as Frequency } }
        : { vertical: 'office', params: { floorArea, frequency: frequency as Frequency } }
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
      const items: Array<{ itemId: string; quantity: number }> = []
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

function stateWithinBounds(state: ServerQuoteState): boolean {
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
        if (!CATALOG.some(candidate => candidate.id === item.itemId)) return false
        if (seen.has(item.itemId)) return false
        seen.add(item.itemId)
        if (item.quantity < 1 || item.quantity > 999) return false
      }
      return true
    }
  }
}

/**
 * Validates an untrusted lead body and recomputes the quote from params.
 * The client's own total is never read.
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
  if (typeof vertical !== 'string' || !VERTICALS.includes(vertical as ServerVertical)) {
    errors.push('vertical')
  }

  if (errors.length > 0 || !id || !name || !phone || date === undefined || time === undefined) {
    return { ok: false, errors }
  }

  const state = reviveState(vertical as ServerVertical, params)
  if (!state || !stateWithinBounds(state)) {
    return { ok: false, errors: ['params'] }
  }

  const quote = calculateServerQuote(state)
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
