/** Minimum one element */
export type NonEmptyArray<T> = [T, ...T[]]

// ────────────────────────────────────────────────────────────
// About section
// ────────────────────────────────────────────────────────────
export interface PortfolioAbout {
  readonly title: string
  readonly description: string
}

// ────────────────────────────────────────────────────────────
// Works section
// ────────────────────────────────────────────────────────────
export type ProjectCategory =
  | 'production'
  | 'competition'
  | 'academic'
  | 'personal'

export interface PortfolioProject {
  readonly id: number
  readonly slug: string
  readonly title: string
  readonly subtitle?: string
  readonly stack: NonEmptyArray<string>
  readonly description: string
  readonly category: ProjectCategory
  readonly role: string
  readonly completedAt: string
  readonly githubUrl: string
  /** When set, project hero shows an npm package link alongside GitHub. */
  readonly npmjsUrl?: string
  /** When true, hero shows "Private Repository" instead of a GitHub link. */
  readonly githubPrivate?: boolean
  /** Omit or leave empty to show grey placeholder. */
  readonly heroImage?: string
  /** Long-form case study copy; each entry is a paragraph. */
  readonly body: NonEmptyArray<string>
  /** Gallery images, top-to-bottom. */
  readonly gallery: NonEmptyArray<string>
}

// ────────────────────────────────────────────────────────────
// Skills section
// ────────────────────────────────────────────────────────────
export interface PortfolioSkill {
  readonly id: string
  readonly title: string
  readonly details: NonEmptyArray<string>
}

// ────────────────────────────────────────────────────────────
// Root content
// ────────────────────────────────────────────────────────────
export interface PortfolioContent {
  readonly about: PortfolioAbout
  readonly works: NonEmptyArray<PortfolioProject>
  readonly skills: NonEmptyArray<PortfolioSkill>
}
