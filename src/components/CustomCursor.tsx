'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const SIZE_REST = 20
const SIZE_HOVER = 48

/**
 * Circular cursor — position via spring, size via direct DOM updates (no React re-renders on hover targets).
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const hoveredRef = useRef(false)
  const rafRef = useRef(0)
  const pendingRef = useRef({ x: -120, y: -120 })

  const rawX = useMotionValue(-120)
  const rawY = useMotionValue(-120)

  const x = useSpring(rawX, { stiffness: 420, damping: 32, mass: 0.2 })
  const y = useSpring(rawY, { stiffness: 420, damping: 32, mass: 0.2 })

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!finePointer.matches || reducedMotion.matches) return

    document.documentElement.classList.add('cursor-active')

    const setSize = (hovered: boolean) => {
      if (hoveredRef.current === hovered) return
      hoveredRef.current = hovered
      const dot = dotRef.current
      if (!dot) return
      const size = hovered ? SIZE_HOVER : SIZE_REST
      dot.style.width = `${size}px`
      dot.style.height = `${size}px`
    }

    const flushMove = () => {
      rafRef.current = 0
      rawX.set(pendingRef.current.x)
      rawY.set(pendingRef.current.y)
    }

    const onMove = (e: MouseEvent) => {
      const dot = dotRef.current
      const overBrand = (e.target as HTMLElement).closest('[data-no-cursor]')
      if (dot) {
        dot.style.opacity = overBrand ? '0' : '1'
      }

      pendingRef.current.x = e.clientX
      pendingRef.current.y = e.clientY
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(flushMove)
    }

    const hoverTarget =
      'a, button, [role="button"], label, [tabindex]:not([data-no-cursor])'

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (el.closest('[data-no-cursor]')) {
        setSize(false)
        return
      }
      if (el.closest(hoverTarget)) setSize(true)
    }

    const onOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null
      if (related?.closest('[data-no-cursor]')) {
        setSize(false)
        return
      }
      if (!related?.closest(hoverTarget)) setSize(false)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })

    return () => {
      document.documentElement.classList.remove('cursor-active')
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [rawX, rawY])

  return (
    <motion.div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
      style={{
        x,
        y,
        width: SIZE_REST,
        height: SIZE_REST,
        translateX: '-50%',
        translateY: '-50%',
        mixBlendMode: 'difference',
        backgroundColor: '#fff',
        willChange: 'transform',
      }}
    />
  )
}
