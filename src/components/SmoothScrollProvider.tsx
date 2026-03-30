'use client'

import { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'

interface LenisContextValue {
  scrollTo: (target: number | string | HTMLElement, opts?: { offset?: number }) => void
  scrollToTop: (opts?: { immediate?: boolean }) => void
}

const LenisContext = createContext<LenisContextValue>({
  scrollTo: () => {},
  scrollToTop: () => {},
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
    })

    lenisRef.current = lenis

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
      if (typeof history !== 'undefined') {
        history.scrollRestoration = prevRestoration
      }
    }
  }, [])

  return (
    <LenisContext.Provider value={{ scrollTo, scrollToTop }}>
      {children}
    </LenisContext.Provider>
  )
}
