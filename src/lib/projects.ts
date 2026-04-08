import { portfolioData } from '@/data/portfolio'
import { CATEGORY_LABELS } from '@/data/project-categories'
import type { PortfolioProject, ProjectCategory } from '@/types/portfolio'

const CATEGORY_ORDER: ProjectCategory[] = [
  'production',
  'competition',
  'academic',
  'personal',
]

/** Runtime-safe: RSC/HMR or stale data can omit or mismatch `category`. */
export function normalizeProjectCategory(value: unknown): ProjectCategory {
  if (typeof value === 'string' && value in CATEGORY_LABELS) {
    return value as ProjectCategory
  }
  return 'personal'
}

export function sortProjectsByCategory(projects: readonly PortfolioProject[]): PortfolioProject[] {
  return [...projects].sort((a, b) => {
    const ra = CATEGORY_ORDER.indexOf(normalizeProjectCategory(a.category))
    const rb = CATEGORY_ORDER.indexOf(normalizeProjectCategory(b.category))
    return ra - rb
  })
}

/**
 * 1-based position in the full portfolio when sorted by category (production → personal).
 * Same numbering on the home Works grid and on More works cards.
 */
export function getWorksOrdinal(projectSlug: string): number {
  const sorted = sortProjectsByCategory(portfolioData.works)
  const i = sorted.findIndex((p) => p.slug === projectSlug)
  return i >= 0 ? i + 1 : 1
}

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  const project = portfolioData.works.find((p) => p.slug === slug)
  return project
}

/**
 * All portfolio projects except `excludeSlug`, ordered by category (production → personal).
 * Pass `limit` only if you need to cap how many are returned.
 */
export function getOtherProjects(excludeSlug: string, limit?: number): PortfolioProject[] {
  const rest = portfolioData.works.filter((p) => p.slug !== excludeSlug)
  const sorted = sortProjectsByCategory(rest)
  return limit !== undefined ? sorted.slice(0, limit) : sorted
}

export function getAllProjectSlugs(): string[] {
  return portfolioData.works.map((p) => p.slug)
}
