import { useState, useCallback } from 'react'
import type { Vertical, LeadData, QuoteParams } from './types'
import { useQuoteEngine } from './hooks/useQuoteEngine'
import { useOfflineQueue } from './hooks/useOfflineQueue'
import { buildWhatsAppUrl } from './utils/wa'
import { printQuoteAsPdf } from './utils/pdf'
import VerticalNav from './components/VerticalNav'
import OfflineBanner from './components/OfflineBanner'
import CommercialQuote from './components/quotes/CommercialQuote'
import OfficeQuote from './components/quotes/OfficeQuote'
import ResidentialQuote from './components/quotes/ResidentialQuote'
import CarQuote from './components/quotes/CarQuote'
import HygieneMartQuote from './components/quotes/HygieneMartQuote'
import QuoteSummary from './components/QuoteSummary'
import BookingForm from './components/BookingForm'
import Footer from './components/Footer'

const VERTICAL_LABELS: Record<Vertical, string> = {
  commercial: 'Commercial',
  residential: 'Residential',
  office: 'Office',
  car: 'Cars',
  hygienemart: 'HygieneMart',
}

export default function App() {
  const [vertical, setVertical] = useState<Vertical>('commercial')
  const { params, updateParams, quote, reset } = useQuoteEngine(vertical)
  const { queue, enqueue, flushing } = useOfflineQueue()
  const [submitted, setSubmitted] = useState<LeadData | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = useCallback(async (contact: { name: string; phone: string; date: string; time: string }) => {
    if (submitting) return
    setSubmitting(true)

    const lead: LeadData = {
      id: crypto.randomUUID(),
      name: contact.name,
      phone: contact.phone,
      vertical,
      params: params as QuoteParams,
      quote,
      preferredDate: contact.date || undefined,
      preferredTime: contact.time || undefined,
      createdAt: new Date().toISOString(),
    }

    enqueue(lead)
    setSubmitted(lead)
    setSubmitting(false)
  }, [vertical, params, quote, enqueue, submitting])

  const handleNewQuote = useCallback(() => {
    setSubmitted(null)
    reset()
  }, [reset])

  const renderQuoteForm = () => {
    switch (vertical) {
      case 'commercial':
        return <CommercialQuote params={params as any} onChange={updateParams as any} />
      case 'office':
        return <OfficeQuote params={params as any} onChange={updateParams as any} />
      case 'residential':
        return <ResidentialQuote params={params as any} onChange={updateParams as any} />
      case 'car':
        return <CarQuote params={params as any} onChange={updateParams as any} />
      case 'hygienemart':
        return <HygieneMartQuote params={params as any} onChange={updateParams as any} />
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <OfflineBanner queue={queue} flushing={flushing} />

      <header className="bg-white/70 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
          <img src="/logo.jpg" alt="Shine Hygiene Solutions" className="h-10 w-auto rounded" />
          <div className="text-left">
            <h1 className="text-lg font-bold text-brand-dark tracking-tight leading-tight">
              Shine Hygiene Solutions
            </h1>
            <p className="text-xs text-gray-500">Instant Quote Engine</p>
          </div>
        </div>
      </header>

      <VerticalNav active={vertical} onChange={v => { setVertical(v); setSubmitted(null); reset() }} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
        {submitted ? (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-brand-light border border-brand/30 rounded-xl p-5 text-center">
              <div className="text-3xl mb-2">&#10003;</div>
              <h2 className="font-semibold text-brand-dark">Quote Submitted!</h2>
              <p className="text-sm text-brand mt-1">
                Your {VERTICAL_LABELS[vertical].toLowerCase()} quote has been received.
                {queue.length > 0 ? ' It will be sent when you reconnect.' : ''}
              </p>
            </div>

            <QuoteSummary quote={submitted.quote} />

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={buildWhatsAppUrl(submitted)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-brand text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-dark transition-all active:scale-[0.98]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Send via WhatsApp
              </a>

              <button
                onClick={() => printQuoteAsPdf(submitted)}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-700 py-3 rounded-xl font-semibold text-sm border-2 border-gray-200 hover:border-brand/60 hover:text-brand-dark transition-all active:scale-[0.98]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                Download PDF
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              A confirmation will also be sent to
              {' '}<a href="mailto:sales@shineclean.co.zw" className="text-brand underline">sales@shineclean.co.zw</a>
            </p>

            <div className="text-center pt-2">
              <button
                onClick={handleNewQuote}
                className="text-sm text-brand hover:text-brand-dark underline underline-offset-2"
              >
                Start a new quote
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              {renderQuoteForm()}
            </div>

            {quote.total > 0 && (
              <>
                <QuoteSummary quote={quote} />

                <BookingForm onSubmit={handleSubmit} disabled={submitting} />

                {queue.length > 0 && (
                  <div className="text-center text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg py-2 px-4">
                    {queue.length} offline quote(s) queued — will sync when back online.
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
