import { motion } from 'motion/react'
import type { Vertical } from '../types'

interface Props {
  vertical: Vertical
  icon: string
  title: string
  description: string
  highlights: string[]
  priceFrom: string
  index: number
  onSelect: (v: Vertical) => void
}

const GRADIENT_MAP: Record<Vertical, string> = {
  commercial: 'from-blue-600 to-blue-700',
  residential: 'from-emerald-600 to-emerald-700',
  office: 'from-violet-600 to-violet-700',
  car: 'from-amber-600 to-amber-700',
  hygienemart: 'from-cyan-600 to-cyan-700',
}

const SHADOW_MAP: Record<Vertical, string> = {
  commercial: 'shadow-blue-500/10',
  residential: 'shadow-emerald-500/10',
  office: 'shadow-violet-500/10',
  car: 'shadow-amber-500/10',
  hygienemart: 'shadow-cyan-500/10',
}

export default function ServiceCard({ vertical, icon, title, description, highlights, priceFrom, index, onSelect }: Props) {
  return (
    <motion.button
      onClick={() => onSelect(vertical)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col items-start text-left p-5 sm:p-6 rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all text-left w-full"
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${GRADIENT_MAP[vertical]} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />

      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${GRADIENT_MAP[vertical]} flex items-center justify-center text-xl shadow-lg ${SHADOW_MAP[vertical]} mb-3.5 shrink-0`}>
        {icon}
      </div>

      <h3 className="text-base font-semibold text-gray-800 group-hover:text-brand-dark transition-colors">
        {title}
      </h3>

      <p className="text-sm text-gray-400 mt-1 leading-relaxed flex-1">
        {description}
      </p>

      <ul className="mt-3 space-y-1 w-full">
        {highlights.map(h => (
          <li key={h} className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg className="w-3 h-3 text-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            {h}
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-3 border-t border-gray-100 w-full flex items-center justify-between">
        <span className="text-xs text-gray-400">
          From <span className="font-semibold text-gray-700">${priceFrom}</span>
        </span>
        <span className="text-xs font-medium text-brand group-hover:gap-1.5 transition-all inline-flex items-center gap-1">
          Get Quote
          <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </span>
      </div>
    </motion.button>
  )
}
