import { motion, AnimatePresence } from 'motion/react'
import type { LeadDraft } from '../types'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

interface Props {
  drafts: LeadDraft[]
}

export default function OfflineBanner({ drafts }: Props) {
  const isOnline = useOnlineStatus()
  const pending = drafts.filter(d => d.status === 'pending').length
  const handedOff = drafts.length - pending

  if (isOnline && drafts.length === 0) return null

  let message: string
  if (!isOnline) {
    message =
      drafts.length > 0
        ? `Offline — ${drafts.length} saved quote${drafts.length === 1 ? '' : 's'} on this device`
        : 'Offline — quotes are saved on this device'
  } else if (pending > 0) {
    message = `${pending} saved quote${pending === 1 ? '' : 's'} on this device — not sent yet`
  } else {
    message = `${handedOff} quote${handedOff === 1 ? '' : 's'} handed to WhatsApp`
  }

  return (
    <AnimatePresence>
      <motion.div
        key={message}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="overflow-hidden"
      >
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center text-sm py-2.5 px-4 font-medium flex items-center justify-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {message}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
