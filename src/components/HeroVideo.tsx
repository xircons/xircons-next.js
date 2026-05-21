'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { HERO_VIDEO } from '@/lib/hero-video'

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

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
        src={HERO_VIDEO.mp4}
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
