'use client'

import type { ReactNode } from 'react'
import SiteHeader from '@/components/Header'

/**
 * Header lives here (not inside each page) so it stacks above the project
 * template curtains. A fixed header inside <main> was still painting under z-40 motion layers.
 *
 * Client layout so the nav bundle always includes the header component (avoids rare RSC/Turbopack
 * cases where `Header` was referenced but not defined at runtime).
 */
export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  )
}
