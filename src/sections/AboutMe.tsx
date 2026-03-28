'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useReducedMotion } from 'framer-motion'
import { useTextScramble } from '@/hooks/useTextScramble'
import type { PortfolioAbout } from '@/types/portfolio'

interface Props {
  data: PortfolioAbout
}

const EXPERIENCE_ITEMS = [
  '/CODING THINGS',
  '/SMOOTH INTERACTIONS',
  '/BACKEND WIRING',
  '/MAKING IT FAST',
]

export default function AboutMe({ data }: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })

  // scrollYProgress: 0 when section enters bottom of viewport, 1 when section top reaches viewport center
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.2'],
  })

  const scrambledTitle = useTextScramble(data.title, scrollYProgress)
  const scrambledDesc  = useTextScramble(data.description, scrollYProgress)

  return (
    <section
      id="about"
      ref={ref}
      data-theme="dark"
      style={{ minHeight: '105vh' }}
      className="relative flex flex-col justify-center bg-ink px-6 py-24 lg:px-10"
    >
      <span className="sr-only">{data.title}</span>
      <span className="sr-only">{data.description}</span>

      <motion.div
        className="relative z-10 w-full"
        initial={reduced ? false : { y: -60 }}
        animate={inView ? { y: 0 } : undefined}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* ── Massive scramble heading ──── */}
        <h2
          aria-hidden="true"
          className="mb-12 w-full font-clash text-[clamp(3.5rem,10vw,11rem)] font-700 leading-none tracking-tighter text-canvas"
        >
          {scrambledTitle}
        </h2>

        {/* ── Two-column body ──────────────────────────────────────── */}
        <div className="grid gap-12 lg:grid-cols-[1fr_auto]">
          <p
            aria-hidden="true"
            className="max-w-2xl font-mono text-sm leading-relaxed tracking-wide text-canvas"
          >
            {scrambledDesc}
          </p>

          <ul role="list" className="flex flex-col gap-2 text-left lg:text-right">
            {EXPERIENCE_ITEMS.map((item) => (
              <li
                key={item}
                className="font-sans text-xs font-500 uppercase tracking-[0.2em] text-canvas"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

      </motion.div>
    </section>
  )
}
