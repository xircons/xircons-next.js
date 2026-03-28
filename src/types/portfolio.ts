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
export interface PortfolioProject {
  readonly id: number
  readonly title: string
  readonly stack: NonEmptyArray<string>
  readonly description: string
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
