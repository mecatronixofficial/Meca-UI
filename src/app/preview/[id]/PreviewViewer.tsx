"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Check, ChevronDown, Link2, Monitor, PartyPopper, Pencil, Smartphone, Tablet } from "lucide-react";
import { TEMPLATES, getTemplate } from "../../../data/templates";
import { SiteTemplate } from "../../../components/preview/SiteTemplate";
import type { SavedPreview } from "../../../lib/previews";
import { cn } from "../../../lib/cn";

const DEVICES = [
  { id: "desktop", label: "Desktop", icon: Monitor, width: null },
  { id: "tablet", label: "Tablet", icon: Tablet, width: 820 },
  { id: "mobile", label: "Mobile", icon: Smartphone, width: 390 },
] as const;
type Device = (typeof DEVICES)[number]["id"];

/** Full-page preview of a visitor's website, with device frames and a template switcher. */
export default function PreviewViewer({ preview }: { preview: SavedPreview }) {
  const params = useSearchParams();
  const [device, setDevice] = useState<Device>("desktop");
  const [slug, setSlug] = useState(preview.industry);
  const [copied, setCopied] = useState(false);
  const [celebrate, setCelebrate] = useState(params.get("new") === "1");

  const template = getTemplate(slug) ?? TEMPLATES[0]!;
  const frameWidth = DEVICES.find((d) => d.id === device)!.width;

  // Freshly built: celebrate, then tidy the URL (without a server round trip, which would
  // count another view) so a shared link doesn't replay it
  useEffect(() => {
    if (!celebrate) return;
    window.history.replaceState(null, "", `/preview/${preview.id}`);
    const timer = window.setTimeout(() => setCelebrate(false), 4200);
    return () => window.clearTimeout(timer);
  }, [celebrate, preview.id]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/preview/${preview.id}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", `${window.location.origin}/preview/${preview.id}`);
    }
  };

  return (
    <div className="min-h-dvh bg-[#e9ebef]">
      {/* Toolbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink text-white">
        <div className="flex h-14 items-center gap-3 px-3 sm:px-5">
          <Link href="/" className="flex shrink-0 items-center gap-2" title="Mecatronix">
            <span className="grid size-8 place-items-center rounded-lg bg-accent font-display text-[15px] font-bold">M</span>
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold">{preview.company_name}</p>
            <p className="truncate text-[11.5px] text-white/50">Website preview by Mecatronix</p>
          </div>

          <div className="hidden items-center rounded-xl bg-white/5 p-1 md:flex" role="radiogroup" aria-label="Device">
            {DEVICES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={device === id}
                title={label}
                onClick={() => setDevice(id)}
                className={cn("grid h-8 w-10 place-items-center rounded-lg transition-colors", device === id ? "bg-white text-ink" : "text-white/60 hover:text-white")}
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>

          <label className="relative hidden lg:block">
            <span className="sr-only">Template</span>
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="h-9 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-8 text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {TEMPLATES.map((t) => (
                <option key={t.slug} value={t.slug} className="text-ink">
                  {t.short} template
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-white/50" />
          </label>

          <button type="button" onClick={copyLink} className="hidden h-9 items-center gap-1.5 rounded-xl border border-white/10 px-3 text-[13px] text-white/80 hover:bg-white/5 sm:inline-flex">
            {copied ? <Check className="size-4 text-emerald-400" /> : <Link2 className="size-4" />}
            {copied ? "Copied" : "Share"}
          </button>
          <Link href="/preview" className="hidden h-9 items-center gap-1.5 rounded-xl border border-white/10 px-3 text-[13px] text-white/80 hover:bg-white/5 xl:inline-flex">
            <Pencil className="size-3.5" /> New preview
          </Link>
          <Link href="/contact" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-accent-strong px-3.5 text-[13px] font-semibold text-white hover:bg-accent">
            Get this website <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      {/* The website */}
      {/* --site-top: the site's sticky header and pop-ups sit below this toolbar */}
      <main className={cn("transition-[padding] duration-300 [--site-top:57px]", frameWidth && "px-4 py-8")}>
        <div
          className={cn("mx-auto transition-[max-width] duration-500 ease-out", frameWidth && "overflow-clip rounded-[28px] border-[10px] border-ink bg-white shadow-[0_40px_100px_-40px_rgba(11,13,18,0.5)]")}
          style={{ maxWidth: frameWidth ?? "100%" }}
        >
          <SiteTemplate
            template={template}
            brand={{
              company: preview.company_name,
              logoUrl: preview.logo_url,
              color: preview.brand_color,
              tagline: preview.tagline,
              description: preview.description,
              services: preview.services,
              phone: preview.phone,
              email: preview.email,
              city: preview.city,
            }}
          />
        </div>
      </main>

      {/* Bottom call to action */}
      <div className="sticky bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-muted-ink">
            <span className="font-semibold text-ink">Like what you see?</span> We can build the real {preview.company_name} website — fast, secure and fully yours.
          </p>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={copyLink} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-line-strong px-3.5 text-[13.5px] font-medium text-ink hover:bg-paper sm:hidden">
              {copied ? <Check className="size-4 text-emerald-600" /> : <Link2 className="size-4" />}
              {copied ? "Copied" : "Share"}
            </button>
            <Link href="/contact" className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-ink px-4 text-[13.5px] font-semibold text-white hover:bg-surface sm:flex-none">
              Talk to our team <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {celebrate && (
        <div role="status" className="fixed left-1/2 top-20 z-[60] w-[min(92vw,440px)] -translate-x-1/2 motion-safe:animate-rise">
          <div className="flex items-center gap-3 rounded-2xl bg-ink px-5 py-4 text-white shadow-window ring-1 ring-white/10">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl" style={{ background: preview.brand_color }}>
              <PartyPopper className="size-5 text-white" />
            </span>
            <div className="min-w-0">
              <p className="text-[14.5px] font-semibold">Your website is ready!</p>
              <p className="text-[13px] text-white/60">Scroll to explore. Try other devices and templates above.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
