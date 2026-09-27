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

  experimental: {
    // Only bundle the icons/components actually imported
    optimizePackageImports: ["react-icons", "antd"],
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
