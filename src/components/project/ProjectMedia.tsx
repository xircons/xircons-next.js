'use client'

import { useEffect, useState } from 'react'

type Props = {
  src?: string | null
  alt: string
  className?: string
  /** Unused; kept for API compatibility with former next/image usage */
  sizes?: string
  priority?: boolean
}

/**
 * Native &lt;img&gt; only (avoids next/image + SVG/hydration issues in layout parents).
 * Missing src or onError → plain grey block, no icon.
 */
export default function ProjectMedia({
  src,
  alt,
  className = '',
  priority,
}: Props) {
  const [broken, setBroken] = useState(false)
  const resolved = typeof src === 'string' ? src.trim() : ''
  const hasSrc = resolved.length > 0

  useEffect(() => {
    setBroken(false)
  }, [resolved])

  if (!hasSrc) {
    return (
      <div className={`absolute inset-0 bg-neutral-200 ${className}`} aria-hidden />
    )
  }

  if (broken) {
    return <div className={`absolute inset-0 bg-neutral-200 ${className}`} aria-hidden />
  }

  return (
    <img
      src={resolved}
      alt={alt}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setBroken(true)}
    />
  )
}
