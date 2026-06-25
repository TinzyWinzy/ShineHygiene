import { motion } from 'motion/react'
import type { CarQuoteParams, CarSize } from '../../types'

interface Props {
  params: CarQuoteParams
  onChange: (p: Partial<CarQuoteParams>) => void
}

const OPTIONS: { value: CarSize; label: string; price: number; icon: string; features: string[] }[] = [
  { value: 'sedan', label: 'Sedan', price: 35, icon: '🚗', features: ['Exterior wash & wax', 'Interior vacuum', 'Dashboard polish', 'Window streak-free'] },
  { value: 'suv_truck', label: 'SUV / 4×4 Truck', price: 50, icon: '🚙', features: ['Deep shampoo seats', 'Exterior wash & wax', 'Full interior detail', 'Tire & rim shine'] },
]

export default function CarQuote({ params, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Vehicle Detailing</h2>
        <p className="text-sm text-gray-400 mt-0.5">Complete interior & exterior deep cleaning service.</p>
      </div>

      <div className="grid gap-3">
        {OPTIONS.map((o, i) => (
          <motion.button
            key={o.value}
            onClick={() => onChange({ carSize: o.value })}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
              params.carSize === o.value
                ? 'border-brand bg-gradient-to-br from-brand-light to-white shadow-lg shadow-brand/10'
                : 'border-gray-200 bg-white hover:border-brand/30 hover:shadow-md'
            }`}
          >
            <span className="text-2xl mt-0.5">{o.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-gray-800">{o.label}</span>
                <span className={`text-lg font-bold tabular-nums ${params.carSize === o.value ? 'text-brand' : 'text-gray-400'}`}>
                  ${o.price}
                </span>
              </div>
              <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5">
                {o.features.map(f => (
                  <li key={f} className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-brand/60 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {params.carSize === o.value && (
              <motion.span
                layoutId="carCheck"
                className="w-6 h-6 rounded-full bg-brand flex items-center justify-center shrink-0 mt-0.5"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
