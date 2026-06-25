import { useState } from 'react'

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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-brand-dark px-5 py-3">
        <h3 className="text-white font-semibold">Your Details</h3>
        <p className="text-white/70 text-xs mt-0.5">We'll use this info to prepare your quote and contact you.</p>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Tinashe Mukova"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="e.g. 0771 234 567"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
            />
          </div>
        </div>

        <button
          onClick={submit}
          disabled={!valid || disabled}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-brand text-white hover:bg-brand-dark active:scale-[0.98]"
        >
          {disabled ? 'Processing...' : 'Get My Quote'}
        </button>
      </div>
    </div>
  )
}
