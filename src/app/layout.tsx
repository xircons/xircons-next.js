import type { Metadata } from 'next'
import { Inter, IBM_Plex_Sans_Thai } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'
import CustomCursor from '@/components/CustomCursor'

const inter = Inter({
  variable: '--font-inter-var',
  subsets: ['latin'],
  display: 'swap',
})

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  variable: '--font-plex-thai-var',
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const clashDisplay = localFont({
  src: [
    { path: '../fonts/ClashDisplay-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/ClashDisplay-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/ClashDisplay-600.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/ClashDisplay-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-clash-var',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Xircons — Web Developer',
  description:
    'Developer specializing in crafting elegant, performant, and accessible user interfaces with React, Next.js, and Framer Motion.',
  openGraph: {
    title: 'Xircons — Web Developer',
    description: 'Crafting elegant, performant UIs.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexSansThai.variable} ${clashDisplay.variable} h-full`}
    >
      <body className="min-h-full">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <CustomCursor />
      </body>
    </html>
  )
}
