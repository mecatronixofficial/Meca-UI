import { afterEach, describe, expect, test } from "bun:test";
import { trackLeadEvent } from "../src/lib/analytics.ts";

afterEach(() => { delete globalThis.window; });

describe("lead measurement", () => {
  test("does not collect anything before opt-in", () => {
    const calls = [];
    globalThis.window = { gtag: (...args) => calls.push(args), location: { origin: "https://www.mecatronix.one", pathname: "/contact" } };
    trackLeadEvent("generate_lead", { method: "contact_form", service: "web-development" });
    expect(calls).toEqual([]);
  });

  test("records intent separately from an accepted enquiry and excludes query strings and form fields", () => {
    const calls = [];
    globalThis.window = {
      mecaAnalyticsEnabled: true,
      gtag: (...args) => calls.push(args),
      location: { origin: "https://www.mecatronix.one", pathname: "/contact", search: "?email=private@example.com" },
    };
    trackLeadEvent("contact_click", { method: "phone" });
    trackLeadEvent("generate_lead", { method: "contact_form", service: "erp-development", email: "private@example.com", message: "Confidential enquiry" });
    expect(calls.map((call) => call[1])).toEqual(["contact_click", "generate_lead"]);
    expect(calls[1][2]).toEqual({ method: "contact_form", service: "erp-development", page_location: "https://www.mecatronix.one/contact", transport_type: "beacon" });
    expect(JSON.stringify(calls)).not.toContain("private@example.com");
    expect(JSON.stringify(calls)).not.toContain("Confidential");
  });
});
