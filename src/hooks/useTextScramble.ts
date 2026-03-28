'use client'

import { useState, useEffect, useRef } from 'react'
import { useMotionValueEvent } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?/\\'

function randomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

/**
 * Each character scrambles individually as scroll progresses.
 *
 * SSR / hydration safety:
 *   - `useState` initialises with the REAL text so server HTML matches the
 *     first client render (no hydration mismatch).
 *   - `display.current` also starts as the real text.
 *   - After mount (`mounted` flag) the scramble effect kicks in, replacing
 *     resolved characters with random ones when scroll resets them.
 */
export function useTextScramble(
  text: string,
  scrollProgress: MotionValue<number>,
): string {
  const letters = text.split('')

  const resolved = useRef<boolean[]>(letters.map(() => false))
  // Start display as real text — safe for SSR
  const display  = useRef<string[]>(letters.map((c) => c))
  const timers   = useRef<Map<number, ReturnType<typeof setInterval>>>(new Map())
  const mounted  = useRef(false)

  // Initial state = real text, so server and first client render match exactly
  const [output, setOutput] = useState<string>(text)

  function flush() {
    setOutput(display.current.join(''))
  }

  // Mark as mounted after hydration so random chars can be used safely
  useEffect(() => {
    mounted.current = true

    // If already scrolled into view on mount (e.g. nav-jump), resolve immediately
    const p = scrollProgress.get()
    if (p > 0) {
      letters.forEach((char, i) => {
        if (char === ' ') return
        if (p >= i / letters.length) {
          display.current[i] = char
          resolved.current[i] = true
        } else {
          display.current[i] = randomChar()
        }
      })
      flush()
    } else {
      // Not yet in view — show scrambled characters so the pre-reveal state
      // looks intentional rather than plain text
      letters.forEach((char, i) => {
        if (char === ' ') return
        display.current[i] = randomChar()
        resolved.current[i] = false
      })
      flush()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useMotionValueEvent(scrollProgress, 'change', (progress) => {
    if (!mounted.current) return

    letters.forEach((char, i) => {
      if (char === ' ') { display.current[i] = ' '; return }

      const threshold = i / letters.length

      if (progress < threshold) {
        // Scrolled back above threshold — reset so it can replay
        if (resolved.current[i] || timers.current.has(i)) {
          const id = timers.current.get(i)
          if (id !== undefined) { clearInterval(id); timers.current.delete(i) }
          resolved.current[i] = false
          display.current[i] = randomChar()
          flush()
        }
        return
      }

      if (resolved.current[i]) return
      if (timers.current.has(i)) return

      // Scroll crossed threshold — start per-letter scramble
      let ticks = 0
      const MAX = 8

      const id = setInterval(() => {
        ticks++
        if (ticks >= MAX) {
          display.current[i] = char
          resolved.current[i] = true
          timers.current.delete(i)
          clearInterval(id)
        } else {
          display.current[i] = randomChar()
        }
        flush()
      }, 40)

      timers.current.set(i, id)
      display.current[i] = randomChar()
      flush()
    })
  })

  // Cleanup on unmount
  useEffect(() => {
    return () => { timers.current.forEach(clearInterval) }
  }, [])

  return output
}
