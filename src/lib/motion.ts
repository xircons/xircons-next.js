import type { Variants } from 'framer-motion'

/** Stagger container — animate children in sequence */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

/** Single item that slides up (no opacity — avoids blended greys over section fills) */
export const fadeUp: Variants = {
  hidden: { y: 40 },
  show: {
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

/** Fade-in only (no translate) */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

/** Slide in from the right edge */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

/** Clip-reveal — content slides up from a clipped container */
export const clipReveal: Variants = {
  hidden: { y: '100%' },
  show: {
    y: 0,
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
  },
}

/** Softer crossfade for ↗ ↔ → (Works cards, header mail CTA, etc.) */
export const ARROW_MORPH_EASE = [0.33, 1, 0.68, 1] as const

export function getArrowMorphTransition(reducedMotion: boolean) {
  if (reducedMotion) return { duration: 0 }
  return {
    opacity: { duration: 0.52, ease: ARROW_MORPH_EASE },
    x: { duration: 0.62, ease: ARROW_MORPH_EASE },
    y: { duration: 0.62, ease: ARROW_MORPH_EASE },
    scale: { duration: 0.62, ease: ARROW_MORPH_EASE },
  }
}
