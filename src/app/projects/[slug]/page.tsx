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

  const path = `/projects/${slug}`
  const ogImages = project.heroImage
    ? [{ url: project.heroImage, alt: project.title }]
    : undefined
  const twitterImages = project.heroImage ? [project.heroImage] : undefined

  return {
    title: project.title,
    description: project.description,
    keywords: [...project.stack, project.title, 'Xircons', 'Wuttikan'],
    alternates: { canonical: path },
    openGraph: {
      title: project.title,
      description: project.description,
      url: path,
      type: 'article',
      images: ogImages,
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
