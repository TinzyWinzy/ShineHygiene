import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Vertical } from './types'
import { useQuoteEngine } from './hooks/useQuoteEngine'
import { useLeadDrafts } from './hooks/useLeadDrafts'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { createLead } from './domain/quoteState'
import { newId } from './utils/id'
import { buildWhatsAppUrl } from './utils/wa'
import { printQuoteAsPdf } from './utils/pdf'
import { submitLead, LeadApiError } from './utils/api'
import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'
import VerticalNav from './components/VerticalNav'
import QuoteSummary from './components/QuoteSummary'
import BookingForm from './components/BookingForm'
import OfflineBanner from './components/OfflineBanner'
import Footer from './components/Footer'
import CommercialQuote from './components/quotes/CommercialQuote'
import OfficeQuote from './components/quotes/OfficeQuote'
import ResidentialQuote from './components/quotes/ResidentialQuote'
import CarQuote from './components/quotes/CarQuote'
import HygieneMartQuote from './components/quotes/HygieneMartQuote'

const VERTICAL_LABELS: Record<Vertical, string> = {
  commercial: 'Commercial',
  residential: 'Residential',
  office: 'Office',
  car: 'Cars',
  hygienemart: 'HygieneMart',
}

const VERTICAL_ICONS: Record<Vertical, string> = {
  commercial: '🏢',
  residential: '🏠',
  office: '💼',
  car: '🚗',
  hygienemart: '🧴',
}

interface SubmissionState {
  lead: ReturnType<typeof createLead>
  reference?: string
  error?: string
}

