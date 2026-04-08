'use client'

import { useMemo, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { staggerContainer } from '@/lib/motion'
import { getWorksOrdinal, sortProjectsByCategory } from '@/lib/projects'
import WorksProjectCard from '@/components/works/WorksProjectCard'
import type { PortfolioProject } from '@/types/portfolio'

interface Props {
  projects: readonly PortfolioProject[]
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
          {sortedProjects.map((project) => (
            <WorksProjectCard
              key={project.id}
              project={project}
              worksOrdinal={getWorksOrdinal(project.slug)}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
