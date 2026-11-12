"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, ImagePlus, Loader2, Plus, Sparkles, Wand2, X } from "lucide-react";
import { TEMPLATES, getTemplate, type SiteTemplateDef } from "../../data/templates";
import { SiteTemplate } from "../../components/preview/SiteTemplate";
import { ScaledFrame } from "../../components/preview/ScaledFrame";
import { SWATCHES, isHex } from "../../components/preview/color";
import { cn } from "../../lib/cn";

const STYLE_LABEL: Record<SiteTemplateDef["style"], string> = { app: "Product site", commerce: "Catalogue", care: "Bookings", industrial: "Corporate" };
const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_LOGO_BYTES = 2 * 1024 * 1024;
const BUILD_STEPS = ["Applying your brand colours", "Placing your logo", "Writing your pages", "Optimising for mobile", "Final polish"];
/** The build sequence runs at least this long, so it reads as a sequence rather than a flash. */
const MIN_BUILD_MS = 3600;

interface FormState {
  company_name: string;
  tagline: string;
  description: string;
  brand_color: string;
  services: string[];
  contact_name: string;
  email: string;
  phone: string;
  city: string;
  website: string;
}

export default function PreviewBuilder() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = getTemplate(params.get("industry"));
  const [template, setTemplate] = useState<SiteTemplateDef | null>(initial ?? null);
  const [form, setForm] = useState<FormState>(() => blankForm(initial));
  const [logo, setLogo] = useState<{ file: File; url: string } | null>(null);
  const [serviceDraft, setServiceDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [building, setBuilding] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);

  // Release the logo's object URL when it changes or the page closes
  useEffect(() => {
    if (!logo) return;
    return () => URL.revokeObjectURL(logo.url);
  }, [logo]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const choose = (t: SiteTemplateDef) => {
    // Colour and services follow the template unless the visitor already customised them
    const untouched = (value: string, previous?: string) => !value || value === previous;
    setForm((f) => ({
      ...f,
      brand_color: untouched(f.brand_color, template?.color) ? t.color : f.brand_color,
      services: untouched(f.services.join("|"), template?.services.slice(0, 6).join("|")) ? t.services.slice(0, 6) : f.services,
    }));
    setTemplate(t);
    window.history.replaceState(null, "", `/preview?industry=${t.slug}`);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pickLogo = (file: File | undefined) => {
    setError(null);
    if (!file) return;
    if (!LOGO_TYPES.includes(file.type)) return setError("Logo must be a PNG, JPG, WebP or GIF image.");
    if (file.size > MAX_LOGO_BYTES) return setError("Logo must be 2 MB or smaller.");
    setLogo({ file, url: URL.createObjectURL(file) });
  };

  const addService = () => {
    const value = serviceDraft.trim();
    if (!value || form.services.length >= 6 || form.services.some((s) => s.toLowerCase() === value.toLowerCase())) return;
    set("services", [...form.services, value.slice(0, 60)]);
    setServiceDraft("");
  };

  const brand = useMemo(
    () => ({
      company: form.company_name,
      logoUrl: logo?.url,
      color: isHex(form.brand_color) ? form.brand_color : (template?.color ?? "#e10600"),
      tagline: form.tagline,
      description: form.description,
      services: form.services,
      phone: form.phone,
      email: form.email,
      city: form.city,
    }),
    [form, logo, template],
  );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!template || building) return;
    setError(null);
    setBuilding(true);
    setBuildStep(0);

    const started = Date.now();
    const ticker = window.setInterval(() => setBuildStep((s) => Math.min(s + 1, BUILD_STEPS.length - 1)), MIN_BUILD_MS / BUILD_STEPS.length);

    const body = new FormData();
    body.append("industry", template.slug);
    for (const [key, value] of Object.entries(form)) body.append(key, key === "services" ? JSON.stringify(value) : String(value));
    if (logo) body.append("logo", logo.file);

    try {
      const res = await fetch("/api/preview", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as { id?: string; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error || "We couldn't build your preview. Please try again.");
      await new Promise((r) => setTimeout(r, Math.max(0, MIN_BUILD_MS - (Date.now() - started))));
      setBuildStep(BUILD_STEPS.length);
      router.push(`/preview/${data.id}?new=1`);
    } catch (err) {
      setBuilding(false);
      setError((err as Error).message);
    } finally {
      window.clearInterval(ticker);
    }
  };

  return (
    <div ref={topRef} className="scroll-mt-24">
      {!template ? (
        <Gallery onChoose={choose} />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:gap-10">
          <form onSubmit={submit} className="flex flex-col gap-6" noValidate={false}>
            <div className="flex items-center justify-between gap-3">
              <button type="button" onClick={() => setTemplate(null)} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-muted-ink hover:text-accent-ink">
                <ArrowLeft className="size-4" /> All industries
              </button>
              <span className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-[12.5px] font-medium text-white">
                <template.icon className="size-3.5" /> {template.name}
              </span>
            </div>

            <Panel step="1" title="Your brand">
              <Field label="Company name" required>
                <input className={inputCls} value={form.company_name} onChange={(e) => set("company_name", e.target.value)} maxLength={120} required placeholder="e.g. Sunrise Clinic" autoComplete="organization" />
              </Field>

              <Field label="Logo" hint="PNG, JPG, WebP or GIF · up to 2 MB">
                {logo ? (
                  <div className="flex items-center gap-3 rounded-xl border border-line bg-paper p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo.url} alt="Your logo" className="h-12 w-auto max-w-[140px] rounded-md bg-white object-contain p-1" />
                    <span className="min-w-0 flex-1 truncate text-[13.5px] text-muted-ink">{logo.file.name}</span>
                    <button type="button" onClick={() => setLogo(null)} className="rounded-lg p-2 text-muted hover:bg-white hover:text-accent-ink" aria-label="Remove logo">
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line-strong bg-paper px-4 py-6 text-center transition-colors hover:border-accent hover:bg-accent-soft"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      pickLogo(e.dataTransfer.files[0]);
                    }}
                  >
                    <ImagePlus className="size-6 text-accent" />
                    <span className="text-[14px] font-medium text-ink">Drop your logo or click to upload</span>
                    <span className="text-[12.5px] text-muted">No logo? We&apos;ll make a monogram.</span>
                    <input type="file" accept={LOGO_TYPES.join(",")} className="sr-only" onChange={(e) => pickLogo(e.target.files?.[0])} />
                  </label>
                )}
              </Field>

              <Field label="Brand colour">
                <div className="flex flex-wrap items-center gap-2">
                  {[template.color, ...SWATCHES.filter((c) => c !== template.color)].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => set("brand_color", color)}
                      aria-label={`Use colour ${color}`}
                      aria-pressed={form.brand_color === color}
                      className={cn("grid size-9 place-items-center rounded-full ring-offset-2 transition-transform hover:scale-110", form.brand_color === color && "ring-2 ring-ink")}
                      style={{ background: color }}
                    >
                      {form.brand_color === color && <Check className="size-4 text-white mix-blend-difference" />}
                    </button>
                  ))}
                  <label className="relative grid size-9 cursor-pointer place-items-center rounded-full border border-line-strong bg-[conic-gradient(red,yellow,lime,aqua,blue,magenta,red)]" title="Custom colour">
                    <input type="color" value={isHex(form.brand_color) ? form.brand_color : template.color} onChange={(e) => set("brand_color", e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Custom brand colour" />
                  </label>
                  <span className="ml-1 font-mono text-[12.5px] text-muted-ink">{form.brand_color}</span>
                </div>
              </Field>

              <Field label="Tagline" hint="Optional">
                <input className={inputCls} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} maxLength={160} placeholder="e.g. Caring for families since 1998" />
              </Field>
            </Panel>

            <Panel step="2" title="Your business">
              <Field label="About your business" hint="Optional · a few sentences">
                <textarea className={cn(inputCls, "min-h-24 resize-y py-3")} value={form.description} onChange={(e) => set("description", e.target.value)} maxLength={600} rows={3} placeholder="What you do, who you serve, what makes you different." />
              </Field>
              <Field label="Services" hint={`${form.services.length}/6`}>
                <div className="flex flex-wrap gap-2">
                  {form.services.map((service) => (
                    <span key={service} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper py-1.5 pl-3 pr-1.5 text-[13px] text-ink">
                      {service}
                      <button type="button" onClick={() => set("services", form.services.filter((s) => s !== service))} className="rounded-full p-0.5 text-muted hover:bg-white hover:text-accent-ink" aria-label={`Remove ${service}`}>
                        <X className="size-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                {form.services.length < 6 && (
                  <div className="mt-2 flex gap-2">
                    <input
                      className={inputCls}
                      value={serviceDraft}
                      onChange={(e) => setServiceDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addService();
                        }
                      }}
                      maxLength={60}
                      placeholder="Add a service"
                    />
                    <button type="button" onClick={addService} className="grid size-11 shrink-0 place-items-center rounded-xl bg-ink text-white hover:bg-surface" aria-label="Add service">
                      <Plus className="size-4" />
                    </button>
                  </div>
                )}
              </Field>
            </Panel>

            <Panel step="3" title="Where should we send it?">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Your name" required>
                  <input className={inputCls} value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} maxLength={100} required autoComplete="name" />
                </Field>
                <Field label="Email" required>
                  <input className={inputCls} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} maxLength={254} required autoComplete="email" />
                </Field>
                <Field label="Phone" hint="Optional">
                  <input className={inputCls} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} maxLength={30} autoComplete="tel" />
                </Field>
                <Field label="City" hint="Optional">
                  <input className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} maxLength={100} autoComplete="address-level2" />
                </Field>
              </div>
              {/* Honeypot: hidden from people, filled by bots */}
              <input type="text" name="website" value={form.website} onChange={(e) => set("website", e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <p className="text-[12.5px] leading-relaxed text-muted">Your details are only used to share this preview and follow up about your website. No spam, ever.</p>
            </Panel>

            {error && (
              <p role="alert" className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-[14px] text-accent-ink">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={building}
              className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-accent-strong px-6 text-[16px] font-semibold text-white shadow-[0_18px_40px_-16px_var(--color-accent)] transition-transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              <Wand2 className="size-5" /> Generate my website
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div className="mb-3 flex items-center justify-between">
              <p className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-ink">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                Live preview — updates as you type
              </p>
            </div>
            <ScaledFrame url={`www.${domainFor(form.company_name)}`} maxHeight={720}>
              <SiteTemplate template={template} brand={brand} />
            </ScaledFrame>
          </div>
        </div>
      )}

      {building && <BuildOverlay company={form.company_name} step={buildStep} color={brand.color} />}
    </div>
  );
}