export default function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [submitted, setSubmitted] = useState<SubmissionState | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { state, dispatch, setVertical, reset, quote } = useQuoteEngine()
  const { drafts, saveDraft, markSubmitted, markHandedOff, removeDraft, clearHandedOff, storageError } = useLeadDrafts()
  const isOnline = useOnlineStatus()

  const vertical = state.vertical
  const pendingDrafts = drafts.filter(d => d.status === 'pending').length
  const submittedDrafts = drafts.filter(d => d.status === 'submitted').length
  const handedOffDrafts = drafts.filter(d => d.status === 'handed_off').length
  const draftSummary = [
    pendingDrafts > 0
      ? `${pendingDrafts} saved quote${pendingDrafts === 1 ? '' : 's'} on this device — not sent yet`
      : '',
    submittedDrafts > 0
      ? `${submittedDrafts} quote request${submittedDrafts === 1 ? '' : 's'} received by our office`
      : '',
  ]
    .filter(Boolean)
    .join(' · ')

  const handleStart = useCallback((v?: Vertical) => {
    setShowLanding(false)
    setSubmitted(null)
    if (v) setVertical(v)
  }, [setVertical])

  const handleSubmit = useCallback(
    async (contact: { name: string; phone: string; date: string; time: string }) => {
      if (submitting) return
      setSubmitting(true)

      const lead = createLead(
        state,
        {
          id: newId(),
          name: contact.name,
          phone: contact.phone,
          preferredDate: contact.date || undefined,
          preferredTime: contact.time || undefined,
          createdAt: new Date().toISOString(),
        },
        quote,
      )

      // Keep a local copy before the network call, so a timeout can never lose the lead.
      saveDraft(lead)

      if (!isOnline) {
        setSubmitted({ lead })
        setSubmitting(false)
        return
      }

      try {
        const receipt = await submitLead(lead)
        markSubmitted(lead.id, receipt.reference)
        setSubmitted({ lead, reference: receipt.reference })
      } catch (error) {
        const message =
          error instanceof LeadApiError
            ? error.message
            : 'Our office could not save your request. Your quote is still saved on this device.'
        setSubmitted({ lead, error: message })
      } finally {
        setSubmitting(false)
      }
    },
    [state, quote, saveDraft, markSubmitted, submitting, isOnline],
  )

  const retrySubmit = useCallback(async () => {
    if (!submitted || submitting) return
    setSubmitting(true)
    try {
      const receipt = await submitLead(submitted.lead)
      markSubmitted(submitted.lead.id, receipt.reference)
      setSubmitted({ lead: submitted.lead, reference: receipt.reference })
    } catch (error) {
      const message =
        error instanceof LeadApiError
          ? error.message
          : 'Our office could not save your request. Your quote is still saved on this device.'
      setSubmitted(previous => (previous ? { ...previous, error: message } : previous))
    } finally {
      setSubmitting(false)
    }
  }, [submitted, submitting, markSubmitted])

  const handleNewQuote = useCallback(() => {
    setSubmitted(null)
    reset()
  }, [reset])

  const handleVerticalChange = useCallback((v: Vertical) => {
    setSubmitted(null)
    setVertical(v)
  }, [setVertical])

  const goHome = useCallback(() => {
    setShowLanding(true)
    setSubmitted(null)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {showLanding ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="min-h-dvh bg-gradient-to-b from-gray-50 via-white to-gray-50 flex flex-col"
        >
          <AnnouncementBar />
          <OfflineBanner drafts={drafts} />
          <Navbar onStart={() => handleStart()} />
          <LandingPage onStart={handleStart} />
          <Footer />
        </motion.div>
      ) : (
        <motion.div
          key="quote"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="min-h-dvh bg-gradient-to-b from-gray-50 via-white to-gray-50 flex flex-col relative"
        >
          <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand-dark/5 rounded-full blur-3xl" />
          </div>

          <AnnouncementBar />
          <OfflineBanner drafts={drafts} />
          <Navbar onStart={goHome} />

          <VerticalNav active={vertical} onChange={handleVerticalChange} />

          <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-4 sm:py-6 space-y-5">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="submitted"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  <div
                    role="status"
                    className="bg-gradient-to-br from-brand-light to-white border border-brand/20 rounded-2xl p-6 sm:p-8 text-center shadow-lg shadow-brand/5"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.15 }}
                      className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-ink to-brand-dark mx-auto mb-4 flex items-center justify-center shadow-lg shadow-brand/20"
                    >
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="text-xl font-bold text-brand-dark"
                    >
                      {submitted.reference ? 'Quote request received' : 'Your quote is ready'}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="text-sm text-brand-ink mt-1"
                    >
                      {submitted.reference ? (
                        <>
                          Your request is saved with reference{' '}
                          <strong className="font-semibold text-brand-dark">{submitted.reference}</strong>. Tap
                          &ldquo;Send via WhatsApp&rdquo; to confirm the details with our team.
                        </>
                      ) : (
                        <>
                          Nothing has been sent yet. Tap &ldquo;Send via WhatsApp&rdquo; to hand this{' '}
                          {VERTICAL_LABELS[submitted.lead.vertical].toLowerCase()}{' '}
                          {VERTICAL_ICONS[submitted.lead.vertical]} quote to our team.
                        </>
                      )}
                    </motion.p>
                    {!isOnline && (
                      <p className="text-xs text-amber-700 mt-2">
                        You are offline. This quote is saved on this device and will stay here until you clear it.
                      </p>
                    )}
                  </div>

                  {submitted.error && (
                    <div
                      role="alert"
                      className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-800"
                    >
                      <p>{submitted.error}</p>
                      <button
                        onClick={retrySubmit}
                        disabled={submitting}
                        className="mt-2 inline-flex items-center gap-1.5 font-semibold text-red-900 underline underline-offset-2 disabled:opacity-50"
                      >
                        {submitting ? 'Trying again…' : 'Try again'}
                      </button>
                    </div>
                  )}

                  <QuoteSummary quote={submitted.lead.quote} />

                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.a
                      href={buildWhatsAppUrl(submitted.lead)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => markHandedOff(submitted.lead.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2.5 bg-[#25D366] text-[#043b1e] py-3.5 rounded-xl font-semibold text-sm hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/20 hover:shadow-xl hover:shadow-[#25D366]/30"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Send via WhatsApp
                    </motion.a>

                    <motion.button
                      onClick={() => printQuoteAsPdf(submitted.lead)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-700 py-3.5 rounded-xl font-semibold text-sm border-2 border-gray-200 hover:border-brand/40 hover:text-brand-dark hover:shadow-lg transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                      Download PDF
                    </motion.button>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    {submitted.reference
                      ? 'Saved to our office. Send it via WhatsApp to confirm scheduling.'
                      : 'This quote is saved as a draft on this device. It is not sent automatically.'}
                  </p>

                  <div className="text-center pt-1 flex items-center justify-center gap-4">
                    <motion.button
                      onClick={handleNewQuote}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-1.5 text-sm text-brand-ink hover:text-brand-dark font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      Start a new quote
                    </motion.button>
                    <button
                      onClick={() => {
                        removeDraft(submitted.lead.id)
                        setSubmitted(null)
                      }}
                      className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
                    >
                      Delete saved quote
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={vertical}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="text-center py-2">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
                      {VERTICAL_ICONS[vertical]} {VERTICAL_LABELS[vertical]}
                    </p>
                    <h2 className="text-lg font-bold text-brand-dark mt-0.5">Configure Your Quote</h2>
                  </div>

                  <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-lg shadow-gray-200/50 p-5">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={vertical}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                      >
                        {state.vertical === 'commercial' && (
                          <CommercialQuote
                            params={state.params}
                            onChange={patch => dispatch({ type: 'updateCommercial', patch })}
                          />
                        )}
                        {state.vertical === 'office' && (
                          <OfficeQuote
                            params={state.params}
                            onChange={patch => dispatch({ type: 'updateOffice', patch })}
                          />
                        )}
                        {state.vertical === 'residential' && (
                          <ResidentialQuote
                            params={state.params}
                            onChange={patch => dispatch({ type: 'updateResidential', patch })}
                          />
                        )}
                        {state.vertical === 'car' && (
                          <CarQuote
                            params={state.params}
                            onChange={patch => dispatch({ type: 'updateCar', patch })}
                          />
                        )}
                        {state.vertical === 'hygienemart' && (
                          <HygieneMartQuote
                            params={state.params}
                            onChange={patch => dispatch({ type: 'updateHygieneMart', patch })}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {quote.total > 0 && (
                    <motion.div
                      key={`summary-${vertical}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.1 }}
                      className="space-y-5"
                    >
                      <QuoteSummary quote={quote} />
                      <BookingForm onSubmit={handleSubmit} disabled={submitting} />

                      {storageError && (
                        <p role="alert" className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl py-2.5 px-4 text-center">
                          This browser could not save your draft. Send it via WhatsApp before closing this page.
                        </p>
                      )}

                      {drafts.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl py-2.5 px-4">
                          {draftSummary && (
                            <span className="inline-flex items-center gap-2">
                              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              {draftSummary}.
                            </span>
                          )}
                          {handedOffDrafts > 0 && (
                            <button onClick={clearHandedOff} className="underline underline-offset-2 hover:text-amber-900">
                              Clear {handedOffDrafts} handed-off draft{handedOffDrafts === 1 ? '' : 's'}
                            </button>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
