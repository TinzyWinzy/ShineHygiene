import { useState, useCallback, useMemo } from 'react'
import type {
  Vertical,
  CommercialQuoteParams,
  OfficeQuoteParams,
  ResidentialQuoteParams,
  CarQuoteParams,
  HygieneMartQuoteParams,
  HygieneMartCartItem,
  QuoteResult,
  Frequency,
  CarSize,
} from '../types'
import {
  calculateCommercial,
  calculateOffice,
  calculateResidential,
  calculateCar,
  calculateHygieneMart,
} from '../utils/pricing'

type QuoteParams =
  | CommercialQuoteParams
  | OfficeQuoteParams
  | ResidentialQuoteParams
  | CarQuoteParams
  | HygieneMartQuoteParams

const EMPTY: QuoteResult = { subtotal: 0, discount: 0, total: 0, breakdown: [] }

export function useQuoteEngine(vertical: Vertical) {
  const [params, setParams] = useState<QuoteParams>(getDefaultParams(vertical))

  const updateParams = useCallback((patch: Partial<QuoteParams>) => {
    setParams(prev => ({ ...prev, ...patch } as QuoteParams))
  }, [])

  const quote = useMemo(() => {
    switch (vertical) {
      case 'commercial':
        return calculateCommercial(params as CommercialQuoteParams)
      case 'office':
        return calculateOffice(params as OfficeQuoteParams)
      case 'residential':
        return calculateResidential(params as ResidentialQuoteParams)
      case 'car':
        return calculateCar(params as CarQuoteParams)
      case 'hygienemart': {
        const hp = params as HygieneMartQuoteParams
        if (hp.items.length === 0) return EMPTY
        return calculateHygieneMart(hp)
      }
    }
  }, [vertical, params])

  const reset = useCallback(() => {
    setParams(getDefaultParams(vertical))
  }, [vertical])

  return { params, updateParams, quote, reset }
}

function getDefaultParams(vertical: Vertical): QuoteParams {
  switch (vertical) {
    case 'commercial':
      return { floorArea: 100, frequency: 'weekly' as Frequency }
    case 'office':
      return { floorArea: 50, frequency: 'weekly' as Frequency }
    case 'residential':
      return { rooms: 3, windowDeepClean: false }
    case 'car':
      return { carSize: 'sedan' as CarSize }
    case 'hygienemart':
      return {
        items: [
          { itemId: 'det-5l', quantity: 2 },
          { itemId: 'san-5l', quantity: 1 },
          { itemId: 'glove-box', quantity: 1 },
        ] as HygieneMartCartItem[],
      }
  }
}
