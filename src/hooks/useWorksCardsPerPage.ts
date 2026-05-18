'use client'

import { useEffect, useState } from 'react'

/**
 * Cards per page = visible grid columns × 2 rows.
 * Tailwind grid: `grid sm:grid-cols-2 lg:grid-cols-3` → 1/2/3 cols.
 */
export function useWorksCardsPerPage(): number {
  const [perPage, setPerPage] = useState(6)

  useEffect(() => {
    const lg = window.matchMedia('(min-width: 1024px)')
    const sm = window.matchMedia('(min-width: 640px)')

    const update = () => {
      if (lg.matches) setPerPage(6)
      else if (sm.matches) setPerPage(4)
      else setPerPage(2)
    }

    update()
    lg.addEventListener('change', update)
    sm.addEventListener('change', update)
    return () => {
      lg.removeEventListener('change', update)
      sm.removeEventListener('change', update)
    }
  }, [])

  return perPage
}
