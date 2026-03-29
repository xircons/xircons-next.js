import type { Metadata } from 'next'
import { Inter, IBM_Plex_Sans_Thai } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'
import CustomCursor from '@/components/CustomCursor'
import StructuredData from '@/components/StructuredData'
import { getMetadataBase, getSiteUrl } from '@/lib/site'
import { siteSeo } from '@/data/seo'

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

const siteUrl = getSiteUrl()
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: siteSeo.title,
    template: `%s · ${siteSeo.shortTitle}`,
  },
  description: siteSeo.description,
  keywords: [...siteSeo.keywords],
  authors: [{ name: siteSeo.person.name, url: siteUrl }],
  creator: siteSeo.person.name,
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    title: siteSeo.title,
    description: siteSeo.ogDescription,
    url: siteUrl,
    siteName: siteSeo.siteName,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteSeo.title,
    description: siteSeo.ogDescription,
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
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
        <StructuredData />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <CustomCursor />
      </body>
    </html>
  )
}
