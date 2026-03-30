import { portfolioData } from '@/data/portfolio'
import { CATEGORY_LABELS } from '@/data/project-categories'
import type { PortfolioProject, ProjectCategory } from '@/types/portfolio'

const CATEGORY_ORDER: ProjectCategory[] = [
  'production',
  'competition',
  'academic',
  'personal',
]

function normalizeProjectCategory(value: unknown): ProjectCategory {
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

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  const project = portfolioData.works.find((p) => p.slug === slug)
  return project
}

export function getOtherProjects(excludeSlug: string, limit = 5): PortfolioProject[] {
  const rest = portfolioData.works.filter((p) => p.slug !== excludeSlug)
  const sorted = sortProjectsByCategory(rest).slice(0, limit)
  return sorted
}

export function getAllProjectSlugs(): string[] {
  return portfolioData.works.map((p) => p.slug)
}
