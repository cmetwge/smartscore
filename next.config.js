// next.config.js   ← must be .js, not .mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      enabled: true
    }
  }
}

module.exports = nextConfig