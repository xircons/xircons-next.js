'use client'

import { useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

export interface ToastItem {
  id: string
  message: string
}

const EASE = [0.22, 1, 0.36, 1] as const
const DURATION = 5000

function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastItem
  onDismiss: (id: string) => void
}) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), DURATION)
    return () => clearTimeout(t)
  }, [toast.id, onDismiss])

  return (
    <motion.div
      layout
      initial={{ x: '110%' }}
      animate={{ x: '0%' }}
      exit={{ x: '110%' }}
      transition={{ duration: 0.45, ease: EASE }}
      role="alert"
      aria-live="assertive"
      className="pointer-events-auto flex items-start justify-between gap-6 bg-canvas"
      style={{
        border: '1px solid #1a1a1a',
        padding: '14px 20px',
        minWidth: '260px',
        maxWidth: '380px',
      }}
    >
      <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-ink">
        {toast.message}
      </p>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        className="mt-px flex-none font-mono text-[10px] text-ink/50 transition-colors hover:text-ink"
      >
        ✕
      </button>
    </motion.div>
  )
}

export function ToastContainer({ toasts, onDismiss }: {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    queueMicrotask(() => setMounted(true))
  }, [])
  if (!mounted) return null

  return createPortal(
    <div
      aria-label="Notifications"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  )
}

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const push = useCallback((message: string) => {
    setToasts((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, message },
    ])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, push, dismiss }
}
