import type { QuoteResult } from '../types'

interface Props {
  quote: QuoteResult
}

export default function QuoteSummary({ quote }: Props) {
  if (quote.total === 0) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-brand px-5 py-3">
        <h3 className="text-white font-semibold">Quote Summary</h3>
      </div>

      <div className="p-5 space-y-3">
        {quote.breakdown.map((b, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className={b.amount < 0 ? 'text-red-600' : 'text-gray-600'}>{b.label}</span>
            <span className={`font-medium ${b.amount < 0 ? 'text-red-600' : 'text-gray-800'}`}>
              {b.amount < 0 ? `-$${Math.abs(b.amount).toFixed(2)}` : `$${b.amount.toFixed(2)}`}
            </span>
          </div>
        ))}

        {quote.discount > 0 && (
          <div className="flex justify-between text-sm text-brand font-medium pt-2 border-t border-gray-100">
            <span>You save</span>
            <span>-${quote.discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t-2 border-gray-200">
          <span>Estimated Total</span>
          <span>${quote.total.toFixed(2)} USD</span>
        </div>

        <p className="text-xs text-gray-400 pt-2">
          Prices are estimates. Final quote confirmed upon inspection. Valid for 30 days.
        </p>
      </div>
    </div>
  )
}
