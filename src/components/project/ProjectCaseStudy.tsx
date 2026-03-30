import type { PortfolioProject } from '@/types/portfolio'
import ProjectMedia from '@/components/project/ProjectMedia'

export default function ProjectCaseStudy({ project }: { project: PortfolioProject }) {
  return (
    <section className="relative z-0 bg-canvas px-5 pt-24 pb-16 lg:px-10 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-10 md:flex-row md:items-start md:gap-x-[5%]">
        <aside className="min-w-0 w-full self-start text-left md:sticky md:top-24 md:z-[1] md:w-[35%] md:max-w-none md:shrink-0">
          <div className="flex flex-col gap-6">
            {project.body.map((paragraph, i) => (
              <p
                key={i}
                className="w-full max-w-none font-sans text-sm font-500 leading-relaxed tracking-wide text-ink md:max-w-prose md:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div> 
        </aside>

        <div className="flex min-w-0 w-full flex-col gap-6 bg-canvas md:w-[60%] md:shrink-0">
          {project.gallery.map((src, i) => (
            <div
              key={i}
              className="relative w-full shrink-0 overflow-hidden bg-neutral-200"
            >
              <ProjectMedia
                src={src}
                alt=""
                variant="intrinsic"
                className="w-full"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
