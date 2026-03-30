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

  return (
    <section className="relative z-0 h-[95vh] overflow-hidden bg-canvas px-5 pt-28 pb-16 sm:pt-32 lg:px-10 lg:pt-36">
      <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col gap-12 md:flex-row md:items-stretch md:gap-10 lg:gap-16">
        {/* Left column: title (top-left) + metadata (bottom-left) */}
        <div className="order-2 flex h-full min-w-0 flex-col justify-between gap-6 text-left md:order-1 md:w-[min(100%,26rem)] md:shrink-0 lg:w-[min(100%,28rem)]">
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
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-ink/30 underline-offset-2 transition-colors hover:decoration-ink"
              >
                GitHub
              </a>
            </MetaCell>
          </div>
        </div>

        {/* Right column: preview image */}
        <div className="order-1 flex h-full min-w-0 flex-col md:order-2 md:ml-auto md:flex-1 md:items-start md:text-left">
          <div className="relative flex-1 min-h-0 w-full max-w-2xl bg-neutral-200 md:ml-auto overflow-hidden">
            <ProjectMedia
              src={project.heroImage}
              alt=""
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
