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
      <section id="why-us" className="max-w-3xl mx-auto px-4">
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

      {/* ───── ABOUT ───── */}
      <section id="about" className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 sm:p-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-brand-dark">About Shine Hygiene</h2>
            <div className="h-0.5 w-12 mx-auto mt-3 rounded-full bg-gradient-to-r from-brand/40 via-brand to-brand-dark/40" />
          </div>

          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-800">Shine Hygiene Solutions</strong> is a Harare-based professional cleaning
              company dedicated to delivering exceptional sanitation and hygiene services across Zimbabwe.
            </p>
            <p>
              Founded with a mission to raise cleaning standards, we combine <strong className="text-gray-800">WHO-compliant
              protocols</strong>, industrial-grade equipment, and rigorously trained staff to serve commercial, residential,
              and industrial clients.
            </p>
            <p>
              Our instant quoting platform eliminates the traditional back-and-forth — configure your service, get a price
              in seconds, and confirm via WhatsApp. No calls, no waiting, no obligation.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            {[
              { value: 'Since 2020', label: 'Years of Service' },
              { value: '500+', label: 'Projects Completed' },
              { value: 'WHO', label: 'Safety Compliant' },
              { value: '100%', label: 'Client Satisfaction' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-lg font-bold text-brand-dark">{s.value}</div>
                <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ───── CONTACT ───── */}
      <section id="contact" className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 sm:p-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-brand-dark">Get in Touch</h2>
            <p className="text-sm text-gray-400 mt-1">We're here to help. Reach out any time.</p>
            <div className="h-0.5 w-12 mx-auto mt-3 rounded-full bg-gradient-to-r from-brand/40 via-brand to-brand-dark/40" />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <a href="tel:+263771962330" className="flex items-center gap-3 p-3.5 rounded-xl bg-white/70 border border-gray-200 hover:border-brand/30 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <span className="block text-xs text-gray-400">Call Us</span>
                  <span className="block text-sm font-medium text-gray-800">+263 77 196 2330</span>
                </div>
              </a>

              <a href="https://wa.me/263771962330" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3.5 rounded-xl bg-white/70 border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <div>
                  <span className="block text-xs text-gray-400">WhatsApp</span>
                  <span className="block text-sm font-medium text-gray-800">Chat with us</span>
                </div>
              </a>

              <a href="mailto:shinecleanzw@gmail.com" className="flex items-center gap-3 p-3.5 rounded-xl bg-white/70 border border-gray-200 hover:border-brand/30 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <span className="block text-xs text-gray-400">Email</span>
                  <span className="block text-sm font-medium text-gray-800 truncate">shinecleanzw@gmail.com</span>
                </div>
              </a>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 border border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <span className="block text-xs text-gray-400">Service Area</span>
                  <span className="block text-sm font-medium text-gray-800">Harare, Zimbabwe</span>
                  <span className="block text-xs text-gray-400 mt-0.5">Full coverage across greater Harare</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 border border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <span className="block text-xs text-gray-400">Business Hours</span>
                  <span className="block text-sm font-medium text-gray-800">Mon – Fri: 7:00 – 17:00</span>
                  <span className="block text-sm text-gray-600">Saturday: 8:00 – 13:00</span>
                  <span className="block text-sm text-gray-400">Sunday: Closed</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gradient-to-br from-brand-light to-white border border-brand/20">
                <p className="text-xs text-brand-dark font-medium flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Quotes are typically confirmed within 1 hour during business hours.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
