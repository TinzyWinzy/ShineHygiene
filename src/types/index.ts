export type Vertical = 'commercial' | 'residential' | 'office' | 'car' | 'hygienemart'

export type CarSize = 'sedan' | 'suv_truck'

export type Frequency = 'one_off' | 'daily' | 'weekly' | 'biweekly' | 'monthly'

export interface CommercialQuoteParams {
  floorArea: number
  frequency: Frequency
}

export interface OfficeQuoteParams {
  floorArea: number
  frequency: Frequency
}

export interface ResidentialQuoteParams {
  rooms: number
  windowDeepClean: boolean
}

export interface CarQuoteParams {
  carSize: CarSize
}

export interface HygieneMartItem {
  id: string
  name: string
  unitPrice: number
  unit: string
  category: string
}

export interface HygieneMartCartItem {
  itemId: string
  quantity: number
}

export interface HygieneMartQuoteParams {
  items: HygieneMartCartItem[]
}

export interface BreakdownLine {
  label: string
  amount: number
}

export interface QuoteResult {
  subtotal: number
  discount: number
  total: number
  breakdown: BreakdownLine[]
}

export type QuoteParams =
  | CommercialQuoteParams
  | OfficeQuoteParams
  | ResidentialQuoteParams
  | CarQuoteParams
  | HygieneMartQuoteParams

/**
 * The single source of truth for the quote screen.
 * Vertical and params are locked together so a component can never receive
 * the previous vertical's params (the former white-screen bug).
 */
export type QuoteState =
  | { vertical: 'commercial'; params: CommercialQuoteParams }
  | { vertical: 'residential'; params: ResidentialQuoteParams }
  | { vertical: 'office'; params: OfficeQuoteParams }
  | { vertical: 'car'; params: CarQuoteParams }
  | { vertical: 'hygienemart'; params: HygieneMartQuoteParams }

export interface LeadBase {
  id: string
  name: string
  phone: string
  quote: QuoteResult
  preferredDate?: string
  preferredTime?: string
  createdAt: string
}

export type LeadData =
  | (LeadBase & { vertical: 'commercial'; params: CommercialQuoteParams })
  | (LeadBase & { vertical: 'residential'; params: ResidentialQuoteParams })
  | (LeadBase & { vertical: 'office'; params: OfficeQuoteParams })
  | (LeadBase & { vertical: 'car'; params: CarQuoteParams })
  | (LeadBase & { vertical: 'hygienemart'; params: HygieneMartQuoteParams })

/**
 * A lead saved on this device. `submitted` means the office API confirmed it;
 * `handed_off` means the customer opened WhatsApp for it.
 */
export type DraftStatus = 'pending' | 'submitted' | 'handed_off'

export interface LeadDraft {
  id: string
  data: LeadData
  savedAt: string
  status: DraftStatus
  serverReference?: string
  submittedAt?: string
  handedOffAt?: string
}

export const HYGIENE_MART_CATALOG: HygieneMartItem[] = [
  { id: 'det-5l', name: 'Multi-Surface Detergent (5L)', unitPrice: 18.00, unit: 'bottle', category: 'Detergents' },
  { id: 'det-20l', name: 'Industrial Degreaser (20L)', unitPrice: 45.00, unit: 'pail', category: 'Detergents' },
  { id: 'san-5l', name: 'Hospital-Grade Sanitiser (5L)', unitPrice: 22.00, unit: 'bottle', category: 'Sanitisers' },
  { id: 'disp-1', name: 'Wall-Mounted Soap Dispenser', unitPrice: 12.50, unit: 'unit', category: 'Dispensers' },
  { id: 'disp-2', name: 'Touchless Hand Sanitiser Stand', unitPrice: 35.00, unit: 'unit', category: 'Dispensers' },
  { id: 'mop-pro', name: 'Professional Microfibre Mop Set', unitPrice: 28.00, unit: 'set', category: 'Equipment' },
  { id: 'glove-box', name: 'Nitrile Gloves (Box of 100)', unitPrice: 9.50, unit: 'box', category: 'PPE' },
  { id: 'mask-box', name: 'Surgical Masks (Box of 50)', unitPrice: 6.00, unit: 'box', category: 'PPE' },
]
