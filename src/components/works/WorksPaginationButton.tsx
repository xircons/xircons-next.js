'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'

const HOVER_SPRING = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 24,
  mass: 0.55,
}

export type WorksPaginationButtonProps = {
  direction: 'prev' | 'next'
  onClick: () => void
  /** Optional context for screen readers, e.g. "Page 2 of 3". */
  pageLabel?: string
  ringOffsetClass?: string
}

/**
 * Minimalist text-only pagination control for the Works section.
 * No border, no background, no hover paint. Only the chevron icon
 * translates in its pointing direction on hover / focus.
 */
export default function WorksPaginationButton({
  direction,
  onClick,
  pageLabel,
  ringOffsetClass = 'ring-offset-canvas',
}: WorksPaginationButtonProps) {
  const reduced = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const isPrev = direction === 'prev'
  const Icon = isPrev ? ChevronsLeft : ChevronsRight
  const hoverShift = reduced ? 0 : isPrev ? -10 : 10

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={`${isPrev ? 'Previous' : 'Next'} page${pageLabel ? ` — ${pageLabel}` : ''}`}
      className={`flex w-10 flex-shrink-0 cursor-pointer appearance-none items-center justify-center self-stretch border-0 bg-transparent p-0 text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${ringOffsetClass} lg:w-12`}
    >
      <motion.span
        className="flex items-center justify-center will-change-transform"
        animate={{ x: hovered ? hoverShift : 0 }}
        transition={reduced ? { duration: 0 } : HOVER_SPRING}
        aria-hidden
      >
        <Icon className="size-6 lg:size-7" strokeWidth={2} aria-hidden />
      </motion.span>
    </motion.button>
  )
}
