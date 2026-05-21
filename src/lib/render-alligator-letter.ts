import { drawTrackedText, getAsciiCellSize } from '@/lib/render-ascii-dither'

export type GlyphMask = {
  width: number
  height: number
  cols: number
  rows: number
  cellW: number
  cellH: number
  /** flat[row * cols + col] — inside glyph */
  inside: boolean[]
  /** flat[row * cols + col] — 0–1 ink density from raster */
  density: number[]
}

/** Radial falloff — localized so the hotspot reads clearly without filling the whole glyph with #. */
export function getRadialRadius(letterW: number, letterH: number): number {
  return Math.min(Math.max(letterW, letterH) * 0.36, 56)
}

/** Monospace advance width for ASCII <pre> (px). */
export function measureMonoAdvancePx(
  fontSize: number,
  fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  fontWeight: string | number = 400,
): number {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return fontSize * 0.62
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  return ctx.measureText('M').width
}

/** Bias strengths toward heavier glyphs (# / +). */
export function boostInkStrength(strength: number): number {
  return Math.min(1, Math.pow(strength, 0.78) * 1.12 + 0.06)
}

export function charForStrength(strength: number): string {
  if (strength > 0.5) return '#'
  if (strength > 0.2) return '+'
  if (strength > 0.05) return ':'
  return '+'
}

/** Per-cell ink strength for static ASCII (no hotspot). */
export function computeStaticStrengths(mask: GlyphMask): Float32Array {
  const { cols, rows, inside, density } = mask
  const strengths = new Float32Array(cols * rows)
  for (let i = 0; i < strengths.length; i++) {
    strengths[i] = inside[i] ? boostInkStrength(density[i]) : 0
  }
  return strengths
}

/** Per-cell ink strength with radial hotspot falloff. */
export function computeRadialStrengths(
  mask: GlyphMask,
  hotspotX: number,
  hotspotY: number,
  radius: number,
  options?: { fillGaps?: boolean },
): Float32Array {
  const { cols, rows, cellW, cellH, inside, density } = mask
  const strengths = new Float32Array(cols * rows)
  const r = Math.max(radius, 1)
  const fillGaps = options?.fillGaps ?? false

  for (let row = 0; row < rows; row++) {
    const py = row * cellH + cellH / 2
    for (let col = 0; col < cols; col++) {
      const idx = row * cols + col
      const px = col * cellW + cellW / 2
      const dist = Math.hypot(px - hotspotX, py - hotspotY)
      const radial = 1 - Math.min(1, dist / r)

      if (inside[idx]) {
        strengths[idx] = boostInkStrength(density[idx] * (0.22 + radial * 0.78))
        continue
      }

      if (fillGaps && radial > 0.03) {
        strengths[idx] = boostInkStrength(radial * 0.62)
      } else {
        strengths[idx] = 0
      }
    }
  }

  return strengths
}

export function asciiFromStrengths(mask: GlyphMask, strengths: Float32Array): string {
  const { cols, rows, inside } = mask
  const lines: string[] = []

  for (let row = 0; row < rows; row++) {
    let line = ''
    for (let col = 0; col < cols; col++) {
      const idx = row * cols + col
      const strength = strengths[idx]
      if (!inside[idx]) {
        line += strength > 0.03 ? charForStrength(strength) : ' '
        continue
      }
      line += charForStrength(strength)
    }
    lines.push(line)
  }

  return lines.join('\n')
}

/**
 * Build mask + per-cell ink density for one character.
 */
export function buildGlyphMask(
  char: string,
  width: number,
  height: number,
  fontFamily: string,
  fontSize: number,
  fontWeight: string | number,
): GlyphMask | null {
  if (width < 1 || height < 1) return null

  const { cellW, cellH } = getAsciiCellSize(width)
  const cols = Math.max(1, Math.floor(width / cellW))
  const rows = Math.max(1, Math.floor(height / cellH))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#1a1a1a'
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(char, width / 2, height / 2)

  const image = ctx.getImageData(0, 0, width, height).data
  const inside: boolean[] = new Array(cols * rows)
  const density: number[] = new Array(cols * rows)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const px = Math.min(width - 1, Math.floor(col * cellW + cellW / 2))
      const py = Math.min(height - 1, Math.floor(row * cellH + cellH / 2))
      const i = (py * width + px) * 4
      const lum = (image[i] + image[i + 1] + image[i + 2]) / 3
      const idx = row * cols + col
      const ink = Math.max(0, Math.min(1, (255 - lum) / 255))
      density[idx] = ink
      inside[idx] = ink > 0.09
    }
  }

  return { width, height, cols, rows, cellW, cellH, inside, density }
}

