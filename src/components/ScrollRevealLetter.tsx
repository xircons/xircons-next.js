'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import type { CSSProperties } from 'react'

/** Same scroll window as Contact headlines — section enters → center hits top. */
export const SCROLL_REVEAL_OFFSET = ['start end', 'center start'] as const

export function getScrollLetterTiming(index: number, total: number) {
  const n = Math.max(total, 1)
  const start = 0.05 + (index / n) * 0.5
  const end = Math.min(start + 0.1, 0.92)
  return { start, end }
}

type Props = {
  char: string
  index: number
  total: number
  scrollYProgress: MotionValue<number>
  reduced: boolean
  plainOpacity?: number
  /** For ASCII mask sampling in AsciiHoverLabel */
  brandChar?: boolean
  fadeStyle?: CSSProperties
  className?: string
}

/** Per-letter clip: slides from above into place on scroll (Contact-style). */
export function ScrollRevealLetter({
  char,
  index,
  total,
  scrollYProgress,
  reduced,
  plainOpacity = 1,
  brandChar = false,
  fadeStyle,
  className = '',
}: Props) {
  const { start, end } = getScrollLetterTiming(index, total)

  const y = useTransform(
    scrollYProgress,
    [0, start, end, 1],
    reduced ? ['0%', '0%', '0%', '0%'] : ['-118%', '-118%', '0%', '0%'],
  )

  return (
    <span
      {...(brandChar ? { 'data-brand-char': true } : {})}
      className={`inline-block overflow-hidden align-baseline leading-none ${className}`.trim()}
      style={{
        opacity: plainOpacity,
        ...fadeStyle,
      }}
    >
      <motion.span className="inline-block will-change-transform" style={{ y }}>
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  )
}
