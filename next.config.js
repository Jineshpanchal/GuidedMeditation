/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['webapp.brahmakumaris.com', 'example.com', 'bkstrapiapp.blob.core.windows.net'],
  },
  async rewrites() {
    return [
      {
        source: '/api/audio/:path*',
        destination: 'https://bkstrapiapp.blob.core.windows.net/strapi-uploads/assets/:path*'
      }
    ];
  }
}

module.exports = nextConfig 