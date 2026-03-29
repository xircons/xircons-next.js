/**
 * Canonical site origin without trailing slash.
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://xircons.website — no www, no trailing slash).
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const normalized = raw?.replace(/\/+$/, '') ?? ''
  if (normalized) return normalized
  return 'http://localhost:3000'
}

export function getMetadataBase(): URL {
  return new URL(`${getSiteUrl()}/`)
}
