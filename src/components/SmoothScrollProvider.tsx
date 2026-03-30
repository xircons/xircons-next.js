'use client'

import { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'

interface LenisContextValue {
  scrollTo: (target: number | string | HTMLElement, opts?: { offset?: number }) => void
  scrollToTop: (opts?: { immediate?: boolean }) => void
  /**
   * Refresh scrollable height after layout changes (images, route).
   * Uses dimensions-only remeasure so Lenis wheel smoothing is not reset
   * (public `lenis.resize()` snaps animatedScroll and feels janky over galleries).
   */
  notifyScrollBoundsChanged: () => void
}

const LenisContext = createContext<LenisContextValue>({
  scrollTo: () => {},
  scrollToTop: () => {},
  notifyScrollBoundsChanged: () => {},
})

export function useLenis() {
  return useContext(LenisContext)
}

interface Props {
  children: React.ReactNode
}

export default function SmoothScrollProvider({ children }: Props) {
  const lenisRef = useRef<Lenis | null>(null)

  const scrollTo = useCallback((target: number | string | HTMLElement, opts?: { offset?: number }) => {
    lenisRef.current?.scrollTo(target, { offset: opts?.offset ?? 0 })
  }, [])

  const scrollToTop = useCallback((opts?: { immediate?: boolean }) => {
    const immediate = opts?.immediate ?? true
    const lenis = lenisRef.current
    if (lenis) {
      lenis.scrollTo(0, { immediate })
    } else if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
  }, [])

  const notifyScrollBoundsChanged = useCallback(() => {
    lenisRef.current?.dimensions.resize()
  }, [])

  useEffect(() => {
    const prevRestoration =
      typeof history !== 'undefined' ? history.scrollRestoration : 'auto'
    if (typeof history !== 'undefined') {
      history.scrollRestoration = 'manual'
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Sticky sidebars with overflow-y-auto (case study) must hand off wheel to the page.
      allowNestedScroll: true,
    })

    lenisRef.current = lenis

    const bumpScrollBounds = () => lenis.dimensions.resize()
    window.addEventListener('load', bumpScrollBounds)

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      window.removeEventListener('load', bumpScrollBounds)
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
      if (typeof history !== 'undefined') {
        history.scrollRestoration = prevRestoration
      }
    }
  }, [])

  return (
    <LenisContext.Provider value={{ scrollTo, scrollToTop, notifyScrollBoundsChanged }}>
      {children}
    </LenisContext.Provider>
  )
}
