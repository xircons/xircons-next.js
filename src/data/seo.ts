/** Shared copy for metadata + JSON-LD — keep in sync with on-page content. */
export const siteSeo = {
  siteName: 'Xircons',
  title: 'Xircons — Web Developer',
  shortTitle: 'Xircons',
  description:
    'Portfolio of Wuttikan, a DII student at Chiang Mai University specializing in Full-stack Web Development.',
  ogDescription:
    'Portfolio of Wuttikan (Xircons): DII student at Chiang Mai University, full-stack web development.',
  keywords: [
    'Wuttikan',
    'Xircons',
    'full-stack web development',
    'full-stack',
    'web developer',
    'Chiang Mai',
    'Chiang Mai University',
    'Next.js',
    'React',
    'portfolio',
  ],
  person: {
    name: 'Wuttikan',
    alternateName: 'Xircons',
    jobTitle: 'Full-stack Web Developer',
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
