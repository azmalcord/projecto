/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Image optimization host allowlist (YouTube thumbnails + local assets)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "googleusercontent.com",
        pathname: "/**",
      },
    ],
  },

  // Redirect everything to the configured port so dev/prod behave identically
  async redirects() {
    return [];
  },
};

export default nextConfig;