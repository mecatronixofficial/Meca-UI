"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { cn } from "../../lib/cn";
import { useSiteContact } from "../layout/SiteContactProvider";
import { useStudioStatus } from "../layout/StudioClock";
import styles from "./hero.module.css";

/**
 * Live studio status pill: open/closed now (from the admin-managed hours), local time, city.
 * Links to the contact page; on hover the border lights up and a call to action slides open.
 */
export function HeroStatus({ className }: { className?: string }) {
  const contact = useSiteContact();
  const now = useStudioStatus();
  const closed = now?.open === false;
  return (
    <Link href="/contact" data-closed={closed || undefined} className={cn(styles.status, className)}>
      <span className={cn(styles.statusBody, "text-label text-white/70")}>
        <span aria-hidden className={styles.beacon}>
          <span />
        </span>
        <span className="font-semibold text-white">{now ? (now.open ? "Studio open now" : now.note) : "Software engineering studio"}</span>
        <span aria-hidden className="h-3.5 w-px bg-white/20" />
        <span className="tabular-nums">
          {contact.address.city}
          {now && (
            <>
              {" · "}
              {now.hour}
              <span className={styles.colon}>:</span>
              {now.minute} IST
            </>
          )}
        </span>
        <span className={styles.reveal}>
          <span className="inline-flex items-center gap-1 font-semibold text-accent-glow">
            <span aria-hidden className="mr-2 h-3.5 w-px bg-white/20" />
            {closed ? "Leave a message" : "Say hello"}
            <ArrowUpRight aria-hidden className={cn(styles.arrow, "size-3.5")} strokeWidth={2.2} />
          </span>
        </span>
      </span>
    </Link>
  );
}

/** One-line ways to reach the team right away. */
export function HeroContactLine({ className }: { className?: string }) {
  const contact = useSiteContact();
  const links = [
    { href: `tel:${contact.phone}`, icon: Phone, label: contact.phoneDisplay },
    contact.whatsapp && { href: `https://wa.me/${contact.whatsapp}`, icon: MessageCircle, label: "WhatsApp", external: true },
    { href: `mailto:${contact.email}`, icon: Mail, label: contact.email },
  ].filter(Boolean) as { href: string; icon: typeof Phone; label: string; external?: boolean }[];

  return (
    <ul className={cn("-ml-1 flex flex-wrap items-center gap-x-2 gap-y-2 text-[14px] text-muted-ink", className)}>
      {links.map(({ href, icon: Icon, label, external }) => (
        <li key={href}>
          <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={styles.contact}>
            <span className={styles.contactIcon}>
              <Icon aria-hidden className="size-4" strokeWidth={1.9} />
            </span>
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
