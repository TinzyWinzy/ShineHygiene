import { useOnlineStatus } from '../hooks/useOnlineStatus'

export default function AnnouncementBar() {
  const online = useOnlineStatus()

  return (
    <div className="bg-gradient-to-r from-brand-dark via-brand to-brand-dark text-white text-[11px] sm:text-xs text-center py-1.5 sm:py-2 px-4 font-medium tracking-wide relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)] animate-shimmer" />
      <div className="relative flex items-center justify-center gap-2 flex-wrap">
        <span className="hidden sm:inline">🛡️</span>
        <span>WHO Safety Compliant</span>
        <span className="text-white/30 hidden sm:inline">|</span>
        <span className="hidden sm:inline">Operating Since 2020</span>
        <span className="text-white/30 hidden sm:inline">|</span>
        <span>🇿🇼 Harare, Zimbabwe</span>
        {!online && (
          <>
            <span className="text-white/30">|</span>
            <span className="text-amber-200">📵 Offline — quotes saved locally</span>
          </>
        )}
      </div>
    </div>
  )
}
