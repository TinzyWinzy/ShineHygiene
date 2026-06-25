import { motion } from 'motion/react'
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
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="flex overflow-x-auto gap-1 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-10 scrollbar-none"
    >
      {TABS.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className="relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors"
        >
          {active === tab.key && (
            <motion.span
              layoutId="activeTab"
              className="absolute inset-0 bg-brand-light rounded-t-lg"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 text-base">{tab.icon}</span>
          <span className={`relative z-10 ${active === tab.key ? 'text-brand-dark font-semibold' : 'text-gray-500'}`}>
            {tab.label}
          </span>
        </button>
      ))}
    </motion.nav>
  )
}
