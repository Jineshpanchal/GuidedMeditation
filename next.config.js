/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['portal.brahmakumaris.com', 'example.com', 'bkstrapiapp.blob.core.windows.net'],
  },
  async rewrites() {
    return [
      {
        source: '/api/audio/:path*',
        destination: 'https://bkstrapiapp.blob.core.windows.net/strapi-uploads/assets/:path*'
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 