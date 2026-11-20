import { motion } from 'motion/react'
import type { Vertical } from '../types'

interface Props {
  vertical: Vertical
  title: string
  description: string
  highlights: string[]
  priceFrom: string
  index: number
  onSelect: (v: Vertical) => void
}

export default function ServiceCard({ vertical, title, description, highlights, priceFrom, index, onSelect }: Props) {
  return (
    <motion.button
      onClick={() => onSelect(vertical)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.2, delay: index * 0.04, ease: 'easeOut' }}
      className="group flex flex-col items-start text-left p-5 sm:p-6 rounded-2xl border border-line-200 bg-surface elevate hover:border-brand transition-colors w-full"
    >
      <h3 className="font-semibold text-brand-dark">{title}</h3>

      <p className="mt-1.5 text-sm text-brand-muted leading-relaxed flex-1">
        {description}
      </p>

      <ul className="mt-3 space-y-1 w-full">
        {highlights.map(h => (
          <li key={h} className="flex items-center gap-1.5 text-xs text-brand-muted">
            <svg className="w-3 h-3 text-brand-ink shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {h}
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-3 border-t border-line-200 w-full flex items-center justify-between">
        <span className="text-xs text-brand-muted">
          From <span className="font-semibold text-brand-dark tabular-nums">${priceFrom}</span>
        </span>
        <span className="text-xs font-semibold text-brand-ink inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
          Get quote
          <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </motion.button>
  )
}
