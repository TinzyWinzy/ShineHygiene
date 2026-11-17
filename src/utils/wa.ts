import type { LeadData } from '../types'
import { HYGIENE_MART_CATALOG } from '../types'

const SHINE_PHONE = '263771962330'

function formatLeadParams(data: LeadData): string {
  switch (data.vertical) {
    case 'commercial':
    case 'office':
      return `Floor Area: ${data.params.floorArea} sqm | Frequency: ${data.params.frequency}`
    case 'residential':
      return `Rooms: ${data.params.rooms} | Window Deep Clean: ${data.params.windowDeepClean ? 'Yes' : 'No'}`
    case 'car':
      return `Vehicle: ${data.params.carSize === 'suv_truck' ? 'SUV / 4×4 Truck' : 'Sedan'}`
    case 'hygienemart': {
      const lines = data.params.items.map(i => {
        const cat = HYGIENE_MART_CATALOG.find(c => c.id === i.itemId)
        const name = cat ? cat.name : i.itemId
        const unitPrice = cat ? cat.unitPrice : 0
        return `  • ${name} × ${i.quantity} @ $${unitPrice.toFixed(2)} = $${(unitPrice * i.quantity).toFixed(2)}`
      })
      const total = data.params.items.reduce((sum, i) => {
        const cat = HYGIENE_MART_CATALOG.find(c => c.id === i.itemId)
        return sum + (cat ? cat.unitPrice * i.quantity : 0)
      }, 0)
      return `Items (${data.params.items.reduce((sum, i) => sum + i.quantity, 0)} units):\n${lines.join('\n')}\nOrder Total: $${total.toFixed(2)}`
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
