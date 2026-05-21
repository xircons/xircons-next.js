'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useReducedMotion } from 'framer-motion'
import { useLenis } from '@/components/SmoothScrollProvider'
import { BRAND_LABEL } from '@/components/FooterBrand'
import RevealPreloader from '@/components/RevealPreloader'

type Props = {
  children: React.ReactNode
}

/**
 * Shows RevealPreloader on full page load / refresh (non-project routes).
 * /projects/* uses ProjectPreloaderGate instead to avoid playing twice.
 */
export default function PreloaderGate({ children }: Props) {
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const { notifyScrollBoundsChanged } = useLenis()
  const isProjectRoute = pathname.startsWith('/projects')
  const [showPreloader, setShowPreloader] = useState(!isProjectRoute)

  useEffect(() => {
    if (reduced || isProjectRoute) setShowPreloader(false)
  }, [reduced, isProjectRoute])

  const handleComplete = useCallback(() => {
    setShowPreloader(false)
    notifyScrollBoundsChanged()
    requestAnimationFrame(() => notifyScrollBoundsChanged())
  }, [notifyScrollBoundsChanged])

  return (
    <>
      {showPreloader ? (
        <RevealPreloader logoText={BRAND_LABEL} onComplete={handleComplete} />
      ) : null}
      {children}
    </>
  )
}