function sampleMaskFromCanvas(
  image: Uint8ClampedArray,
  width: number,
  height: number,
  cellW: number,
  cellH: number,
): GlyphMask {
  const cols = Math.max(1, Math.floor(width / cellW))
  const rows = Math.max(1, Math.floor(height / cellH))
  const inside: boolean[] = new Array(cols * rows)
  const density: number[] = new Array(cols * rows)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const px = Math.min(width - 1, Math.floor(col * cellW + cellW / 2))
      const py = Math.min(height - 1, Math.floor(row * cellH + cellH / 2))
      const i = (py * width + px) * 4
      const lum = (image[i] + image[i + 1] + image[i + 2]) / 3
      const idx = row * cols + col
      const ink = Math.max(0, Math.min(1, (255 - lum) / 255))
      density[idx] = ink
      inside[idx] = ink > 0.09
    }
  }

  return { width, height, cols, rows, cellW, cellH, inside, density }
}

/** Raster mask from measured flex letter boxes (proportional widths + gaps). */
export function buildWordMaskFromDom(container: HTMLElement): GlyphMask | null {
  const width = container.offsetWidth
  const height = container.offsetHeight
  if (width < 1 || height < 1) return null

  const charEls = container.querySelectorAll<HTMLElement>('[data-brand-char]')
  if (!charEls.length) return null

  const containerRect = container.getBoundingClientRect()
  const probe = charEls[0]
  const style = getComputedStyle(probe)
  const fontSize = parseFloat(style.fontSize)
  if (!fontSize) return null

  const { cellW, cellH } = getAsciiCellSize(width)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#1a1a1a'
  ctx.font = `${style.fontWeight} ${fontSize}px ${style.fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (const el of charEls) {
    const ch = el.textContent ?? ''
    if (!ch) continue
    const r = el.getBoundingClientRect()
    const x = r.left - containerRect.left + r.width / 2
    const y = r.top - containerRect.top + r.height / 2
    ctx.fillText(ch, x, y)
  }

  const image = ctx.getImageData(0, 0, width, height).data
  return sampleMaskFromCanvas(image, width, height, cellW, cellH)
}

/** Raster mask for the full brand word (canvas-only layout estimate). */
export function buildWordMask(
  label: string,
  width: number,
  height: number,
  fontFamily: string,
  fontSize: number,
  fontWeight: string | number,
  letterSpacingPx: number,
): GlyphMask | null {
  if (width < 1 || height < 1) return null

  const { cellW, cellH } = getAsciiCellSize(width)
  const cols = Math.max(1, Math.floor(width / cellW))
  const rows = Math.max(1, Math.floor(height / cellH))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#1a1a1a'
  drawTrackedText(ctx, label, width, height, fontSize, fontFamily, fontWeight, letterSpacingPx)

  const image = ctx.getImageData(0, 0, width, height).data
  return sampleMaskFromCanvas(image, width, height, cellW, cellH)
}

/** Pixel bounds of ink cells inside a word mask (for overlay alignment). */
export function getMaskInkBounds(mask: GlyphMask): {
  left: number
  top: number
  width: number
  height: number
} | null {
  const { cols, rows, cellW, cellH, inside } = mask
  let minCol = cols
  let maxCol = -1
  let minRow = rows
  let maxRow = -1

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const idx = row * cols + col
      if (!inside[idx]) continue
      minCol = Math.min(minCol, col)
      maxCol = Math.max(maxCol, col)
      minRow = Math.min(minRow, row)
      maxRow = Math.max(maxRow, row)
    }
  }

  if (maxCol < 0) return null

  return {
    left: minCol * cellW,
    top: minRow * cellH,
    width: (maxCol - minCol + 1) * cellW,
    height: (maxRow - minRow + 1) * cellH,
  }
}

/** Word-level radius — wide enough to span gaps between letters. */
export function getWordRadialRadius(wordW: number, wordH: number): number {
  return Math.min(Math.max(wordW, wordH) * 0.24, 72)
}

/**
 * Full ASCII fill from glyph shape only (no cursor hotspot).
 */
export function buildStaticAscii(mask: GlyphMask): string {
  return asciiFromStrengths(mask, computeStaticStrengths(mask))
}

/**
 * Radial ASCII from cursor — shape density × hotspot falloff.
 */
export function buildRadialAscii(
  mask: GlyphMask,
  hotspotX: number,
  hotspotY: number,
  radius: number,
  options?: { fillGaps?: boolean },
): string {
  return asciiFromStrengths(
    mask,
    computeRadialStrengths(mask, hotspotX, hotspotY, radius, options),
  )
}
