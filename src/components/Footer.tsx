import { motion } from 'motion/react'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-center py-8 px-4 mt-8"
    >
      <div className="max-w-3xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand to-brand-dark p-0.5">
            <div className="w-full h-full rounded-[3px] bg-white flex items-center justify-center overflow-hidden">
              <img src="/logo.jpg" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <span className="text-sm font-semibold text-brand-dark">Shine Hygiene Solutions</span>
        </div>

        <p className="text-xs text-gray-400 mb-2">
          WHO Safety Compliant &middot; Professional Cleaning Services &middot; Harare, Zimbabwe
        </p>

        <div className="flex items-center justify-center gap-4 text-xs">
          <a href="mailto:sales@shineclean.co.zw" className="text-brand hover:text-brand-dark transition-colors">
            sales@shineclean.co.zw
          </a>
          <span className="text-gray-300">|</span>
          <a href="mailto:shinecleanzw@gmail.com" className="text-brand hover:text-brand-dark transition-colors">
            shinecleanzw@gmail.com
          </a>
        </div>

        <p className="text-[10px] text-gray-300 mt-4">
          &copy; {new Date().getFullYear()} Shine Hygiene Solutions. All rights reserved.
        </p>
      </div>
    </motion.footer>
  )
}
