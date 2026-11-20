import { motion } from 'motion/react'
import { SHINE_CONTACT } from '../config/contact'

const telHref = (e164: string) => `tel:${e164.replace(/[^\d+]/g, '')}`

const NAV = [
  { label: 'Services', href: '#services' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.2 }}
      className="mt-16 sm:mt-24 bg-brand-dark text-white"
    >
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white p-0.5">
                <img src="/logo.jpg" alt="" className="w-full h-full rounded-[5px] object-cover" />
              </div>
              <span className="font-display font-bold tracking-tight">Shine Hygiene Solutions</span>
            </div>
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              Cleaning, hygiene supplies and washroom equipment for homes, offices and
              commercial premises in Harare. You see the price before you book.
            </p>
          </div>

          {/* Explore */}
          <nav aria-labelledby="footer-explore" className="text-sm">
            <h2 id="footer-explore" className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              {NAV.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-white/80 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">Contact</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={telHref(SHINE_CONTACT.primaryPhone.e164)} className="text-white/80 hover:text-white transition-colors">
                  {SHINE_CONTACT.primaryPhone.e164}
                </a>
              </li>
              <li>
                <a href={telHref(SHINE_CONTACT.secondaryPhone.e164)} className="text-white/80 hover:text-white transition-colors">
                  {SHINE_CONTACT.secondaryPhone.e164}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${SHINE_CONTACT.whatsapp.digits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:shinecleanzw@gmail.com" className="text-white/80 hover:text-white transition-colors break-all">
                  shinecleanzw@gmail.com
                </a>
              </li>
            </ul>
            <p className="mt-4 text-white/60">
              Mon–Fri 7:00–17:00 · Sat 8:00–13:00 · Closed Sunday
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} Shine Hygiene Solutions. All rights reserved.</p>
          <p>Harare, Zimbabwe</p>
        </div>
      </div>
    </motion.footer>
  )
}
