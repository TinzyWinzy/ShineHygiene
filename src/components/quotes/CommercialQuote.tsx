import { motion } from 'motion/react'
import type { CommercialQuoteParams, Frequency } from '../../types'

interface Props {
  params: CommercialQuoteParams
  onChange: (p: Partial<CommercialQuoteParams>) => void
}

const FREQUENCIES: { value: Frequency; label: string; desc: string }[] = [
  { value: 'one_off', label: 'One-off', desc: 'Single clean' },
  { value: 'daily', label: 'Daily', desc: '15% off' },
  { value: 'weekly', label: 'Weekly', desc: '10% off' },
  { value: 'biweekly', label: 'Bi-weekly', desc: '5% off' },
  { value: 'monthly', label: 'Monthly', desc: 'Standard rate' },
]

export default function CommercialQuote({ params, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Commercial Deep Cleaning</h2>
        <p className="text-sm text-gray-500 mt-0.5">For factories, warehouses, showrooms and large commercial premises.</p>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <label htmlFor="commercial-floor-area" className="text-sm font-medium text-gray-700">Floor Area</label>
          <span className="text-sm text-brand-dark font-bold tabular-nums">{params.floorArea} sqm</span>
        </div>
        <input
          id="commercial-floor-area"
          type="range"
          min={20}
          max={5000}
          step={10}
          value={params.floorArea}
          onChange={e => onChange({ floorArea: Number(e.target.value) })}
          className="w-full accent-brand-ink"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>20 sqm</span>
          <span>5,000 sqm</span>
        </div>
      </div>

      <div role="group" aria-labelledby="commercial-frequency">
        <label id="commercial-frequency" className="block text-sm font-medium text-gray-700 mb-2.5">Cleaning Frequency</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {FREQUENCIES.map(f => (
            <motion.button
              key={f.value}
              type="button"
              onClick={() => onChange({ frequency: f.value })}
              aria-pressed={params.frequency === f.value}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-3 py-2.5 text-sm rounded-xl border transition-all ${
                params.frequency === f.value
                  ? 'bg-brand-ink text-white border-brand shadow-md shadow-brand/20'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand/40 hover:shadow-sm'
              }`}
            >
              <span className="block font-medium">{f.label}</span>
              <span className={`block text-[10px] mt-0.5 ${params.frequency === f.value ? 'text-white' : 'text-gray-500'}`}>
                {f.desc}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
