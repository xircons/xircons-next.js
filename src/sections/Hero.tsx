'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TechStackMarquee from '@/components/TechStackMarquee'
import { clipReveal, staggerContainer, fadeUp } from '@/lib/motion'

export default function Hero() {
  const reduced = useReducedMotion()

  return (
    <section
      id="hero"
      className="flex h-[100dvh] flex-col overflow-hidden bg-canvas pt-20"
    >
      <motion.div
        className="flex min-h-0 flex-1 flex-col"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >

        {/* ── Main headline (single h1, three lines) ───────────────── */}
        <div className="flex min-h-0 flex-1 flex-col justify-center px-4 lg:px-8">
          <motion.h1
            aria-label="Crafting digital experiences."
            className="m-0 w-full font-clash text-[clamp(4.5rem,12.5vw,14rem)] font-700 leading-none tracking-[-0.03em] text-ink"
          >
            <div className="overflow-hidden">
              <motion.span
                variants={reduced ? {} : clipReveal}
                className="block w-full"
              >
                CRAFTING
              </motion.span>
            </div>
            <div className="overflow-hidden">
              <motion.span
                variants={reduced ? {} : clipReveal}
                className="block w-full"
              >
                DIGITAL
              </motion.span>
            </div>
            <div className="overflow-hidden">
              <motion.span
                variants={reduced ? {} : clipReveal}
                className="block w-full"
              >
                EXPERIENCES.
              </motion.span>
            </div>
          </motion.h1>
        </div>

        <div className="relative isolate shrink-0">
          <motion.div
            variants={reduced ? {} : fadeUp}
            className="relative z-0 flex items-end justify-between px-6 py-6 lg:px-10"
          >
            <div className="flex flex-col gap-1">
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-ink">
                FOR COLLABORATION ↘
              </span>
              <a
                href="mailto:wutthikan_s@cmu.ac.th"
                className="font-sans text-xs text-ink underline decoration-ink underline-offset-4 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-ink"
              >
                wutthikan_s@cmu.ac.th
              </a>
            </div>
            <div className="text-right">
              <span className="block font-sans text-xs uppercase tracking-[0.2em] text-ink">
                BASED IN CHIANG MAI, TH
              </span>
            </div>
          </motion.div>
          <TechStackMarquee className="relative z-10" />
        </div>
      </motion.div>
    </section>
  )
}
