'use client'

import { useEffect, useState, startTransition } from 'react'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import { BRAND_LETTER_CLASS } from '@/components/FooterBrand'

const LETTER_DELAY = 0.075
const LETTER_DURATION = 0.4
const HOLD_AFTER_LETTERS = 1
const FADE_DURATION = 0.3
const BLINDS_EXTRA_DELAY = 0.3
const BLINDS_DURATION = 0.6
const BLINDS_EASE = [0.42, 0, 0.58, 1] as const
const LETTER_EASE = [0.25, 0.1, 0.25, 1] as const

const BG = '#1a1a1a'
const TEXT = '#ffffff'

export type RevealPreloaderProps = {
  logoText: string
  onComplete: () => void
  backgroundColor?: string
  textColor?: string
}

/**
 * Reveal preloader: staggered logo, fade, center-split blinds.
 */
export default function RevealPreloader({
  logoText,
  onComplete,
  backgroundColor = BG,
  textColor = TEXT,
}: RevealPreloaderProps) {
  const reduced = useReducedMotion()
  const topControls = useAnimation()
  const bottomControls = useAnimation()
  const [animationComplete, setAnimationComplete] = useState(false)
  const [shouldRender, setShouldRender] = useState(true)

  const letters = [...logoText]
  const fadeOutDelay =
    (letters.length - 1) * LETTER_DELAY + LETTER_DURATION + HOLD_AFTER_LETTERS
  const blindsDelay = fadeOutDelay + FADE_DURATION + BLINDS_EXTRA_DELAY

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  useEffect(() => {
    if (reduced) {
      onComplete()
      return
    }

    let cancelled = false

    const run = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready
      }
      if (cancelled) return

      await new Promise((resolve) => setTimeout(resolve, blindsDelay * 1000))
      if (cancelled) return

      await Promise.all([
        topControls.start({
          y: '-100%',
          transition: { duration: BLINDS_DURATION, ease: BLINDS_EASE },
        }),
        bottomControls.start({
          y: '100%',
          transition: { duration: BLINDS_DURATION, ease: BLINDS_EASE },
        }),
      ])
      if (cancelled) return

      startTransition(() => {
        setAnimationComplete(true)
        setTimeout(() => {
          setShouldRender(false)
          onComplete()
        }, 100)
      })
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [reduced, onComplete, topControls, bottomControls, blindsDelay])

  if (!shouldRender) return null

  const pointerEvents = animationComplete ? 'none' : 'auto'

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        pointerEvents,
      }}
    >
      <motion.div
        aria-hidden
        animate={topControls}
        initial={{ y: 0 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '50%',
          backgroundColor,
          pointerEvents,
        }}
      />
      <motion.div
        aria-hidden
        animate={bottomControls}
        initial={{ y: 0 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '50%',
          backgroundColor,
          pointerEvents,
        }}
      />

      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: fadeOutDelay, duration: FADE_DURATION }}
        className="absolute left-1/2 top-1/2 z-[10001] -translate-x-1/2 -translate-y-1/2"
        style={{ pointerEvents }}
      >
        <div
          className={`inline-flex max-w-full flex-nowrap items-baseline justify-center gap-x-[0.06em] ${BRAND_LETTER_CLASS}`}
          style={{ color: textColor }}
        >
          {letters.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * LETTER_DELAY,
                duration: LETTER_DURATION,
                ease: LETTER_EASE,
              }}
              className={`inline-block${letter === '.' ? ' min-w-[0.35em] text-center' : ''}`}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
