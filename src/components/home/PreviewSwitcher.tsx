"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { TEMPLATES } from "../../data/templates";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Reveal } from "../animations/Reveal";
import { ScaledFrame } from "../preview/ScaledFrame";
import { SiteTemplate } from "../preview/SiteTemplate";

/** Industries offered as chips on the home page. */
const SHOWN = 10;

/** A sample business for each chip, so every preview looks like a real site. */
const samples: Record<string, { company: string; tagline: string }> = {
  medical: { company: "Sunrise Clinic", tagline: "Caring for families since 1998" },
  textile: { company: "Kovai Weaves", tagline: "Fabrics woven in Coimbatore" },
  ecommerce: { company: "Urban Basket", tagline: "Everyday essentials, delivered" },
  crm: { company: "LeadFlow", tagline: "Every lead, followed up" },
  erp: { company: "Prime Industries", tagline: "Operations under one roof" },
  saas: { company: "CloudDesk", tagline: "Work, simplified" },
  education: { company: "Little Stars School", tagline: "Learning with joy" },
  "real-estate": { company: "Greenfield Homes", tagline: "Homes built to last" },
  restaurant: { company: "Spice Route Kitchen", tagline: "Authentic South Indian flavours" },
  logistics: { company: "SwiftMove Logistics", tagline: "On time, every time" },
};

const domain = (company: string) => `www.${company.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com`;

/**
 * Industry chips that swap the live sample website beside them. "Preview your website"
 * opens the full generator on whichever industry is selected.
 */
export function PreviewSwitcher({ intro }: { intro: React.ReactNode }) {
  const [slug, setSlug] = useState(TEMPLATES[0].slug);
  const frame = useRef<HTMLDivElement>(null);
  const template = TEMPLATES.find((t) => t.slug === slug) ?? TEMPLATES[0];
  const sample = samples[template.slug] ?? { company: `${template.short} Co.`, tagline: template.blurb };

  const choose = (next: string) => {
    if (next === slug) return;
    setSlug(next);
    // Start the new site from its header
    frame.current?.querySelector(".overflow-y-auto")?.scrollTo({ top: 0 });
  };

  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        {intro}
        <Reveal className="mt-8 flex flex-wrap gap-2" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
          {TEMPLATES.slice(0, SHOWN).map((t) => {
            const active = t.slug === slug;
            return (
              <button
                key={t.slug}
                type="button"
                onClick={() => choose(t.slug)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13.5px] font-medium transition-[color,background-color,border-color,box-shadow,translate] duration-300",
                  active
                    ? "border-accent bg-accent text-white shadow-glow"
                    : "border-line bg-white text-surface hover:-translate-y-0.5 hover:border-accent hover:text-accent-ink",
                )}
              >
                <t.icon aria-hidden className="size-4" style={{ color: active ? "currentColor" : t.color }} />
                {t.short}
              </button>
            );
          })}
          <Link href="/preview" className="inline-flex items-center rounded-full px-3 py-2 text-[13.5px] font-medium text-accent-ink hover:underline">
            +{TEMPLATES.length - SHOWN} more
          </Link>
        </Reveal>
        <Reveal className="mt-10" style={{ "--reveal-delay": "160ms" } as React.CSSProperties}>
          <Button href={`/preview?industry=${template.slug}`} size="lg" arrow>
            Preview your website
          </Button>
        </Reveal>
      </div>

      <Reveal className="min-w-0 lg:col-span-7" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
        <div ref={frame}>
          <ScaledFrame url={domain(sample.company)} maxHeight={520}>
            <div key={template.slug} className="motion-safe:animate-fade">
              <SiteTemplate template={template} brand={{ company: sample.company, color: template.color, city: "Coimbatore", tagline: sample.tagline }} />
            </div>
          </ScaledFrame>
        </div>
        <p className="mt-3 text-center text-[12.5px] text-muted-ink" aria-live="polite">
          Showing a sample <span className="font-medium text-ink">{template.name}</span> website
        </p>
      </Reveal>
    </div>
  );
}
