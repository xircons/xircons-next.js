'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { HERO_VIDEO } from '@/lib/hero-video'

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Pick a lighter source on small screens / save-data connections to cut
    // mobile load time, then let the browser stream it (faststart-encoded).
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    type NavWithData = Navigator & { connection?: { saveData?: boolean } }
    const saveData = (navigator as NavWithData).connection?.saveData === true
    const canWebm =
      !isMobile && video.canPlayType('video/webm; codecs="vp9"') !== ''

    video.src = canWebm
      ? HERO_VIDEO.webm
      : isMobile || saveData
        ? HERO_VIDEO.mobileMp4
        : HERO_VIDEO.mp4
    video.load()

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      if (mq.matches) {
        video.pause()
      } else {
        void video.play().catch(() => {})
      }
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <div className="relative h-full w-full border-0">
      <video
        ref={videoRef}
        className="block h-full w-full border-0 object-cover outline-none motion-reduce:hidden"
        poster={HERO_VIDEO.poster}
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden
      />
      <div className="absolute inset-0 hidden border-0 motion-reduce:block">
        <Image
          src={HERO_VIDEO.poster}
          alt=""
          fill
          priority
          sizes="100vw"
          className="border-0 object-cover outline-none"
          aria-hidden
        />
      </div>
    </div>
  )
}
