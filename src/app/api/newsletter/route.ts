import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { backendBaseUrl, siteHeaders } from "../../../lib/backend";

/**
 * Newsletter sign-up (POST /api/newsletter) -> mec-api /news/add.
 * Subscribers appear in the admin panel and receive voucher emails.
 */

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  // Honeypot: real visitors never fill it
  company: z.string().max(0).optional(),
});

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "company")) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }

  const base = backendBaseUrl();
  if (!base) return NextResponse.json({ error: "Sign-ups are temporarily unavailable." }, { status: 503 });

  try {
    const res = await fetch(`${base}/news/add`, {
      method: "POST",
      headers: siteHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ email: parsed.data.email }),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return NextResponse.json({ ok: true });
    if (res.status === 409) return NextResponse.json({ ok: true, already: true });
    console.error(`Newsletter backend responded ${res.status}`);
  } catch (error) {
    console.error("Newsletter backend unreachable:", error);
  }
  return NextResponse.json({ error: "We couldn't sign you up just now. Please try again." }, { status: 502 });
}
