/** Base URL path for files in `public/projects/`. */
export const PROJECT_IMAGE_ROOT = '/projects' as const

const SLUG_TO_DIR: Readonly<Record<string, string>> = {
  'icas-cmu-hub': 'icas-cmu',
  'react-farm-life-cycle': 'reactfarmlifecycle',
  'store-atelien': 'store.atelien',
  'tic-tac-toe-with-ai': 'tic-tac-toe',
}

export function projectImageDir(slug: string): string {
  return SLUG_TO_DIR[slug] ?? slug
}

export function projectImage(slug: string, filename: string): string {
  return `${PROJECT_IMAGE_ROOT}/${projectImageDir(slug)}/${filename}`
}

/** Build `/projects/<dir>/<NN>.png` paths for two-digit frame numbers. */
export function projectGalleryFrames(slug: string, frameNumbers: readonly number[]): string[] {
  return frameNumbers.map((n) =>
    projectImage(slug, `${String(n).padStart(2, '0')}.png`),
  )
}
