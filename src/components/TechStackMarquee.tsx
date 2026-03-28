import Image from 'next/image'

/*
 * Logo files live in public/tech/<slug>.<ext>
 * ext defaults to 'svg'; use 'png' for raster logos.
 */
const TECH_ITEMS: { slug: string; alt: string; ext?: string }[] = [
  { slug: 'javascript',    alt: 'JavaScript' },
  { slug: 'typescript',    alt: 'TypeScript' },
  { slug: 'html5',         alt: 'HTML5' },
  { slug: 'css3',          alt: 'CSS3' },
  { slug: 'python',        alt: 'Python' },
  { slug: 'react',         alt: 'React' },
  { slug: 'java',          alt: 'Java' },
  { slug: 'springboot',    alt: 'Spring Boot' },
  { slug: 'astro',         alt: 'Astro' },
  { slug: 'tailwind',      alt: 'Tailwind CSS' },
  { slug: 'vite',          alt: 'Vite' },
  { slug: 'redux',         alt: 'Redux Toolkit' },
  { slug: 'lucide',        alt: 'Lucide UI' },
  { slug: 'nodejs',        alt: 'Node.js' },
  { slug: 'express',       alt: 'Express' },
  { slug: 'fastapi',       alt: 'FastAPI' },
  { slug: 'socketio',      alt: 'Socket.IO' },
  { slug: 'mysql',         alt: 'MySQL' },
  { slug: 'mongodb',       alt: 'NoSQL' },
  { slug: 'supabase',      alt: 'Supabase' },
  { slug: 'neon',          alt: 'Neon',   ext: 'png' },
  { slug: 'firebase',      alt: 'Firebase Firestore' },
  { slug: 'docker',        alt: 'Docker' },
  { slug: 'git',           alt: 'Git' },
  { slug: 'vercel',        alt: 'Vercel' },
  { slug: 'railway',       alt: 'Railway' },
  { slug: 'firebase',      alt: 'Firebase Hosting' },
  { slug: 'chartjs',       alt: 'Chart.js' },
]

interface Props {
  className?: string
}

function LogoList({ id }: { id: string }) {
  return (
    <ul
      aria-hidden="true"
      id={id}
      className="marquee-list flex shrink-0 items-center gap-10"
    >
      {TECH_ITEMS.map((item, i) => (
        <li key={`${id}-${i}`} className="relative h-7 w-7 shrink-0 list-none">
          <Image
            src={`/tech/${item.slug}.${item.ext ?? 'svg'}`}
            alt=""
            fill
            className="object-contain"
            style={{ filter: 'brightness(0)' }}
            unoptimized
          />
        </li>
      ))}
    </ul>
  )
}

/**
 * Infinite horizontal marquee of tech-stack logos.
 *
 * Two identical <LogoList> siblings sit inside a flex row.
 * The CSS animation scrolls the whole track left by exactly
 * one list-width (100% of .marquee-track), then resets — giving
 * a perfect pixel-seamless circular loop regardless of item count.
 */
export default function TechStackMarquee({ className = '' }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden border-y border-ink bg-canvas py-4 ${className}`}
    >
      <div className="marquee-track flex w-max will-change-transform">
        <LogoList id="marquee-a" />
        <div className="w-10 shrink-0" aria-hidden="true" />
        <LogoList id="marquee-b" />
        <div className="w-10 shrink-0" aria-hidden="true" />
      </div>
    </div>
  )
}
