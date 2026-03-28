'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'

interface LenisContextValue {
  scrollTo: (target: string | HTMLElement, opts?: { offset?: number }) => void
}

const LenisContext = createContext<LenisContextValue>({
  scrollTo: () => {},
})

export function useLenis() {
  return useContext(LenisContext)
}

interface Props {
  children: React.ReactNode
}

export default function SmoothScrollProvider({ children }: Props) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
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
    }
  }, [])

  function scrollTo(target: string | HTMLElement, opts?: { offset?: number }) {
    lenisRef.current?.scrollTo(target as string, { offset: opts?.offset ?? 0 })
  }

  return (
    <LenisContext.Provider value={{ scrollTo }}>
      {children}
    </LenisContext.Provider>
  )
}
