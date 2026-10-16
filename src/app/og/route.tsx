import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

/**
 * 1200x630 social share image: GET /og?title=Page%20Title
 * Referenced by every page's Open Graph / Twitter metadata (see src/lib/seo.ts).
 */

const DEFAULT_TITLE = "Engineering software. Empowering businesses.";

export function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("title")?.trim();
  const title = (raw || DEFAULT_TITLE).slice(0, 90);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 76px",
          backgroundColor: "#ffffff",
          backgroundImage:
            "radial-gradient(circle at 88% 8%, rgba(225,6,0,.16), transparent 42%), radial-gradient(circle at 0% 100%, rgba(255,92,70,.12), transparent 40%)",
          color: "#0b0d12",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: 3 }}>MECATRONIX</div>
            <div style={{ display: "flex", fontSize: 15, letterSpacing: 6, color: "#555a66", marginTop: 6 }}>SOFTWARE DEVELOPMENT</div>
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#555a66" }}>mecatronix.one</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: 64, height: 6, borderRadius: 6, background: "#e10600", marginBottom: 34 }} />
          <div
            style={{
              display: "flex",
              fontSize: title.length > 48 ? 62 : 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2.5,
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#555a66" }}>
          Software engineering studio · Coimbatore, India
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
