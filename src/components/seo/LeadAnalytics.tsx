"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackLeadEvent } from "../../lib/analytics";

const CONSENT_KEY = "meca-analytics-consent";
const SETTINGS_EVENT = "meca-analytics-settings";
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
const configured = /^G-[A-Z0-9]+$/.test(measurementId);

export function AnalyticsPreferences() {
  if (!configured) return null;
  return <button type="button" onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))} className="text-left text-sm text-muted hover:text-accent-ink">Analytics preferences</button>;
}

/** No analytics request is made until the visitor opts in. */
export default function LeadAnalytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<"granted" | "denied" | null>(null);
  const [showChoices, setShowChoices] = useState(false);
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);
  const desiredConsent = useRef<"granted" | "denied" | null>(null);
  const previousPath = useRef<string | null>(null);
  const privatePreview = pathname.startsWith("/preview/");

  useEffect(() => {
    if (!configured) return;
    try {
      const saved = window.localStorage.getItem(CONSENT_KEY);
      if (saved === "granted" || saved === "denied") {
        desiredConsent.current = saved;
        setConsent(saved);
      }
      else setShowChoices(true);
    } catch { setShowChoices(true); }
    const open = () => setShowChoices(true);
    window.addEventListener(SETTINGS_EVENT, open);
    return () => window.removeEventListener(SETTINGS_EVENT, open);
  }, []);

  useEffect(() => {
    const enabled = configured && consent === "granted" && ready && !privatePreview;
    window.mecaAnalyticsEnabled = enabled;
    if (!enabled) return;
    if (previousPath.current !== pathname) {
      window.gtag?.("event", "page_view", { page_location: `${window.location.origin}${pathname}` });
      previousPath.current = pathname;
    }
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]");
      const href = anchor?.getAttribute("href") ?? "";
      if (/^tel:/i.test(href)) trackLeadEvent("contact_click", { method: "phone" });
      else if (/^mailto:/i.test(href)) trackLeadEvent("contact_click", { method: "email" });
      else if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) trackLeadEvent("contact_click", { method: "whatsapp" });
    };
    document.addEventListener("click", onClick);
    return () => {
      window.mecaAnalyticsEnabled = false;
      document.removeEventListener("click", onClick);
    };
  }, [consent, ready, pathname, privatePreview]);

  function choose(value: "granted" | "denied") {
    desiredConsent.current = value;
    try { window.localStorage.setItem(CONSENT_KEY, value); } catch { /* Use the choice for this page session. */ }
    // Revoking consent stops collection immediately, including Google's own tag.
    (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = value === "denied";
    window.mecaAnalyticsEnabled = false;
    previousPath.current = null;
    window.gtag?.("consent", "update", { analytics_storage: value });
    setConsent(value);
    setShowChoices(false);
  }

  function initialize() {
    // The choice may change while the third-party script is still downloading.
    if (desiredConsent.current !== "granted") return;
    if (!initialized.current) {
      window.dataLayer = window.dataLayer ?? [];
      window.gtag = function () { window.dataLayer!.push(arguments); };
      window.gtag("consent", "default", {
        analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
      });
      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        page_location: `${window.location.origin}${window.location.pathname}`,
        page_referrer: document.referrer ? new URL(document.referrer).origin : "",
      });
      initialized.current = true;
    }
    setReady(true);
  }

  if (!configured || privatePreview) return null;
  return (
    <>
      {consent === "granted" && <Script id="meca-ga4" src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" onReady={initialize} />}
      {showChoices && (
        <aside role="region" aria-label="Optional analytics" className="fixed bottom-4 left-4 z-[80] max-w-sm rounded-2xl border border-line bg-white p-5 text-ink shadow-lift max-sm:right-4">
          <p className="text-base font-semibold">Help us improve your experience</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-ink">Allow optional analytics to measure page visits and contact actions. Your enquiry text and contact details are not sent to analytics. <Link href="/privacy" className="underline underline-offset-4">Privacy policy</Link></p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => choose("granted")} className="rounded-full bg-accent-strong px-5 py-3 text-sm font-medium text-white">Allow analytics</button>
            <button type="button" onClick={() => choose("denied")} className="rounded-full border border-line-strong px-5 py-3 text-sm font-medium">No thanks</button>
          </div>
        </aside>
      )}
    </>
  );
}
