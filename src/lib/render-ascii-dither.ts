/** Dark → light density palette (aino-style mono glyphs). */
const CHARSET = ' .\'`^",:;!i1lI[]{}|/\\*+=~<>?L+tfjrxnuvczXYNUCWMBDHKARVGS0234589@#'

export type AsciiDitherResult = {
  text: string
  cols: number
  rows: number
}

/** Finer grid on narrow boxes so letters stay readable on mobile. */
export function getAsciiCellSize(width: number): { cellW: number; cellH: number } {
  if (width < 320) return { cellW: 2, cellH: 4 }
  if (width < 520) return { cellW: 3, cellH: 5 }
  if (width < 900) return { cellW: 4, cellH: 6 }
  return { cellW: 5, cellH: 7 }
}

export function drawTrackedText(
  ctx: CanvasRenderingContext2D,
  label: string,
  width: number,
  height: number,
  fontSize: number,
  fontFamily: string,
  fontWeight: string | number,
  letterSpacingPx: number,
  offsetX = 0,
  offsetY = 0,
) {
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'

  const chars = [...label]
  const advances = chars.map((ch) => ctx.measureText(ch).width)
  const tracking = chars.length > 1 ? letterSpacingPx : 0
  const totalWidth =
    advances.reduce((sum, w) => sum + w, 0) + tracking * (chars.length - 1)

  let x = offsetX + (width - totalWidth) / 2
  const y = offsetY + height / 2

  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], x, y)
    x += advances[i] + (i < chars.length - 1 ? tracking : 0)
  }
}

export function parseLetterSpacingPx(
  letterSpacing: string,
  fontSize: number,
): number {
  if (!letterSpacing || letterSpacing === 'normal') return fontSize * -0.035
  if (letterSpacing.endsWith('em')) return parseFloat(letterSpacing) * fontSize
  if (letterSpacing.endsWith('px')) return parseFloat(letterSpacing)
  const n = parseFloat(letterSpacing)
  return Number.isFinite(n) ? n : 0
}

/**
 * Rasterize label with DOM-like tracking, sample grid → ASCII.
 */
export function renderAsciiDither(
  label: string,
  width: number,
  height: number,
  fontFamily: string,
  fontSize: number,
  fontWeight: string | number = 700,
  letterSpacingPx = 0,
  cellSize?: { cellW: number; cellH: number },
): AsciiDitherResult {
  if (width < 1 || height < 1) {
    return { text: '', cols: 0, rows: 0 }
  }

  const { cellW, cellH } = cellSize ?? getAsciiCellSize(width)
  const cols = Math.max(1, Math.floor(width / cellW))
  const rows = Math.max(1, Math.floor(height / cellH))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return { text: '', cols, rows }

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = '#1a1a1a'
  drawTrackedText(
    ctx,
    label,
    width,
    height,
    fontSize,
    fontFamily,
    fontWeight,
    letterSpacingPx,
  )

  const image = ctx.getImageData(0, 0, width, height).data
  const lines: string[] = []

  for (let row = 0; row < rows; row++) {
    let line = ''
    const py = Math.min(height - 1, Math.floor(row * cellH + cellH / 2))
    for (let col = 0; col < cols; col++) {
      const px = Math.min(width - 1, Math.floor(col * cellW + cellW / 2))
      const i = (py * width + px) * 4
      const lum = (image[i] + image[i + 1] + image[i + 2]) / 3
      const idx = Math.round((1 - lum / 255) * (CHARSET.length - 1))
      line += CHARSET[Math.max(0, Math.min(CHARSET.length - 1, idx))]
    }
    lines.push(line)
  }

  return { text: lines.join('\n'), cols, rows }
}
