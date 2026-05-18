'use client'

import ScrollRevealTitle from '@/components/ScrollRevealTitle'
import WorksPaginatedGrid from '@/components/works/WorksPaginatedGrid'
import { CompactWorksProjectCard } from '@/components/works/WorksProjectCard'
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
        <WorksPaginatedGrid
          items={items}
          getItemKey={(item) => (item as MoreWorkItem).project.slug}
          minHeightClass="min-h-[31rem] sm:min-h-[33rem]"
          ariaLabel="More projects"
          ringOffsetClass="ring-offset-[#ffffff]"
          renderCard={(item, _index, { noEntrance }) => {
            const { project, worksOrdinal } = item as MoreWorkItem
            return (
              <CompactWorksProjectCard
                project={project}
                worksOrdinal={worksOrdinal}
                noEntrance={noEntrance}
              />
            )
          }}
        />
      </div>
    </section>
  )
}
