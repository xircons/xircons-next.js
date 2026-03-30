/** Shared copy for metadata + JSON-LD — keep in sync with on-page content. */
export const siteSeo = {
  siteName: 'Xircons',
  title: 'Xircons — Web Developer',
  shortTitle: 'Xircons',
  description:
    'Wuttikan (Xircons) — web developer and DII student at Chiang Mai University, Thailand. Portfolio of personal and team web projects.',
  ogDescription:
    'Wuttikan (Xircons) — web developer and DII student at Chiang Mai University, Thailand. Portfolio of personal and team web projects.',
  keywords: [
    'Wuttikan',
    'Xircons',
    'web developer',
    'Chiang Mai',
    'Chiang Mai University',
    'Thailand',
    'DII',
    'portfolio',
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
