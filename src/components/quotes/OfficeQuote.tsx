import type { OfficeQuoteParams, Frequency } from '../../types'

interface Props {
  params: OfficeQuoteParams
  onChange: (p: Partial<OfficeQuoteParams>) => void
}

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'one_off', label: 'One-off' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
]

export default function OfficeQuote({ params, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Office Cleaning</h2>
      <p className="text-sm text-gray-500">For corporate offices, banks, showrooms, and coworking spaces.</p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Office Area (sqm):           <span className="text-brand-dark font-bold">{params.floorArea}</span>
        </label>
        <input
          type="range"
          min={10}
          max={2000}
          step={5}
          value={params.floorArea}
          onChange={e => onChange({ floorArea: Number(e.target.value) })}
          className="w-full accent-brand"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>10 sqm</span>
          <span>2000 sqm</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cleaning Frequency</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {FREQUENCIES.map(f => (
            <button
              key={f.value}
              onClick={() => onChange({ frequency: f.value })}
              className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                params.frequency === f.value
                  ? 'bg-brand text-white border-brand shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
