import { useOnlineStatus } from '../hooks/useOnlineStatus'
import type { QueuedLead } from '../types'

interface Props {
  queue: QueuedLead[]
  flushing: boolean
}

export default function OfflineBanner({ queue, flushing }: Props) {
  const isOnline = useOnlineStatus()

  if (!isOnline) {
    return (
      <div className="bg-amber-500 text-white text-center text-sm py-2 px-4 font-medium">
        Offline Mode — Changes saved locally
      </div>
    )
  }

  if (queue.length > 0) {
    return (
      <div className="bg-emerald-600 text-white text-center text-sm py-2 px-4 font-medium">
        {flushing ? 'Syncing...' : `${queue.length} lead(s) pending sync`}
      </div>
    )
  }

  return null
}
