'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDownRight } from 'lucide-react'
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
            className="relative z-0 flex items-end justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5 lg:px-10"
          >
            {/* Shared meta line style — same scale left / right */}
            <div className="min-w-0 flex-1 pr-1">
              <div className="mt-1.5 flex flex-wrap items-center">
                <span className="font-sans text-[10px] font-500 uppercase leading-tight tracking-[0.12em] text-ink sm:text-[clamp(0.72rem,2.1vw,0.88rem)] md:text-xs md:tracking-[0.18em] lg:text-sm">
                FOR COLLABORATION
                </span>
                <ArrowDownRight
                  className="size-3 shrink-0 text-ink sm:size-3.5"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
              <a
                href="mailto:wutthikan_s@cmu.ac.th"
                className="mt-2 block max-w-full font-sans text-[10px] leading-snug text-ink underline decoration-ink underline-offset-[3px] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-ink sm:text-[11px] md:text-xs break-all"
              >
                wutthikan_s@cmu.ac.th
              </a>
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-end gap-0.5 text-right pl-1">
              <span className="block font-sans text-[clamp(0.5rem,2.35vw,0.62rem)] font-500 uppercase leading-tight tracking-[0.1em] text-ink sm:text-[clamp(0.54rem,1.55vw,0.65rem)] md:text-[10px] md:tracking-[0.16em] lg:text-[11px]">
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
