'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useLenis } from '@/components/SmoothScrollProvider'

const NAV = [
  { label: 'ABOUT ME', href: '#about' },
  { label: 'WORKS', href: '#works' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'CONNECT', href: '#contact' },
]

const SOCIALS = [
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/pppwtk/' },
  { label: 'FACEBOOK', href: 'https://www.facebook.com/pppwtk/' },
]

const PLATFORMS = [
  { label: 'GITHUB', href: 'https://github.com/xircons' },
]

/** Mobile top row — bracketed externals (image-2 style), same targets as below */
const MOBILE_BRACKET_EXTERNAL = [
  { label: 'GITHUB', href: PLATFORMS[0].href },
  { label: 'INSTAGRAM', href: SOCIALS[0].href },
  { label: 'FACEBOOK', href: SOCIALS[1].href },
] as const

const SOCIAL_LINK_CLASS =
  'font-sans text-sm font-500 uppercase tracking-[0.1em] text-ink'

const BRACKET_EASE = { duration: 0.3, ease: 'easeInOut' as const }
const SOCIAL_EASE = [0.22, 1, 0.36, 1] as const
const SOCIAL_T = { duration: 0.4, ease: SOCIAL_EASE }

/** External social — L→R underline draw + ArrowUpRight crossfades to ArrowRight on hover. */
function FooterSocialLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false)
  const reduced = useReducedMotion()
  const t = reduced ? { duration: 0 } : SOCIAL_T

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative inline-flex items-baseline gap-1 pb-1 ${SOCIAL_LINK_CLASS} focus-visible:rounded focus-visible:outline-2 focus-visible:outline-ink`}
    >
      <span className="relative z-10">{label}</span>
      <span className="relative z-10 inline-flex h-[1em] w-[1em] shrink-0 items-center justify-center overflow-hidden text-[0.85em] leading-none">
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            opacity: hovered ? 0 : 1,
            x: hovered ? 6 : 0,
          }}
          transition={t}
          aria-hidden="true"
        >
          <ArrowUpRight className="size-full" strokeWidth={2} aria-hidden />
        </motion.span>
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            opacity: hovered ? 1 : 0,
            x: hovered ? 0 : -6,
          }}
          transition={t}
          aria-hidden="true"
        >
          <ArrowRight className="size-[72%]" strokeWidth={2} aria-hidden />
        </motion.span>
      </span>
      {/* Underline draws L→R on hover, retracts on leave */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[1.5px] w-full origin-left bg-ink"
        initial={false}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={t}
      />
    </a>
  )
}

/** Bracketed in-page nav — same slide + `[ LABEL ]` style as header `NavLink`. */
function FooterBracketNavLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false)
  const { scrollTo } = useLenis()

  const slide = { rest: { y: '0%' }, hover: { y: '100%' } }
  const slideIn = { rest: { y: '-100%' }, hover: { y: '0%' } }
  const transition = { duration: 0.3, ease: 'easeInOut' as const }

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault()
        scrollTo(href)
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative block overflow-hidden font-sans text-xs font-500 tracking-[0.15em] text-ink focus-visible:rounded focus-visible:outline-2 focus-visible:outline-ink"
    >
      <motion.span
        aria-hidden="true"
        className="block"
        animate={hovered ? slide.hover : slide.rest}
        transition={transition}
      >
        [ {label} ]
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 block"
        animate={hovered ? slideIn.hover : slideIn.rest}
        transition={transition}
      >
        [ {label} ]
      </motion.span>
      <span className="sr-only">{label}</span>
    </a>
  )
}


/** Same top→bottom slide-through as Header `NavLink` for `[ LABEL ]` links. */
function BracketPlatformLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false)
  const slide = { rest: { y: '0%' }, hover: { y: '100%' } }
  const slideIn = { rest: { y: '-100%' }, hover: { y: '0%' } }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative block overflow-hidden font-sans text-xs font-500 uppercase tracking-[0.15em] text-ink focus-visible:rounded focus-visible:outline-2 focus-visible:outline-ink"
    >
      <motion.span
        aria-hidden="true"
        className="block"
        animate={hovered ? slide.hover : slide.rest}
        transition={BRACKET_EASE}
      >
        [ {label} ]
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 block"
        animate={hovered ? slideIn.hover : slideIn.rest}
        transition={BRACKET_EASE}
      >
        [ {label} ]
      </motion.span>
      <span className="sr-only">{label}</span>
    </a>
  )
}

/** Edit location + IANA zone so the line always matches a real place & offset. */
const FOOTER_CLOCK = {
  locationLabel: 'CHIANG MAI, THAILAND',
  timeZone: 'Asia/Bangkok',
} as const

function timeZoneOffsetLabel(timeZone: string, date: Date): string {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      timeZoneName: 'shortOffset',
    }).formatToParts(date)
    const raw = parts.find((p) => p.type === 'timeZoneName')?.value?.trim()
    if (raw) return raw.replace(/\u2212/g, '-').replace(/\s+/g, '')
  } catch {
    /* older engines */
  }
  return 'GMT+7'
}

function formatClock24h(timeZone: string, date: Date): string {
  return date.toLocaleTimeString('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function buildClockParts(date: Date): {
  line: string
  location: string
  offset: string
  time: string
} {
  const { locationLabel, timeZone } = FOOTER_CLOCK
  const offset = timeZoneOffsetLabel(timeZone, date)
  const time = formatClock24h(timeZone, date)
  return {
    line: `${locationLabel}: (${offset}) ${time}`,
    location: locationLabel,
    offset,
    time,
  }
}

const FOOTER_CLOCK_PLACEHOLDER = {
  line: `${FOOTER_CLOCK.locationLabel}: (--:--)`,
  location: FOOTER_CLOCK.locationLabel,
  offset: 'GMT+7',
  time: '--:--',
} as const

/**
 * Live-updating footer clock: correct TZ offset via Intl, ticks every second,
 * resyncs when the tab becomes visible again (browser throttles background tabs).
 * Placeholder until mount avoids SSR/client Intl or clock skew hydration mismatches.
 */
function useFooterClock(): {
  line: string
  location: string
  offset: string
  time: string
} {
  const [parts, setParts] = useState<{
    line: string
    location: string
    offset: string
    time: string
  } | null>(null)

  useEffect(() => {
    const tick = () => setParts(buildClockParts(new Date()))

    tick()
    const id = window.setInterval(tick, 1000)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return parts ?? { ...FOOTER_CLOCK_PLACEHOLDER }
}

export default function Footer() {
  const clock = useFooterClock()
  const year = new Date().getFullYear()

  return (
    <footer role="contentinfo" style={{ background: '#f2f2f2', color: '#1a1a1a' }}>

      {/* ── MOBILE (<lg) — bracket externals → centered contact → meta ── */}
      <div className="lg:hidden">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 px-5 pt-10 pb-3">
          {MOBILE_BRACKET_EXTERNAL.map(({ label, href }) => (
            <BracketPlatformLink key={label} label={label} href={href} />
          ))}
        </div>

        <div className="mx-auto h-px max-w-[calc(100%-2.5rem)] bg-ink/10" aria-hidden="true" />

        <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
          <a
            href="tel:+66933199416"
            className="font-clash font-700 leading-tight tracking-[-0.02em] text-ink transition-opacity hover:opacity-60"
            style={{ fontSize: 'clamp(1.15rem, 4.5vw, 1.65rem)' }}
          >
            +66 93 319 9416
          </a>
          <a
            href="mailto:wutthikan_s@cmu.ac.th"
            className="max-w-full font-clash font-700 leading-tight tracking-[-0.02em] text-ink transition-opacity hover:opacity-60 break-all"
            style={{ fontSize: 'clamp(1rem, 3.8vw, 1.35rem)' }}
          >
            wutthikan_s@cmu.ac.th
          </a>
        </div>

        <div className="mx-auto h-px max-w-[calc(100%-2.5rem)] bg-ink/10" aria-hidden="true" />

        <div
          className="px-5 pt-8"
          style={{
            paddingBottom: 'max(2.75rem, calc(env(safe-area-inset-bottom, 0px) + 2.25rem))',
          }}
        >
          <div
            className="flex w-full items-start justify-between gap-4 font-mono text-ink"
            style={{
              fontSize: 'clamp(10px, 3.1vw, 12px)',
              opacity: 0.52,
            }}
          >
            <div
              className="min-w-0 flex-1 text-left uppercase leading-[1.6] tracking-[0.07em]"
              aria-label={clock.line}
            >
              <p className="text-balance">{clock.location}</p>
              <p className="mt-1.5 tabular-nums tracking-[0.06em]">
                <span className="opacity-90">({clock.offset})</span>{' '}
                <span className="font-500 opacity-100">{clock.time}</span>
              </p>
            </div>
            <div className="ml-1 shrink-0 text-right sm:ml-2">
              <p className="leading-[1.65]">© {year} All Rights Reserved.</p>
              <p className="mt-2 font-500 leading-[1.65] tracking-[0.04em]">XIRCONS</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── DESKTOP (lg+) — existing layout ───────────────────── */}
      <div className="hidden lg:block">
        {/* ── ROW 1 — Contact: phone + email, right-aligned ────── */}
        <div className="flex justify-end" style={{ padding: '52px 40px 24px' }}>
          <div className="flex flex-col items-end" style={{ gap: '4px' }}>
            <a
              href="tel:+66933199416"
              className="font-clash font-700 leading-none tracking-[-0.02em] text-ink transition-opacity hover:opacity-60"
              style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2.2rem)' }}
            >
              +66 93 319 9416
            </a>
            <a
              href="mailto:wutthikan_s@cmu.ac.th"
              className="font-clash font-700 leading-none tracking-[-0.02em] text-ink transition-opacity hover:opacity-60"
              style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2.2rem)' }}
            >
              wutthikan_s@cmu.ac.th
            </a>
          </div>
        </div>

        {/* ── ROW 2 — Nav (left) + Socials-row + Address (right) ── */}
        <div
          className="flex items-start justify-between"
          style={{ padding: '0 40px 40px', gap: '32px' }}
        >
          <nav aria-label="Footer navigation">
            <ul className="flex flex-col" style={{ gap: '6px' }} role="list">
              {NAV.map(({ label, href }) => (
                <li key={href}>
                  <FooterBracketNavLink label={label} href={href} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-1 items-start justify-between" style={{ paddingLeft: '40px' }}>
            <div className="flex flex-1 items-start justify-between" style={{ paddingRight: '48px' }}>
              {SOCIALS.map(({ label, href }) => (
                <FooterSocialLink key={label} label={label} href={href} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: '#1a1a1a', opacity: 0.1, margin: '0 40px' }} />

        <div className="flex items-center justify-center" style={{ padding: '28px 40px' }}>
          <ul className="flex flex-wrap items-center justify-center gap-x-16 gap-y-4" role="list">
            {PLATFORMS.map(({ label, href }) => (
              <li key={label}>
                <BracketPlatformLink label={label} href={href} />
              </li>
            ))}
          </ul>
        </div>

        <div style={{ height: '1px', background: '#1a1a1a', opacity: 0.1, margin: '0 40px' }} />

        <div style={{ padding: '0 28px' }}>
          <p
            className="font-clash font-700 leading-none text-ink text-center"
            style={{
              fontSize: 'clamp(14vw, 16vw, 18vw)',
              letterSpacing: '-0.035em',
              lineHeight: 0.87,
            }}
            aria-label="XIRCONS"
          >
            XIRCONS
          </p>
        </div>

        <div style={{ height: '1px', background: '#1a1a1a', opacity: 0.1, margin: '0 40px' }} />

        <div
          className="flex items-center justify-between"
          style={{ padding: '14px 40px 20px', gap: '16px' }}
        >
          <p
            className="font-mono uppercase text-ink tabular-nums"
            style={{ fontSize: '11px', letterSpacing: '0.12em', opacity: 0.5 }}
          >
            {clock.line}
          </p>
          <p
            className="text-right font-mono leading-relaxed text-ink"
            style={{ fontSize: '10px', opacity: 0.4 }}
          >
            © {year} All Rights Reserved. XIRCONS.
          </p>
        </div>
      </div>
    </footer>
  )
}
