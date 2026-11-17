import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'

interface Props {
  onSubmit: (data: { name: string; phone: string; date: string; time: string }) => void
  disabled?: boolean
}

function todayIso(): string {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

export default function BookingForm({ onSubmit, disabled }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const valid = name.trim().length > 0 && phone.trim().length > 0

  const submit = (event?: FormEvent) => {
    event?.preventDefault()
    if (!valid) return
    onSubmit({ name: name.trim(), phone: phone.trim(), date, time })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-lg shadow-gray-200/50 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-brand-dark to-brand-ink px-5 py-3.5">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          Your Details
        </h3>
        <p className="text-white text-xs mt-0.5">We&rsquo;ll prepare your quote and contact you.</p>
      </div>

      <form className="p-5 space-y-4" onSubmit={submit} noValidate>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <label htmlFor="lead-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            id="lead-name"
            name="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Tinashe Mukova"
            autoComplete="name"
            maxLength={80}
            required
            aria-required="true"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all bg-white/50"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label htmlFor="lead-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="e.g. 0771 234 567"
            autoComplete="tel"
            maxLength={20}
            required
            aria-required="true"
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
            <label htmlFor="lead-date" className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
            <input
              id="lead-date"
              name="preferredDate"
              type="date"
              min={todayIso()}
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all bg-white/50"
            />
          </div>
          <div>
            <label htmlFor="lead-time" className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
            <input
              id="lead-time"
              name="preferredTime"
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
            type="submit"
            disabled={!valid || disabled}
            whileHover={valid ? { scale: 1.01 } : {}}
            whileTap={valid ? { scale: 0.98 } : {}}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-brand-ink to-brand-dark text-white shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/30 active:shadow-md"
          >
            {disabled ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Processing...
              </span>
            ) : 'Get My Quote'}
          </motion.button>
          <p className="text-[11px] text-gray-500 text-center mt-2">
            By requesting a quote you agree that Shine Hygiene may store these details to prepare and follow up
            on your request. We do not sell your data. Email{' '}
            <a href="mailto:shinecleanzw@gmail.com" className="underline underline-offset-2 text-brand-ink">
              shinecleanzw@gmail.com
            </a>{' '}
            to ask for a copy or deletion.
          </p>
        </motion.div>
      </form>
    </motion.div>
  )
}
