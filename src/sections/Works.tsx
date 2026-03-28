'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { getArrowMorphTransition, staggerContainer, fadeUp } from '@/lib/motion'
import type { PortfolioProject } from '@/types/portfolio'

interface Props {
  projects: readonly PortfolioProject[]
}

const CARD_EASE = [0.22, 1, 0.36, 1] as const

function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = useReducedMotion()
  const [hovered, setHovered] = useState(false)

  const paintTransition = reduced ? { duration: 0 } : { duration: 0.4, ease: CARD_EASE }
  const arrowTransition = getArrowMorphTransition(!!reduced)

  return (
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
      {/* Index label */}
      <span aria-hidden="true" className="mb-6 font-clash text-xs font-500 tracking-widest">
        {String(index + 1).padStart(2, '0')}
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

      {/* Corner arrows: ↗ default, crossfade to → on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-8 flex h-8 w-8 items-center justify-center font-clash text-xl leading-none transform-gpu"
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
          ↗
        </motion.span>
        <motion.span
          className="absolute inset-0 flex items-center justify-center text-[0.72em] will-change-transform"
          initial={false}
          animate={{
            opacity: hovered ? 1 : 0,
            x: hovered ? 3 : 0,
            scale: hovered ? 1 : 0.94,
          }}
          transition={arrowTransition}
        >
          →
        </motion.span>
      </div>
      </motion.article>
    </motion.div>
  )
}

export default function Works({ projects }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-5% 0px' })
  const reduced = useReducedMotion()

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
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
