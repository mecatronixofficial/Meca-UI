import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { TEMPLATE_SLUGS } from "../../../data/templates";
import { backendBaseUrl, siteHeaders } from "../../../lib/backend";

/**
 * "Preview your own website" (POST /api/preview, multipart/form-data) -> mec-api /previews/add.
 * The API stores the request (a lead for the admin panel), uploads the logo and returns the
 * preview id; the visitor is then sent to /preview/{id}.
 */

const LOGO_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const MAX_LOGO_BYTES = 2 * 1024 * 1024;

const schema = z.object({
  company_name: z.string().trim().min(1, "Please enter your company name.").max(120),
  industry: z.string().refine((v) => TEMPLATE_SLUGS.includes(v), "Please choose an industry."),
  tagline: z.string().trim().max(160).optional().default(""),
  description: z.string().trim().max(600).optional().default(""),
  brand_color: z.string().trim().toLowerCase().regex(/^#[0-9a-f]{6}$/, "Please pick a brand colour."),
  services: z.array(z.string().trim().min(1).max(60)).max(6).optional().default([]),
  contact_name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(254),
  phone: z.string().trim().max(30).optional().default(""),
  city: z.string().trim().max(100).optional().default(""),
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

const text = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value : undefined;
};

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ error: "Too many previews in a short time. Please try again in a few minutes." }, { status: 429 });

  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  let services: unknown = [];
  try {
    services = JSON.parse(text(form, "services") || "[]");
  } catch {
    services = [];
  }

  const parsed = schema.safeParse({
    company_name: text(form, "company_name"),
    industry: text(form, "industry"),
    tagline: text(form, "tagline"),
    description: text(form, "description"),
    brand_color: text(form, "brand_color"),
    services,
    contact_name: text(form, "contact_name"),
    email: text(form, "email"),
    phone: text(form, "phone"),
    city: text(form, "city"),
    website: text(form, "website"),
  });
  if (!parsed.success) {
    // Bots fill the honeypot: pretend it worked
    if (parsed.error.issues.some((i) => i.path[0] === "website")) return NextResponse.json({ error: "Please try again." }, { status: 400 });
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check the form." }, { status: 422 });
  }

  const logo = form.get("logo");
  if (logo instanceof File && logo.size > 0) {
    if (!LOGO_TYPES.has(logo.type)) return NextResponse.json({ error: "The logo must be a PNG, JPG, WebP or GIF image." }, { status: 422 });
    if (logo.size > MAX_LOGO_BYTES) return NextResponse.json({ error: "The logo must be 2 MB or smaller." }, { status: 422 });
  }

  const base = backendBaseUrl();
  if (!base) return NextResponse.json({ error: "Previews are temporarily unavailable." }, { status: 503 });

  const { website: _honeypot, services: list, ...fields } = parsed.data;
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.append(key, value);
  body.append("services", JSON.stringify(list));
  if (logo instanceof File && logo.size > 0) body.append("logo", logo, logo.name || "logo");

  try {
    const res = await fetch(`${base}/previews/add`, { method: "POST", body, headers: siteHeaders(), signal: AbortSignal.timeout(20000) });
    const json = (await res.json().catch(() => ({}))) as { success?: boolean; data?: { id?: string }; message?: string | string[] };
    if (res.ok && json.data?.id) return NextResponse.json({ ok: true, id: json.data.id });
    const message = Array.isArray(json.message) ? json.message[0] : json.message;
    if (res.status === 429) return NextResponse.json({ error: "Too many previews in a short time. Please try again in a few minutes." }, { status: 429 });
    console.error(`Preview backend responded ${res.status}: ${message}`);
    return NextResponse.json({ error: res.status < 500 && message ? message : "We couldn't build your preview just now. Please try again." }, { status: res.status < 500 ? 422 : 502 });
  } catch (error) {
    console.error("Preview backend unreachable:", error);
    return NextResponse.json({ error: "We couldn't build your preview just now. Please try again." }, { status: 502 });
  }
}