/* ---------- Pieces ---------- */

function Gallery({ onChoose }: { onChoose: (t: SiteTemplateDef) => void }) {
  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-label text-accent-ink">Step 1 of 3</p>
          <h2 className="mt-2 font-display text-[1.6rem] font-semibold tracking-tight text-ink sm:text-[2rem]">Choose your industry</h2>
        </div>
        <p className="text-[14px] text-muted-ink">{TEMPLATES.length} templates · switch any time</p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TEMPLATES.map((t) => (
          <button
            key={t.slug}
            type="button"
            onClick={() => onChoose(t)}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_24px_50px_-24px_rgba(11,13,18,0.35)]"
          >
            <span aria-hidden className="absolute -right-10 -top-10 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40" style={{ background: t.color }} />
            <span className="relative grid size-12 place-items-center rounded-xl text-white shadow-sm" style={{ background: t.color }}>
              <t.icon className="size-6" strokeWidth={1.8} />
            </span>
            <span className="relative mt-5 text-[16.5px] font-semibold text-ink">{t.name}</span>
            <span className="relative mt-1.5 flex-1 text-[13.5px] leading-relaxed text-muted-ink">{t.blurb}</span>
            <span className="relative mt-5 flex items-center justify-between text-[12.5px]">
              <span className="rounded-full bg-paper px-2.5 py-1 font-medium text-muted-ink">{STYLE_LABEL[t.style]}</span>
              <span className="inline-flex items-center gap-1 font-medium text-accent-ink opacity-0 transition-opacity group-hover:opacity-100">
                Use this <ArrowRight className="size-3.5" />
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Panel({ step, title, children }: { step: string; title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
      <legend className="sr-only">{title}</legend>
      <p className="flex items-center gap-3 font-display text-[17px] font-semibold text-ink" aria-hidden>
        <span className="grid size-7 place-items-center rounded-full bg-ink text-[13px] text-white">{step}</span>
        {title}
      </p>
      {children}
    </fieldset>
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

function BuildOverlay({ company, step, color }: { company: string; step: number; color: string }) {
  const done = step >= BUILD_STEPS.length;
  return (
    <div role="status" aria-live="polite" className="fixed inset-0 z-[60] grid place-items-center bg-ink/92 p-6 backdrop-blur-md">
      <div aria-hidden className="absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-[120px]" style={{ background: color }} />
      <div className="relative w-full max-w-md text-white">
        <span className="relative mx-auto grid size-16 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
          <Sparkles className="size-7 animate-pulse" style={{ color }} />
        </span>
        <p className="mt-6 text-center font-display text-[1.6rem] font-semibold tracking-tight">Building {company.trim() || "your"}&apos;s website</p>
        <p className="mt-2 text-center text-[14px] text-white/60">This takes just a few seconds.</p>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${Math.min(100, ((step + 1) / BUILD_STEPS.length) * 100)}%`, background: color }} />
        </div>
        <ul className="mt-6 grid gap-3">
          {BUILD_STEPS.map((label, i) => (
            <li key={label} className={cn("flex items-center gap-3 text-[14.5px] transition-opacity duration-500", i <= step ? "opacity-100" : "opacity-35")}>
              <span className={cn("grid size-6 place-items-center rounded-full", i < step || done ? "bg-emerald-500" : "bg-white/10")}>
                {i < step || done ? <Check className="size-3.5" strokeWidth={3} /> : i === step ? <Loader2 className="size-3.5 animate-spin" /> : null}
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-line-strong bg-white px-3.5 text-[15px] text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10";

const domainFor = (company: string) => `${company.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24) || "yourcompany"}.com`;

function blankForm(t: SiteTemplateDef | undefined): FormState {
  return {
    company_name: "",
    tagline: "",
    description: "",
    brand_color: t?.color ?? "",
    services: t?.services.slice(0, 6) ?? [],
    contact_name: "",
    email: "",
    phone: "",
    city: "",
    website: "",
  };
}
