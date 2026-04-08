'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import ScrollRevealTitle from '@/components/ScrollRevealTitle'
import { CompactWorksProjectCard } from '@/components/works/WorksProjectCard'
import { getWorksOrdinal } from '@/lib/projects'
import { staggerContainer } from '@/lib/motion'
import type { PortfolioProject } from '@/types/portfolio'

const LABEL = '/ MORE WORKS /'

export default function MoreWorksSection({ projects }: { projects: readonly PortfolioProject[] }) {
  const gridRef = useRef<HTMLDivElement>(null)
  const gridInView = useInView(gridRef, { once: true, margin: '-5% 0px' })

  return (
    <section className="bg-[#ffffff]" aria-labelledby="more-works-heading">
      <ScrollRevealTitle
        label={LABEL}
        className="relative -mt-px overflow-x-auto overflow-y-hidden bg-[#ffffff]"
      />
      <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-4 lg:px-10 lg:pb-28">
        <h2 id="more-works-heading" className="sr-only">
          More works
        </h2>
        <motion.div
          ref={gridRef}
          variants={staggerContainer}
          initial="hidden"
          animate={gridInView ? 'show' : 'hidden'}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="More projects"
        >
          {projects.map((p) => (
            <CompactWorksProjectCard
              key={p.slug}
              project={p}
              worksOrdinal={getWorksOrdinal(p.slug)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
