import { describe, expect, it } from 'vitest'
import {
  calculateCar,
  calculateCommercial,
  calculateHygieneMart,
  calculateOffice,
  calculateResidential,
} from './pricing'

describe('pricing', () => {
  it('applies the weekly commercial multiplier', () => {
    const quote = calculateCommercial({ floorArea: 100, frequency: 'weekly' })
    expect(quote.total).toBe(135)
    expect(quote.discount).toBe(15)
  })

  it('applies the daily office multiplier', () => {
    const quote = calculateOffice({ floorArea: 50, frequency: 'daily' })
    expect(quote.total).toBe(63.75)
    expect(quote.discount).toBe(11.25)
  })

  it('adds the window deep clean to residential quotes', () => {
    expect(calculateResidential({ rooms: 3, windowDeepClean: false }).total).toBe(120)
    expect(calculateResidential({ rooms: 3, windowDeepClean: true }).total).toBe(145)
  })

  it('prices the two vehicle classes differently', () => {
    expect(calculateCar({ carSize: 'sedan' }).total).toBe(35)
    expect(calculateCar({ carSize: 'suv_truck' }).total).toBe(50)
  })

  it('applies the 5% bulk discount at ten units', () => {
    const quote = calculateHygieneMart({ items: [{ itemId: 'det-5l', quantity: 10 }] })
    expect(quote.subtotal).toBe(180)
    expect(quote.discount).toBe(9)
    expect(quote.total).toBe(171)
  })

  it('ignores unknown catalog items', () => {
    const quote = calculateHygieneMart({ items: [{ itemId: 'missing', quantity: 4 }] })
    expect(quote.total).toBe(0)
    expect(quote.breakdown).toHaveLength(0)
  })
})
