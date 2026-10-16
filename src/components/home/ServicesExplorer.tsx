"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { serviceList as services } from "../../data/service-list";
import { serviceIcons } from "../ui/icons";
import { cn } from "../../lib/cn";

/**
 * Desktop: a typographic list on the left drives a sticky detail panel.
 * Mobile: every row shows its own details inline (nothing is hidden).
 */
export function ServicesExplorer() {
  const [active, setActive] = useState(0);
  const current = services[active];
  const Icon = serviceIcons[current.slug];

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <ol className="border-t border-line lg:col-span-7">
        {services.map((s, i) => {
          const RowIcon = serviceIcons[s.slug];
          const isActive = i === active;
          return (
            <li key={s.slug} className="relative border-b border-line" onMouseEnter={() => setActive(i)}>
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 -bottom-px hidden h-px origin-left bg-gradient-to-r from-accent to-wine transition-transform duration-700 ease-[var(--ease-out-expo)] lg:block",
                  isActive ? "scale-x-100" : "scale-x-0",
                )}
              />
              <Link
                href={`/services/${s.slug}`}
                onFocus={() => setActive(i)}
                className="group flex items-center gap-5 py-6 lg:py-7"
              >
                <span className={cn("font-mono text-xs transition-colors", isActive ? "text-accent-ink" : "text-muted-ink")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "flex-1 font-display text-[1.45rem] font-medium leading-tight tracking-[-0.025em] transition-[color,translate] duration-500 ease-[var(--ease-out-expo)] sm:text-[1.9rem] lg:text-[2.3rem]",
                    isActive ? "text-ink lg:translate-x-3" : "text-ink lg:text-ink/30",
                  )}
                >
                  {s.title}
                </span>
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                    isActive ? "border-accent bg-accent text-white shadow-glow" : "border-line-strong text-ink",
                  )}
                >
                  <ArrowUpRight aria-hidden className={cn("size-4 transition-transform duration-300", isActive && "rotate-45")} />
                </span>
              </Link>

              {/* Inline details on small screens */}
              <div className="-mt-1 pb-7 pl-9 lg:hidden">
                <div className="flex items-start gap-3">
                  <RowIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-accent" />
                  <p className="text-[15px] leading-relaxed text-muted-ink">{s.summary}</p>
                </div>
                <p className="mt-3 border-l-2 border-accent/40 pl-3 text-[14.5px] leading-relaxed text-surface/80">{s.benefit}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Detail panel (desktop) */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28">
          <div key={current.slug} className="spotlight relative overflow-hidden rounded-panel border border-line bg-white p-10 text-ink shadow-lift motion-safe:animate-fade">
            <div aria-hidden className="absolute -right-16 -top-16 size-64 glow-accent" />
            <div aria-hidden className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />

            <div className="relative">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <Icon aria-hidden className="size-6" strokeWidth={1.6} />
              </span>
              <p className="text-label mt-10 text-muted">{String(active + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}</p>
              <h3 className="mt-3 text-[1.9rem] font-semibold leading-tight tracking-[-0.03em]">{current.title}</h3>
              <p className="mt-4 text-[15.5px] leading-relaxed text-muted-ink">{current.summary}</p>

              <div className="mt-8 border-t border-line pt-6">
                <p className="text-label text-accent-ink">Business benefit</p>
                <p className="mt-3 text-[15.5px] leading-relaxed text-surface">{current.benefit}</p>
              </div>

              <Link
                href={`/services/${current.slug}`}
                className="group mt-10 inline-flex h-11 items-center gap-2 rounded-full bg-accent-strong px-5 text-[15px] font-medium text-white shadow-glow transition-[background-color,box-shadow] hover:bg-accent-ink hover:shadow-glow-lg"
              >
                Explore service
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
