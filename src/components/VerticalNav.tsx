import type { Vertical } from '../types'

interface Props {
  active: Vertical
  onChange: (v: Vertical) => void
}

const TABS: { key: Vertical; label: string; icon: string }[] = [
  { key: 'commercial', label: 'Commercial', icon: '🏢' },
  { key: 'residential', label: 'Residential', icon: '🏠' },
  { key: 'office', label: 'Office', icon: '💼' },
  { key: 'car', label: 'Cars', icon: '🚗' },
  { key: 'hygienemart', label: 'HygieneMart', icon: '🧴' },
]

export default function VerticalNav({ active, onChange }: Props) {
  return (
    <nav className="flex overflow-x-auto gap-1 bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
      {TABS.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
            active === tab.key
              ? 'border-brand text-brand-dark bg-brand-light'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <span className="text-base">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
