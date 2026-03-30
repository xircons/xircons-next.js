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
        <div className="grid gap-10 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-stretch lg:gap-x-12 lg:gap-y-0 lg:pb-24 xl:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
          {/* Left column: title + copy top, experience lines bottom-left (same band as photo) */}
          <div className="flex min-h-0 min-w-0 flex-col gap-8 lg:h-full lg:justify-between lg:gap-0">
            <div className="flex flex-col gap-8 lg:gap-10">
              <h2
                aria-hidden="true"
                className="w-full font-clash text-[clamp(2.75rem,7vw,8.25rem)] font-700 leading-[0.95] tracking-tighter text-canvas xl:text-[clamp(2.75rem,6.5vw,7.75rem)]"
              >
                {scrambledTitle}
              </h2>
              <p
                aria-hidden="true"
                className="max-w-2xl font-mono text-sm leading-relaxed tracking-wide text-canvas"
              >
                {scrambledDesc}
              </p>
            </div>
            <ul role="list" className="hidden shrink-0 flex-col gap-2 text-left lg:flex">
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

          {/* Right column: photo (bottom-aligned with left-column caption) */}
          <div className="flex h-full min-h-0 items-end justify-center lg:justify-end lg:pt-1">
            <img
              src="/___________________copykub.jpg"
              alt=""
              aria-hidden
              className="pointer-events-none aspect-[3/4] w-full max-w-[min(100%,20rem)] object-cover grayscale sm:max-w-[22rem] lg:max-w-none"
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
