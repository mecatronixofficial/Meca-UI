/** Only non-personal conversion details may be sent to analytics. */
export type LeadMethod = "phone" | "whatsapp" | "email" | "contact_form";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    mecaAnalyticsEnabled?: boolean;
  }
}

export function trackLeadEvent(event: "contact_click" | "generate_lead", details: { method: LeadMethod; service?: string }) {
  if (typeof window === "undefined" || !window.mecaAnalyticsEnabled) return;
  window.gtag?.("event", event, {
    method: details.method,
    ...(details.service ? { service: details.service } : {}),
    page_location: `${window.location.origin}${window.location.pathname}`,
    transport_type: "beacon",
  });
}
