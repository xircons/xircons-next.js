'use client'

import { useRef } from 'react'
import { useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { SCROLL_REVEAL_OFFSET } from '@/components/ScrollRevealLetter'

/** Scroll progress + block lift for oversized transition titles. */
export function useScrollRevealTitle() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion() ?? false

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [...SCROLL_REVEAL_OFFSET],
  })

  const blockY = useTransform(
    scrollYProgress,
    [0, 0.12, 0.28, 1],
    reduced ? ['0%', '0%', '0%', '0%'] : ['-48%', '-22%', '0%', '0%'],
  )

  return { ref, scrollYProgress, blockY, reduced }
}
