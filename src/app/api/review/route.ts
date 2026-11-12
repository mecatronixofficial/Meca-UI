import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { backendBaseUrl, siteHeaders } from "../../../lib/backend";

/**
 * Client review form (POST /api/review) -> mec-api /review/add.
 * Reviews from known clients (matching email or company) are verified by the API and shown at
 * once; others wait for approval in the admin panel (Reviews).
 */

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "That name is too long."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(254),
  company: z.string().trim().max(120, "That company name is too long.").optional().default(""),
  rating: z.number().int().min(1, "Please choose a star rating.").max(5),
  comment: z.string().trim().min(10, "Please write at least a sentence (10+ characters).").max(500, "Please keep your review under 500 characters."),
  // Honeypot: real visitors never fill it
  website: z.string().max(0).optional(),
});

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;
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
  if (rateLimited(ip)) return NextResponse.json({ error: "Too many reviews in a short time. Please try again later." }, { status: 429 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    // Bots fill the honeypot: answer as if it worked
    if (parsed.error.issues.some((i) => i.path[0] === "website")) return NextResponse.json({ ok: true, verified: false });
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check the form." }, { status: 422 });
  }

  const base = backendBaseUrl();
  if (!base) return NextResponse.json({ error: "Reviews are temporarily unavailable." }, { status: 503 });

  const { name, email, company, rating, comment } = parsed.data;
  try {
    const res = await fetch(`${base}/review/add`, {
      method: "POST",
      headers: siteHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ user_name: name, user_email: email, company_name: company || undefined, rating, comment }),
      signal: AbortSignal.timeout(8000),
    });
    const json = (await res.json().catch(() => ({}))) as { data?: { is_verified?: boolean }; message?: string | string[] };
    if (!res.ok) {
      const message = Array.isArray(json.message) ? json.message[0] : json.message;
      console.error(`Review backend responded ${res.status}: ${message}`);
      return NextResponse.json({ error: res.status < 500 && message ? message : "We couldn't save your review just now. Please try again." }, { status: res.status < 500 ? 422 : 502 });
    }

    const verified = json.data?.is_verified === true;
    // Shown straight away: refresh the cached testimonials
    if (verified) revalidateTag("content:reviews", { expire: 0 });
    return NextResponse.json({ ok: true, verified });
  } catch (error) {
    console.error("Review backend unreachable:", error);
    return NextResponse.json({ error: "We couldn't save your review just now. Please try again." }, { status: 502 });
  }
}
