'use client'

import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'

const LABEL = '/ RECENT WORK /'

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

export default function AboutMeTransition() {
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

  const letters = LABEL.split('')

  return (
    <div
      ref={ref}
      className="relative -mt-px overflow-hidden border-t-2 border-ink bg-canvas"
    >
      <motion.div
        className="flex min-h-[20vh] w-full items-center justify-center px-4 py-6 sm:min-h-[32vh] sm:py-10"
        style={{ y: blockY }}
      >
        <span className="sr-only">{LABEL}</span>
        <h2
          aria-hidden="true"
          className="inline-flex max-w-full flex-nowrap justify-center font-clash font-700 leading-none tracking-[-0.03em] text-ink"
          style={{ fontSize: 'clamp(1rem, 7vw, 15rem)' }}
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
