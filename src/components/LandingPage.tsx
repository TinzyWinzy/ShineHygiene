import { motion } from 'motion/react'
import type { Vertical } from '../types'
import ServiceCard from './ServiceCard'
import PhotoSlot from './PhotoSlot'
import { SHINE_CONTACT } from '../config/contact'

interface Props {
  onStart: (vertical?: Vertical) => void
}

const SERVICES: { vertical: Vertical; title: string; description: string; highlights: string[]; priceFrom: string }[] = [
  {
    vertical: 'commercial',
    title: 'Commercial deep cleaning',
    description: 'Factories, warehouses and showrooms. Heavy-duty sanitation for high-traffic spaces.',
    highlights: ['Floor area-based pricing', 'Daily or weekly schedules', 'Industrial-grade equipment'],
    priceFrom: '30.00',
  },
  {
    vertical: 'residential',
    title: 'Residential deep cleaning',
    description: 'Houses, apartments and townhouses. Per-room pricing with optional add-ons.',
    highlights: ['Per-room transparent pricing', 'Window deep clean add-on', 'Weekend and after-hours'],
    priceFrom: '40.00',
  },
  {
    vertical: 'office',
    title: 'Office cleaning',
    description: 'Corporate offices, banks and coworking spaces, on a schedule that suits you.',
    highlights: ['After-hours cleaning available', 'Reception and washroom focus', 'Custom frequency plans'],
    priceFrom: '15.00',
  },
  {
    vertical: 'car',
    title: 'Vehicle detailing',
    description: 'Full interior and exterior deep cleaning, from sedan shampoo to 4x4 packages.',
    highlights: ['Sedan and SUV packages', 'Deep seat shampoo', 'Tyre and rim shine included'],
    priceFrom: '35.00',
  },
  {
    vertical: 'hygienemart',
    title: 'HygieneMart supplies',
    description: 'Bulk cleaning supplies and equipment: detergents, sanitisers, dispensers and PPE.',
    highlights: ['Bulk discounts on 10+ units', 'Hospital-grade sanitisers', 'Delivery on bulk orders'],
    priceFrom: '6.00',
  },
]

/** Only claims the owner can evidence (UX brief §2.2, PRD §2.3). */
const TRUST_ROW = ['Instant, itemised quotes', 'Harare and surrounding areas', 'Real people to confirm']

const STEPS = [
  {
    title: 'Get your quote',
    body: 'Pick a service, answer a few questions and see the price straight away. No calls, no waiting.',
  },
  {
    title: 'Confirm with a person',
    body: 'Send your request on WhatsApp with the reference. Our team confirms the date, time and what is included.',
  },
  {
    title: 'We do the work',
    body: 'Your crew arrives with the equipment and supplies. Closed on Sundays, like it should be.',
  },
]

const ROWS = [
  {
    id: 'homes',
    eyebrow: 'Homes',
    title: 'A deep clean that reaches the parts a quick wipe misses',
    body: 'Rooms, kitchens, bathrooms and windows, priced per room so you know what you are paying for before we start. Book a one-off deep clean or keep it regular.',
    points: ['Per-room quote before you book', 'Window deep clean as an add-on', 'Weekend and after-hours slots'],
    photo: 'home' as const,
    position: 'right' as const,
    side: 'left' as const,
    alt: 'Gloved hands deep cleaning a kitchen basin and taps in a Harare home',
    cta: { label: 'Quote a home clean', vertical: 'residential' as Vertical },
  },
  {
    id: 'offices',
    eyebrow: 'Offices',
    title: 'Washrooms and workspaces handled, so nobody has to chase',
    body: 'Daily, weekly or after-hours cleaning for offices, banks and coworking spaces. We can keep the washrooms stocked too, so the little things never run out.',
    points: ['Frequency that fits your team', 'Reception and washroom focus', 'Supplies and dispensers restocked'],
    photo: 'office' as const,
    position: 'left' as const,
    side: 'right' as const,
    alt: 'Washroom basin and dispensers being cleaned in a Harare office',
    cta: { label: 'Quote office cleaning', vertical: 'office' as Vertical },
  },
  {
    id: 'supplies',
    eyebrow: 'HygieneMart',
    title: 'Bulk supplies and washroom equipment, delivered',
    body: 'Detergents, sanitisers, dispensers, hand dryers and PPE in the quantities a business actually uses. Build the order and see the itemised total.',
    points: ['Itemised order total', 'Bulk pricing on 10+ units', 'Delivery on bulk orders'],
    photo: 'supplies' as const,
    position: 'left' as const,
    side: 'left' as const,
    alt: 'Cleaning detergents, sanitisers, cloths and dispensers packed for delivery',
    cta: { label: 'Build a supply order', vertical: 'hygienemart' as Vertical },
  },
]

