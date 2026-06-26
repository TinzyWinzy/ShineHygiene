import type { LeadData } from '../types'
import { HYGIENE_MART_CATALOG } from '../types'

const SHINE_PHONE = '263771962330'

function formatLeadParams(data: LeadData): string {
  switch (data.vertical) {
    case 'commercial':
    case 'office': {
      const p = data.params as { floorArea: number; frequency: string }
      return `Floor Area: ${p.floorArea} sqm | Frequency: ${p.frequency}`
    }
    case 'residential': {
      const p = data.params as { rooms: number; windowDeepClean: boolean }
      return `Rooms: ${p.rooms} | Window Deep Clean: ${p.windowDeepClean ? 'Yes' : 'No'}`
    }
    case 'car': {
      const p = data.params as { carSize: string }
      return `Vehicle: ${p.carSize === 'suv_truck' ? 'SUV / 4×4 Truck' : 'Sedan'}`
    }
    case 'hygienemart': {
      const p = data.params as { items: { itemId: string; quantity: number }[] }
      const lines = p.items.map(i => {
        const cat = HYGIENE_MART_CATALOG.find(c => c.id === i.itemId)
        const name = cat ? cat.name : i.itemId
        const unitPrice = cat ? cat.unitPrice : 0
        return `  • ${name} × ${i.quantity} @ $${unitPrice.toFixed(2)} = $${(unitPrice * i.quantity).toFixed(2)}`
      })
      const total = p.items.reduce((s, i) => {
        const cat = HYGIENE_MART_CATALOG.find(c => c.id === i.itemId)
        return s + (cat ? cat.unitPrice * i.quantity : 0)
      }, 0)
      return `Items (${p.items.reduce((s, i) => s + i.quantity, 0)} units):\n${lines.join('\n')}\nOrder Total: $${total.toFixed(2)}`
    }
  }
}

export function buildWhatsAppUrl(data: LeadData): string {
  const message = [
    '[NEW BOOKING REQUEST via Web App]',
    '----------------------------------',
    `Customer Name: ${data.name}`,
    `Primary Contact: ${data.phone}`,
    `Selected Service Line: ${data.vertical}`,
    `Job Parameters: ${formatLeadParams(data)}`,
    `Requested Date: ${data.preferredDate ?? 'Not specified'} @ ${data.preferredTime ?? 'Not specified'}`,
    `Calculated Estimated Total: $${data.quote.total} USD`,
    '----------------------------------',
    'Please reply to confirm scheduled availability.',
  ].join('\n')

  return `https://wa.me/${SHINE_PHONE}?text=${encodeURIComponent(message)}`
}
