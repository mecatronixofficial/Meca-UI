import "server-only";

/**
 * Server-side bridge to the existing Mecatronix backend (mec-api).
 *
 * The base URL comes from MECA_API_BASE_URL (server-only, preferred) or the
 * legacy NEXT_PUBLIC_API_BASE_URL. Localhost URLs are ignored in production
 * so a missing env var can never make the live site call localhost.
 */

export function backendBaseUrl(): string | null {
  const raw = (process.env.MECA_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "").trim().replace(/\/+$/, "");
  if (!raw) return null;
  if (process.env.NODE_ENV === "production" && /\/\/(localhost|127\.0\.0\.1)/.test(raw)) return null;
  return raw;
}

export interface Review {
  id: string;
  name: string;
  company?: string;
  quote: string;
}

/** Reviews marked verified in the backend. Returns [] when unavailable. */
export async function getVerifiedReviews(): Promise<Review[]> {
  const base = backendBaseUrl();
  if (!base) return [];

  try {
    const res = await fetch(`${base}/review/all`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { success?: boolean; data?: unknown };
    if (!json?.success || !Array.isArray(json.data)) return [];

    return json.data
      .filter((r: any) => r?.is_verified === true && typeof r?.comment === "string" && r.comment.trim() && r?.user_name)
      .map((r: any) => ({
        id: String(r._id ?? r.user_name),
        name: String(r.user_name).trim(),
        company: r.company_name ? String(r.company_name).trim() : undefined,
        quote: String(r.comment).trim(),
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
      headers: { "Content-Type": "application/json" },
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
