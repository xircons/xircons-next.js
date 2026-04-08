'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation, useReducedMotion } from 'framer-motion'
import type { PortfolioSkill } from '@/types/portfolio'

interface Props {
  skills: readonly PortfolioSkill[]
}

const EASE = [0.22, 1, 0.36, 1] as const

const DESCRIPTIONS: Record<string, string> = {
  '00-1':
    'Building clean, responsive, and user-friendly web interfaces. I focus on writing maintainable component structures that look great and work smoothly on any device.',
  '00-2':
    'Adding life to static pages. I really enjoy implementing smooth scroll effects and interactive elements that make websites feel more engaging without slowing them down.',
  '00-3':
    'Creating the logic behind the scenes. I build straightforward APIs and server routes to handle user data, authentication, and core application features safely.',
  '00-4':
    'Structuring data so it is easy to store and retrieve. I have experience designing relational SQL databases for university projects as well as setting up quick NoSQL solutions.',
  '00-5':
    'Taking an idea and building it from start to finish. I enjoy combining the frontend and backend, figuring out how different parts communicate, and getting the final project live on the web.',
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DESKTOP  — horizontal hover accordion
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function DesktopColumn({
  skill,
  index,
  hovered,
  onEnter,
  onLeave,
  reduced,
  isLast,
}: {
  skill: PortfolioSkill
  index: number
  hovered: boolean
  onEnter: () => void
  onLeave: () => void
  reduced: boolean
  isLast: boolean
}) {
  const slashAnim = useAnimation()

  useEffect(() => {
    if (reduced) return
    if (hovered) {
      slashAnim.set({ y: '-110%' })
      slashAnim.start({ y: '0%', transition: { duration: 0.35, delay: 0.15, ease: EASE } })
    } else {
      slashAnim.start({ y: '110%', transition: { duration: 0.25, ease: EASE } })
    }
  }, [hovered, reduced, slashAnim])

  return (
    <motion.div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      animate={{ flex: hovered ? 4 : 1 }}
      transition={reduced ? { duration: 0 } : { duration: 0.6, ease: EASE }}
      className="relative flex min-h-0 flex-col overflow-hidden"
      style={{
        minWidth: 0,
        borderRight: isLast ? 'none' : '1px solid #1a1a1a',
      }}
    >
      {/* Header */}
      <div className="flex flex-none items-center justify-between gap-3" style={{ padding: '20px 24px 16px' }}>
        <div className="flex min-w-0 flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
            {skill.id}
          </span>
          <div className="relative overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              {hovered ? (
                <motion.span
                  key="expanded"
                  initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  exit={{ clipPath: 'inset(0% 0% 0% 100%)' }}
                  transition={reduced ? { duration: 0 } : { duration: 0.35, ease: EASE }}
                  className="flex items-baseline gap-1 font-clash font-700 leading-tight text-ink whitespace-nowrap"
                  style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.4rem)', letterSpacing: '-0.02em' }}
                >
                  <motion.span animate={slashAnim} className="inline-block overflow-hidden">
                    {'//'}
                  </motion.span>
                  {skill.title}
                </motion.span>
              ) : (
                <motion.h3
                  key="collapsed"
                  initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  exit={{ clipPath: 'inset(0% 0% 0% 100%)' }}
                  transition={reduced ? { duration: 0 } : { duration: 0.35, ease: EASE }}
                  className="font-clash font-700 leading-tight text-ink whitespace-nowrap"
                  style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.4rem)', letterSpacing: '-0.02em' }}
                >
                  {skill.title}
                </motion.h3>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.span
          animate={{ rotate: hovered ? 45 : 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.3, ease: EASE }}
          className="flex-none select-none font-mono text-ink"
          style={{ fontSize: '1.1rem', lineHeight: 1, opacity: 0.3 }}
          aria-hidden="true"
        >
          +
        </motion.span>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#1a1a1a', margin: '0 24px' }} />

      {/* Body — opacity-only animation; flex:1 fills height so content pins to bottom */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        initial={{ opacity: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.45, ease: EASE }}
        className="flex flex-col overflow-hidden"
        style={{ flex: '1 1 0' }}
      >
        <div className="flex flex-1 flex-col justify-between" style={{ padding: '16px 24px 24px' }}>
          <div className="flex min-h-0 flex-1 gap-4">
            <ul role="list" className="flex flex-1 flex-col gap-2">
              {skill.details.map((detail) => (
                <li key={detail} className="font-sans text-xs font-500 uppercase tracking-[0.12em] text-ink">
                  / {detail.replace(/^\//, '')}
                </li>
              ))}
            </ul>
            {/* <div className="flex-1 bg-neutral-200 mb-5" /> */}
          </div>

          <div className="flex flex-none flex-col gap-2">
            <p className="font-mono text-xs leading-relaxed text-ink">
              {DESCRIPTIONS[skill.id]}
            </p>
            <span className="font-mono text-[10px] tabular-nums text-ink">
              0{index + 1} / 05
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function DesktopAccordion({ skills, reduced }: { skills: readonly PortfolioSkill[]; reduced: boolean }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <section id="skills" className="hidden flex-col lg:flex lg:h-[100dvh]" style={{ background: '#fff' }}>
      <div className="flex flex-none items-baseline justify-between" style={{ padding: '20px 32px' }}>
        <h2
          className="font-clash font-700 leading-none tracking-[-0.04em] text-ink"
          style={{ fontSize: 'clamp(3rem, 8vw, 8rem)' }}
        >
          SKILLS
        </h2>
      </div>

      <div
        className="flex min-h-0 flex-1 flex-row"
        style={{ border: '1px solid #1a1a1a', margin: '12px 32px 32px' }}
      >
        {skills.map((skill, i) => (
          <DesktopColumn
            key={skill.id}
            skill={skill}
            index={i}
            hovered={activeId === skill.id}
            onEnter={() => setActiveId(skill.id)}
            onLeave={() => setActiveId(null)}
            reduced={reduced}
            isLast={i === skills.length - 1}
          />
        ))}
      </div>
    </section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MOBILE  — vertical tap accordion
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function MobileRow({
  skill,
  index,
  open,
  onToggle,
  reduced,
  isLast,
}: {
  skill: PortfolioSkill
  index: number
  open: boolean
  onToggle: () => void
  reduced: boolean
  isLast: boolean
}) {
  const slashAnim = useAnimation()

  useEffect(() => {
    if (reduced) return
    if (open) {
      slashAnim.set({ y: '-110%' })
      slashAnim.start({ y: '0%', transition: { duration: 0.35, delay: 0.15, ease: EASE } })
    } else {
      slashAnim.start({ y: '110%', transition: { duration: 0.25, ease: EASE } })
    }
  }, [open, reduced, slashAnim])

  return (
    <div
      onClick={onToggle}
      className="flex flex-col"
      style={{
        cursor: 'pointer',
        borderBottom: isLast ? 'none' : '1px solid #1a1a1a',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3" style={{ padding: '18px 20px 14px' }}>
        <div className="flex min-w-0 flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
            {skill.id}
          </span>
          <div className="relative overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              {open ? (
                <motion.span
                  key="expanded"
                  initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  exit={{ clipPath: 'inset(0% 0% 0% 100%)' }}
                  transition={reduced ? { duration: 0 } : { duration: 0.35, ease: EASE }}
                  className="flex items-baseline gap-1 font-clash font-700 leading-tight text-ink"
                  style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)', letterSpacing: '-0.02em' }}
                >
                  <motion.span animate={slashAnim} className="inline-block overflow-hidden">
                    {'//'}
                  </motion.span>
                  {skill.title}
                </motion.span>
              ) : (
                <motion.h3
                  key="collapsed"
                  initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  exit={{ clipPath: 'inset(0% 0% 0% 100%)' }}
                  transition={reduced ? { duration: 0 } : { duration: 0.35, ease: EASE }}
                  className="font-clash font-700 leading-tight text-ink"
                  style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)', letterSpacing: '-0.02em' }}
                >
                  {skill.title}
                </motion.h3>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Circle +/× indicator */}
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.3, ease: EASE }}
          className="flex h-7 w-7 flex-none select-none items-center justify-center rounded-full border border-current font-mono text-ink"
          style={{ fontSize: '0.9rem', lineHeight: 1, opacity: 0.55 }}
          aria-hidden="true"
        >
          +
        </motion.span>
      </div>

      {/* Divider — only shown when open */}
      {open && (
        <div style={{ height: '1px', background: '#1a1a1a', margin: '0 20px' }} />
      )}

      {/* Body */}
      <motion.div
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        initial={{ height: 0, opacity: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.45, ease: EASE }}
        className="overflow-hidden"
      >
        <div className="flex flex-col gap-5" style={{ padding: '14px 20px 20px' }}>
          <ul role="list" className="flex flex-col gap-2">
            {skill.details.map((detail) => (
              <li key={detail} className="font-sans text-[10px] font-500 uppercase tracking-[0.14em] text-ink">
                — {detail.replace(/^\//, '')}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs leading-relaxed text-ink">
              {DESCRIPTIONS[skill.id]}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tabular-nums text-ink">
                0{index + 1} / 05
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink opacity-30">
                tap to close
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function MobileAccordion({ skills, reduced }: { skills: readonly PortfolioSkill[]; reduced: boolean }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <section id="skills" className="flex flex-col lg:hidden" style={{ background: '#fff' }}>
      <div className="flex items-baseline justify-between" style={{ padding: '48px 20px 16px' }}>
        <h2
          className="font-clash font-700 leading-none tracking-[-0.04em] text-ink"
          style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)' }}
        >
          SKILLS
        </h2>
      </div>

      <div
        className="flex flex-col"
        style={{ border: '1px solid #1a1a1a', margin: '8px 20px 32px' }}
      >
        {skills.map((skill, i) => (
          <MobileRow
            key={skill.id}
            skill={skill}
            index={i}
            open={activeId === skill.id}
            onToggle={() => setActiveId((prev) => (prev === skill.id ? null : skill.id))}
            reduced={reduced}
            isLast={i === skills.length - 1}
          />
        ))}
      </div>
    </section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   EXPORT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function Skills({ skills }: Props) {
  const reduced = useReducedMotion() ?? false

  return (
    <>
      <DesktopAccordion skills={skills} reduced={reduced} />
      <MobileAccordion skills={skills} reduced={reduced} />
    </>
  )
}
