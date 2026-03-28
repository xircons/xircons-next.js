'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Circular expanding cursor for fine-pointer (mouse) devices.
 * Disabled automatically when prefers-reduced-motion is set.
 *
 * The cursor element always renders but starts at (-120, -120) so it is
 * invisible until the first mousemove. The `cursor-active` class on <html>
 * (toggled via DOM — not setState — inside the effect) hides the native
 * pointer only for qualifying devices. `setHovered` is called exclusively
 * inside event-listener callbacks, satisfying the no-sync-setState-in-effect
 * rule.
 */
export default function CustomCursor() {
  const [hovered, setHovered] = useState(false)

  const rawX = useMotionValue(-120)
  const rawY = useMotionValue(-120)

  const x = useSpring(rawX, { stiffness: 300, damping: 28, mass: 0.25 })
  const y = useSpring(rawY, { stiffness: 300, damping: 28, mass: 0.25 })

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!finePointer.matches || reducedMotion.matches) return

    // DOM-only side effect — no setState in the effect body
    document.documentElement.classList.add('cursor-active')

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (el.closest('a, button, [role="button"], label, [tabindex]')) {
        setHovered(true)
      }
    }

    const onOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null
      if (!related?.closest('a, button, [role="button"], label, [tabindex]')) {
        setHovered(false)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })

    return () => {
      document.documentElement.classList.remove('cursor-active')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [rawX, rawY])

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
        mixBlendMode: 'difference',
        backgroundColor: '#fff',
      }}
      animate={{
        width: hovered ? 48 : 20,
        height: hovered ? 48 : 20,
        scale: hovered ? 1 : 1,
      }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    />
  )
}
