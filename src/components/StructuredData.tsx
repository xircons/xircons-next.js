import { getSiteUrl } from '@/lib/site'
import { siteSeo } from '@/data/seo'

export default function StructuredData() {
  const url = getSiteUrl()
  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${url}/#website`,
      name: siteSeo.siteName,
      url,
      description: siteSeo.description,
    },
    {
      '@type': 'Person',
      '@id': `${url}/#person`,
      name: siteSeo.person.name,
      alternateName: siteSeo.person.alternateName,
      url,
      email: siteSeo.person.email,
      jobTitle: siteSeo.person.jobTitle,
      affiliation: siteSeo.organization,
      sameAs: [...siteSeo.sameAs],
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': graph,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
