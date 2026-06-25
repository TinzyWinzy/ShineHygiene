import { motion } from 'motion/react'
import type { Vertical } from '../types'
import ServiceCard from './ServiceCard'

interface Props {
  onStart: (vertical?: Vertical) => void
}

const SERVICES: { vertical: Vertical; icon: string; title: string; description: string; highlights: string[]; priceFrom: string }[] = [
  {
    vertical: 'commercial',
    icon: '🏢',
    title: 'Commercial Deep Cleaning',
    description: 'Factories, warehouses, showrooms and large commercial premises. Heavy-duty sanitation for high-traffic spaces.',
    highlights: ['Floor area-based pricing', 'Daily / weekly schedules', 'Industrial-grade equipment'],
    priceFrom: '30.00',
  },
  {
    vertical: 'residential',
    icon: '🏠',
    title: 'Residential Deep Cleaning',
    description: 'Houses, apartments, and townhouses. Per-room pricing with optional add-ons like window deep cleaning.',
    highlights: ['Per-room transparent pricing', 'Window deep clean add-on', 'Weekend & after-hours'],
    priceFrom: '40.00',
  },
  {
    vertical: 'office',
    icon: '💼',
    title: 'Office Cleaning',
    description: 'Corporate offices, banks, showrooms, and coworking spaces. Professional janitorial services on your schedule.',
    highlights: ['After-hours cleaning available', 'Reception & washroom focus', 'Custom frequency plans'],
    priceFrom: '15.00',
  },
  {
    vertical: 'car',
    icon: '🚗',
    title: 'Vehicle Detailing',
    description: 'Full interior and exterior deep cleaning. From sedan shampoo to 4x4 full detail packages.',
    highlights: ['Sedan & SUV packages', 'Deep seat shampoo', 'Tire & rim shine included'],
    priceFrom: '35.00',
  },
  {
    vertical: 'hygienemart',
    icon: '🧴',
    title: 'HygieneMart Wholesale',
    description: 'Bulk cleaning supplies and equipment. Detergents, sanitisers, dispensers, PPE, and professional-grade tools.',
    highlights: ['Bulk discounts on 10+ units', 'Hospital-grade sanitisers', 'Free delivery on bulk orders'],
    priceFrom: '6.00',
  },
]

const TRUST_SIGNALS = [
  { label: 'WHO Safety Compliant', icon: '🛡️' },
  { label: 'Insured & Bonded', icon: '📋' },
  { label: '5+ Years Experience', icon: '⭐' },
  { label: '100+ Happy Clients', icon: '🤝' },
]

export default function LandingPage({ onStart }: Props) {
  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* ───── HERO ───── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-b-3xl sm:rounded-b-[2rem] -mx-4 sm:-mx-0 px-4 pt-8 sm:pt-12 pb-12 sm:pb-16"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-white to-brand-light pointer-events-none" />
        <div className="absolute top-10 -left-20 w-72 h-72 bg-brand/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-brand-dark/5 rounded-full blur-3xl" />

        <div className="relative max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="mx-auto mb-5 w-20 h-20 rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-0.5 shadow-xl shadow-brand/20"
          >
            <div className="w-full h-full rounded-[calc(0.75rem-1px)] bg-white flex items-center justify-center overflow-hidden">
              <img src="/logo.jpg" alt="" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl sm:text-4xl font-bold text-brand-dark tracking-tight leading-tight"
          >
            Professional Cleaning
            <br />
            <span className="text-brand">Instant Pricing</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm sm:text-base text-gray-500 mt-3 max-w-md mx-auto leading-relaxed"
          >
            Harare's trusted cleaning service. Get a quote in seconds — no calls, no waiting, no obligation.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-5"
          >
            {TRUST_SIGNALS.map(s => (
              <span key={s.label} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm border border-gray-200/60 text-xs text-gray-600 shadow-sm">
                <span className="text-sm">{s.icon}</span>
                {s.label}
              </span>
            ))}
          </motion.div>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8"
          >
            <motion.button
              onClick={() => onStart()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand to-brand-dark text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-xl shadow-brand/20 hover:shadow-2xl hover:shadow-brand/30 transition-all"
            >
              Calculate Your Instant Quote
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </motion.button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-gray-300"
            >
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ───── SERVICES ───── */}
      <section className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-brand-dark">
            Our Services
          </h2>
          <p className="text-sm text-gray-400 mt-1.5">
            Choose a service below for an instant, itemised quote
          </p>
          <div className="h-0.5 w-12 mx-auto mt-3 rounded-full bg-gradient-to-r from-brand/40 via-brand to-brand-dark/40" />
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((svc, i) => (
            <ServiceCard key={svc.vertical} {...svc} index={i} onSelect={onStart} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center mt-8"
        >
          <motion.button
            onClick={() => onStart()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-1.5 text-sm text-brand hover:text-brand-dark font-medium transition-colors"
          >
            See all services
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </motion.button>
        </motion.div>
      </section>

      {/* ───── WHY US ───── */}
      <section className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 sm:p-8 text-center"
        >
          <h2 className="text-lg sm:text-xl font-bold text-brand-dark">
            Why Shine Hygiene?
          </h2>

          <div className="grid sm:grid-cols-3 gap-5 mt-6 text-left">
            <div>
              <span className="text-2xl">🛡️</span>
              <h3 className="text-sm font-semibold text-gray-800 mt-2">WHO-Compliant</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                We follow World Health Organization safety protocols for all cleaning and sanitation services.
              </p>
            </div>
            <div>
              <span className="text-2xl">⚡</span>
              <h3 className="text-sm font-semibold text-gray-800 mt-2">Instant Quoting</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                No calls, no back-and-forth. Configure your service and get a price in seconds.
              </p>
            </div>
            <div>
              <span className="text-2xl">📱</span>
              <h3 className="text-sm font-semibold text-gray-800 mt-2">WhatsApp Ready</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Your quote pipes directly into WhatsApp. One tap to confirm with our team.
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-6 border-t border-gray-100 pt-4">
            Proudly serving Harare, Zimbabwe · Insured and bonded for your peace of mind
          </p>
        </motion.div>
      </section>
    </div>
  )
}
