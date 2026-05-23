import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site'
import { getAllProjectSlugs } from '@/lib/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()
  const now = new Date()

  const projects: MetadataRoute.Sitemap = getAllProjectSlugs().map((slug) => ({
    url: `${base}/projects/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...projects,
  ]
}
