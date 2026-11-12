import "server-only";

/**
 * Server-side bridge to the existing Mecatronix backend (mec-api).
 *
 * The base URL comes from MECA_API_BASE_URL (server-only, preferred) or the
 * legacy NEXT_PUBLIC_API_BASE_URL. Localhost URLs are ignored in production
 * so a missing env var can never make the live site call localhost.
 */

/** Local mec-api, used in development when no URL is configured (same API the admin panel talks to). */
const DEV_FALLBACK = "http://localhost:5000/mec-api";

export function backendBaseUrl(): string | null {
  const isProduction = process.env.NODE_ENV === "production";
  const raw = (process.env.MECA_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "").trim().replace(/\/+$/, "");
  if (!raw) return isProduction ? null : DEV_FALLBACK;
  if (isProduction && /\/\/(localhost|127\.0\.0\.1)/.test(raw)) return null;
  return raw;
}

/**
 * Headers for forwarding a visitor's form to the API. Every visitor reaches the API from this
 * server's IP, so the API would rate-limit them all together; the shared secret (REVALIDATE_SECRET,
 * the API's SITE_REVALIDATE_SECRET) tells it to skip that. These routes rate-limit each visitor themselves.
 */
export function siteHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const secret = process.env.REVALIDATE_SECRET?.trim();
  return secret ? { ...extra, "x-site-key": secret } : extra;
}

const titleCase = (value: string) => value.replace(/\b\w/g, (c) => c.toUpperCase());

export interface Review {
  id: string;
  name: string;
  company?: string;
  quote: string;
  /** 1–5 stars. */
  rating: number;
}

/** Reviews marked verified in the backend. Returns [] when unavailable. */
export async function getVerifiedReviews(): Promise<Review[]> {
  const base = backendBaseUrl();
  if (!base) return [];

  try {
    // Same cache tag and refresh window as src/lib/content.ts: admin edits refresh it via /api/revalidate
    const res = await fetch(`${base}/review/all?verified=true`, {
      next: { revalidate: 60, tags: ["content:reviews"] },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { success?: boolean; data?: unknown };
    if (!json?.success || !Array.isArray(json.data)) return [];

    return json.data
      .filter((r: any) => r?.is_verified === true && typeof r?.comment === "string" && r.comment.trim() && r?.user_name)
      .map((r: any) => ({
        id: String(r.id ?? r._id ?? r.user_name),
        name: String(r.user_name).trim(),
        // The API stores company names in lower case (it matches them to clients); capitalise for display
        company: r.company_name ? titleCase(String(r.company_name).trim()) : undefined,
        quote: String(r.comment).trim(),
        rating: Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5))),
      }));
  } catch {
    return [];
  }
}

/** Posts an enquiry to the backend's existing /enquiry/add endpoint. */
export async function forwardEnquiryToBackend(payload: {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}): Promise<"sent" | "duplicate" | "skipped" | "failed"> {
  const base = backendBaseUrl();
  if (!base) return "skipped";

  try {
    const res = await fetch(`${base}/enquiry/add`, {
      method: "POST",
      headers: siteHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return "sent";
    const data = (await res.json().catch(() => ({}))) as { code?: string };
    // The backend rejects repeat enquiries from the same email; the earlier one is on file
    if (data?.code === "EMAIL_EXISTS") return "duplicate";
    console.error(`Enquiry backend responded ${res.status}`);
    return "failed";
  } catch (error) {
    console.error("Enquiry backend unreachable:", error);
    return "failed";
  }
}
