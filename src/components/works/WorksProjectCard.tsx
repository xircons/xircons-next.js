'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { getArrowMorphTransition, fadeUp } from '@/lib/motion'
import { normalizeProjectCategory } from '@/lib/projects'
import { CATEGORY_LABELS } from '@/data/project-categories'
import type { PortfolioProject } from '@/types/portfolio'

const CARD_EASE = [0.22, 1, 0.36, 1] as const

/** Frozen tokens so SSR and client always use the same class strings per entry point. */
type CardLayoutTokens = {
  linkMinH: string
  article: string
  index: string
  categoryPad: string
  title: string
  description: string
  stackWrap: string
  stackChip: string
  arrowWrap: string
  arrowUpClass: string
  arrowRightClass: string
}

const LAYOUT_FEATURED: CardLayoutTokens = {
  linkMinH: 'min-h-[24rem] sm:min-h-[24rem]',
  article: 'relative flex h-full flex-col justify-between overflow-hidden p-8',
  index: 'font-mono text-[10px] uppercase tracking-[0.2em]',
  categoryPad: 'px-3 py-1 text-xs',
  title:
    'font-clash text-[clamp(1.4rem,3vw,2.5rem)] font-700 leading-tight tracking-tight',
  description: 'mt-4 font-sans text-sm leading-relaxed',
  stackWrap: 'mt-6 flex flex-wrap gap-2',
  stackChip: 'border border-current px-3 py-1 font-sans text-xs font-500',
  arrowWrap:
    'pointer-events-none absolute right-8 top-8 flex h-8 w-8 items-center justify-center transform-gpu',
  arrowUpClass: 'size-5',
  arrowRightClass: 'size-[1.125rem]',
}

const LAYOUT_COMPACT: CardLayoutTokens = {
  linkMinH: 'min-h-[15rem] sm:min-h-[16rem]',
  article:
    'relative flex h-full flex-col justify-between gap-2 overflow-hidden p-5',
  index: 'font-mono text-[9px] uppercase tracking-[0.18em]',
  categoryPad: 'px-2 py-0.5 text-[10px]',
  title:
    'font-clash text-[clamp(1.05rem,2.4vw,1.35rem)] font-700 leading-tight tracking-tight',
  description: 'mt-1 line-clamp-3 font-sans text-xs leading-relaxed',
  stackWrap: 'mt-3 flex flex-wrap gap-1.5',
  stackChip:
    'border border-current px-2 py-0.5 font-sans text-[10px] font-500',
  arrowWrap:
    'pointer-events-none absolute right-4 top-4 flex h-6 w-6 items-center justify-center transform-gpu',
  arrowUpClass: 'size-4',
  arrowRightClass: 'size-3.5',
}

export type WorksProjectCardProps = {
  project: PortfolioProject
  /** 1-based index in category-sorted full works list (`00-${worksOrdinal}` label). */
  worksOrdinal: number
}

function WorksProjectCardInner({
  project,
  worksOrdinal,
  layout,
}: WorksProjectCardProps & { layout: CardLayoutTokens }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = useReducedMotion()
  const [hovered, setHovered] = useState(false)

  const paintTransition = reduced ? { duration: 0 } : { duration: 0.4, ease: CARD_EASE }
  const arrowTransition = getArrowMorphTransition(!!reduced)
  const category = normalizeProjectCategory(project.category)
  const categoryLabel = CATEGORY_LABELS[category]

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${layout.linkMinH}`}
      prefetch
    >
      <motion.div
        ref={ref}
        variants={reduced ? { hidden: {}, show: {} } : fadeUp}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        className="h-full"
      >
        <motion.article
          aria-labelledby={`project-title-${project.id}`}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          style={{ borderWidth: 1, borderStyle: 'solid' }}
          animate={{
            backgroundColor: hovered ? '#1a1a1a' : '#ffffff',
            color: hovered ? '#ffffff' : '#1a1a1a',
            borderColor: hovered ? 'rgba(255,255,255,0.35)' : '#1a1a1a',
          }}
          transition={paintTransition}
          className={layout.article}
        >
          <span aria-hidden="true" className={layout.index}>
            {`00-${worksOrdinal}`}
          </span>

          <span
            className={`inline-flex w-fit border font-sans font-500 transition-colors duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${layout.categoryPad} ${
              hovered
                ? 'border-ink bg-white text-ink'
                : 'border-transparent bg-ink text-white'
            }`}
          >
            {categoryLabel}
          </span>

          <h3 id={`project-title-${project.id}`} className={layout.title}>
            {project.title}
          </h3>

          <p className={layout.description}>{project.description}</p>

          <div className={layout.stackWrap}>
            {project.stack.map((tech) => (
              <span key={tech} className={layout.stackChip}>
                {tech}
              </span>
            ))}
          </div>

          <div aria-hidden="true" className={layout.arrowWrap}>
            <motion.span
              className="absolute inset-0 flex items-center justify-center will-change-transform"
              initial={false}
              animate={{
                opacity: hovered ? 0 : 1,
                x: hovered ? -2 : 0,
                y: hovered ? -1 : 0,
                scale: hovered ? 0.94 : 1,
              }}
              transition={arrowTransition}
            >
              <ArrowUpRight
                className={layout.arrowUpClass}
                strokeWidth={2}
                aria-hidden
              />
            </motion.span>
            <motion.span
              className="absolute inset-0 flex items-center justify-center will-change-transform"
              initial={false}
              animate={{
                opacity: hovered ? 1 : 0,
                x: hovered ? 3 : 0,
                scale: hovered ? 1 : 0.94,
              }}
              transition={arrowTransition}
            >
              <ArrowRight
                className={layout.arrowRightClass}
                strokeWidth={2}
                aria-hidden
              />
            </motion.span>
          </div>
        </motion.article>
      </motion.div>
    </Link>
  )
}

/** Selected works grid on the home page */
export default function WorksProjectCard(props: WorksProjectCardProps) {
  return <WorksProjectCardInner {...props} layout={LAYOUT_FEATURED} />
}

/** “More works” grid on project detail pages (smaller card) */
export function CompactWorksProjectCard(props: WorksProjectCardProps) {
  return <WorksProjectCardInner {...props} layout={LAYOUT_COMPACT} />
}
