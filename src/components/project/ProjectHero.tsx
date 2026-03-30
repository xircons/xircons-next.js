'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CATEGORY_LABELS } from '@/data/project-categories'
import type { PortfolioProject } from '@/types/portfolio'
import ProjectMedia from '@/components/project/ProjectMedia'

function MetaCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 text-left">
      <span className="font-sans text-[10px] font-500 uppercase tracking-[0.2em] text-ink/55">
        {label}
      </span>
      <div className="break-words font-sans text-xs font-700 uppercase tracking-[0.12em] text-ink">
        {children}
      </div>
    </div>
  )
}

export default function ProjectHero({ project }: { project: PortfolioProject }) {
  const category = project.category in CATEGORY_LABELS ? project.category : 'personal'
  const categoryLabel = CATEGORY_LABELS[category]

  const mediaWrapRef = useRef<HTMLDivElement>(null)
  const [mediaHeight, setMediaHeight] = useState<number | null>(null)
  const [isMd, setIsMd] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onMq = () => setIsMd(mq.matches)
    onMq()
    mq.addEventListener('change', onMq)
    return () => mq.removeEventListener('change', onMq)
  }, [])

  useEffect(() => {
    const el = mediaWrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const h = el.getBoundingClientRect().height
      setMediaHeight(h > 0 ? Math.round(h) : null)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [project.heroImage])

  const leftColumnStyle =
    isMd && mediaHeight != null ? ({ height: mediaHeight } as const) : undefined

  return (
    <section className="relative z-0 flex min-h-[95vh] flex-col justify-start overflow-hidden bg-canvas px-5 pt-28 pb-16 sm:pt-32 md:justify-center lg:px-10 lg:pt-36">
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-12 md:h-auto md:flex-none md:flex-row md:items-stretch md:gap-10 lg:gap-16">
        {/* Mobile: title + metadata stacked at bottom of column; md+: contents wrapper + justify-between match image */}
        <div
          className="order-2 flex min-h-0 min-w-0 flex-col overflow-y-auto text-left max-md:flex-1 max-md:justify-end max-md:min-h-0 md:order-1 md:justify-between md:gap-8 md:w-[min(100%,26rem)] md:shrink-0 md:flex-none lg:w-[min(100%,28rem)]"
          style={leftColumnStyle}
        >
          <div className="flex flex-col gap-12 md:contents">
            <div className="flex flex-col gap-3 text-left">
              <h1 className="max-w-full font-clash text-[clamp(1.75rem,4.5vw,3.75rem)] font-700 leading-[1.08] tracking-tighter text-ink md:max-w-[22ch]">
                {project.title}
              </h1>
              {project.subtitle ? (
                <p className="font-sans text-sm text-ink/60">{project.subtitle}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-10">
              <MetaCell label="Category">{categoryLabel}</MetaCell>
              <MetaCell label="Date">{project.completedAt}</MetaCell>
              <MetaCell label="Role">{project.role}</MetaCell>
              <MetaCell label="Codebase">
                {project.githubPrivate ? (
                  <span className="normal-case">PRIVATE REPOSITORY</span>
                ) : (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-ink/30 underline-offset-2 transition-colors hover:decoration-ink"
                  >
                    GitHub
                  </a>
                )}
              </MetaCell>
            </div>
          </div>
        </div>

        {/* Right column: mobile back link above image; intrinsic image height drives row (md+ left matches via ResizeObserver) */}
        <div className="order-1 flex min-h-0 min-w-0 flex-col max-md:shrink-0 max-md:pt-4 md:order-2 md:flex-1 md:pt-0 md:text-left">
          <Link
            href="/"
            className="mb-2 flex w-fit items-center gap-1 font-sans text-[10px] font-500 uppercase tracking-[0.18em] text-ink transition-colors duration-200 hover:text-ink focus-visible:rounded focus-visible:outline-2 focus-visible:outline-ink md:hidden"
            aria-label="Back to home"
          >
            <ArrowLeft className="size-3 shrink-0" strokeWidth={2} aria-hidden />
            back
          </Link>
          <div ref={mediaWrapRef} className="min-h-0 min-w-0">
            <div className="relative w-full overflow-hidden bg-neutral-200">
              <ProjectMedia
                src={project.heroImage}
                alt=""
                variant="intrinsic"
                className="w-full"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
