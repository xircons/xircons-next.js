'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useReducedMotion } from 'framer-motion'
import { useLenis } from '@/components/SmoothScrollProvider'

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

  useEffect(() => {
    const reset = () => scrollToTop({ immediate: true })
    const clearStagger = scheduleScrollResets(reset)
    notifyScrollBoundsChanged()
    return () => clearStagger()
  }, [pathname, reduced, scrollToTop, notifyScrollBoundsChanged])

  return <div className="relative z-0 min-h-0">{children}</div>
}
