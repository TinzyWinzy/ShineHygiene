import { motion } from 'motion/react'
import type { QuoteResult } from '../types'
import AnimatedCounter from './AnimatedCounter'

interface Props {
  quote: QuoteResult
}

export default function QuoteSummary({ quote }: Props) {
  if (quote.total === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-lg shadow-gray-200/50 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-brand to-brand-dark px-5 py-3.5">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Quote Summary
        </h3>
      </div>

      <div className="p-5 space-y-2.5">
        {quote.breakdown.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex justify-between text-sm py-1"
          >
            <span className={b.amount < 0 ? 'text-red-600' : 'text-gray-600'}>{b.label}</span>
            <span className={`font-medium tabular-nums ${b.amount < 0 ? 'text-red-600' : 'text-gray-800'}`}>
              {b.amount < 0 ? `-$${Math.abs(b.amount).toFixed(2)}` : `$${b.amount.toFixed(2)}`}
            </span>
          </motion.div>
        ))}

        {quote.discount > 0 && (
          <div className="flex justify-between text-sm text-emerald-700 font-medium pt-2 border-t border-gray-100">
            <span>You save</span>
            <span>-${quote.discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between items-baseline pt-3 border-t-2 border-gray-200">
          <span className="text-sm font-medium text-gray-600">Estimated Total</span>
          <span className="text-2xl font-bold text-brand-dark tabular-nums">
            $<AnimatedCounter value={quote.total} duration={500} /> USD
          </span>
        </div>

        <p className="text-xs text-gray-400 pt-1.5">
          Prices are estimates. Final quote confirmed upon inspection. Valid for 30 days.
        </p>
      </div>
    </motion.div>
  )
}
