import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import ProjectHero from '@/components/project/ProjectHero'
import ProjectCaseStudy from '@/components/project/ProjectCaseStudy'
import MoreWorksSection from '@/components/project/MoreWorksSection'
import ProjectStructuredData from '@/components/project/ProjectStructuredData'
import {
  getAllProjectSlugs,
  getOtherProjects,
  getProjectBySlug,
  getWorksOrdinal,
} from '@/lib/projects'
import { projectImageDir, PROJECT_IMAGE_ROOT } from '@/lib/project-assets'

/**
 * Build-time check: if `/public/projects/{dir}/og.png` exists, return its
 * URL with 1200x630 dimensions (the Open Graph / Twitter Card standard).
 * Else fall back to the project's hero image (any size).
 *
 * Drop a properly designed 1200x630 og.png in the project's image folder
 * and it'll automatically take over the social preview for that page.
 */
function resolveProjectOgImage(
  slug: string,
  fallback: string | undefined,
  alt: string,
):
  | readonly [{ url: string; alt: string; width: number; height: number }]
  | readonly [{ url: string; alt: string }]
  | undefined {
  const dir = projectImageDir(slug)
  const ogPath = path.join(process.cwd(), 'public', 'projects', dir, 'og.png')
  if (fs.existsSync(ogPath)) {
    return [
      {
        url: `${PROJECT_IMAGE_ROOT}/${dir}/og.png`,
        alt,
        width: 1200,
        height: 630,
      },
    ] as const
  }
  if (fallback) return [{ url: fallback, alt }] as const
  return undefined
}

type Props = { params: Promise<{ slug: string }> }

// Pre-render all 8 project pages at build time via `generateStaticParams`
// below. Static HTML = better LCP, faster Googlebot crawls, lower cost.

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return { title: 'Project' }

  const canonicalPath = `/projects/${slug}`
  const ogImages = resolveProjectOgImage(slug, project.heroImage, project.title)
  const twitterImages = ogImages ? ogImages.map((img) => img.url) : undefined

  return {
    title: project.title,
    description: project.description,
    keywords: [...project.stack, project.title, 'Xircons', 'Wuttikan'],
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: project.title,
      description: project.description,
      url: canonicalPath,
      type: 'article',
      images: ogImages ? [...ogImages] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: twitterImages,
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const more = getOtherProjects(slug)
  const moreItems = more.map((p) => ({
    project: p,
    worksOrdinal: getWorksOrdinal(p.slug),
  }))

  return (
    <main id="main-content">
      <ProjectStructuredData project={project} />
      <ProjectHero key={project.slug} project={project} />
      <ProjectCaseStudy project={project} />
      <MoreWorksSection items={moreItems} />
      <Footer />
    </main>
  )
}
