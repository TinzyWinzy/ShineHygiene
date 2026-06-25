import { motion } from 'motion/react'

export default function HeroBrand() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="text-center py-8 px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="mx-auto mb-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-0.5 shadow-lg shadow-brand/20"
      >
        <div className="w-full h-full rounded-[calc(0.75rem-1px)] bg-white flex items-center justify-center overflow-hidden">
          <img src="/logo.jpg" alt="Shine Hygiene" className="w-full h-full object-cover rounded-[calc(0.75rem-1px)]" />
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight"
      >
        Instant Quote Engine
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="text-sm text-gray-500 mt-2 max-w-md mx-auto"
      >
        Select your service below for an instant price — no calls, no waiting.
      </motion.p>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        className="h-0.5 w-16 mx-auto mt-4 rounded-full bg-gradient-to-r from-brand/40 via-brand to-brand-dark/40 origin-center"
      />
    </motion.div>
  )
}
