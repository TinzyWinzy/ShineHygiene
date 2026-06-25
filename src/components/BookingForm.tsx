import { useState } from 'react'
import { motion } from 'motion/react'

interface Props {
  onSubmit: (data: { name: string; phone: string; date: string; time: string }) => void
  disabled?: boolean
}

export default function BookingForm({ onSubmit, disabled }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const submit = () => {
    if (!name.trim() || !phone.trim()) return
    onSubmit({ name: name.trim(), phone: phone.trim(), date, time })
  }

  const valid = name.trim().length > 0 && phone.trim().length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-lg shadow-gray-200/50 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-brand-dark to-brand px-5 py-3.5">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          Your Details
        </h3>
        <p className="text-white/60 text-xs mt-0.5">We'll prepare your quote and contact you.</p>
      </div>

      <div className="p-5 space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Tinashe Mukova"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all bg-white/50"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="e.g. 0771 234 567"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all bg-white/50"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all bg-white/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all bg-white/50"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <motion.button
            onClick={submit}
            disabled={!valid || disabled}
            whileHover={valid ? { scale: 1.01 } : {}}
            whileTap={valid ? { scale: 0.98 } : {}}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-brand to-brand-dark text-white shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/30 active:shadow-md"
          >
            {disabled ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Processing...
              </span>
            ) : 'Get My Quote'}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
