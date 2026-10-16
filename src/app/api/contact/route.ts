import { NextRequest, NextResponse } from "next/server";
import { budgetOptions, contactSchema, fieldErrors, labelFor, serviceOptions, type ContactData } from "../../../lib/contact";
import { forwardEnquiryToBackend, backendBaseUrl } from "../../../lib/backend";
import { site } from "../../../lib/site";

/**
 * Project enquiry endpoint (POST /api/contact).
 *
 * Delivery channels — any that are configured are used:
 *  1. Email via Resend          RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL
 *  2. Existing Mecatronix API   MECA_API_BASE_URL (or NEXT_PUBLIC_API_BASE_URL) -> /enquiry/add
 * The enquiry succeeds if at least one channel accepts it. If nothing is
 * configured the visitor is told to use email/WhatsApp instead, so an
 * enquiry is never silently lost.
 */

const MIN_FILL_MS = 3000;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

// Best-effort, per-instance limiter (serverless instances don't share memory)
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

function emailText(d: ContactData) {
  return [
    `New project enquiry from ${d.name}`,
    "",
    `Name:     ${d.name}`,
    `Email:    ${d.email}`,
    `Phone:    ${d.phone || "—"}`,
    `Company:  ${d.company || "—"}`,
    `Service:  ${labelFor(serviceOptions, d.service)}`,
    `Budget:   ${labelFor(budgetOptions, d.budget)}`,
    "",
    "Message:",
    d.message,
    "",
    "— Sent from the contact form on mecatronix.one",
  ].join("\n");
}

async function sendEmail(d: ContactData): Promise<"sent" | "skipped" | "failed"> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !from) return "skipped";
  const to = (process.env.CONTACT_TO_EMAIL || site.email).split(",").map((s) => s.trim()).filter(Boolean);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        reply_to: d.email,
        subject: `Project enquiry: ${labelFor(serviceOptions, d.service)} — ${d.name}`,
        text: emailText(d),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return "sent";
    console.error(`Resend responded ${res.status}: ${await res.text().catch(() => "")}`);
    return "failed";
  } catch (error) {
    console.error("Resend request failed:", error);
    return "failed";
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many enquiries from this connection. Please try again later, or email us directly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    // A filled honeypot means a bot: respond as if it worked, deliver nothing
    if (parsed.error.issues.some((i) => i.path[0] === "website")) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error) }, { status: 422 });
  }

  const data = parsed.data;
  if (Date.now() - data.startedAt < MIN_FILL_MS) return NextResponse.json({ ok: true });

  const [email, backend] = await Promise.all([
    sendEmail(data),
    forwardEnquiryToBackend({
      name: data.name,
      email: data.email,
      phone: data.phone || "Not provided",
      company: data.company,
      message: `[${labelFor(serviceOptions, data.service)} · Budget: ${labelFor(budgetOptions, data.budget)}]\n\n${data.message}`,
    }),
  ]);

  if (email === "sent" || backend === "sent" || backend === "duplicate") {
    return NextResponse.json({ ok: true });
  }

  const configured = email !== "skipped" || backendBaseUrl() !== null;
  if (!configured && process.env.NODE_ENV !== "production") {
    console.info("[contact] No delivery channel configured; enquiry received in development:\n" + emailText(data));
    return NextResponse.json({ ok: true, dev: true });
  }

  return NextResponse.json(
    {
      error: configured
        ? "We couldn't send your enquiry just now."
        : "Online enquiries are temporarily unavailable.",
      fallback: true,
    },
    { status: configured ? 502 : 503 },
  );
}
