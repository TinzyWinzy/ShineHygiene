import type { CarQuoteParams, CarSize } from '../../types'

interface Props {
  params: CarQuoteParams
  onChange: (p: Partial<CarQuoteParams>) => void
}

const OPTIONS: { value: CarSize; label: string; price: string; desc: string }[] = [
  { value: 'sedan', label: 'Sedan', price: '$35.00', desc: 'Full interior & exterior' },
  { value: 'suv_truck', label: 'SUV / 4×4 Truck', price: '$50.00', desc: 'Full interior & exterior + deep shampoo' },
]

export default function CarQuote({ params, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Vehicle Detailing</h2>
      <p className="text-sm text-gray-500">Full interior and exterior deep cleaning for all vehicle types.</p>

      <div className="grid gap-3">
        {OPTIONS.map(o => (
          <button
            key={o.value}
            onClick={() => onChange({ carSize: o.value })}
            className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
              params.carSize === o.value
              ? 'border-brand bg-brand-light shadow-sm'
              : 'border-gray-200 bg-white hover:border-brand/60'
            }`}
          >
            <div>
              <span className="block font-semibold text-gray-800">{o.label}</span>
              <span className="text-sm text-gray-500">{o.desc}</span>
            </div>
            <span className={`text-lg font-bold ${params.carSize === o.value ? 'text-brand-dark' : 'text-gray-400'}`}>
              {o.price}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
