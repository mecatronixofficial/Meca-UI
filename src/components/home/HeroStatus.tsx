"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import { cn } from "../../lib/cn";
import { useSiteContact } from "../layout/SiteContactProvider";
import { useStudioStatus } from "../layout/StudioClock";

/** Live studio status pill: open/closed now (from the admin-managed hours), local time, city. */
export function HeroStatus({ className }: { className?: string }) {
  const contact = useSiteContact();
  const now = useStudioStatus();
  return (
    <p className={cn("text-label inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-line-strong/70 bg-white/75 py-2 pl-3 pr-4 text-muted-ink shadow-soft backdrop-blur-md sm:rounded-full", className)}>
      <span className="relative flex size-2">
        <span className={cn("absolute inset-0 rounded-full motion-safe:animate-ping", now?.open === false ? "bg-line-strong" : "bg-emerald-500")} />
        <span className={cn("relative size-2 rounded-full", now?.open === false ? "bg-muted" : "bg-emerald-500")} />
      </span>
      <span className="text-ink">{now ? (now.open ? "Studio open now" : now.note) : "Software engineering studio"}</span>
      <span aria-hidden className="text-line-strong">/</span>
      <span>
        {contact.address.city}
        {now && ` · ${now.hour}:${now.minute} IST`}
      </span>
    </p>
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
    <ul className={cn("flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-muted-ink", className)}>
      {links.map(({ href, icon: Icon, label, external }) => (
        <li key={href}>
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="inline-flex items-center gap-2 transition-colors hover:text-accent-ink"
          >
            <Icon aria-hidden className="size-4 text-accent" />
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
