"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Clock, Loader2, Star, X } from "lucide-react";
import { cn } from "../../lib/cn";

/** Open the review form from anywhere: dispatch this event, or link to #write-review. */
export const OPEN_REVIEW_EVENT = "meca:open-review";
export const REVIEW_HASH = "#write-review";

const LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

type Status = "idle" | "sending" | "live" | "pending";

/** "Write a review" dialog for clients. Mounted once in the site layout. */
export default function ReviewModal() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", company: "", comment: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // Open on the custom event, or when the URL hash asks for it (works from any page's links)
  useEffect(() => {
    const show = () => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    const fromHash = () => {
      if (window.location.hash !== REVIEW_HASH) return;
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      show();
    };
    // Links to #write-review (e.g. in the footer) open the dialog without touching the URL
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!link || !link.getAttribute("href")?.endsWith(REVIEW_HASH)) return;
      e.preventDefault();
      show();
    };
    fromHash();
    window.addEventListener(OPEN_REVIEW_EVENT, show);
    window.addEventListener("hashchange", fromHash);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener(OPEN_REVIEW_EVENT, show);
      window.removeEventListener("hashchange", fromHash);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  // While open: lock page scroll, close on Escape, focus the dialog; restore focus after
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 30);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      returnFocus.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const close = () => {
    setOpen(false);
    // Start fresh next time once a review was sent
    if (status === "live" || status === "pending") {
      setStatus("idle");
      setRating(0);
      setForm({ name: "", email: "", company: "", comment: "", website: "" });
    }
  };

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!rating) return setError("Please choose a star rating.");
    setError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating }),
      });
      const data = (await res.json().catch(() => ({}))) as { verified?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error || "We couldn't save your review. Please try again.");
      setStatus(data.verified ? "live" : "pending");
    } catch (err) {
      setStatus("idle");
      setError((err as Error).message);
    }
  };

  const shown = hover || rating;
  const sent = status === "live" || status === "pending";

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm motion-safe:animate-fade" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
        className="relative w-full max-w-lg rounded-panel bg-white p-6 text-ink shadow-window motion-safe:animate-rise sm:p-8"
      >
        <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-muted hover:bg-paper hover:text-ink">
          <X className="size-5" />
        </button>

        {sent ? (
          <div className="py-6 text-center">
            <span className={cn("mx-auto grid size-16 place-items-center rounded-full", status === "live" ? "bg-emerald-50 text-emerald-600" : "bg-accent-soft text-accent")}>
              {status === "live" ? <CheckCircle2 className="size-8" /> : <Clock className="size-8" />}
            </span>
            <h2 id="review-title" className="mt-5 font-display text-[1.6rem] font-semibold tracking-tight">
              Thank you, {form.name.split(" ")[0] || "friend"}!
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-muted-ink">
              {status === "live"
                ? "We recognised you as a client, so your review is now live on our website."
                : "Your review has been received. It will appear on our website once our team has verified it."}
            </p>
            <button type="button" onClick={close} data-autofocus className="mt-7 inline-flex h-11 items-center rounded-full bg-ink px-6 text-[15px] font-medium text-white hover:bg-surface">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <p className="text-label text-accent-ink">Client review</p>
            <h2 id="review-title" className="mt-2 pr-10 font-display text-[1.6rem] font-semibold leading-tight tracking-tight">
              How was working with us?
            </h2>
            <p className="mt-2 text-[14.5px] text-muted-ink">Your feedback helps other businesses choose with confidence.</p>

            {/* Star rating */}
            <div className="mt-6">
              <div role="radiogroup" aria-label="Rating" className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={rating === value}
                    aria-label={`${value} star${value > 1 ? "s" : ""} — ${LABELS[value]}`}
                    data-autofocus={value === 1 ? true : undefined}
                    onClick={() => {
                      setRating(value);
                      setError(null);
                    }}
                    onMouseEnter={() => setHover(value)}
                    className="rounded-lg p-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <Star className={cn("size-9 transition-colors", value <= shown ? "fill-[#f5a524] text-[#f5a524]" : "text-line-strong")} strokeWidth={1.5} />
                  </button>
                ))}
                <span className="ml-2 text-[14px] font-medium text-muted-ink" aria-live="polite">
                  {LABELS[shown]}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Your name" required>
                <input className={inputCls} value={form.name} onChange={set("name")} maxLength={100} required autoComplete="name" />
              </Field>
              <Field label="Company" hint="Optional">
                <input className={inputCls} value={form.company} onChange={set("company")} maxLength={120} autoComplete="organization" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Email" required hint="Not shown publicly">
                  <input className={inputCls} type="email" value={form.email} onChange={set("email")} maxLength={254} required autoComplete="email" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Your review" required hint={`${form.comment.length}/500`}>
                  <textarea
                    className={cn(inputCls, "min-h-28 resize-y py-3")}
                    value={form.comment}
                    onChange={set("comment")}
                    maxLength={500}
                    rows={4}
                    required
                    placeholder="What did we build for you, and how did it go?"
                  />
                </Field>
              </div>
            </div>
            {/* Honeypot: hidden from people, filled by bots */}
            <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

            <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
              Reviews from our clients appear on the website. We use your email only to confirm you&apos;ve worked with us.
            </p>

            {error && (
              <p role="alert" className="mt-4 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-[14px] text-accent-ink">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent-strong text-[15.5px] font-semibold text-white shadow-glow transition-colors hover:bg-accent-ink disabled:opacity-70"
            >
              {status === "sending" && <Loader2 className="size-4 animate-spin" />}
              {status === "sending" ? "Sending…" : "Submit review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between text-[13.5px] font-medium text-ink">
        <span>
          {label}
          {required && <span className="text-accent"> *</span>}
        </span>
        {hint && <span className="text-[12px] font-normal text-muted">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-line-strong bg-white px-3.5 text-[15px] text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10";
