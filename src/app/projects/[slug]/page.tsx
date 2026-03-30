import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProjectHero from '@/components/project/ProjectHero'
import ProjectCaseStudy from '@/components/project/ProjectCaseStudy'
import MoreWorksSection from '@/components/project/MoreWorksSection'
import { getAllProjectSlugs, getOtherProjects, getProjectBySlug } from '@/lib/projects'

type Props = { params: Promise<{ slug: string }> }

// Ensure this route reads from `src/data/portfolio.ts` on every request.
// Otherwise Next will pre-render static HTML via `generateStaticParams`.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return { title: 'Project' }
  return {
    title: project.title,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const more = getOtherProjects(slug, 5)

  return (
    <main id="main-content">
      <Header />
      <ProjectHero project={project} />
      <ProjectCaseStudy project={project} />
      <MoreWorksSection projects={more} />
      <Footer />
    </main>
  )
}
