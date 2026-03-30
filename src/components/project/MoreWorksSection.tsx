'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ScrollRevealTitle from '@/components/ScrollRevealTitle'
import ProjectMedia from '@/components/project/ProjectMedia'
import type { PortfolioProject } from '@/types/portfolio'

const LABEL = '/ MORE WORKS /'

const PILL_CLASS =
  'whitespace-nowrap bg-ink px-2 py-0.5 font-sans text-[10px] font-600 uppercase tracking-[0.2em] text-canvas'

function MoreWorksThumb({
  project: p,
  router,
}: {
  project: PortfolioProject
  router: ReturnType<typeof useRouter>
}) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null)

  const heroSrc = typeof p.heroImage === 'string' ? p.heroImage.trim() : ''
  const hasHero = heroSrc.length > 0

  return (
    <li className="min-w-0">
      <Link
        href={`/projects/${p.slug}`}
        aria-label={`View ${p.title} project`}
        className="group block bg-canvas outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onClick={(e) => {
          if (
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey ||
            e.button !== 0
          ) {
            return
          }
          e.preventDefault()
          router.push(`/projects/${p.slug}`)
        }}
      >
        <div
          className="relative aspect-video w-full min-h-[4rem] overflow-hidden bg-neutral-200"
          onMouseEnter={(e) => {
            setHovered(true)
            setPointer({ x: e.clientX, y: e.clientY })
          }}
          onMouseMove={(e) => {
            setPointer({ x: e.clientX, y: e.clientY })
          }}
          onMouseLeave={() => {
            setHovered(false)
            setPointer(null)
          }}
        >
          <ProjectMedia
            src={p.heroImage}
            alt={hasHero ? p.title : ''}
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 20vw"
          />

          {/* Keyboard: same pill, centered (no cursor to follow) */}
          {focused && !hovered ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
            >
              <span className={PILL_CLASS}>{p.title}</span>
            </div>
          ) : null}
        </div>
      </Link>

      {/* Mouse: pill follows cursor (fixed — escapes overflow-hidden on thumbnail) */}
      {hovered && pointer ? (
        <span
          aria-hidden
          className={`pointer-events-none fixed z-[9980] ${PILL_CLASS}`}
          style={{
            left: pointer.x,
            top: pointer.y,
            transform: 'translate(8px, 8px)',
          }}
        >
          {p.title}
        </span>
      ) : null}
    </li>
  )
}

export default function MoreWorksSection({ projects }: { projects: readonly PortfolioProject[] }) {
  const router = useRouter()
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
        <ul
          className="m-0 grid w-full list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:grid-cols-5 md:gap-4"
          role="list"
        >
          {projects.map((p) => (
            <MoreWorksThumb key={p.slug} project={p} router={router} />
          ))}
        </ul>
      </div>
    </section>
  )
}
