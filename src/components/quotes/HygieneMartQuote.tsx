import { useMemo } from 'react'
import { motion } from 'motion/react'
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-800">HygieneMart</h2>
        <p className="text-sm text-gray-400 mt-0.5">Wholesale cleaning supplies and equipment.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={totalQty > 0 ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
        className={`overflow-hidden px-4 py-2.5 rounded-xl text-sm font-medium ${
          qualifiesForDiscount ? 'bg-gradient-to-r from-brand-light to-blue-50 text-brand-dark border border-brand/20' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {qualifiesForDiscount
          ? `5% bulk discount applied — ${totalQty} units selected`
          : `${totalQty} unit(s) selected · ${10 - totalQty} more for 5% bulk discount`
        }
      </motion.div>

      {categories.map((cat, ci) => (
        <div key={cat}>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">{cat}</h3>
          <div className="space-y-2">
            {HYGIENE_MART_CATALOG.filter(i => i.category === cat).map((item, ii) => {
              const qty = cartMap.get(item.id) ?? 0
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: ci * 0.05 + ii * 0.03 }}
                  whileHover={{ y: -1 }}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-white hover:border-brand/30 hover:shadow-sm transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-gray-800 truncate">{item.name}</span>
                    <span className="text-xs text-gray-400">${item.unitPrice.toFixed(2)} / {item.unit}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateItem(item.id, Math.max(0, qty - 1))}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none"
                    >
                      &minus;
                    </motion.button>
                    <motion.span
                      key={qty}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      className="w-8 text-center font-semibold text-sm tabular-nums"
                    >
                      {qty}
                    </motion.span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateItem(item.id, qty + 1)}
                      className="w-8 h-8 rounded-full border border-brand/30 flex items-center justify-center text-brand hover:bg-brand-light transition-colors text-lg leading-none"
                    >
                      +
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      ))}
    </motion.div>
  )
}
