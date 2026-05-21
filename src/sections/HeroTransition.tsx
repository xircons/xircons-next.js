'use client'

import { motion } from 'framer-motion'
import AsciiHoverLabel from '@/components/AsciiHoverLabel'
import { ScrollRevealLetter } from '@/components/ScrollRevealLetter'
import { useScrollRevealTitle } from '@/hooks/useScrollRevealTitle'

const LABEL = '/ ABOUT ME /'
const TITLE_FADE_STYLE = { transition: 'opacity 320ms ease-out' } as const

export default function HeroTransition() {
  const { ref, scrollYProgress, blockY, reduced } = useScrollRevealTitle()
  const letters = LABEL.split('')

  return (
    <div
      ref={ref}
      className="relative -mt-px overflow-x-hidden overflow-y-visible bg-canvas"
    >
      <motion.div
        className="flex min-h-[20vh] w-full items-center justify-center px-4 py-6 sm:min-h-[32vh] sm:py-10"
        style={{ y: blockY }}
      >
        <span className="sr-only">{LABEL}</span>
        <h2 aria-hidden="true" className="m-0 p-0">
          <AsciiHoverLabel
            label={LABEL}
            hideCursor
            measureClassName="inline-flex max-w-full flex-nowrap justify-center font-clash font-700 leading-none tracking-[-0.03em] text-ink"
            measureStyle={{ fontSize: 'clamp(1rem, 9vw, 15rem)' }}
            renderLetter={(char, i, plainOpacity) => (
              <ScrollRevealLetter
                key={`${char}-${i}`}
                char={char}
                index={i}
                total={letters.length}
                scrollYProgress={scrollYProgress}
                reduced={reduced}
                plainOpacity={plainOpacity}
                brandChar
                fadeStyle={reduced ? undefined : TITLE_FADE_STYLE}
              />
            )}
          />
        </h2>
      </motion.div>
    </div>
  )
}
