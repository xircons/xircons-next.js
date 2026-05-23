import { getSiteUrl } from '@/lib/site'
import { siteSeo } from '@/data/seo'
import type { PortfolioProject } from '@/types/portfolio'

type Props = {
  project: PortfolioProject
}

/**
 * Per-project JSON-LD: BreadcrumbList for SERP crumb trail + CreativeWork
 * for rich result eligibility. Author references the global Person @id so
 * Google can link this page to the homepage Person graph.
 */
export default function ProjectStructuredData({ project }: Props) {
  const base = getSiteUrl()
  const projectUrl = `${base}/projects/${project.slug}`
  const heroImage = project.heroImage
    ? project.heroImage.startsWith('http')
      ? project.heroImage
      : `${base}${project.heroImage}`
    : undefined

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
      { '@type': 'ListItem', position: 2, name: 'Works', item: `${base}/#works` },
      { '@type': 'ListItem', position: 3, name: project.title, item: projectUrl },
    ],
  }

  const creativeWork = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${projectUrl}#creativework`,
    name: project.title,
    headline: project.title,
    description: project.description,
    url: projectUrl,
    ...(heroImage ? { image: heroImage } : {}),
    keywords: project.stack.join(', '),
    inLanguage: 'en',
    author: { '@id': `${base}/#person` },
    creator: { '@id': `${base}/#person` },
    publisher: { '@id': `${base}/#person` },
    isPartOf: { '@id': `${base}/#website` },
    ...(project.completedAt ? { dateCreated: String(project.completedAt) } : {}),
    about: siteSeo.person.jobTitle,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWork) }}
      />
    </>
  )
}