function Check() {
  return (
    <svg className="w-4 h-4 shrink-0 text-brand-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function Arrow() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

export default function LandingPage({ onStart }: Props) {
  const waHref = `https://wa.me/${SHINE_CONTACT.whatsapp.digits}?text=${encodeURIComponent(
    'Hi Shine Hygiene, I would like a cleaning quote for Harare.',
  )}`

  return (
    <div>
      {/* ───── HERO: navy band over photography ───── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="relative bg-brand-dark text-white overflow-hidden sm:rounded-b-3xl"
      >
        <div className="absolute inset-0 hero-grid" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-10 pt-10 sm:pt-16 pb-12 sm:pb-20 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/70">
              Harare · Homes, offices and commercial
            </p>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05, ease: 'easeOut' }}
              className="mt-4 text-[2rem] leading-[1.1] sm:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              A cleaner space, without the chasing.
            </motion.h1>

            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-white/80 max-w-md leading-relaxed">
              Instant quote, real people, and a team that shows up. See the price
              before you book, then confirm on WhatsApp.
            </p>

            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onStart()}
                className="inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-xl bg-brand-ink text-white font-semibold text-sm hover:bg-brand transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get my quote
                <Arrow />
              </button>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                WhatsApp us
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm text-white/75">
              {TRUST_ROW.map(item => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-brand-light/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            {/* Soft navy overlay keeps the headline legible against the photo */}
            <PhotoSlot
              name="hero"
              priority
              alt="Two Shine Hygiene cleaners in navy uniforms and gloves deep cleaning a bright Harare office"
              className="w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-3xl"
            />
            <div
              className="absolute inset-0 rounded-3xl bg-brand-dark/25 ring-1 ring-white/10 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>
      </motion.section>

      {/* ───── SERVICES ───── */}
      <section id="services" className="max-w-6xl mx-auto px-4 pt-14 sm:pt-20 scroll-mt-20">
        <div className="max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark">What needs cleaning?</h2>
          <p className="mt-2 text-brand-muted">
            Pick a service to get an itemised price straight away.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((svc, i) => (
            <ServiceCard key={svc.vertical} {...svc} index={i} onSelect={onStart} />
          ))}

          <button
            onClick={() => onStart()}
            className="flex flex-col items-start justify-between text-left p-5 sm:p-6 rounded-2xl bg-brand-light border border-brand/20 hover:border-brand transition-colors"
          >
            <div>
              <h3 className="font-semibold text-brand-dark">Not sure where it fits?</h3>
              <p className="mt-1.5 text-sm text-brand-muted leading-relaxed">
                Start the quote and choose as you go. Nothing is confirmed until you send it.
              </p>
            </div>
            <span className="mt-4 text-sm font-semibold text-brand-ink inline-flex items-center gap-1">
              Start a quote <Arrow />
            </span>
          </button>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section id="how-it-works" className="mt-14 sm:mt-20 bg-surface-soft border-y border-line-200 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark">How it works</h2>
            <p className="mt-2 text-brand-muted">Three steps, and you are not chasing anyone.</p>
          </div>

          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.2, delay: i * 0.05, ease: 'easeOut' }}
                className="bg-surface rounded-2xl border border-line-200 p-6 elevate"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-dark text-white text-sm font-bold">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold text-brand-dark">{step.title}</h3>
                <p className="mt-1.5 text-sm text-brand-muted leading-relaxed">{step.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───── ALTERNATING TEXT AND IMAGE ROWS ───── */}
      <div className="max-w-6xl mx-auto px-4 divide-y divide-line-200">
        {ROWS.map(row => {
          // Photo on the left, copy on the right, so the outer edge is always
          // whitespace and never two bare photo edges facing each other.
          const flipped = row.side === 'right'
          return (
          <section
            key={row.id}
            id={row.id}
            className="py-14 sm:py-20 grid gap-8 lg:grid-cols-2 lg:gap-14 lg:items-center scroll-mt-20"
          >
            <PhotoSlot
              name={row.photo}
              alt={row.alt}
              position={row.position}
              className={`w-full aspect-[4/3] rounded-3xl ${flipped ? 'lg:order-2' : ''}`}
            />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={flipped ? 'lg:order-1' : ''}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink">{row.eyebrow}</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-brand-dark leading-tight">{row.title}</h2>
              <p className="mt-3 text-brand-muted leading-relaxed max-w-[60ch]">{row.body}</p>

              <ul className="mt-5 space-y-2.5">
                {row.points.map(point => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-brand-subtext">
                    <Check />
                    {point}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onStart(row.cta.vertical)}
                className="mt-6 inline-flex items-center gap-2 min-h-11 px-5 rounded-xl bg-brand-ink text-white text-sm font-semibold hover:bg-brand-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
              >
                {row.cta.label}
                <Arrow />
              </button>
            </motion.div>
          </section>
          )
        })}
      </div>

      {/* ───── ABOUT ───── */}
      <section id="about" className="max-w-6xl mx-auto px-4 py-14 sm:py-20 border-t border-line-200 scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink">About Shine Hygiene</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-brand-dark leading-tight">
              A Harare team that treats your space like it is theirs
            </h2>
            <div className="mt-4 space-y-3 text-brand-muted leading-relaxed max-w-[62ch]">
              <p>
                Shine Hygiene Solutions cleans homes, offices and commercial premises across
                Harare, and supplies the hygiene products and washroom equipment that keep them
                that way.
              </p>
              <p>
                The team works to WHO-aligned cleaning and sanitation practices, arrives with
                professional equipment, and confirms every job with a person before it is booked.
              </p>
              <p>
                Sunday is a rest day. We are closed, and we plan your clean around it rather than
                squeeze it in.
              </p>
            </div>
          </motion.div>

          <PhotoSlot
            name="about"
            alt="Three Shine Hygiene cleaners in navy uniforms, caps and gloves with a cleaning kit"
            position="center"
            className="w-full aspect-[4/3] rounded-3xl"
          />
        </div>
      </section>

      {/* ───── FINAL CTA + CONTACT ───── */}
      <section id="contact" className="max-w-6xl mx-auto px-4 pb-16 sm:pb-20 scroll-mt-20">
        <div className="rounded-3xl bg-brand-light border border-brand/20 p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark">
            Ready to see your price?
          </h2>
          <p className="mt-2 text-brand-muted max-w-xl">
            It takes about a minute. You will get an itemised estimate and a reference to
            send us on WhatsApp. No account needed, and no obligation.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onStart()}
              className="inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-xl bg-brand-dark text-white font-semibold text-sm hover:bg-navy-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
            >
              Get my quote
              <Arrow />
            </button>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-xl bg-white border border-line-200 text-brand-dark font-semibold text-sm hover:border-brand transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>

          <dl className="mt-8 grid gap-6 sm:grid-cols-3 pt-6 border-t border-brand/15 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Service area</dt>
              <dd className="mt-1 text-brand-subtext">Harare and surrounding areas</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Hours</dt>
              <dd className="mt-1 text-brand-subtext">Mon–Fri 7:00–17:00 · Sat 8:00–13:00</dd>
              <dd className="text-brand-muted">Closed Sunday</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Call us</dt>
              <dd className="mt-1 text-brand-subtext">
                <a href={`tel:${SHINE_CONTACT.primaryPhone.e164.replace(/[^\d+]/g, '')}`} className="hover:text-brand-ink transition-colors">
                  {SHINE_CONTACT.primaryPhone.label}
                </a>
              </dd>
              <dd className="text-brand-muted">
                <a href={`tel:${SHINE_CONTACT.secondaryPhone.e164.replace(/[^\d+]/g, '')}`} className="hover:text-brand-ink transition-colors">
                  {SHINE_CONTACT.secondaryPhone.label}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  )
}
