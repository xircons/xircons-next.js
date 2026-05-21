'use client'

import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import AsciiHoverLabel from '@/components/AsciiHoverLabel'
import { ScrollRevealLetter } from '@/components/ScrollRevealLetter'
import { useScrollRevealTitle } from '@/hooks/useScrollRevealTitle'

const TITLE_FADE_STYLE = { transition: 'opacity 320ms ease-out' } as const

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
  className = 'relative -mt-px overflow-x-auto overflow-y-visible border-t-2 border-ink bg-canvas',
  blockClassName = 'flex min-h-[20vh] w-full items-center justify-center px-4 py-6 sm:min-h-[32vh] sm:py-10',
  headingClassName =
    'inline-flex max-w-full flex-nowrap justify-center font-clash font-700 leading-none tracking-[-0.03em] text-ink',
  headingStyle,
}: Omit<Props, 'simple'>) {
  const { ref, scrollYProgress, blockY, reduced } = useScrollRevealTitle()
  const letters = label.split('')

  return (
    <div ref={ref} className={className}>
      <motion.div className={blockClassName} style={{ y: blockY }}>
        <span className="sr-only">{label}</span>
        <h2 aria-hidden="true" className="m-0 p-0">
          <AsciiHoverLabel
            label={label}
            hideCursor
            measureClassName={headingClassName}
            measureStyle={{
              fontSize: 'clamp(1rem, 7vw, 15rem)',
              ...headingStyle,
            }}
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

/**
 * Scroll-driven oversized title: letters rise into view; whole block shifts on scroll.
 * Use `simple` for a static, non-clipped heading (e.g. long “MORE WORKS” labels).
 */
export default function ScrollRevealTitle({
  label,
  className = 'relative -mt-px overflow-x-auto overflow-y-visible border-t-2 border-ink bg-canvas',
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
