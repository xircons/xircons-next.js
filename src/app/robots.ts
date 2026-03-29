import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl()
  const host = (() => {
    try {
      return new URL(base).host
    } catch {
      return undefined
    }
  })()

  return {
    rules: { userAgent: '*', allow: '/' },
    ...(host ? { host } : {}),
    sitemap: `${base}/sitemap.xml`,
  }
}
