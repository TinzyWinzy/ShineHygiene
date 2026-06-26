import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface Props {
  onStart: () => void
}

const NAV_LINKS = [
  { label: 'Home', action: 'home' as const },
  { label: 'Services', action: 'services' as const },
  { label: 'About', action: 'about' as const },
  { label: 'Contact', action: 'contact' as const },
]

export default function Navbar({ onStart }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => setScrolled(window.scrollY > 10))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleNav = (action: string) => {
    setMenuOpen(false)
    if (action === 'home' || action === 'services') {
      onStart()
    } else {
      const id = action === 'about' ? 'about' : 'contact'
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      } else {
        onStart()
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        })
      }
    }
  }

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-200 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.04)]'
          : 'bg-white/50 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-dark p-0.5 shadow-md shadow-brand/20">
            <div className="w-full h-full rounded-[5px] bg-white flex items-center justify-center overflow-hidden">
              <img src="/logo.jpg" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="hidden xs:block">
            <span className="text-sm font-bold text-brand-dark tracking-tight leading-tight block">
              Shine Hygiene
            </span>
            <span className="text-[10px] text-gray-400 leading-tight block">
              Solutions
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <button
              key={link.label}
              onClick={() => handleNav(link.action)}
              className="px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-brand-dark rounded-lg hover:bg-gray-50 transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-1.5">
          <a
            href="tel:+263771962330"
            className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-brand-dark rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Call
          </a>
          <a
            href="https://wa.me/263771962330"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] text-white text-[13px] font-semibold rounded-xl hover:bg-[#20bd5a] transition-all shadow-sm hover:shadow-md hover:shadow-[#25D366]/20"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 bg-gradient-to-r from-brand to-brand-dark text-white text-[13px] font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            Get Quote
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-1.5 md:hidden">
          <a
            href="tel:+263771962330"
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 text-gray-500 hover:text-brand hover:border-brand/30 transition-colors"
            aria-label="Call us"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          </a>
          <motion.button
            onClick={onStart}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-2 bg-brand text-white text-xs font-semibold rounded-xl"
          >
            Quote
          </motion.button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px]"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden border-t border-gray-100"
          >
            <div className="px-4 py-3 space-y-1 bg-white">
              {NAV_LINKS.map(link => (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.action)}
                  className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-brand-dark hover:bg-gray-50 transition-colors min-h-[44px]"
                >
                  {link.label}
                </button>
              ))}
              <hr className="my-2 border-gray-100" />
              <a
                href="https://wa.me/263771962330"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-[#25D366] text-white min-h-[44px]"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </a>
              <a
                href="tel:+263771962330"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 min-h-[44px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Call {''}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
