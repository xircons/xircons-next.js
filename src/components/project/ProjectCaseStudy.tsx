import type { PortfolioProject } from '@/types/portfolio'
import ProjectMedia from '@/components/project/ProjectMedia'

const BODY_LINK_CLASS =
  'inline cursor-pointer break-all font-500 text-ink underline decoration-1 decoration-ink/30 underline-offset-[3px] transition-[text-decoration-color] hover:decoration-ink'

/** Remove an embedded URL from copy; keep trailing "at " for inline link. */
function textBeforeLiveLink(text: string, liveUrl: string): string {
  let lead = text.trimEnd()
  const strip = [
    liveUrl,
    `${liveUrl}.`,
    liveUrl.replace(/^https?:\/\//, ''),
    'https://icas-cmu.turnpro.dev',
    'https://icas-cmu.turnpro.dev.',
    'icas-cmu.turnpro.dev',
    'icas-cmu.turnpro.dev.',
  ]
  for (const part of strip) {
    if (part) lead = lead.split(part).join('')
  }
  lead = lead.replace(/\s*\.\s*$/, '').trimEnd()
  if (!/\sat\s*$/i.test(lead)) {
    lead = `${lead} at`
  }
  return `${lead} `
}

function CaseStudyParagraph({
  text,
  liveUrl,
  suffixLiveLink,
}: {
  text: string
  liveUrl?: string
  suffixLiveLink?: boolean
}) {
  const className =
    'w-full max-w-none font-sans text-sm font-500 leading-relaxed tracking-wide text-ink md:max-w-prose md:text-base'

  const href = liveUrl?.trim()
  if (suffixLiveLink && href) {
    return (
      <p className={className}>
        {textBeforeLiveLink(text, href)}
        <a href={href} target="_blank" rel="noopener noreferrer" className={BODY_LINK_CLASS}>
          {href}
        </a>{' '}
      </p>
    )
  }

  if (href && text.includes(href)) {
    const [before, after] = text.split(href)
    return (
      <p className={className}>
        {before}
        <a href={href} target="_blank" rel="noopener noreferrer" className={BODY_LINK_CLASS}>
          {href}
        </a>
        {after}
      </p>
    )
  }

  return <p className={className}>{text}</p>
}

export default function ProjectCaseStudy({ project }: { project: PortfolioProject }) {
  const liveUrl = project.liveUrl?.trim()

  return (
    <section className="relative z-0 bg-canvas px-5 pt-24 pb-16 lg:px-10 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-10 md:flex-row md:items-start md:gap-x-[5%]">
        <aside className="relative z-20 min-w-0 w-full self-start text-left md:sticky md:top-24 md:w-[35%] md:max-w-none md:shrink-0">
          <div className="flex flex-col gap-6">
            {project.body.map((paragraph, i) => (
              <CaseStudyParagraph
                key={i}
                text={paragraph}
                liveUrl={liveUrl}
                suffixLiveLink={i === 0 && Boolean(liveUrl)}
              />
            ))}
          </div>
        </aside>

        <div className="relative z-0 flex min-w-0 w-full flex-col gap-6 bg-canvas md:w-[60%] md:shrink-0">
          {project.gallery.map((src) => (
            <div
              key={src}
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
