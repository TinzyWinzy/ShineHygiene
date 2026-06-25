import type { ResidentialQuoteParams } from '../../types'

interface Props {
  params: ResidentialQuoteParams
  onChange: (p: Partial<ResidentialQuoteParams>) => void
}

export default function ResidentialQuote({ params, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Residential Deep Cleaning</h2>
      <p className="text-sm text-gray-500">Houses, apartments, and townhouses — per-room pricing with optional add-ons.</p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Bedrooms:           <span className="text-brand-dark font-bold">{params.rooms}</span>
        </label>
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

      <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand/60 cursor-pointer transition-all">
        <input
          type="checkbox"
          checked={params.windowDeepClean}
          onChange={e => onChange({ windowDeepClean: e.target.checked })}
          className="w-5 h-5 rounded accent-brand"
        />
        <div>
          <span className="font-medium text-gray-800">Add Window Deep Cleaning</span>
          <span className="block text-sm text-gray-500">+$25.00 — interior & exterior window service</span>
        </div>
      </label>
    </div>
  )
}
