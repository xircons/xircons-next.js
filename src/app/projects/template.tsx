'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useLenis } from '@/components/SmoothScrollProvider'

const CURTAIN_EASE = [0.22, 1, 0.36, 1] as const

/** Lenis + Next can restore scroll after our first reset; stagger several immediate jumps to y=0. */
function scheduleScrollResets(scrollToTop: () => void) {
  scrollToTop()
  queueMicrotask(scrollToTop)

  let innerRaf = 0
  const outerRaf = requestAnimationFrame(() => {
    scrollToTop()
    innerRaf = requestAnimationFrame(() => {
      scrollToTop()
    })
  })

  const t0 = window.setTimeout(scrollToTop, 0)
  const t50 = window.setTimeout(scrollToTop, 50)

  return () => {
    cancelAnimationFrame(outerRaf)
    if (innerRaf) cancelAnimationFrame(innerRaf)
    window.clearTimeout(t0)
    window.clearTimeout(t50)
  }
}

export default function ProjectsTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduced = useReducedMotion() ?? false
  const { scrollToTop, notifyScrollBoundsChanged } = useLenis()
  const [open, setOpen] = useState(reduced)

  useEffect(() => {
    const reset = () => scrollToTop({ immediate: true })

    if (reduced) {
      setOpen(true)
      return scheduleScrollResets(reset)
    }

    setOpen(false)
    const clearStagger = scheduleScrollResets(reset)

    const curtainRaf = requestAnimationFrame(() => {
      setOpen(true)
      reset()
      requestAnimationFrame(reset)
    })

    return () => {
      cancelAnimationFrame(curtainRaf)
      clearStagger()
    }
  }, [pathname, reduced, scrollToTop])

  /** Curtain + client navigations skip `window` `load`; refresh Lenis when content shows and after transition. */
  useEffect(() => {
    if (!open) return
    notifyScrollBoundsChanged()
    const id = window.setTimeout(notifyScrollBoundsChanged, reduced ? 0 : 2100)
    return () => window.clearTimeout(id)
  }, [open, reduced, pathname, notifyScrollBoundsChanged])

  const duration = reduced ? 2 : 2

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-40 bg-ink"
        style={{ height: '50dvh' }}
        initial={false}
        animate={{ y: open ? '-100%' : '0%' }}
        transition={{ duration, ease: CURTAIN_EASE }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 bg-ink"
        style={{ height: '50dvh' }}
        initial={false}
        animate={{ y: open ? '100%' : '0%' }}
        transition={{ duration, ease: CURTAIN_EASE }}
      />
      {/*
        Stack page content above curtains (z-40). A fixed header inside <main> was painting
        underneath sibling curtains because the whole main subtree sat below z-40.
      */}
      <div className="relative z-[41] min-h-0">{children}</div>
    </>
  )
}
