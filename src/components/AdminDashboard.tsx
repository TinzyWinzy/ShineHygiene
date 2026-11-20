import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'

interface Staff {
  id: string
  email: string
  name: string
  role: string
}

interface Booking {
  id: string
  quote_id: string
  reference: string
  customer_name: string
  customer_phone: string
  vertical: string
  scheduled_date: string
  scheduled_time: string
  status: string
  quote_status: string
  total_cents: number
  currency: string
  created_at: string
  preferred_date: string | null
  preferred_time: string | null
}

interface Quote {
  id: string
  reference: string
  lead_id: string
  customer_name: string
  customer_phone: string
  vertical: string
  params: unknown
  quote: unknown
  total_cents: number
  status: string
  currency: string
  source: string
  created_at: string
  client_request_id: string
  preferred_date: string | null
  preferred_time: string | null
}

interface Props {
  onExit?: () => void
}

export default function AdminDashboard({ onExit }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [staff, setStaff] = useState<Staff | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loginError, setLoginError] = useState<string | null>(null)

  async function handleLogin(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setLoginError(null)

    try {
      const response = await fetch('/api/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const body = (await response.json()) as { error?: string } | { accessToken?: string; user?: Staff }

      if (!response.ok) {
        setLoginError(body && 'error' in body ? body.error ?? 'Staff login failed.' : 'Staff login failed.')
        return
      }

      const accessToken = 'accessToken' in body ? body.accessToken : ''
      const staffUser = 'user' in body ? body.user : undefined
      if (!accessToken || !staffUser) {
        setLoginError('Staff login failed.')
        return
      }

      setToken(accessToken)
      setStaff(staffUser)
      await loadBookings(accessToken)
      await loadQuotes(accessToken)
    } catch {
      setLoginError('Unable to reach the staff service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function loadBookings(accessToken: string) {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/staff-bookings', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const body = (await response.json()) as { error?: string; data?: { bookings?: Booking[] } } | { error?: string }

      if (!response.ok) {
        setError(body && 'error' in body ? body.error ?? 'Unable to load bookings.' : 'Unable to load bookings.')
        setBookings([])
        return
      }

      const payload = 'data' in body ? body.data : undefined
      setBookings(payload?.bookings ?? [])
    } catch {
      setError('Unable to reach the staff service. Please try again.')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  async function loadQuotes(accessToken: string) {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/staff-quotes', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const body = (await response.json()) as { error?: string; data?: { quotes?: Quote[] } } | { error?: string }

      if (!response.ok) {
        setError(body && 'error' in body ? body.error ?? 'Unable to load quotes.' : 'Unable to load quotes.')
        setQuotes([])
        return
      }

      const payload = 'data' in body ? body.data : undefined
      setQuotes(payload?.quotes ?? [])
    } catch {
      setError('Unable to reach the staff service. Please try again.')
      setQuotes([])
    } finally {
      setLoading(false)
    }
  }

  async function createBooking(quote: Quote) {
    const accessToken = token
    if (!accessToken) return

    setLoading(true)
    setError(null)

    try {
      const scheduledDate = quote.preferred_date ?? new Date().toISOString().slice(0, 10)
      const scheduledTime = quote.preferred_time ?? '09:00'
      const response = await fetch('/api/staff-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ quoteId: quote.id, scheduledDate, scheduledTime }),
      })
      const body = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        setError(body?.error ?? 'Unable to confirm booking.')
        return
      }

      await loadBookings(accessToken)
      await loadQuotes(accessToken)
    } catch {
      setError('Unable to reach the staff service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function shareOnWhatsApp(booking: Booking) {
    const message = [
      'Hello, this is Shine Hygiene Operations.',
      `Reference: ${booking.reference}`,
      `Service: ${booking.vertical}`,
      `Requested date: ${booking.scheduled_date} at ${booking.scheduled_time}`,
      `Estimated total: US$${(booking.total_cents / 100).toFixed(2)}`,
      `Customer: ${booking.customer_name}`,
    ].join('\n')

    const phone = booking.customer_phone.replace(/\D/g, '')
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  if (!token || !staff) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-lg shadow-gray-200/50 p-6"
      >
        <h1 className="text-xl font-bold text-brand-dark">Staff sign in</h1>
        <p className="text-sm text-gray-500 mt-1">Back-office access for Shine Hygiene operations.</p>

        <form className="mt-5 space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              autoComplete="email"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all bg-white/50"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all bg-white/50"
            />
          </div>

          {loginError ? <p role="alert" className="text-sm text-red-700">{loginError}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-brand-ink to-brand-dark text-white shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign in to back office'}
          </button>
        </form>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-lg shadow-gray-200/50 p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-dark">Back office</h1>
          <p className="text-sm text-gray-500 mt-1">
            Signed in as {staff.name} · {staff.role}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!token) return
              void loadQuotes(token)
              void loadBookings(token)
            }}
            disabled={loading}
            className="text-sm font-medium text-gray-500 hover:text-brand-dark transition-colors disabled:opacity-40"
          >
            Refresh
          </button>
          {onExit ? (
            <button
              onClick={onExit}
              className="text-sm font-medium text-gray-500 hover:text-brand-dark transition-colors"
            >
              Back to quote
            </button>
          ) : null}
        </div>
      </div>

      {loading ? <p className="mt-5 text-sm text-gray-500">Loading bookings…</p> : null}
      {error ? <p role="alert" className="mt-5 text-sm text-red-700">{error}</p> : null}

      {!loading && !error ? (
        <div className="mt-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Quote inbox</h3>
          {quotes.length === 0 ? (
            <p className="text-sm text-gray-500">No quotes yet.</p>
          ) : (
            <div className="space-y-3">
              {quotes.map(quote => (
                <div
                  key={quote.id}
                  className="border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{quote.reference}</p>
                    <p className="text-xs text-gray-500">
                      {quote.customer_name} · {quote.vertical} ·{' '}
                      {quote.currency === 'USD' ? 'US$' : quote.currency}
                      {(quote.total_cents / 100).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: {quote.status} · Preferred: {quote.preferred_date ?? 'Not specified'} at{' '}
                      {quote.preferred_time ?? 'Not specified'}
                    </p>
                  </div>
                  {quote.status === 'confirmed' ? (
                    <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold">
                      Confirmed
                    </span>
                  ) : (
                    <button
                      onClick={() => createBooking(quote)}
                      className="px-4 py-2 rounded-xl bg-brand-ink text-white text-sm font-semibold hover:bg-brand-dark transition-colors"
                    >
                      Confirm booking
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {!loading && !error ? (
        bookings.length === 0 ? (
          <p className="mt-5 text-sm text-gray-500">No bookings yet. New customer quotes will appear here.</p>
        ) : (
          <div className="mt-5 space-y-3">
            {bookings.map(booking => (
              <div
                key={booking.id}
                className="border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{booking.reference}</p>
                  <p className="text-xs text-gray-500">
                    {booking.customer_name} · {booking.vertical} · {booking.scheduled_date} at {booking.scheduled_time}
                  </p>
                  <p className="text-xs text-gray-500">
                    Quote status: {booking.quote_status} · Booking status: {booking.status} ·{' '}
                    {booking.currency === 'USD' ? 'US$' : booking.currency}
                    {(booking.total_cents / 100).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => shareOnWhatsApp(booking)}
                  className="px-4 py-2 rounded-xl bg-[#25D366] text-[#043b1e] text-sm font-semibold hover:bg-[#20bd5a] transition-colors"
                >
                  Share on WhatsApp
                </button>
              </div>
            ))}
          </div>
        )
      ) : null}
    </motion.div>
  )
}
