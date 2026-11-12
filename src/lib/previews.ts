import "server-only";
import { cache } from "react";
import { backendBaseUrl } from "./backend";

/** A saved "preview your own website" request, as the public site may show it. */
export interface SavedPreview {
  id: string;
  company_name: string;
  industry: string;
  tagline: string;
  description: string;
  logo_url: string | null;
  brand_color: string;
  services: string[];
  phone: string;
  email: string;
  city: string;
  createdAt: string;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Loads a preview from mec-api (never cached: each visit counts as a view). Null when missing. */
export const getPreview = cache(async (id: string): Promise<SavedPreview | null> => {
  const base = backendBaseUrl();
  if (!base || !UUID.test(id)) return null;
  try {
    const res = await fetch(`${base}/previews/public/${id}`, { cache: "no-store", signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const json = (await res.json()) as { success?: boolean; data?: SavedPreview };
    return json.success && json.data ? json.data : null;
  } catch {
    return null;
  }
});
