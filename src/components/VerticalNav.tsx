import { motion } from 'motion/react'
import type { Vertical } from '../types'

interface Props {
  active: Vertical
  onChange: (v: Vertical) => void
}

const GRADIENT_MAP: Record<Vertical, string> = {
  commercial: 'from-blue-600 to-blue-700',
  residential: 'from-emerald-600 to-emerald-700',
  office: 'from-violet-600 to-violet-700',
  car: 'from-amber-600 to-amber-700',
  hygienemart: 'from-cyan-600 to-cyan-700',
}

const SHADOW_MAP: Record<Vertical, string> = {
  commercial: 'shadow-blue-500/20',
  residential: 'shadow-emerald-500/20',
  office: 'shadow-violet-500/20',
  car: 'shadow-amber-500/20',
  hygienemart: 'shadow-cyan-500/20',
}

interface Tab {
  key: Vertical
  label: string
  tagline: string
  price: string
  icon: React.ReactNode
}

const ICON_SIZE = 'w-4.5 h-4.5'

const TABS: Tab[] = [
  {
    key: 'commercial', label: 'Commercial', tagline: 'Deep Cleaning', price: '$30',
    icon: <svg className={ICON_SIZE} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M6 21V7l6-4 6 4v14M10 21v-6h4v6" /></svg>,
  },
  {
    key: 'residential', label: 'Residential', tagline: 'Home Cleaning', price: '$40',
    icon: <svg className={ICON_SIZE} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 3l9 6.5V21H3zM9 21V13h6v8" /></svg>,
  },
  {
    key: 'office', label: 'Office', tagline: 'Janitorial', price: '$15',
    icon: <svg className={ICON_SIZE} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16v13H4zM8 7V4h8v3M8 12h8M8 16h6" /></svg>,
  },
  {
    key: 'car', label: 'Cars', tagline: 'Detailing', price: '$35',
    icon: <svg className={ICON_SIZE} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 17h14M5 17a2 2 0 01-2-2v-4l2.5-5A2 2 0 017.5 5h9a2 2 0 011.5.5L21 11v4a2 2 0 01-2 2M7 17a2 2 0 100-4 2 2 0 000 4zM17 17a2 2 0 100-4 2 2 0 000 4z" /></svg>,
  },
  {
    key: 'hygienemart', label: 'HygieneMart', tagline: 'Wholesale', price: '$6',
    icon: <svg className={ICON_SIZE} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7v10l10 5 10-5V7zM2 7l10 5 10-5M12 22V12" /></svg>,
  },
]

export default function VerticalNav({ active, onChange }: Props) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm shadow-gray-200/20"
    >
      <div className="flex overflow-x-auto gap-2 px-3 sm:px-4 py-2.5 scrollbar-none max-w-3xl mx-auto">
        {TABS.map((tab, i) => {
          const isActive = active === tab.key
          return (
            <motion.button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex items-center gap-2.5 px-3 sm:px-4 py-2.5 rounded-xl text-left whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-white shadow-lg shadow-gray-200/60 border border-gray-200/80'
                  : 'bg-transparent hover:bg-white/60 border border-transparent hover:border-gray-200/40'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeTabGlow"
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand/5 via-white to-brand-light/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {isActive && (
                <motion.span
                  layoutId="activeTabBorder"
                  className="absolute -top-px left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-brand/60 via-brand to-brand-dark/60"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 w-8 h-8 rounded-lg bg-gradient-to-br ${GRADIENT_MAP[tab.key]} flex items-center justify-center text-white shadow-sm ${SHADOW_MAP[tab.key]}`}>
                {tab.icon}
              </span>
              <span className="relative z-10 flex flex-col items-start leading-tight -mt-0.5">
                <span className={`text-sm font-semibold ${isActive ? 'text-brand-dark' : 'text-gray-600'}`}>
                  {tab.label}
                </span>
                <span className={`text-[10px] ${isActive ? 'text-brand/70' : 'text-gray-400'}`}>
                  {tab.tagline} · From {tab.price}
                </span>
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.nav>
  )
}
