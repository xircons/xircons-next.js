'use client'

import { useEffect } from 'react'
import { useLenis } from '@/components/SmoothScrollProvider'
import { takePendingHomeSection } from '@/lib/home-nav'

/**
 * After cross-route nav from Header (sessionStorage), land on hero then Lenis-scroll to section.
 */
export default function HomeSectionScroll() {
  const { scrollTo, scrollToTop, notifyScrollBoundsChanged } = useLenis()

  useEffect(() => {
    const slug = takePendingHomeSection()
    if (!slug) return

    scrollToTop({ immediate: true })
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        notifyScrollBoundsChanged()
        scrollTo(`#${slug}`)
      })
    })
  }, [scrollTo, scrollToTop, notifyScrollBoundsChanged])

  return null
}
