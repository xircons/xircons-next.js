import { ImageResponse } from 'next/og'

export const alt = 'Wuttikan (Xircons) — web developer, Chiang Mai University'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 72,
          background: '#ffffff',
          color: '#1a1a1a',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: '0.35em',
            fontWeight: 600,
            textTransform: 'uppercase',
            marginBottom: 24,
            opacity: 0.85,
          }}
        >
          Portfolio
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            maxWidth: 900,
          }}
        >
          XIRCONS
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 34,
            fontWeight: 500,
            maxWidth: 720,
            lineHeight: 1.25,
            opacity: 0.92,
          }}
        >
          Web developer and DII student at Chiang Mai University, Thailand.
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 56,
            left: 72,
            fontSize: 22,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            opacity: 0.55,
          }}
        >
          Chiang Mai · Thailand
        </div>
      </div>
    ),
    { ...size }
  )
}
