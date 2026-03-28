'use client'

import { useRef, useEffect, useState, useActionState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'
import { submitContact, type ContactFormState } from '@/app/actions/contact'
import { useToasts, ToastContainer } from '@/components/Toast'

const INITIAL_STATE: ContactFormState = { ok: false }

const LINE_1 = 'GREAT PRODUCTS'
const LINE_2 = 'GREAT COLLABORATION'
const ALL_LETTERS = (LINE_1 + ' ' + LINE_2).split('')
const TOTAL = ALL_LETTERS.length

function MaskedLetter({
  char,
  index,
  scrollYProgress,
  reduced,
}: {
  char: string
  index: number
  scrollYProgress: MotionValue<number>
  reduced: boolean
}) {
  const start = 0.05 + (index / TOTAL) * 0.5
  const end = Math.min(start + 0.1, 0.92)

  const y = useTransform(
    scrollYProgress,
    [0, start, end, 1],
    reduced ? ['0%', '0%', '0%', '0%'] : ['-118%', '-118%', '0%', '0%'],
  )

  return (
    <span className="inline-block overflow-hidden align-baseline">
      <motion.span className="inline-block" style={{ y }}>
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  )
}


const INPUT_STYLE = {
  borderBottom: '1px solid rgba(255,255,255,0.35)',
}
const INPUT_CLASS =
  'w-full border-0 bg-transparent pb-4 pt-2 font-mono text-sm text-canvas placeholder:text-white/40 placeholder:uppercase placeholder:tracking-[0.2em] placeholder:text-[11px] focus:outline-none disabled:cursor-not-allowed disabled:opacity-40'
const LABEL_CLASS = 'block font-mono text-[10px] uppercase tracking-[0.25em] mb-1'
const LABEL_STYLE = { color: 'rgba(255,255,255,0.6)' }

export default function Contact() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion() ?? false

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center start'],
  })

  const [state, formAction, isPending] = useActionState(submitContact, INITIAL_STATE)
  const { toasts, push, dismiss } = useToasts()
  const [btnHovered, setBtnHovered] = useState(false)

  useEffect(() => {
    // Skip INITIAL_STATE (no error, no fieldErrors)
    if (!state.error && !state.fieldErrors) return
    if (state.error) push(state.error)
    if (state.fieldErrors?.name?.[0]) push(state.fieldErrors.name[0])
    if (state.fieldErrors?.email?.[0]) push(state.fieldErrors.email[0])
    if (state.fieldErrors?.message?.[0]) push(state.fieldErrors.message[0])
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

  const line1Letters = LINE_1.split('')
  const line2Letters = LINE_2.split('')
  const line2Offset = LINE_1.length + 1

  return (
    <>
    <section
      id="contact"
      ref={ref}
      data-theme="dark"
      className="overflow-hidden"
      style={{ background: '#1a1a1a', paddingTop: '120px', paddingBottom: '120px' }}
    >
      {/* ── Headline ────────────────────────────────────────── */}
      <div className="flex flex-col items-center px-6 text-center" style={{ marginBottom: '96px' }}>
        <p
          className="font-mono uppercase"
          style={{ fontSize: '10px', letterSpacing: '0.35em', marginBottom: '40px', color: 'rgba(255,255,255,0.5)' }}
        >
          LET&apos;S START THE CONVERSATION
        </p>

        <h2
          aria-label={LINE_1}
          className="inline-flex max-w-full flex-wrap justify-center font-clash font-700 leading-[0.9] tracking-[-0.03em] text-canvas"
          style={{ fontSize: 'clamp(3.5rem, 11vw, 10rem)' }}
        >
          {line1Letters.map((char, i) => (
            <MaskedLetter
              key={i}
              char={char}
              index={i}
              scrollYProgress={scrollYProgress}
              reduced={reduced}
            />
          ))}
        </h2>

        <p
          className="font-mono uppercase"
          style={{ fontSize: '10px', letterSpacing: '0.5em', margin: '28px 0', color: 'rgba(255,255,255,0.4)' }}
        >
          STARTS WITH
        </p>

        <h2
          aria-label={LINE_2}
          className="inline-flex max-w-full flex-wrap justify-center font-clash font-700 leading-[0.9] tracking-[-0.03em] text-canvas"
          style={{ fontSize: 'clamp(3.5rem, 11vw, 10rem)' }}
        >
          {line2Letters.map((char, i) => (
            <MaskedLetter
              key={i}
              char={char}
              index={line2Offset + i}
              scrollYProgress={scrollYProgress}
              reduced={reduced}
            />
          ))}
        </h2>
      </div>

      {/* ── Form ────────────────────────────────────────────── */}
      <div className="mx-auto w-full px-6 lg:px-16" style={{ maxWidth: '800px' }}>
        {state.ok ? (
          <div className="flex flex-col items-center gap-6 py-24 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-canvas/50">
              MESSAGE SENT
            </span>
            <p className="font-clash font-700 text-canvas" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
              I&apos;ll be in touch soon.
            </p>
          </div>
        ) : (
          <form
            action={formAction}
            aria-label="Contact form"
            aria-busy={isPending}
            noValidate
            className="flex flex-col"
            style={{ gap: '40px' }}
          >
            {/* Name */}
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-required="true"
              aria-invalid={!!state.fieldErrors?.name}
              disabled={isPending}
              placeholder="YOUR NAME *"
              className={INPUT_CLASS}
              style={INPUT_STYLE}
            />

            {/* Phone + Email side by side on desktop */}
            <div className="grid gap-10 lg:grid-cols-2">
            <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-required="true"
                aria-invalid={!!state.fieldErrors?.email}
                disabled={isPending}
                placeholder="YOUR EMAIL *"
                className={INPUT_CLASS}
                style={INPUT_STYLE}
              />
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                disabled={isPending}
                placeholder="+1 000 000 0000 (OPTIONAL)"
                className={INPUT_CLASS}
                style={INPUT_STYLE}
              />
            
            </div>

            {/* Message */}
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              required
              aria-required="true"
              aria-invalid={!!state.fieldErrors?.message}
              disabled={isPending}
              placeholder="TELL ME ABOUT YOUR PROJECT"
              className={`${INPUT_CLASS} resize-none`}
              style={INPUT_STYLE}
            />

            {/* Submit */}
            <div style={{ paddingTop: '16px' }}>
              <motion.button
                type="submit"
                disabled={isPending}
                aria-disabled={isPending}
                onHoverStart={() => !isPending && setBtnHovered(true)}
                onHoverEnd={() => setBtnHovered(false)}
                animate={{
                  backgroundColor: btnHovered ? '#ffffff' : 'rgba(0,0,0,0)',
                  color: btnHovered ? '#1a1a1a' : '#ffffff',
                  borderColor: btnHovered ? '#ffffff' : 'rgba(255,255,255,0.35)',
                }}
                whileTap={isPending ? {} : { scale: 0.99 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex items-center justify-between font-clash font-700 uppercase disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  fontSize: 'clamp(0.8rem, 1.2vw, 1.2rem)',
                  letterSpacing: '0.08em',
                  border: '1px solid rgba(255,255,255,0.35)',
                  padding: '20px 32px',
                }}
              >
                <span>{isPending ? 'SENDING…' : 'SEND MESSAGE'}</span>
                <span>{isPending ? '' : '→'}</span>
              </motion.button>
            </div>
          </form>
        )}
      </div>
    </section>

    <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  )
}
