'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useLenis } from '@/components/SmoothScrollProvider'
import { HOME_SECTION_STORAGE_KEY } from '@/lib/home-nav'
import { getArrowMorphTransition } from '@/lib/motion'

const NAV_LINKS = [
  { label: 'ABOUT ME', hash: 'about' as const },
  { label: 'WORKS', hash: 'works' as const },
  { label: 'SKILLS', hash: 'skills' as const },
  { label: 'CONNECT', hash: 'contact' as const },
]

const CONTACT_EASE = [0.22, 1, 0.36, 1] as const
const CONTACT_T = { duration: 0.4, ease: CONTACT_EASE }

/** Mailto CTA — same L→R underline + ArrowUpRight → ArrowRight morph as footer socials. */
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
          <ArrowUpRight className="size-full" strokeWidth={2} aria-hidden />
        </motion.span>
        <motion.span
          className="absolute inset-0 flex items-center justify-center will-change-transform"
          initial={false}
          animate={{
            opacity: hovered ? 1 : 0,
            x: hovered ? 3 : 0,
            scale: hovered ? 1 : 0.94,
          }}
          transition={arrowT}
          aria-hidden="true"
        >
          <ArrowRight className="size-[72%]" strokeWidth={2} aria-hidden />
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
  hash,
  dark,
  isHome,
}: {
  label: string
  hash: string
  dark: boolean
  isHome: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const router = useRouter()
  const { scrollTo } = useLenis()
  const href = `#${hash}`

  const slide   = { rest: { y: '0%' },    hover: { y: '100%' }  }
  const slideIn = { rest: { y: '-100%' }, hover: { y: '0%' }    }
  const transition = { duration: 0.3, ease: 'easeInOut' as const }

  const color = dark ? 'text-canvas' : 'text-ink'
  const outline = dark ? 'focus-visible:outline-canvas' : 'focus-visible:outline-ink'

  const commonClass = `relative block overflow-hidden font-sans text-xs font-500 tracking-[0.15em] focus-visible:rounded focus-visible:outline-2 transition-colors duration-300 ${color} ${outline}`

  const inner = (
    <>
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
    </>
  )

  return (
    <li>
      {isHome ? (
        <a
          href={href}
          onClick={(e) => {
            e.preventDefault()
            scrollTo(href)
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={commonClass}
        >
          {inner}
        </a>
      ) : (
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault()
            try {
              sessionStorage.setItem(HOME_SECTION_STORAGE_KEY, hash)
            } catch {
              /* private / quota */
            }
            router.push('/', { scroll: false })
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={commonClass}
        >
          {inner}
        </Link>
      )}
    </li>
  )
}

export default function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const { scrollTo } = useLenis()
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

      <header role="banner" className="fixed left-0 right-0 top-0 z-[100]">
        <nav
          role="navigation"
          aria-label="Primary navigation"
          className="flex items-center justify-between px-6 py-5 lg:px-10"
        >
          {isHome ? (
            <a
              href="#"
              aria-label="Xircons — back to top"
              onClick={(e) => {
                e.preventDefault()
                scrollTo('#main-content')
              }}
              className={`font-clash text-lg font-700 leading-none tracking-tighter transition-colors duration-300 focus-visible:rounded focus-visible:outline-2 ${textColor} ${outlineColor}`}
            >
              XIRCONS
            </a>
          ) : (
            <Link
              href="/"
              aria-label="Xircons — home"
              className={`font-clash text-lg font-700 leading-none tracking-tighter transition-colors duration-300 focus-visible:rounded focus-visible:outline-2 ${textColor} ${outlineColor}`}
            >
              XIRCONS
            </Link>
          )}

          <ul className="hidden items-center gap-10 md:flex" role="list">
            {NAV_LINKS.map(({ label, hash }) => (
              <NavLink key={hash} label={label} hash={hash} dark={dark} isHome={isHome} />
            ))}
          </ul>

          <HeaderMailLink href="mailto:wutthikan_s@cmu.ac.th" dark={dark} />
        </nav>
      </header>
    </>
  )
}
