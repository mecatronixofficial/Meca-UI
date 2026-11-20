"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { serviceList } from "../../data/service-list";
import { serviceIcons } from "../../components/ui/icons";
import styles from "./solutions.module.css";

/** One photo per service (Unsplash, stored locally in /public/assets/services). */
const photos: Record<string, string> = {
  "web-development": "/assets/services/web.jpg",
  "custom-software": "/assets/services/software.jpg",
  "mobile-app-development": "/assets/services/mobile.jpg",
  "ecommerce-development": "/assets/services/ecommerce.jpg",
  "erp-development": "/assets/services/erp.jpg",
  "ai-automation": "/assets/services/ai.jpg",
};

/**
 * Service list on the left drives a large photo panel on the right. It moves to the next
 * service on its own (the bar under the current item times it), pauses while hovered or
 * focused, and jumps to whichever service is hovered or clicked. Reduced motion: no autoplay.
 */
export function SolutionsShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = serviceList[active];
  const Icon = serviceIcons[current.slug];
  const next = () => setActive((i) => (i + 1) % serviceList.length);

  return (
    <div
      className={styles.showcase}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
      data-paused={paused || undefined}
    >
      <ol className={styles.list}>
        {serviceList.map((service, i) => {
          const ItemIcon = serviceIcons[service.slug];
          const on = i === active;
          return (
            <li key={service.slug}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className={styles.item}
              >
                <span className={styles.itemIndex}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.itemIcon}>
                  <ItemIcon size={17} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className={styles.itemTitle}>{service.navLabel}</span>
                <ArrowRight size={16} aria-hidden="true" className={styles.itemArrow} />
                <span aria-hidden="true" className={styles.timer}>
                  {on && <span key={active} onAnimationEnd={next} />}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className={styles.panel} aria-live="polite">
        <div className={styles.photo}>
          {serviceList.map((service, i) => (
            <Image
              key={service.slug}
              src={photos[service.slug] ?? photos["web-development"]}
              alt=""
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className={styles.photoImg}
              data-on={i === active || undefined}
            />
          ))}
          <span className={styles.badge}>
            <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
            {String(active + 1).padStart(2, "0")} / {String(serviceList.length).padStart(2, "0")}
          </span>
        </div>
        <div key={current.slug} className={styles.copy}>
          <h3>{current.title}</h3>
          <p>{current.summary}</p>
          <p className={styles.benefit}>{current.benefit}</p>
          <Link href={`/services/${current.slug}`} className={styles.cta}>
            Explore service
            <span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
