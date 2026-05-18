'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from 'framer-motion'
import WorksPaginationButton from '@/components/works/WorksPaginationButton'
import { useWorksCardsPerPage } from '@/hooks/useWorksCardsPerPage'
import {
  WORKS_SLIDE_SPRING,
  WORKS_SWIPE_OFFSET,
  WORKS_SWIPE_VELOCITY,
  worksSlideVariants,
} from '@/lib/works-carousel'

export type WorksPaginatedGridProps = {
  /** Stable React keys for each slide page item. */
  getItemKey: (item: unknown, index: number) => string | number
  items: readonly unknown[]
  renderCard: (
    item: unknown,
    index: number,
    ctx: { noEntrance: boolean },
  ) => React.ReactNode
  /** Minimum carousel viewport height (2 rows + gap). */
  minHeightClass: string
  ariaLabel?: string
  ringOffsetClass?: string
}

export default function WorksPaginatedGrid({
  getItemKey,
  items,
  renderCard,
  minHeightClass,
  ariaLabel = 'Projects carousel',
  ringOffsetClass,
}: WorksPaginatedGridProps) {
  const regionRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const pageSize = useWorksCardsPerPage()
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const showControls = totalPages > 1

  const [rawPage, setPage] = useState(0)
  const [direction, setDirection] = useState(0)
  const page = rawPage >= totalPages ? 0 : rawPage

  const goPrev = useCallback(() => {
    setDirection(-1)
    setPage((p) => (p - 1 + totalPages) % totalPages)
  }, [totalPages])

  const goNext = useCallback(() => {
    setDirection(1)
    setPage((p) => (p + 1) % totalPages)
  }, [totalPages])

  useEffect(() => {
    if (!showControls) return
    const handler = (e: KeyboardEvent) => {
      const region = regionRef.current
      if (!region) return
      const active = document.activeElement
      if (!active || !region.contains(active)) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showControls, goPrev, goNext])

  const handlePanEnd = useCallback(
    (_: PointerEvent | TouchEvent | MouseEvent, info: PanInfo) => {
      if (!showControls) return
      if (Math.abs(info.offset.x) < Math.abs(info.offset.y)) return
      const { x: offsetX } = info.offset
      const { x: velocityX } = info.velocity
      if (offsetX < -WORKS_SWIPE_OFFSET || velocityX < -WORKS_SWIPE_VELOCITY) {
        goNext()
      } else if (offsetX > WORKS_SWIPE_OFFSET || velocityX > WORKS_SWIPE_VELOCITY) {
        goPrev()
      }
    },
    [showControls, goPrev, goNext],
  )

  const visibleItems = useMemo(
    () => items.slice(page * pageSize, (page + 1) * pageSize),
    [items, page, pageSize],
  )

  const slideTransition = reduced ? { duration: 0 } : WORKS_SLIDE_SPRING
  const pageLabel = `Page ${page + 1} of ${totalPages}`

  return (
    <motion.div
      ref={regionRef}
      className="flex items-stretch gap-4"
      role="region"
      aria-label={ariaLabel}
      aria-roledescription="carousel"
    >
      {showControls ? (
        <WorksPaginationButton
          direction="prev"
          onClick={goPrev}
          pageLabel={pageLabel}
          ringOffsetClass={ringOffsetClass}
        />
      ) : null}

      <motion.div
        layout
        transition={slideTransition}
        onPanEnd={handlePanEnd}
        className={`relative min-w-0 flex-1 touch-pan-y overflow-hidden ${minHeightClass}`}
      >
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={worksSlideVariants}
            initial={direction === 0 ? false : 'enter'}
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="grid gap-4 will-change-transform sm:grid-cols-2 lg:grid-cols-3"
            aria-live="polite"
          >
            {visibleItems.map((item, i) => (
              <div key={getItemKey(item, page * pageSize + i)}>
                {renderCard(item, page * pageSize + i, {
                  noEntrance: direction !== 0,
                })}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {showControls ? (
        <WorksPaginationButton
          direction="next"
          onClick={goNext}
          pageLabel={pageLabel}
          ringOffsetClass={ringOffsetClass}
        />
      ) : null}
    </motion.div>
  )
}
