'use client'

import { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLenis } from '@/components/SmoothScrollProvider'
import { HOME_SECTION_STORAGE_KEY } from '@/lib/home-nav'

/** In-page section nav on `/`, or store target + go home from other routes. */
export function useHomeSectionNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { scrollTo } = useLenis()
  const isHome = pathname === '/'

  const goToSection = useCallback(
    (hash: string, e?: React.MouseEvent) => {
      e?.preventDefault()
      const id = hash.startsWith('#') ? hash.slice(1) : hash
      const target = `#${id}`

      if (isHome) {
        scrollTo(target)
        return
      }

      try {
        sessionStorage.setItem(HOME_SECTION_STORAGE_KEY, id)
      } catch {
        /* private mode / quota */
      }
      router.push('/', { scroll: false })
    },
    [isHome, scrollTo, router],
  )

  return { isHome, goToSection }
}
