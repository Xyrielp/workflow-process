/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig