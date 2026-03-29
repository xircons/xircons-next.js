import type { MetadataRoute } from 'next'
import { siteSeo } from '@/data/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteSeo.title,
    short_name: siteSeo.shortTitle,
    description: siteSeo.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1a1a1a',
  }
}
