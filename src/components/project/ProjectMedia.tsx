'use client'

import { useState } from 'react'
import { useLenis } from '@/components/SmoothScrollProvider'

type Props = {
  src?: string | null
  alt: string
  className?: string
  /** Unused; kept for API compatibility with former next/image usage */
  sizes?: string
  priority?: boolean
  /**
   * `fill` — absolute cover (thumbnails, legacy).
   * `intrinsic` — natural aspect ratio, full width of container (hero, case study gallery).
   */
  variant?: 'fill' | 'intrinsic'
}

type InnerProps = {
  resolved: string
  alt: string
  className: string
  priority?: boolean
  variant: 'fill' | 'intrinsic'
  notifyScrollBoundsChanged: () => void
}

/** Remount when `resolved` changes so load/error state resets without an effect. */
function ProjectMediaInner({
  resolved,
  alt,
  className,
  priority,
  variant,
  notifyScrollBoundsChanged,
}: InnerProps) {
  const [broken, setBroken] = useState(false)

  if (broken) {
    if (variant === 'intrinsic') {
      return (
        <div className={`min-h-[12rem] w-full bg-neutral-200 ${className}`} aria-hidden />
      )
    }
    return <div className={`absolute inset-0 bg-neutral-200 ${className}`} aria-hidden />
  }

  if (variant === 'intrinsic') {
    return (
      <img
        src={resolved}
        alt={alt}
        className={`block h-auto max-w-full ${className}`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => notifyScrollBoundsChanged()}
        onError={() => {
          setBroken(true)
          notifyScrollBoundsChanged()
        }}
      />
    )
  }

  return (
    <img
      src={resolved}
      alt={alt}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onLoad={() => notifyScrollBoundsChanged()}
      onError={() => {
        setBroken(true)
        notifyScrollBoundsChanged()
      }}
    />
  )
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
  variant = 'fill',
}: Props) {
  const { notifyScrollBoundsChanged } = useLenis()
  const resolved = typeof src === 'string' ? src.trim() : ''
  const hasSrc = resolved.length > 0

  if (!hasSrc) {
    if (variant === 'intrinsic') {
      return (
        <div className={`min-h-[12rem] w-full bg-neutral-200 ${className}`} aria-hidden />
      )
    }
    return (
      <div className={`absolute inset-0 bg-neutral-200 ${className}`} aria-hidden />
    )
  }

  return (
    <ProjectMediaInner
      key={resolved}
      resolved={resolved}
      alt={alt}
      className={className}
      priority={priority}
      variant={variant}
      notifyScrollBoundsChanged={notifyScrollBoundsChanged}
    />
  )
}
