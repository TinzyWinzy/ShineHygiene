import { useMemo } from 'react'
import type { HygieneMartQuoteParams } from '../../types'
import { HYGIENE_MART_CATALOG } from '../../types'

interface Props {
  params: HygieneMartQuoteParams
  onChange: (p: Partial<HygieneMartQuoteParams>) => void
}

export default function HygieneMartQuote({ params, onChange }: Props) {
  const categories = useMemo(
    () => [...new Set(HYGIENE_MART_CATALOG.map(i => i.category))],
    []
  )

  const cartMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const item of params.items) {
      map.set(item.itemId, item.quantity)
    }
    return map
  }, [params.items])

  const updateItem = (itemId: string, qty: number) => {
    const updated = [...params.items.filter(i => i.itemId !== itemId)]
    if (qty > 0) {
      updated.push({ itemId, quantity: qty })
    }
    onChange({ items: updated })
  }

  const totalQty = useMemo(() => params.items.reduce((s, i) => s + i.quantity, 0), [params.items])
  const qualifiesForDiscount = totalQty >= 10

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">HygieneMart — Wholesale Catalog</h2>
      <p className="text-sm text-gray-500">Browse our proprietary line of detergents, dispensers, and equipment.</p>

      {totalQty > 0 && (
        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${qualifiesForDiscount ? 'bg-brand-light text-brand-dark' : 'bg-gray-100 text-gray-600'}`}>
          {totalQty} unit(s) selected &middot;
          {qualifiesForDiscount
            ? ' 5% bulk discount applied!'
            : ` ${10 - totalQty} more unit(s) for 5% bulk discount`}
        </div>
      )}

      {categories.map(cat => (
        <div key={cat}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{cat}</h3>
          <div className="space-y-2">
            {HYGIENE_MART_CATALOG.filter(i => i.category === cat).map(item => {
              const qty = cartMap.get(item.id) ?? 0
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white"
                >
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-gray-800 truncate">{item.name}</span>
                    <span className="text-xs text-gray-400">${item.unitPrice.toFixed(2)} / {item.unit}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <button
                      onClick={() => updateItem(item.id, Math.max(0, qty - 1))}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold text-sm">{qty}</span>
                    <button
                      onClick={() => updateItem(item.id, qty + 1)}
                      className="w-8 h-8 rounded-full border border-brand/40 flex items-center justify-center text-brand hover:bg-brand-light transition-colors text-lg leading-none"
                    >
                      +
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
