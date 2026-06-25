import { motion } from 'motion/react'
import type { ResidentialQuoteParams } from '../../types'

interface Props {
  params: ResidentialQuoteParams
  onChange: (p: Partial<ResidentialQuoteParams>) => void
}

export default function ResidentialQuote({ params, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Residential Deep Cleaning</h2>
        <p className="text-sm text-gray-400 mt-0.5">Houses, apartments, and townhouses — per-room pricing.</p>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <label className="text-sm font-medium text-gray-700">Number of Bedrooms</label>
          <span className="text-sm text-brand-dark font-bold tabular-nums">{params.rooms}</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={params.rooms}
          onChange={e => onChange({ rooms: Number(e.target.value) })}
          className="w-full accent-brand"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1 room</span>
          <span>10 rooms</span>
        </div>
      </div>

      <motion.label
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 hover:border-brand/40 hover:shadow-sm cursor-pointer transition-all"
      >
        <div className="relative">
          <input
            type="checkbox"
            checked={params.windowDeepClean}
            onChange={e => onChange({ windowDeepClean: e.target.checked })}
            className="peer sr-only"
          />
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            params.windowDeepClean ? 'bg-brand border-brand' : 'border-gray-300 bg-white'
          }`}>
            {params.windowDeepClean && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            )}
          </div>
        </div>
        <div className="flex-1">
          <span className="font-medium text-gray-800">Window Deep Cleaning</span>
          <span className="block text-sm text-gray-400">+$25.00 — interior & exterior window service</span>
        </div>
      </motion.label>
    </motion.div>
  )
}
