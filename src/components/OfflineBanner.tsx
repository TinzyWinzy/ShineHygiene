import { motion, AnimatePresence } from 'motion/react'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import type { QueuedLead } from '../types'

interface Props {
  queue: QueuedLead[]
  flushing: boolean
}

export default function OfflineBanner({ queue, flushing }: Props) {
  const isOnline = useOnlineStatus()

  if (isOnline && queue.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="overflow-hidden"
      >
        {!isOnline ? (
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center text-sm py-2.5 px-4 font-medium flex items-center justify-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 000-7.07m-4.243 4.243a1 1 0 010-1.414" /></svg>
            Offline Mode — Changes saved locally
          </div>
        ) : (
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-center text-sm py-2.5 px-4 font-medium flex items-center justify-center gap-2">
            <svg className={`w-4 h-4 shrink-0 ${flushing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {flushing ? 'Syncing...' : `${queue.length} lead(s) pending sync`}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
