import { NextRequest, NextResponse } from "next/server";
import { backendBaseUrl } from "../../../../lib/backend";

/**
 * Same-origin bridge between the admin panel (/admin) and the Mecatronix API.
 *
 * The browser only ever talks to this site, so the API needs no CORS entry for
 * the admin and its httpOnly `admin_token` cookie is stored on this domain.
 * Requests are forwarded as-is to `{MECA_API_BASE_URL}/{path}`.
 */

const AUTH_COOKIE = "admin_token";
const DEV_FALLBACK = "http://localhost:5000/mec-api";

function apiBase(): string | null {
  return backendBaseUrl() ?? (process.env.NODE_ENV === "production" ? null : DEV_FALLBACK);
}

/** Drops `Domain=` so the API's cookie (which may target the API's domain) lands on this site. */
const rehomeCookie = (cookie: string) => cookie.replace(/;\s*domain=[^;]*/i, "");

async function forward(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const base = apiBase();
  if (!base) {
    return NextResponse.json({ success: false, message: "The admin API is not configured (MECA_API_BASE_URL)." }, { status: 503 });
  }

  const { path } = await params;
  if (path.some((segment) => segment === "." || segment === "..")) {
    return NextResponse.json({ success: false, message: "Invalid path" }, { status: 400 });
  }
  const target = `${base}/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;

  const headers = new Headers({ accept: "application/json" });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (token) headers.set("cookie", `${AUTH_COOKIE}=${token}`);

  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(60_000),
    });
  } catch (error) {
    console.error("Admin API unreachable:", error);
    return NextResponse.json({ success: false, message: "Can't reach the Mecatronix API. Is the server running?" }, { status: 502 });
  }

  const response = new NextResponse(await upstream.arrayBuffer(), {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") ?? "application/json", "cache-control": "no-store" },
  });
  for (const cookie of upstream.headers.getSetCookie()) response.headers.append("set-cookie", rehomeCookie(cookie));
  return response;
}

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };
