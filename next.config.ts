import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Geolocation for this site only: the contact page's "Use my location" (asked on tap, used in the browser)
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

/** Where the separate mec-admin app lives, e.g. https://admin.mecatronix.one. Optional. */
const adminPanelUrl = process.env.ADMIN_PANEL_URL?.trim().replace(/\/+$/, "") || null;

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
      // Articles moved from /insights to /blogs
      { source: "/insights", destination: "/blogs", permanent: true },
      { source: "/insights/:slug", destination: "/blogs/:slug", permanent: true },
      { source: "/blog", destination: "/blogs", permanent: true },
      { source: "/blog/:slug", destination: "/blogs/:slug", permanent: true },
      // The admin panel is the separate Mecatronix-AdminUi app; old /admin links go there
      ...(adminPanelUrl
        ? [
            { source: "/admin", destination: adminPanelUrl, permanent: false },
            { source: "/admin/:path*", destination: adminPanelUrl, permanent: false },
          ]
        : []),
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
