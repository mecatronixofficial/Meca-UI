"use client";

import { ChevronLeft, ChevronRight, Inbox, LoaderCircle, RotateCw, Search, TriangleAlert, X } from "lucide-react";
import { forwardRef, useEffect, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import type { PageMeta } from "../_lib/types";

/* ---------- Buttons ---------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-accent-strong text-white shadow-[0_6px_18px_-8px_rgb(225_6_0/0.6)] hover:bg-accent-ink",
  secondary: "border border-line-strong bg-white text-ink hover:border-ink/30 hover:bg-paper",
  ghost: "text-muted-ink hover:bg-paper hover:text-ink",
  danger: "bg-[#b42318] text-white hover:bg-[#912018]",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({ variant = "primary", size = "md", loading, icon, className, children, disabled, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-medium whitespace-nowrap transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55",
        size === "sm" ? "h-8 px-3 text-[13px]" : "h-10 px-4 text-sm",
        buttonVariants[variant],
        className,
      )}
      {...props}
    >
      {loading ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

/** Square icon-only button; `label` is announced and shown as a tooltip. */
export function IconButton({ label, tone = "default", className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; tone?: "default" | "danger" }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-ink transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        tone === "danger" ? "hover:bg-[#fef3f2] hover:text-[#b42318]" : "hover:bg-paper hover:text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------- Form controls ---------- */

const control =
  "w-full rounded-xl border border-line-strong bg-white px-3 text-sm text-ink transition-[border-color,box-shadow] placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none disabled:bg-paper disabled:text-muted aria-[invalid=true]:border-[#d92d20]";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(control, "h-10", className)} {...props} />;
});

export function Textarea({ className, rows = 4, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={rows} className={cn(control, "resize-y py-2.5 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(control, "h-10 cursor-pointer pr-8", className)} {...props}>
      {children}
    </select>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  counter,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  counter?: { value: number; max: number };
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-ink">
          {label}
          {required && <span className="ml-0.5 text-accent-ink">*</span>}
        </label>
        {counter && (
          <span className={cn("font-mono text-[11px] tabular-nums", counter.value > counter.max ? "text-[#b42318]" : "text-muted")}>
            {counter.value}/{counter.max}
          </span>
        )}
      </div>
      {children}
      {error ? <p className="text-xs text-[#b42318]">{error}</p> : hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function Switch({ checked, onChange, label, description, id }: { checked: boolean; onChange: (value: boolean) => void; label: string; description?: string; id?: string }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-paper/60 px-3.5 py-3">
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input id={id} type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span className="h-5 w-9 rounded-full bg-line-strong transition-colors peer-checked:bg-accent-strong peer-focus-visible:ring-4 peer-focus-visible:ring-accent/20" />
        <span className="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description && <span className="block text-xs text-muted">{description}</span>}
      </span>
    </label>
  );
}

export function SearchInput({ value, onChange, placeholder = "Search" }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  const [draft, setDraft] = useState(value);
  // Debounce so typing doesn't fire a request per keystroke
  useEffect(() => {
    if (draft === value) return;
    const timer = setTimeout(() => onChange(draft.trim()), 350);
    return () => clearTimeout(timer);
  }, [draft, value, onChange]);

  return (
    <div className="relative w-full sm:w-72">
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
      <Input type="search" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={placeholder} aria-label={placeholder} className="pl-9" />
    </div>
  );
}

/* ---------- Display ---------- */

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "accent";

const tones: Record<Tone, string> = {
  neutral: "bg-paper text-muted-ink ring-line-strong",
  success: "bg-[#ecfdf3] text-[#067647] ring-[#abefc6]",
  warning: "bg-[#fffaeb] text-[#b54708] ring-[#fedf89]",
  danger: "bg-[#fef3f2] text-[#b42318] ring-[#fecdca]",
  info: "bg-[#eff8ff] text-[#175cd3] ring-[#b2ddff]",
  accent: "bg-accent-soft text-accent-ink ring-accent/20",
};

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset", tones[tone], className)}>
      {children}
    </span>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("rounded-2xl border border-line bg-white shadow-soft", className)}>{children}</section>;
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-ink">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Spinner({ label = "Loading", className }: { label?: string; className?: string }) {
  return (
    <div role="status" className={cn("flex items-center justify-center gap-2 py-16 text-sm text-muted", className)}>
      <LoaderCircle aria-hidden className="size-5 animate-spin" />
      {label}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-paper text-muted">
        <Inbox aria-hidden className="size-6" />
      </span>
      <p className="font-medium text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center px-6 py-14 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#fef3f2] text-[#b42318]">
        <TriangleAlert aria-hidden className="size-6" />
      </span>
      <p className="font-medium text-ink">Couldn&apos;t load this</p>
      <p className="mt-1 max-w-md text-sm text-muted-ink">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-5" icon={<RotateCw className="size-4" />} onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function Alert({ tone = "danger", children, onDismiss }: { tone?: "danger" | "success" | "info"; children: ReactNode; onDismiss?: () => void }) {
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("flex items-start gap-3 rounded-xl px-3.5 py-3 text-sm ring-1 ring-inset", tones[tone])}>
      <span className="min-w-0 flex-1">{children}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss" className="opacity-70 hover:opacity-100">
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

export function Pagination({ meta, onPage }: { meta: PageMeta; onPage: (page: number) => void }) {
  const from = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.page * meta.limit, meta.total);
  return (
    <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-muted-ink">
      <span className="tabular-nums">
        {from}–{to} of {meta.total}
      </span>
      <div className="flex items-center gap-1">
        <IconButton label="Previous page" disabled={meta.page <= 1} onClick={() => onPage(meta.page - 1)}>
          <ChevronLeft className="size-4" />
        </IconButton>
        <span className="px-2 tabular-nums">
          {meta.page} / {meta.totalPages}
        </span>
        <IconButton label="Next page" disabled={meta.page >= meta.totalPages} onClick={() => onPage(meta.page + 1)}>
          <ChevronRight className="size-4" />
        </IconButton>
      </div>
    </div>
  );
}

/** Small square preview of an uploaded image. */
export function Thumb({ src, alt = "", className }: { src?: string | null; alt?: string; className?: string }) {
  return (
    <span className={cn("flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-paper", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary R2 URLs, no need for the image optimiser here
        <img src={src} alt={alt} loading="lazy" className="size-full object-cover" />
      ) : null}
    </span>
  );
}

export function Avatar({ name, src, className }: { name: string; src?: string | null; className?: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return src ? (
    <Thumb src={src} alt="" className={cn("rounded-full", className)} />
  ) : (
    <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-white", className)}>{initials || "?"}</span>
  );
}

/** Two-line cell: a strong primary line and a muted secondary line. */
export function Stack({ primary, secondary }: { primary: ReactNode; secondary?: ReactNode }) {
  return (
    <span className="flex min-w-0 flex-col">
      <span className="truncate font-medium text-ink">{primary}</span>
      {secondary && <span className="truncate text-xs text-muted">{secondary}</span>}
    </span>
  );
}
