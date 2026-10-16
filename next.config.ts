import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Don't advertise the framework in response headers
  poweredByHeader: false,

  images: {
    // Serve modern formats for next/image (smaller files, better LCP)
    formats: ["image/avif", "image/webp"],
  },

  // Routes from the previous site. Permanent (308) so search engines move
  // existing rankings and backlinks onto the new URLs.
  async redirects() {
    return [
      { source: "/ourworld", destination: "/about", permanent: true },
      { source: "/portfolio", destination: "/work", permanent: true },
      { source: "/openline", destination: "/contact", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
