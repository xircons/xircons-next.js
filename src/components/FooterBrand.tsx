'use client'

import { useEffect, useState } from 'react'
import AsciiHoverLabel from '@/components/AsciiHoverLabel'

export const BRAND_LABEL = 'XIRCONS.'

const BRAND_ROW_LAYOUT =
  'inline-flex max-w-full flex-nowrap items-baseline justify-center gap-x-[0.06em] overflow-visible'

export const BRAND_LETTER_CLASS =
  'font-clash text-[clamp(2.75rem,18vw,4.75rem)] font-700 leading-none tracking-normal text-ink lg:text-[clamp(3.25rem,14vw,11rem)]'

function FooterBrandStatic() {
  return (
    <div
      className="w-full max-w-full select-none px-4 sm:px-6 lg:px-8"
      role="img"
      aria-label="XIRCONS"
    >
      <div className="flex w-full items-center justify-center overflow-visible py-2 sm:py-3">
        <AsciiHoverLabel
          label={BRAND_LABEL}
          measureClassName={BRAND_ROW_LAYOUT}
          letterClassName={BRAND_LETTER_CLASS}
          getLetterClassName={(char) =>
            char === '.' ? ' min-w-[0.35em] text-center' : ''
          }
        />
      </div>
    </div>
  )
}

export default function FooterBrand() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <FooterBrandStatic />
  }

  return (
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8">
      <div className="flex w-full items-center justify-center overflow-visible py-2 sm:py-3">
        <AsciiHoverLabel
          label={BRAND_LABEL}
          measureClassName={BRAND_ROW_LAYOUT}
          letterClassName={BRAND_LETTER_CLASS}
          hideCursor
          ariaLabel="XIRCONS"
          getLetterClassName={(char) =>
            char === '.' ? ' min-w-[0.35em] text-center' : ''
          }
        />
      </div>
    </div>
  )
}
