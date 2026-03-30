'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { getArrowMorphTransition, staggerContainer, fadeUp } from '@/lib/motion'
import { CATEGORY_LABELS } from '@/data/project-categories'
import type { PortfolioProject, ProjectCategory } from '@/types/portfolio'

interface Props {
  projects: readonly PortfolioProject[]
}

const CARD_EASE = [0.22, 1, 0.36, 1] as const
/** Minimum card height; grid rows stretch to match the tallest card in each row. */
const CARD_MIN_H = 'min-h-[24rem] sm:min-h-[24rem]'
/** One rhythm inside cards: padding from border + gaps between blocks (keep in sync with arrow `*-8`). */
const CARD_PAD_GAP = 'p-8 gap-4' as const
const CHIP_PAD = 'py-1' as const

const CATEGORY_ORDER: ProjectCategory[] = [
  'production',
  'competition',
  'academic',
  'personal',
]

/** Runtime-safe: RSC/HMR or stale data can omit or mismatch `category`. */
function normalizeProjectCategory(value: unknown): ProjectCategory {
  if (typeof value === 'string' && value in CATEGORY_LABELS) {
    return value as ProjectCategory
  }
  return 'personal'
}

function sortProjectsByCategory(projects: readonly PortfolioProject[]): PortfolioProject[] {
  return [...projects].sort((a, b) => {
    const ra = CATEGORY_ORDER.indexOf(normalizeProjectCategory(a.category))
    const rb = CATEGORY_ORDER.indexOf(normalizeProjectCategory(b.category))
    return ra - rb
  })
}

function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
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
      className={`block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${CARD_MIN_H}`}
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
          className="relative flex h-full flex-col justify-between overflow-hidden p-8"
        >
      {/* Index label — matches Skills.tsx id style (00-1 …) */}
      <span aria-hidden="true" className="font-mono text-[10px] uppercase tracking-[0.2em]">
        {`00-${index + 1}`}
      </span>

      <span className="inline-flex w-fit bg-ink px-3 py-1 font-sans text-xs font-500 text-white">
        {categoryLabel}
      </span>

      <h3
        id={`project-title-${project.id}`}
        className="font-clash text-[clamp(1.4rem,3vw,2.5rem)] font-700 leading-tight tracking-tight"
      >
        {project.title}
      </h3>

      <p className="mt-4 font-sans text-sm leading-relaxed">{project.description}</p>

      {/* Tech stack chips — border/current follow inherited color */}
      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="border border-current px-3 py-1 font-sans text-xs font-500"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Corner arrows: ArrowUpRight default, crossfade to ArrowRight on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-8 flex h-8 w-8 items-center justify-center transform-gpu"
      >
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
          <ArrowUpRight className="size-5" strokeWidth={2} aria-hidden />
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
          <ArrowRight className="size-[1.125rem]" strokeWidth={2} aria-hidden />
        </motion.span>
      </div>
        </motion.article>
      </motion.div>
    </Link>
  )
}

export default function Works({ projects }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-5% 0px' })
  const reduced = useReducedMotion()
  const sortedProjects = useMemo(() => sortProjectsByCategory(projects), [projects])

  return (
    <section
      id="works"
      ref={sectionRef}
      className="relative min-h-[100dvh] bg-canvas px-5 py-24 lg:px-8"
    >
      <motion.div
        initial={reduced ? false : { y: 80 }}
        animate={inView ? { y: 0 } : undefined}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full"
      >
        {/* Heading row */}
        <div className="mb-16 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-4">
              <span className="h-px w-12 bg-ink" />
              <span className="font-sans text-xs font-500 uppercase tracking-[0.25em] text-ink">
                Selected works
              </span>
            </div>
            <h2 className="font-clash text-[clamp(2.5rem,6vw,6rem)] font-700 leading-[1] tracking-tighter text-ink">
              PROJECTS
            </h2>
          </div>
          <p className="max-w-sm font-mono text-sm leading-relaxed tracking-wide text-ink">
            Selected works demonstrating end-to-end development.
          </p>
        </div>

        {/* Project grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {sortedProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
