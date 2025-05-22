/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io', 'uploadthing.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.utfs.io'
      },
      {
        protocol: 'https',
        hostname: '**.uploadthing.com'
      }
    ]
  },
}

export default nextConfig