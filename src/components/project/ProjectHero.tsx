'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { CATEGORY_LABELS } from '@/data/project-categories'
import { HOME_SECTION_STORAGE_KEY } from '@/lib/home-nav'
import { clipReveal, fadeUp, staggerContainer } from '@/lib/motion'
import type { PortfolioProject } from '@/types/portfolio'
import ProjectMedia from '@/components/project/ProjectMedia'

const CODEBASE_LINK_CLASS =
  'underline decoration-ink/30 underline-offset-2 transition-colors hover:decoration-ink'

const BACK_EASE = [0.22, 1, 0.36, 1] as const
const HERO_STAGGER: Variants = {
  ...staggerContainer,
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.18 },
  },
}

const HERO_IMAGE_REVEAL: Variants = {
  hidden: { opacity: 0, x: 56 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: BACK_EASE,
      delay: 0.28,
    },
  },
}

function ProjectBackLink() {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)
  const reduced = useReducedMotion()
  const t = reduced ? { duration: 0 } : { duration: 0.4, ease: BACK_EASE }

  return (
    <Link
      href="/"
      onClick={(e) => {
        e.preventDefault()
        try {
          sessionStorage.setItem(HOME_SECTION_STORAGE_KEY, 'works')
        } catch {
          /* private / quota */
        }
        router.push('/', { scroll: false })
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative mb-1 inline-flex w-fit items-center gap-1.5 pb-1 font-sans text-xs font-500 uppercase tracking-[0.15em] text-ink focus-visible:rounded focus-visible:outline-2 focus-visible:outline-ink"
      aria-label="Back to works"
    >
      <ArrowLeft className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
      <span className="relative z-10">Back</span>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left bg-ink"
        initial={false}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={t}
      />
    </Link>
  )
}

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

function RevealBlock({
  children,
  variants = clipReveal,
}: {
  children: React.ReactNode
  variants?: Variants
}) {
  return (
    <div className="overflow-hidden py-[0.02em]">
      <motion.div className="will-change-transform" variants={variants}>
        {children}
      </motion.div>
    </div>
  )
}

export default function ProjectHero({ project }: { project: PortfolioProject }) {
  const category = project.category in CATEGORY_LABELS ? project.category : 'personal'
  const categoryLabel = CATEGORY_LABELS[category]
  const reduced = useReducedMotion() ?? false
  const motionState = reduced ? 'show' : 'hidden'
  const motionAnimate = 'show'

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
    isMd && mediaHeight != null ? ({ minHeight: mediaHeight } as const) : undefined

  return (
    <section className="relative z-0 flex min-h-[95vh] flex-col justify-start overflow-hidden bg-canvas px-5 pt-28 pb-16 sm:pt-32 md:justify-center lg:px-10 lg:pt-36">
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-12 md:h-auto md:flex-none md:flex-row md:items-start md:gap-10 lg:gap-16">
        {/* Mobile: title + metadata stacked at bottom of column; md+: contents wrapper + justify-between match image */}
        <motion.div
          className="order-2 flex min-h-0 min-w-0 flex-col overflow-hidden text-left max-md:flex-1 max-md:justify-end max-md:min-h-0 md:order-1 md:justify-between md:gap-8 md:w-[min(100%,26rem)] md:shrink-0 md:flex-none lg:w-[min(100%,28rem)]"
          style={leftColumnStyle}
          variants={HERO_STAGGER}
          initial={motionState}
          animate={motionAnimate}
        >
          <div className="flex flex-col gap-12 md:contents">
            <div className="flex flex-col gap-3 text-left">
              <RevealBlock>
                <ProjectBackLink />
              </RevealBlock>
              <RevealBlock>
                <h1 className="max-w-full font-clash text-[clamp(1.75rem,4.5vw,3.75rem)] font-700 leading-[1.08] tracking-tighter text-ink md:max-w-[22ch]">
                  {project.title}
                </h1>
              </RevealBlock>
              {project.subtitle ? (
                <RevealBlock>
                  <p className="font-sans text-sm text-ink/60">{project.subtitle}</p>
                </RevealBlock>
              ) : null}
            </div>

            <motion.div
              className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-10"
              variants={fadeUp}
            >
              <MetaCell label="Category">{categoryLabel}</MetaCell>
              <MetaCell label="Date">{project.completedAt}</MetaCell>
              <MetaCell label="Role">{project.role}</MetaCell>
              <MetaCell label="Codebase">
                {project.githubPrivate ? (
                  <span className="normal-case">PRIVATE REPOSITORY</span>
                ) : (
                  <div className="flex flex-col gap-1 normal-case">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={CODEBASE_LINK_CLASS}
                    >
                      GitHub
                    </a>
                    {project.npmjsUrl ? (
                      <a
                        href={project.npmjsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={CODEBASE_LINK_CLASS}
                      >
                        npm
                      </a>
                    ) : null}
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={CODEBASE_LINK_CLASS}
                      >
                        Live site
                      </a>
                    ) : null}
                  </div>
                )}
              </MetaCell>
            </motion.div>
          </div>
        </motion.div>

        {/* Right column: intrinsic image height drives row (md+ left matches via ResizeObserver) */}
        <motion.div
          className="order-1 flex min-h-0 min-w-0 flex-col max-md:shrink-0 max-md:pt-4 md:order-2 md:flex-1 md:pt-0 md:text-left"
          variants={HERO_IMAGE_REVEAL}
          initial={motionState}
          animate={motionAnimate}
        >
          <div ref={mediaWrapRef} className="min-h-0 min-w-0 overflow-hidden">
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
        </motion.div>
      </div>
    </section>
  )
}
