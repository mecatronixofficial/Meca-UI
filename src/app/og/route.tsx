import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

/**
 * 1200x630 social share image: GET /og?title=Page%20Title
 * Referenced by every page's Open Graph / Twitter metadata (see src/lib/seo.ts).
 */

const DEFAULT_TITLE = "Software Development Company in Coimbatore";

export function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("title")?.trim();
  const title = (raw || DEFAULT_TITLE).slice(0, 80);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#0c0906",
          backgroundImage: "radial-gradient(circle at 85% 15%, rgba(249,115,22,.35), transparent 45%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row: badge + domain */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 22px",
              borderRadius: 999,
              background: "#f97316",
              color: "#000000",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Mecatronix
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "rgba(255,255,255,.55)" }}>mecatronix.one</div>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 40 ? 64 : 80,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: -2,
              textTransform: "uppercase",
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", marginTop: 28, gap: 14 }}>
            <div style={{ width: 90, height: 8, borderRadius: 8, background: "#f97316" }} />
            <div style={{ width: 8, height: 8, borderRadius: 8, background: "#22d3ee" }} />
            <div style={{ width: 8, height: 8, borderRadius: 8, background: "#a78bfa" }} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", fontSize: 26, color: "rgba(255,255,255,.7)" }}>
          Web Development · Ecommerce · Mobile Apps · Coimbatore
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" },
    },
  );
}
