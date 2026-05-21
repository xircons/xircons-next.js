'use client'

import { useMemo, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { sortProjectsByCategory } from '@/lib/projects'
import WorksProjectCard from '@/components/works/WorksProjectCard'
import WorksPaginatedGrid from '@/components/works/WorksPaginatedGrid'
import type { PortfolioProject } from '@/types/portfolio'

interface Props {
  projects: readonly PortfolioProject[]
}

export default function Works({ projects }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-5% 0px' })
  const reduced = useReducedMotion()
  const sortedProjects = useMemo(() => sortProjectsByCategory(projects), [projects])
  const projectCount = sortedProjects.length

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
        <div className="mb-16">
          <div className="mb-4 flex items-center gap-4">
            <span className="h-px w-12 bg-ink" />
            <span className="font-sans text-xs font-500 uppercase tracking-[0.25em] text-ink">
              Selected works
            </span>
          </div>
          <h2 className="flex flex-wrap items-baseline justify-between gap-4 font-clash text-[clamp(2.5rem,6vw,6rem)] font-700 leading-[1] tracking-tighter text-ink">
            <span>PROJECTS</span>
            <span aria-label={`${projectCount} projects`}>({projectCount})</span>
          </h2>
        </div>

        <WorksPaginatedGrid
          items={sortedProjects}
          getItemKey={(project) => (project as PortfolioProject).id}
          minHeightClass="min-h-[49rem]"
          ariaLabel="Projects pagination"
          renderCard={(project, index, { noEntrance }) => (
            <WorksProjectCard
              project={project as PortfolioProject}
              worksOrdinal={index + 1}
              noEntrance={noEntrance}
            />
          )}
        />
      </motion.div>
    </section>
  )
}
