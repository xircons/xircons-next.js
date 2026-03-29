/** Shared copy for metadata + JSON-LD — keep in sync with on-page content. */
export const siteSeo = {
  siteName: 'Xircons',
  title: 'Xircons — Web Developer',
  shortTitle: 'Xircons',
  description:
    'Wuttikan (Xircons) — web developer and DII student at Chiang Mai University. Frontend with React, Next.js, Framer Motion, full-stack projects, and UI craft.',
  ogDescription:
    'Portfolio of Wuttikan (Xircons): web development, motion, and full-stack work from Chiang Mai, Thailand.',
  keywords: [
    'Xircons',
    'Wuttikan',
    'web developer',
    'Next.js',
    'React',
    'Framer Motion',
    'Chiang Mai University',
    'portfolio',
    'frontend',
    'Thailand',
  ],
  person: {
    name: 'Wuttikan',
    alternateName: 'Xircons',
    jobTitle: 'Web developer',
    email: 'wutthikan_s@cmu.ac.th',
  },
  organization: {
    '@type': 'CollegeOrUniversity' as const,
    name: 'Chiang Mai University',
    sameAs: 'https://www.cmu.ac.th',
  },
  sameAs: [
    'https://github.com/xircons',
    'https://www.instagram.com/pppwtk/',
    'https://www.facebook.com/pppwtk/',
  ],
} as const
