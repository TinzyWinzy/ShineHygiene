import type {
  CommercialQuoteParams,
  OfficeQuoteParams,
  ResidentialQuoteParams,
  CarQuoteParams,
  HygieneMartQuoteParams,
  QuoteResult,
} from '../types'
import { HYGIENE_MART_CATALOG } from '../types'

const FREQUENCY_MULTIPLIER: Record<string, number> = {
  one_off: 1.0,
  daily: 0.85,
  weekly: 0.90,
  biweekly: 0.95,
  monthly: 1.0,
}

const FREQUENCY_LABEL: Record<string, string> = {
  one_off: 'One-off',
  daily: 'Daily (×0.85)',
  weekly: 'Weekly (×0.90)',
  biweekly: 'Bi-weekly (×0.95)',
  monthly: 'Monthly (×1.0)',
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}

export function calculateCommercial(params: CommercialQuoteParams): QuoteResult {
  const base = params.floorArea * 1.50
  const mult = FREQUENCY_MULTIPLIER[params.frequency] ?? 1.0
  const subtotal = base * mult
  const discount = round(base - subtotal)
  return {
    subtotal: round(subtotal),
    discount: discount > 0 ? discount : 0,
    total: round(subtotal),
    breakdown: [
      { label: `${params.floorArea} sqm @ $1.50/sqm`, amount: round(base) },
      { label: `${FREQUENCY_LABEL[params.frequency]}`, amount: -discount },
    ],
  }
}

export function calculateOffice(params: OfficeQuoteParams): QuoteResult {
  const base = params.floorArea * 1.50
  const mult = FREQUENCY_MULTIPLIER[params.frequency] ?? 1.0
  const subtotal = base * mult
  const discount = round(base - subtotal)
  return {
    subtotal: round(subtotal),
    discount: discount > 0 ? discount : 0,
    total: round(subtotal),
    breakdown: [
      { label: `${params.floorArea} sqm @ $1.50/sqm`, amount: round(base) },
      { label: `${FREQUENCY_LABEL[params.frequency]}`, amount: -discount },
    ],
  }
}

export function calculateResidential(params: ResidentialQuoteParams): QuoteResult {
  const base = params.rooms * 40.00
  const breakdown: { label: string; amount: number }[] = [
    { label: `${params.rooms} room(s) @ $40.00/room`, amount: base },
  ]
  if (params.windowDeepClean) {
    breakdown.push({ label: 'Window Deep Clean add-on', amount: 25.00 })
  }
  const total = breakdown.reduce((sum, line) => sum + line.amount, 0)
  return {
    subtotal: round(total),
    discount: 0,
    total: round(total),
    breakdown,
  }
}

export function calculateCar(params: CarQuoteParams): QuoteResult {
  const price = params.carSize === 'suv_truck' ? 50.00 : 35.00
  const label = params.carSize === 'suv_truck' ? 'SUV / 4×4 Truck' : 'Sedan'
  return {
    subtotal: price,
    discount: 0,
    total: price,
    breakdown: [{ label: `${label} — ${params.carSize === 'suv_truck' ? 'Full interior & exterior' : 'Standard detail'}`, amount: price }],
  }
}

export function calculateHygieneMart(params: HygieneMartQuoteParams): QuoteResult {
  const breakdown: { label: string; amount: number }[] = []
  let subtotal = 0
  const totalQty = params.items.reduce((sum, i) => sum + i.quantity, 0)
  for (const item of params.items) {
    const catalog = HYGIENE_MART_CATALOG.find(c => c.id === item.itemId)
    if (!catalog) continue
    const lineTotal = catalog.unitPrice * item.quantity
    subtotal += lineTotal
    breakdown.push({ label: `${catalog.name} × ${item.quantity}`, amount: lineTotal })
  }
  const discount = totalQty >= 10 ? round(subtotal * 0.05) : 0
  const total = round(subtotal - discount)
  if (discount > 0) {
    breakdown.push({ label: 'Bulk discount (5% — 10+ units)', amount: -discount })
  }
  return {
    subtotal: round(subtotal),
    discount,
    total: round(total),
    breakdown,
  }
}
