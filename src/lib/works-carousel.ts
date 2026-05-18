import type { Variants } from 'framer-motion'

export const WORKS_SLIDE_SPRING = {
  type: 'spring' as const,
  stiffness: 220,
  damping: 30,
  mass: 0.85,
}

export const WORKS_SWIPE_OFFSET = 60
export const WORKS_SWIPE_VELOCITY = 400

export const worksSlideVariants: Variants = {
  enter: (dir: number) => ({ x: dir >= 0 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir >= 0 ? '-100%' : '100%' }),
}
