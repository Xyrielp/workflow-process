/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  images: {
    unoptimized: true
  },
  staticPageGenerationTimeout: 120,
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
}

module.exports = nextConfig