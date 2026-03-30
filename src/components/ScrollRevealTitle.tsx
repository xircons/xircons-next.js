'use client'

import { useRef, type CSSProperties } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'

function MaskedLetter({
  char,
  index,
  total,
  scrollYProgress,
  reduced,
}: {
  char: string
  index: number
  total: number
  scrollYProgress: MotionValue<number>
  reduced: boolean
}) {
  const n = Math.max(total, 1)
  const start = 0.08 + (index / n) * 0.5
  const end = Math.min(start + 0.1, 0.96)

  const y = useTransform(
    scrollYProgress,
    [0, start, end, 1],
    reduced ? ['0%', '0%', '0%', '0%'] : ['-118%', '-118%', '0%', '0%'],
  )

  return (
    <span className="inline-block overflow-hidden align-baseline">
      <motion.span className="inline-block" style={{ y }}>
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  )
}

type Props = {
  label: string
  className?: string
  blockClassName?: string
  headingClassName?: string
  headingStyle?: CSSProperties
  /** Plain centered title — avoids clipped letter animation on long strings. */
  simple?: boolean
}

function ScrollRevealTitleAnimated({
  label,
  className = 'relative -mt-px overflow-x-auto overflow-y-hidden border-t-2 border-ink bg-canvas',
  blockClassName = 'flex min-h-[20vh] w-full items-center justify-center px-4 py-6 sm:min-h-[32vh] sm:py-10',
  headingClassName =
    'inline-flex max-w-full flex-nowrap justify-center font-clash font-700 leading-none tracking-[-0.03em] text-ink',
  headingStyle,
}: Omit<Props, 'simple'>) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion() ?? false

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const blockY = useTransform(
    scrollYProgress,
    [0, 0.12, 0.28, 1],
    reduced ? ['0%', '0%', '0%', '0%'] : ['-48%', '-22%', '0%', '0%'],
  )

  const letters = label.split('')

  return (
    <div ref={ref} className={className}>
      <motion.div className={blockClassName} style={{ y: blockY }}>
        <span className="sr-only">{label}</span>
        <h2
          aria-hidden="true"
          className={headingClassName}
          style={{
            fontSize: 'clamp(1rem, 7vw, 15rem)',
            ...headingStyle,
          }}
        >
          {letters.map((char, i) => (
            <MaskedLetter
              key={i}
              char={char}
              index={i}
              total={letters.length}
              scrollYProgress={scrollYProgress}
              reduced={reduced}
            />
          ))}
        </h2>
      </motion.div>
    </div>
  )
}

/**
 * Scroll-driven oversized title: letters rise into view; whole block shifts on scroll.
 * Use `simple` for a static, non-clipped heading (e.g. long “MORE WORKS” labels).
 */
export default function ScrollRevealTitle({
  label,
  className = 'relative -mt-px overflow-x-auto overflow-y-hidden border-t-2 border-ink bg-canvas',
  blockClassName = 'flex min-h-[20vh] w-full items-center justify-center px-4 py-6 sm:min-h-[32vh] sm:py-10',
  headingClassName,
  headingStyle,
  simple = false,
}: Props) {
  if (simple) {
    return (
      <div className={className}>
        <div className={blockClassName}>
          <h2
            className="max-w-full whitespace-normal break-words px-2 text-center font-clash font-700 leading-tight tracking-[-0.03em] text-ink"
            style={{
              fontSize: 'clamp(1.5rem, 5.5vw, 6rem)',
              ...headingStyle,
            }}
          >
            {label}
          </h2>
        </div>
      </div>
    )
  }

  return (
    <ScrollRevealTitleAnimated
      label={label}
      className={className}
      blockClassName={blockClassName}
      headingClassName={
        headingClassName ??
        'inline-flex max-w-full flex-nowrap justify-center font-clash font-700 leading-none tracking-[-0.03em] text-ink'
      }
      headingStyle={headingStyle}
    />
  )
}
