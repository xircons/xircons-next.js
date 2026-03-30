const SECTION_IDS = new Set(['about', 'works', 'skills', 'contact'])

export const HOME_SECTION_STORAGE_KEY = 'xircons:homeSection'

/** Read pending section from sessionStorage, validate, remove key, return slug or null. */
export function takePendingHomeSection(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(HOME_SECTION_STORAGE_KEY)
    sessionStorage.removeItem(HOME_SECTION_STORAGE_KEY)
    if (raw && SECTION_IDS.has(raw)) return raw
    return null
  } catch {
    return null
  }
}
