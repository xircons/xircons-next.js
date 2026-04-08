'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import ScrollRevealTitle from '@/components/ScrollRevealTitle'
import { CompactWorksProjectCard } from '@/components/works/WorksProjectCard'
import { staggerContainer } from '@/lib/motion'
import type { PortfolioProject } from '@/types/portfolio'

const LABEL = '/ MORE WORKS /'

export type MoreWorkItem = {
  project: PortfolioProject
  /** 1-based index in category-sorted full works list (from server). */
  worksOrdinal: number
}

export default function MoreWorksSection({
  items,
}: {
  items: readonly MoreWorkItem[]
}) {
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
          {items.map(({ project: p, worksOrdinal }) => (
            <CompactWorksProjectCard
              key={p.slug}
              project={p}
              worksOrdinal={worksOrdinal}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
