'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLenis } from '@/components/SmoothScrollProvider'
import { getArrowMorphTransition } from '@/lib/motion'

const NAV_LINKS = [
  { label: 'ABOUT ME', href: '#about' },
  { label: 'WORKS', href: '#works' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'CONNECT', href: '#contact' },
]

const CONTACT_EASE = [0.22, 1, 0.36, 1] as const
const CONTACT_T = { duration: 0.4, ease: CONTACT_EASE }

/** Mailto CTA — same L→R underline + ↗→→ as footer socials; colours follow header dark mode. */
function HeaderMailLink({ href, dark }: { href: string; dark: boolean }) {
  const [hovered, setHovered] = useState(false)
  const reduced = useReducedMotion()
  const t = reduced ? { duration: 0 } : CONTACT_T
  const arrowT = getArrowMorphTransition(!!reduced)
  const color = dark ? 'text-canvas' : 'text-ink'
  const outline = dark ? 'focus-visible:outline-canvas' : 'focus-visible:outline-ink'
  const lineBg = dark ? 'bg-canvas' : 'bg-ink'

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative inline-flex items-baseline gap-1 pb-1 font-sans text-xs font-700 uppercase tracking-[0.15em] focus-visible:rounded focus-visible:outline-2 ${color} ${outline}`}
    >
      {/* <span className="relative z-10">CONTACT ME</span> */}
      <span className="relative z-10 inline-flex h-[1em] w-[1em] shrink-0 items-center justify-center overflow-hidden text-[0.85em] leading-none transform-gpu">
        <motion.span
          className="absolute inset-0 flex items-center justify-center will-change-transform"
          initial={false}
          animate={{
            opacity: hovered ? 0 : 1,
            x: hovered ? -2 : 0,
            y: hovered ? -1 : 0,
            scale: hovered ? 0.94 : 1,
          }}
          transition={arrowT}
          aria-hidden="true"
        >
          {/* ↗ */}
        </motion.span>
        <motion.span
          className="absolute inset-0 flex items-center justify-center text-[0.72em] will-change-transform"
          initial={false}
          animate={{
            opacity: hovered ? 1 : 0,
            x: hovered ? 3 : 0,
            scale: hovered ? 1 : 0.94,
          }}
          transition={arrowT}
          aria-hidden="true"
        >
          →
        </motion.span>
      </span>
      <motion.span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-0 left-0 h-[1.5px] w-full origin-left ${lineBg}`}
        initial={false}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={t}
      />
    </a>
  )
}

/**
 * Nav link — text slides top→bottom through a clipped window on hover.
 */
function NavLink({
  label,
  href,
  dark,
}: {
  label: string
  href: string
  dark: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const { scrollTo } = useLenis()

  const slide   = { rest: { y: '0%' },    hover: { y: '100%' }  }
  const slideIn = { rest: { y: '-100%' }, hover: { y: '0%' }    }
  const transition = { duration: 0.3, ease: 'easeInOut' as const }

  const color = dark ? 'text-canvas' : 'text-ink'
  const outline = dark ? 'focus-visible:outline-canvas' : 'focus-visible:outline-ink'

  return (
    <li>
      <a
        href={href}
        onClick={(e) => { e.preventDefault(); scrollTo(href) }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative block overflow-hidden font-sans text-xs font-500 tracking-[0.15em] focus-visible:rounded focus-visible:outline-2 transition-colors duration-300 ${color} ${outline}`}
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
    </li>
  )
}

export default function Header() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const darkSections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-theme="dark"]')
    )
    if (darkSections.length === 0) return

    // Track which dark sections are currently inside the header zone
    const active = new Set<Element>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            active.add(entry.target)
          } else {
            active.delete(entry.target)
          }
        })
        setDark(active.size > 0)
      },
      {
        // Shrink the observed zone to roughly the top 10% of the viewport
        // so only sections that are actually behind the header trigger the switch
        rootMargin: '0px 0px -90% 0px',
        threshold: 0,
      }
    )

    darkSections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const textColor   = dark ? 'text-canvas' : 'text-ink'
  const outlineColor = dark ? 'focus-visible:outline-canvas' : 'focus-visible:outline-ink'

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas focus:outline-none"
      >
        Skip to content
      </a>

      <header role="banner" className="fixed left-0 right-0 top-0 z-50">
        <nav
          role="navigation"
          aria-label="Primary navigation"
          className="flex items-center justify-between px-6 py-5 lg:px-10"
        >
          <a
            href="#"
            aria-label="Xircons — back to top"
            className={`font-clash text-lg font-700 leading-none tracking-tighter transition-colors duration-300 focus-visible:rounded focus-visible:outline-2 ${textColor} ${outlineColor}`}
          >
            XIRCONS
          </a>

          <ul className="hidden items-center gap-10 md:flex" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <NavLink key={href} label={label} href={href} dark={dark} />
            ))}
          </ul>

          <HeaderMailLink href="mailto:wutthikan_s@cmu.ac.th" dark={dark} />
        </nav>
      </header>
    </>
  )
}
