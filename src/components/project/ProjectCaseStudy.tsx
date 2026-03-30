import type { PortfolioProject } from '@/types/portfolio'
import ProjectMedia from '@/components/project/ProjectMedia'

export default function ProjectCaseStudy({ project }: { project: PortfolioProject }) {
  return (
    <section className="relative z-0 bg-canvas px-5 pt-24 pb-16 lg:px-10 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-10 md:flex-row md:items-start md:gap-x-[5%]">
        <aside className="min-w-0 w-full text-left md:sticky md:top-24 md:z-[1] md:w-[35%] md:max-w-none md:shrink-0 md:max-h-[min(100dvh,100svh)] md:overflow-y-auto">
          <div className="flex flex-col gap-6">
            {project.body.map((paragraph, i) => (
              <p
                key={i}
                className="font-sans text-[14px] font-500 leading-relaxed tracking-wide text-ink sm:text-xs md:text-sm max-w-prose"
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
              className="relative aspect-video w-full min-h-[10rem] shrink-0 overflow-hidden bg-neutral-200"
            >
              <ProjectMedia
                src={src}
                alt=""
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
