'use client'

import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { useReducedMotion } from 'framer-motion'
import {
  asciiFromStrengths,
  buildStaticAscii,
  buildWordMaskFromDom,
  computeRadialStrengths,
  computeStaticStrengths,
  getWordRadialRadius,
  measureMonoAdvancePx,
  type GlyphMask,
} from '@/lib/render-alligator-letter'

const HOTSPOT_LERP = 0.42
const STRENGTH_LERP = 0.4
const STRENGTH_EPS = 0.006
const HOTSPOT_EPS = 0.45
const ASCII_FADE_MS = 320

type Phase = 'plain' | 'static' | 'radial'

const fadeStyle = (reduced: boolean | null): CSSProperties | undefined =>
  reduced ? undefined : { transition: `opacity ${ASCII_FADE_MS}ms ease-out` }

export type AsciiHoverLabelProps = {
  label: string
  className?: string
  measureClassName?: string
  letterClassName?: string
  measureStyle?: CSSProperties
  hideCursor?: boolean
  ariaLabel?: string
  getLetterClassName?: (char: string, index: number) => string
  renderLetter?: (
    char: string,
    index: number,
    plainOpacity: number,
  ) => ReactNode
}

function AsciiHoverLabelStatic({
  label,
  measureClassName = 'inline-flex max-w-full flex-nowrap items-baseline justify-center overflow-visible',
  letterClassName = '',
  measureStyle,
  getLetterClassName,
}: AsciiHoverLabelProps) {
  return (
    <span className={measureClassName} style={measureStyle} aria-hidden="true">
      {[...label].map((char, i) => (
        <span
          key={`${char}-${i}`}
          className={`inline-block ${letterClassName}${getLetterClassName?.(char, i) ?? ''}`}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

function AsciiHoverLabelInteractive({
  label,
  className = '',
  measureClassName = 'inline-flex max-w-full flex-nowrap items-baseline justify-center overflow-visible',
  letterClassName = '',
  measureStyle,
  hideCursor = false,
  ariaLabel,
  getLetterClassName,
  renderLetter,
  asciiEnabled = true,
}: AsciiHoverLabelProps & { asciiEnabled?: boolean }) {
  const reduced = useReducedMotion()
  const rowRef = useRef<HTMLSpanElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const maskRef = useRef<GlyphMask | null>(null)
  const asciiRef = useRef('')
  const hotspotRef = useRef({ x: 0, y: 0 })
  const displayHotspotRef = useRef({ x: 0, y: 0 })
  const displayStrengthRef = useRef<Float32Array | null>(null)
  const targetStrengthRef = useRef<Float32Array | null>(null)
  const phaseRef = useRef<Phase>('plain')
  const activeRef = useRef(false)
  const radialReadyRef = useRef(false)
  const scaleRef = useRef({ x: 1, y: 1 })
  const scaleFitLockedRef = useRef(false)
  const renderPxRef = useRef(5)
  const animRef = useRef(0)
  const fadeTimerRef = useRef(0)

  const [isActive, setIsActive] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [fadeAscii, setFadeAscii] = useState(false)
  const [ascii, setAscii] = useState('')
  const [asciiReady, setAsciiReady] = useState(false)
  const [scale, setScale] = useState({ x: 1, y: 1 })
  const [renderPx, setRenderPx] = useState(5)
  const [gridPx, setGridPx] = useState({ w: 0, h: 0 })

  const applyAscii = useCallback((art: string, phase: Phase) => {
    if (art === asciiRef.current && phaseRef.current === phase) return false
    asciiRef.current = art
    phaseRef.current = phase
    setAscii(art)
    return true
  }, [])

  const stopAnimation = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current)
      animRef.current = 0
    }
  }, [])

  const measureRow = useCallback(() => {
    const row = measureRef.current
    if (!row) return null
    const w = row.offsetWidth
    const h = row.offsetHeight
    if (w < 1 || h < 1) return null
    return { w, h }
  }, [])

  const rebuildMask = useCallback(() => {
    const row = measureRef.current
    const box = measureRow()
    if (!row || !box) return false

    maskRef.current = buildWordMaskFromDom(row)
    if (maskRef.current) {
      hotspotRef.current = { x: box.w / 2, y: box.h / 2 }
    }
    return !!maskRef.current
  }, [measureRow])

  const fitScale = useCallback(
    (options?: { force?: boolean }) => {
      if (scaleFitLockedRef.current && !options?.force) return true

      const mask = maskRef.current
      const box = measureRow()
      if (!mask || !box) return false

      const px = mask.cellH
      const charW = measureMonoAdvancePx(px)
      const gridW = mask.cols * charW
      const gridH = mask.rows * px
      if (gridW < 1 || gridH < 1) return false

      const next = { x: box.w / gridW, y: box.h / gridH }

      const prev = scaleRef.current
      if (
        !options?.force &&
        Math.abs(prev.x - next.x) < 0.0001 &&
        Math.abs(prev.y - next.y) < 0.0001 &&
        renderPxRef.current === px
      ) {
        scaleFitLockedRef.current = true
        return true
      }

      scaleRef.current = next
      renderPxRef.current = px
      setScale(next)
      setRenderPx(px)
      setGridPx({ w: gridW, h: gridH })
      scaleFitLockedRef.current = true
      return true
    },
    [measureRow],
  )

  const ensureStrengthBuffers = useCallback((mask: GlyphMask) => {
    const n = mask.cols * mask.rows
    if (!displayStrengthRef.current || displayStrengthRef.current.length !== n) {
      displayStrengthRef.current = computeStaticStrengths(mask)
    }
    if (!targetStrengthRef.current || targetStrengthRef.current.length !== n) {
      targetStrengthRef.current = new Float32Array(n)
    }
    return {
      display: displayStrengthRef.current,
      target: targetStrengthRef.current,
    }
  }, [])

  const paintFromDisplayStrengths = useCallback(
    (phase: 'static' | 'radial') => {
      const mask = maskRef.current
      const display = displayStrengthRef.current
      if (!mask || !display || !activeRef.current || reduced) return false

      const art = asciiFromStrengths(mask, display)
      if (!art.trim()) return false

      return applyAscii(art, phase)
    },
    [reduced, applyAscii],
  )

  const paintStatic = useCallback(() => {
    const mask = maskRef.current
    if (!mask || !activeRef.current || reduced) return false

    stopAnimation()
    const display = ensureStrengthBuffers(mask).display
    display.set(computeStaticStrengths(mask))
    displayHotspotRef.current = { ...hotspotRef.current }

    const art = buildStaticAscii(mask)
    if (!art.trim()) return false

    applyAscii(art, 'static')
    return true
  }, [reduced, applyAscii, ensureStrengthBuffers, stopAnimation])

  const paintRadialInstant = useCallback(() => {
    const mask = maskRef.current
    if (!mask || !activeRef.current || reduced || !radialReadyRef.current) return false

    const { display } = ensureStrengthBuffers(mask)
    displayHotspotRef.current = { ...hotspotRef.current }
    const radius = getWordRadialRadius(mask.width, mask.height)
    display.set(
      computeRadialStrengths(
        mask,
        hotspotRef.current.x,
        hotspotRef.current.y,
        radius,
        { fillGaps: true },
      ),
    )
    return paintFromDisplayStrengths('radial')
  }, [reduced, ensureStrengthBuffers, paintFromDisplayStrengths])

  const tickRadialAnimation = useCallback(() => {
    animRef.current = 0

    const mask = maskRef.current
    if (!mask || !activeRef.current || reduced || !radialReadyRef.current) return

    const targetHotspot = hotspotRef.current
    const displayHotspot = displayHotspotRef.current
    const hx = displayHotspot.x + (targetHotspot.x - displayHotspot.x) * HOTSPOT_LERP
    const hy = displayHotspot.y + (targetHotspot.y - displayHotspot.y) * HOTSPOT_LERP
    displayHotspot.x = hx
    displayHotspot.y = hy

    const hotspotMoved =
      Math.hypot(targetHotspot.x - hx, targetHotspot.y - hy) > HOTSPOT_EPS

    const { display, target } = ensureStrengthBuffers(mask)
    const radius = getWordRadialRadius(mask.width, mask.height)
    const computed = computeRadialStrengths(mask, hx, hy, radius, { fillGaps: true })
    target.set(computed)

    let strengthsMoved = hotspotMoved
    for (let i = 0; i < display.length; i++) {
      const diff = target[i] - display[i]
      if (Math.abs(diff) > STRENGTH_EPS) {
        display[i] += diff * STRENGTH_LERP
        strengthsMoved = true
      } else {
        display[i] = target[i]
      }
    }

    paintFromDisplayStrengths('radial')

    if (strengthsMoved) {
      animRef.current = requestAnimationFrame(tickRadialAnimation)
    }
  }, [reduced, ensureStrengthBuffers, paintFromDisplayStrengths])

  const scheduleRadial = useCallback(() => {
    if (reduced) {
      paintRadialInstant()
      return
    }
    stopAnimation()
    animRef.current = requestAnimationFrame(tickRadialAnimation)
  }, [reduced, paintRadialInstant, tickRadialAnimation, stopAnimation])

  const clampHotspot = useCallback((clientX: number, clientY: number) => {
    const row = measureRef.current
    const mask = maskRef.current
    if (!row || !mask) return false

    const rect = row.getBoundingClientRect()
    hotspotRef.current = {
      x: Math.max(0, Math.min(mask.width, clientX - rect.left)),
      y: Math.max(0, Math.min(mask.height, clientY - rect.top)),
    }
    return true
  }, [])

  const deactivate = useCallback(() => {
    activeRef.current = false
    radialReadyRef.current = false
    scaleFitLockedRef.current = false
    stopAnimation()
    phaseRef.current = 'plain'
    asciiRef.current = ''
    displayStrengthRef.current = null
    targetStrengthRef.current = null
    setIsActive(false)
    setAsciiReady(false)
    setFadeAscii(false)
    setAscii('')
  }, [stopAnimation])

  const activate = useCallback(() => {
    if (!asciiEnabled || reduced) return

    const run = () => {
      rebuildMask()
      activeRef.current = true
      radialReadyRef.current = false
      setIsActive(true)

      const box = measureRow()
      if (box) {
        hotspotRef.current = { x: box.w / 2, y: box.h / 2 }
        displayHotspotRef.current = { x: box.w / 2, y: box.h / 2 }
      }

      if (paintStatic()) {
        radialReadyRef.current = true
        return true
      }

      // Re-hover before deactivate timer — keep showing cached ASCII.
      if (asciiRef.current && maskRef.current) {
        radialReadyRef.current = true
        phaseRef.current = 'static'
        return true
      }
      return false
    }

    if (run()) return

    requestAnimationFrame(() => {
      if (run()) fitScale()
    })
  }, [asciiEnabled, reduced, rebuildMask, measureRow, paintStatic, fitScale])

  const scheduleDeactivate = useCallback(() => {
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current)
    setHovering(false)
    setFadeAscii(false)
    const delay = reduced ? 0 : ASCII_FADE_MS
    fadeTimerRef.current = window.setTimeout(() => {
      fadeTimerRef.current = 0
      deactivate()
    }, delay)
  }, [deactivate, reduced])

  const cancelScheduledDeactivate = useCallback(() => {
    if (fadeTimerRef.current) {
      window.clearTimeout(fadeTimerRef.current)
      fadeTimerRef.current = 0
    }
  }, [])

  const updateHotspot = useCallback(
    (clientX: number, clientY: number) => {
      if (!activeRef.current || !radialReadyRef.current) return
      if (!clampHotspot(clientX, clientY)) return
      scheduleRadial()
    },
    [clampHotspot, scheduleRadial],
  )

  useLayoutEffect(() => {
    let cancelled = false

    const init = async () => {
      if (document.fonts?.ready) await document.fonts.ready
      if (cancelled) return
      rebuildMask()
      fitScale()
    }
    void init()

    const row = measureRef.current
    if (!row) {
      return () => {
        cancelled = true
      }
    }

    const ro = new ResizeObserver(() => {
      rebuildMask()
      scaleFitLockedRef.current = false
      if (activeRef.current && phaseRef.current !== 'plain') {
        if (phaseRef.current === 'radial' && radialReadyRef.current) {
          displayHotspotRef.current = { ...hotspotRef.current }
          scheduleRadial()
        } else {
          paintStatic()
        }
        fitScale({ force: true })
      } else {
        fitScale({ force: true })
      }
    })
    ro.observe(row)
    return () => {
      cancelled = true
      ro.disconnect()
    }
  }, [rebuildMask, paintStatic, scheduleRadial, fitScale])

  useLayoutEffect(() => {
    if (!isActive || !ascii) {
      if (!isActive) setAsciiReady(false)
      return
    }
    if (scaleFitLockedRef.current) {
      setAsciiReady(true)
      return
    }
    const ok = fitScale()
    setAsciiReady(ok)
    if (!ok) {
      requestAnimationFrame(() => {
        if (fitScale()) setAsciiReady(true)
      })
    }
  }, [ascii, isActive, fitScale])

  useEffect(() => {
    if (reduced) {
      setFadeAscii(hovering && isActive && asciiReady && ascii.length > 0)
      return
    }
    if (hovering && isActive && asciiReady && ascii.length > 0) {
      const id = requestAnimationFrame(() => setFadeAscii(true))
      return () => cancelAnimationFrame(id)
    }
    if (!hovering) setFadeAscii(false)
  }, [hovering, isActive, asciiReady, ascii.length, reduced])

  useEffect(
    () => () => {
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current)
    },
    [],
  )

  const showAsciiOverlay =
    isActive && ascii.length > 0 && asciiReady && !reduced
  const showAsciiVisual = hovering && fadeAscii && showAsciiOverlay
  const showPlainVisual = !hovering || !fadeAscii || !showAsciiOverlay
  const plainOpacity = showPlainVisual ? 1 : 0

  const defaultLetter = (char: string, i: number) => (
    <span
      data-brand-char
      className={`inline-block ${letterClassName}${getLetterClassName?.(char, i) ?? ''}`}
      style={{ opacity: plainOpacity, ...fadeStyle(reduced) }}
      aria-hidden={!showPlainVisual}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  )

  return (
    <span
      ref={rowRef}
      className={`relative inline-block max-w-full select-none ${className}`.trim()}
      data-no-cursor={hideCursor ? true : undefined}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      onMouseEnter={
        asciiEnabled
          ? (e) => {
              const { clientX, clientY } = e
              cancelScheduledDeactivate()
              setHovering(true)
              activate()
              requestAnimationFrame(() => {
                updateHotspot(clientX, clientY)
                if (activeRef.current && asciiRef.current) {
                  setFadeAscii(true)
                }
              })
            }
          : undefined
      }
      onMouseMove={asciiEnabled ? (e) => updateHotspot(e.clientX, e.clientY) : undefined}
      onMouseLeave={
        asciiEnabled
          ? (e) => {
              const next = e.relatedTarget
              if (next instanceof Node && e.currentTarget.contains(next)) return
              scheduleDeactivate()
            }
          : undefined
      }
      onTouchStart={
        asciiEnabled
          ? (e) => {
              cancelScheduledDeactivate()
              setHovering(true)
              activate()
              const t = e.touches[0]
              if (t) {
                updateHotspot(t.clientX, t.clientY)
                requestAnimationFrame(() => {
                  if (activeRef.current && asciiRef.current) setFadeAscii(true)
                })
              }
            }
          : undefined
      }
      onTouchMove={
        asciiEnabled
          ? (e) => {
              const t = e.touches[0]
              if (t) updateHotspot(t.clientX, t.clientY)
            }
          : undefined
      }
      onTouchEnd={asciiEnabled ? scheduleDeactivate : undefined}
      onTouchCancel={asciiEnabled ? scheduleDeactivate : undefined}
    >
      <span
        ref={measureRef}
        className={`${measureClassName} align-baseline`.trim()}
        style={measureStyle}
      >
        {[...label].map((char, i) =>
          renderLetter ? (
            <Fragment key={`${char}-${i}`}>
              {renderLetter(char, i, plainOpacity)}
            </Fragment>
          ) : (
            <span key={`${char}-${i}`}>{defaultLetter(char, i)}</span>
          ),
        )}
      </span>

      {asciiEnabled ? (
      <span
        className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-visible"
        style={{
          opacity: showAsciiVisual ? 1 : 0,
          visibility: hovering ? 'visible' : 'hidden',
          ...fadeStyle(reduced),
        }}
        aria-hidden={!showAsciiVisual}
      >
        <pre
          ref={preRef}
          className="m-0 whitespace-pre font-mono font-400 leading-none text-ink"
          style={{
            fontSize: `${renderPx}px`,
            lineHeight: 1,
            width: gridPx.w > 0 ? `${gridPx.w}px` : undefined,
            height: gridPx.h > 0 ? `${gridPx.h}px` : undefined,
            transform: showAsciiVisual
              ? `scale(${scale.x}, ${scale.y}) translateZ(0)`
              : 'none',
            transformOrigin: '0 0',
            willChange: showAsciiVisual ? 'transform' : undefined,
          }}
        >
          {ascii}
        </pre>
      </span>
      ) : null}
    </span>
  )
}

/** Word-level ASCII hover with fade + radial : / + / # hotspot. */
export default function AsciiHoverLabel(props: AsciiHoverLabelProps) {
  const [asciiReady, setAsciiReady] = useState(false)

  useEffect(() => {
    setAsciiReady(true)
  }, [])

  // Scroll-reveal letters must mount with motion immediately (no static plain fallback).
  if (props.renderLetter) {
    return (
      <AsciiHoverLabelInteractive
        {...props}
        asciiEnabled={asciiReady}
      />
    )
  }

  if (!asciiReady) {
    return <AsciiHoverLabelStatic {...props} />
  }

  return <AsciiHoverLabelInteractive {...props} asciiEnabled />
}
