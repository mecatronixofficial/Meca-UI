import * as z from "zod/mini";
import { serviceList as services } from "../data/service-list";

/** Shared by the contact form (client) and /api/contact (server). */

export const serviceOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.title })),
  { value: "not-sure", label: "Not sure yet — I need advice" },
];

export const budgetOptions = [
  { value: "", label: "Prefer not to say" },
  { value: "under-1l", label: "Under ₹1 lakh" },
  { value: "1l-3l", label: "₹1 – 3 lakh" },
  { value: "3l-10l", label: "₹3 – 10 lakh" },
  { value: "10l-plus", label: "₹10 lakh+" },
  { value: "discuss", label: "Let's discuss" },
];

const serviceValues = serviceOptions.map((o) => o.value) as [string, ...string[]];
const budgetValues = budgetOptions.map((o) => o.value) as [string, ...string[]];

// zod/mini: same validation, a fraction of the client bundle size
const text = (max: number, maxMessage?: string) => z.string().check(z.trim(), z.maxLength(max, maxMessage));

export const contactSchema = z.object({
  name: z.string().check(z.trim(), z.minLength(2, "Please enter your full name."), z.maxLength(100, "That name is too long.")),
  email: z.string().check(z.trim(), z.maxLength(200, "That email is too long."), z.email("Please enter a valid email address.")),
  phone: z
    .string()
    .check(
      z.trim(),
      z.refine((v) => v === "" || /^\+?[\d\s()-]{7,20}$/.test(v), "Please enter a valid phone number, or leave it blank."),
    ),
  company: text(120, "That company name is too long."),
  service: z.enum(serviceValues, { error: "Please choose the service you're interested in." }),
  budget: z.enum(budgetValues),
  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(20, "Please tell us a little more — at least 20 characters."),
      z.maxLength(4000, "Please keep your message under 4,000 characters."),
    ),
  /** Honeypot: hidden from people, often filled in by bots */
  website: z._default(z.string().check(z.maxLength(0)), ""),
  /** When the form was rendered (ms since epoch), for a minimum-fill-time check */
  startedAt: z.number().check(z.int(), z.nonnegative()),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type ContactField = "name" | "email" | "phone" | "company" | "service" | "budget" | "message";

/** First error message per field */
export function fieldErrors(error: { issues: { path: PropertyKey[]; message: string }[] }): Partial<Record<ContactField, string>> {
  const out: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as ContactField;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

export const labelFor = (options: { value: string; label: string }[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value;
