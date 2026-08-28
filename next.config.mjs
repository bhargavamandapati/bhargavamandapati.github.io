/** @type {import('next').NextConfig} */

// Set NEXT_PUBLIC_BASE_PATH when deploying to a GitHub *project* page
// (e.g. "/portfolio"). Leave empty for a user page (bhargavamandapati.github.io).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig = {
  output: 'export',            // fully static build -> deployable to GitHub Pages
  trailingSlash: true,         // emits /blog/index.html so Pages resolves clean URLs
  basePath,
  images: {
    unoptimized: true,         // no server at runtime, so skip the optimizer
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
