import { useState } from 'react'

export type PhotoSlotName = 'hero' | 'home' | 'office' | 'supplies' | 'car' | 'about'

interface Props {
  name: PhotoSlotName
  /** Describes the service and context, not "image of cleaner". */
  alt: string
  className?: string
  /** Focal point for object-cover, e.g. 'right' keeps a subject that sits off-centre. */
  position?: 'center' | 'left' | 'right' | 'top' | 'bottom'
  /** Use the first frame on request instead of the full decode. */
  priority?: boolean
}

/** Drop the approved photograph here to fill the slot. See public/photos/README.md. */
const photoSrc = (name: PhotoSlotName) => `/photos/${name}.jpg`

/**
 * Static map, not a template string. Tailwind only emits classes it can find as
 * complete literals in the source, so `object-${position}` would compile to nothing.
 */
const objectPosition: Record<NonNullable<Props['position']>, string> = {
  center: 'object-center',
  left: 'object-left',
  right: 'object-right',
  top: 'object-top',
  bottom: 'object-bottom',
}

/**
 * Image slot for approved Shine photography.
 *
 * Until a photo is supplied for a slot, it renders a quiet placeholder that
 * keeps the layout, contrast and alt text correct. It never borrows stock
 * imagery and never invents people or claims.
 */
export default function PhotoSlot({ name, alt, className = '', position = 'center', priority = false }: Props) {
  const [missing, setMissing] = useState(false)

  // Above-the-fold hero image loads eagerly; the rest stay lazy.
  return missing ? (
    <div
      data-photo-slot={name}
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden bg-navy-800 ${className}`}
    >
      <div className="absolute inset-0 hero-grid" aria-hidden="true" />
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h1.5l1.2-1.6A2 2 0 019.3 4h5.4a2 2 0 011.6.8L17.5 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
    </div>
  ) : (
    <img
      src={photoSrc(name)}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => setMissing(true)}
      className={`object-cover ${objectPosition[position]} ${className}`}
    />
  )
}
