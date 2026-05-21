'use client'

import HeroVideo from '@/components/HeroVideo'

export default function Hero() {
  return (
    <section
      id="hero"
      data-theme="dark"
      className="relative h-[100dvh] overflow-hidden"
      aria-label="Portfolio home"
    >
      <div className="absolute inset-0 border-0">
        <HeroVideo />
      </div>
    </section>
  )
}
