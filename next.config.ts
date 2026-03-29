import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.xircons.website' }],
        destination: 'https://xircons.website/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
