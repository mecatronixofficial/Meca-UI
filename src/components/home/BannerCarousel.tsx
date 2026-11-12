"use client";

import Image from "next/image";
import { useState, type CSSProperties, type FocusEvent } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import type { SiteBanner } from "../../lib/content";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import styles from "./banner.module.css";

/** How long each slide stays before moving on (the timer bar under the active tab). */
const ROTATE_MS = 7000;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Home page banners: the image with a slow zoom, and a panel with the label, title, description,
 * highlight points and button set in the admin panel. With more than one banner, tabs below show
 * every slide and a timer bar; it pauses on hover or keyboard focus, and doesn't auto-advance
 * for visitors who prefer reduced motion.
 */
export function BannerCarousel({ banners }: { banners: SiteBanner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = banners.length;
  const multi = count > 1;
  const go = (i: number) => setIndex((i + count) % count);

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
  };

  return (
    <div
      className={cn(paused && styles.paused)}
      style={{ "--banner-duration": `${ROTATE_MS}ms` } as CSSProperties}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={onBlur}
      role={multi ? "region" : undefined}
      aria-roledescription={multi ? "carousel" : undefined}
      aria-label={multi ? "Highlights" : undefined}
    >
      <div className="relative isolate overflow-hidden rounded-panel bg-ink text-white shadow-lift lg:grid lg:grid-cols-[1fr_1.1fr]">
        {/* Images */}
        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[2/1] lg:order-2 lg:aspect-auto lg:min-h-[440px]">
          {banners.map((b, i) => (
            <div
              key={b.id}
              aria-hidden={i !== index}
              className={cn("absolute inset-0 transition-opacity duration-700 ease-out", i === index ? "opacity-100" : "opacity-0")}
            >
              {/* Admin-uploaded image (remote storage, served as-is) */}
              <Image
                src={b.img}
                alt=""
                fill
                unoptimized
                priority={i === 0}
                sizes="(min-width: 1024px) 640px, 100vw"
                className={cn(
                  "object-cover transition-transform duration-[7000ms] ease-out motion-reduce:transition-none",
                  i === index ? "scale-100" : "scale-110",
                )}
              />
            </div>
          ))}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent lg:bg-gradient-to-r lg:from-ink lg:via-ink/10" />
          {multi && (
            <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-ink/55 px-3 py-1.5 font-mono text-[11.5px] tracking-wider text-white/85 backdrop-blur-md sm:right-6 sm:top-6">
              {pad(index + 1)} / {pad(count)}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="relative -mt-14 flex flex-col px-6 pb-7 sm:-mt-20 sm:px-10 sm:pb-10 lg:mt-0 lg:p-12 xl:p-14">
          <span aria-hidden className="pointer-events-none absolute -left-24 -top-24 -z-10 size-80 rounded-full bg-accent/25 blur-3xl" />
          {/* Every slide's text shares one grid cell, so the card keeps the tallest slide's height */}
          <div className="grid flex-1" aria-live={multi && !paused ? "off" : "polite"}>
            {banners.map((b, i) => (
              <SlideDetails key={b.id} banner={b} active={i === index}>
                {multi && (
                  <span className="ml-auto flex gap-2">
                    <ArrowButton label="Previous banner" onClick={() => go(index - 1)}>
                      <ChevronLeft aria-hidden className="size-5" />
                    </ArrowButton>
                    <ArrowButton label="Next banner" onClick={() => go(index + 1)}>
                      <ChevronRight aria-hidden className="size-5" />
                    </ArrowButton>
                  </span>
                )}
              </SlideDetails>
            ))}
          </div>
        </div>
      </div>

      {/* Every slide, with a timer bar on the current one */}
      {multi && (
        <ol className="mt-4 flex snap-x gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
          {banners.map((b, i) => (
            <li key={b.id} className="min-w-[230px] flex-1 snap-start">
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={i === index}
                aria-label={`Show banner ${i + 1}: ${b.title}`}
                className={cn(
                  "group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border bg-white p-2.5 pr-4 text-left transition-[border-color,box-shadow] duration-300",
                  i === index ? "border-ink/15 shadow-soft" : "border-line hover:border-line-strong",
                )}
              >
                <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-paper">
                  <Image src={b.img} alt="" fill unoptimized sizes="48px" className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                    {pad(i + 1)} · {b.tag || "Highlight"}
                  </span>
                  <span className={cn("mt-0.5 block truncate text-[14px] font-medium", i === index ? "text-ink" : "text-muted-ink group-hover:text-ink")}>{b.title}</span>
                </span>
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-line/60">
                  {i === index && <span key={index} className={cn("block h-full bg-accent", styles.progress)} onAnimationEnd={() => go(index + 1)} />}
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function ArrowButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-11 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-white/40 hover:bg-white/10"
    >
      {children}
    </button>
  );
}

/** One slide's text. Inactive slides stay in the layout (for a stable height) but are hidden. */
function SlideDetails({ banner, active, children }: { banner: SiteBanner; active: boolean; children?: React.ReactNode }) {
  return (
    <div
      aria-hidden={!active}
      className={cn("relative flex flex-col [grid-area:1/1]", active ? styles.enter : "invisible")}
    >
      <p className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-accent px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white">{banner.tag || "Highlight"}</span>
        <span className="h-px w-8 bg-white/20" aria-hidden />
        <span className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-white/55">Mecatronix</span>
      </p>
      <h3 className="mt-5 font-display text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-balance sm:text-[2.5rem] xl:text-[2.85rem]">{banner.title}</h3>
      {banner.description && <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-white/70 sm:text-[17px]">{banner.description}</p>}
      {banner.highlights.length > 0 && (
        <ul className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {banner.highlights.map((point) => (
            <li key={point} className="flex items-start gap-3 text-[14.5px] leading-snug text-white/85">
              <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-accent/20 text-accent">
                <Check aria-hidden className="size-3" strokeWidth={3} />
              </span>
              {point}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
        {banner.cta ? (
          <Button href={banner.cta.href} external={banner.cta.external} arrow={banner.cta.external ? "external" : true}>
            {banner.cta.label}
          </Button>
        ) : (
          <Button href="/contact" arrow>
            Start a project
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}
