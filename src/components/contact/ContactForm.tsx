"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, ChevronDown, Loader2, Mail } from "lucide-react";
import {
  budgetOptions,
  contactSchema,
  fieldErrors,
  labelFor,
  serviceOptions,
  type ContactField,
  type ContactInput,
} from "../../lib/contact";
import { cn } from "../../lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

const empty = { name: "", email: "", phone: "", company: "", service: "", budget: "", message: "" };

const inputBase =
  "block w-full rounded-xl border bg-white px-4 text-[16px] text-surface placeholder:text-muted-ink/60 transition-[border-color,box-shadow] duration-200 focus:outline-none focus:ring-4 disabled:opacity-60";

export function ContactForm({ email, whatsapp }: { email: string; whatsapp: string }) {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const startedAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const set = (field: ContactField) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const payload = (): ContactInput => ({ ...values, website: honeypot.current?.value ?? "", startedAt: startedAt.current });

  function focusFirstError(errs: Partial<Record<ContactField, string>>) {
    const first = (Object.keys(empty) as ContactField[]).find((k) => errs[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    const check = contactSchema.safeParse(payload());
    if (!check.success) {
      const errs = fieldErrors(check.error);
      setErrors(errs);
      focusFirstError(errs);
      return;
    }

    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: typeof errors };
      if (res.ok && data.ok) {
        setStatus("success");
        return;
      }
      if (data.fields) {
        setErrors(data.fields);
        focusFirstError(data.fields);
      }
      setMessage(data.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setMessage("We couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  // Pre-filled fallback so nothing typed is lost if online delivery fails
  const fallbackBody = encodeURIComponent(
    `Name: ${values.name}\nCompany: ${values.company}\nPhone: ${values.phone}\nService: ${labelFor(serviceOptions, values.service)}\nBudget: ${labelFor(budgetOptions, values.budget)}\n\n${values.message}`,
  );

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-start rounded-panel border border-line bg-white p-8 shadow-soft sm:p-12">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 aria-hidden className="size-7" />
        </span>
        <h2 className="text-h3 mt-8 text-surface">Thank you, {values.name.split(" ")[0]}. We&apos;ve received your enquiry.</h2>
        <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-muted-ink">
          Someone from our team will review your requirements and get back to you at <strong className="font-medium text-surface">{values.email}</strong>.
          If it&apos;s urgent, you can also reach us on WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(empty);
            startedAt.current = Date.now();
            setStatus("idle");
          }}
          className="mt-8 text-[15px] font-medium text-accent-ink underline-offset-4 hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const field = (name: ContactField) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    onChange: set(name),
    disabled: status === "submitting",
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    className: cn(
      inputBase,
      errors[name] ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-line-strong focus:border-accent focus:ring-accent/15",
    ),
  });

  const label = (name: ContactField, text: string, optional?: boolean) => (
    <label htmlFor={`contact-${name}`} className="mb-2 flex items-baseline justify-between text-[14.5px] font-medium text-surface">
      {text}
      {optional && <span className="text-[12.5px] font-normal text-muted-ink">Optional</span>}
    </label>
  );

  const error = (name: ContactField) =>
    errors[name] && (
      <p id={`contact-${name}-error`} className="mt-2 flex items-center gap-1.5 text-[13.5px] text-red-600">
        <AlertCircle aria-hidden className="size-3.5 shrink-0" /> {errors[name]}
      </p>
    );

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative rounded-panel border border-line bg-white p-6 shadow-soft sm:p-10" aria-describedby="contact-form-note">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          {label("name", "Full name")}
          <input {...field("name")} type="text" autoComplete="name" required className={cn(field("name").className, "h-12")} />
          {error("name")}
        </div>
        <div>
          {label("email", "Email")}
          <input {...field("email")} type="email" autoComplete="email" inputMode="email" required className={cn(field("email").className, "h-12")} />
          {error("email")}
        </div>
        <div>
          {label("phone", "Phone", true)}
          <input {...field("phone")} type="tel" autoComplete="tel" inputMode="tel" className={cn(field("phone").className, "h-12")} />
          {error("phone")}
        </div>
        <div>
          {label("company", "Company", true)}
          <input {...field("company")} type="text" autoComplete="organization" className={cn(field("company").className, "h-12")} />
          {error("company")}
        </div>
        <div>
          {label("service", "Service interested in")}
          <div className="relative">
            <select {...field("service")} required className={cn(field("service").className, "h-12 appearance-none pr-10", !values.service && "text-muted-ink/70")}>
            <option value="" disabled>Select a service</option>
            {serviceOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-ink" />
          </div>
          {error("service")}
        </div>
        <div>
          {label("budget", "Budget range", true)}
          <div className="relative">
            <select {...field("budget")} className={cn(field("budget").className, "h-12 appearance-none pr-10")}>
            {budgetOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-ink" />
          </div>
          {error("budget")}
        </div>
        <div className="sm:col-span-2">
          {label("message", "Project description")}
          <textarea
            {...field("message")}
            rows={6}
            required
            placeholder="What are you looking to build? Who will use it, and what problem should it solve?"
            className={cn(field("message").className, "resize-y py-3.5 leading-relaxed")}
          />
          <div className="flex items-start justify-between gap-4">
            {error("message") || <span />}
            <span className="mt-2 font-mono text-[11.5px] text-muted-ink">{values.message.length}/4000</span>
          </div>
        </div>
      </div>

      {/* Honeypot: visually hidden, skipped by keyboard and assistive tech */}
      <div aria-hidden className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input ref={honeypot} id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <div role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-[14.5px] text-red-800">
          <p className="flex items-center gap-2 font-medium">
            <AlertCircle aria-hidden className="size-4" /> {message}
          </p>
          <p className="mt-2 text-red-700">
            Your details are still here. You can try again, or send them directly:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`mailto:${email}?subject=${encodeURIComponent("Project enquiry")}&body=${fallbackBody}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-medium text-surface ring-1 ring-red-200 hover:ring-red-300"
            >
              <Mail aria-hidden className="size-4" /> Send by email
            </a>
            <a
              href={`https://wa.me/${whatsapp}?text=${fallbackBody}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-medium text-surface ring-1 ring-red-200 hover:ring-red-300"
            >
              Send on WhatsApp
            </a>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p id="contact-form-note" className="max-w-sm text-[13px] leading-relaxed text-muted-ink">
          We use your details only to respond to this enquiry. See our <Link href="/privacy" className="underline underline-offset-2 hover:text-surface">privacy policy</Link>.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-accent-strong px-7 text-[15.5px] font-medium text-white shadow-glow transition-[background-color,box-shadow] hover:bg-accent-ink hover:shadow-glow-lg disabled:opacity-70"
        >
          {status === "submitting" ? (
            <>
              <Loader2 aria-hidden className="size-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send enquiry <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">{status === "submitting" ? "Sending your enquiry" : ""}</p>
    </form>
  );
}
