"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { mainNav } from "../../data/navigation";
import { site, whatsappLink } from "../../lib/site";
import { cn } from "../../lib/cn";
import { Logo } from "../ui/Logo";

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const dropdownId = useId();
  const servicesRef = useRef<HTMLLIElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close everything on navigation
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------- Services dropdown ---------- */

  const openServices = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  }, []);

  const closeServicesSoon = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 120);
  }, []);

  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        servicesRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [servicesOpen]);

  /* ---------- Mobile menu: scroll lock, Escape, focus trap ---------- */

  useEffect(() => {
    if (!menuOpen) return;
    const button = menuButtonRef.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    // The toggle button lives in the header bar, so it's part of the trap too
    const focusables = () => [
      ...(button ? [button] : []),
      ...Array.from(dialog?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []),
    ];
    focusables()[1]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || menuOpen
            ? "border-b border-line bg-white/85 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>

        <div className="mx-auto flex h-[72px] w-full max-w-[1320px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
          <Logo priority />

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);

                if (item.children) {
                  return (
                    <li
                      key={item.href}
                      ref={servicesRef}
                      className="relative"
                      onMouseEnter={openServices}
                      onMouseLeave={closeServicesSoon}
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node)) setServicesOpen(false);
                      }}
                    >
                      <button
                        type="button"
                        aria-expanded={servicesOpen}
                        aria-controls={dropdownId}
                        onClick={() => setServicesOpen((v) => !v)}
                        className={cn(
                          "group/nav relative flex items-center gap-1 rounded-full px-3.5 py-2 text-[14.5px] transition-colors",
                          active || servicesOpen ? "text-ink" : "text-surface/70 hover:text-ink",
                        )}
                      >
                        {item.label}
                        <ChevronDown aria-hidden className={cn("size-3.5 transition-transform duration-300", servicesOpen && "rotate-180")} />
                        {active ? <ActiveDot /> : <HoverRule />}
                      </button>

                      {/* Dropdown */}
                      <div
                        id={dropdownId}
                        className={cn(
                          "absolute left-1/2 top-full w-[640px] -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-300 ease-[var(--ease-out-expo)]",
                          servicesOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
                        )}
                      >
                        <div className="overflow-hidden rounded-[1.25rem] border border-line bg-white/95 shadow-window backdrop-blur-xl">
                          <ul className="grid grid-cols-2 gap-1 p-2">
                            {item.children.map((child, i) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  prefetch={false}
                                  className={cn(
                                    "group flex h-full gap-3 rounded-xl p-3.5 transition-colors hover:bg-sand focus-visible:bg-sand",
                                    pathname === child.href && "bg-paper",
                                  )}
                                >
                                  <span className="mt-0.5 h-fit rounded-md px-1 font-mono text-[11px] text-accent transition-colors group-hover:bg-accent group-hover:text-white">{String(i + 1).padStart(2, "0")}</span>
                                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                                    <span className="block text-[14.5px] font-medium text-ink group-hover:text-accent-ink">{child.label}</span>
                                    <span className="mt-1 block text-[13px] leading-snug text-muted-ink line-clamp-2">{child.summary}</span>
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <Link
                            href="/services"
                            className="flex items-center justify-between border-t border-line px-5 py-3.5 text-[14px] text-surface/80 transition-colors hover:bg-paper hover:text-accent-ink"
                          >
                            View all services
                            <ArrowRight aria-hidden className="size-4" />
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group/nav relative block rounded-full px-3.5 py-2 text-[14.5px] transition-colors",
                        active ? "text-ink" : "text-surface/70 hover:text-ink",
                      )}
                    >
                      {item.label}
                      {active ? <ActiveDot /> : <HoverRule />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="group hidden h-10 items-center gap-2 btn-shine rounded-full bg-accent-strong px-5 text-[14.5px] font-medium text-white shadow-glow transition-[background-color,box-shadow] hover:bg-accent-ink hover:shadow-glow-lg sm:inline-flex"
            >
              Let&apos;s Talk
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex size-11 items-center justify-center rounded-full border border-line-strong text-ink transition-colors hover:bg-paper lg:hidden"
            >
              {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </div>

      </header>

      {/* Mobile menu: a sibling of <header>, because the header's backdrop-filter
          would otherwise become the containing block for this fixed panel */}
      <div
        id="mobile-menu"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!menuOpen}
        className="fixed inset-x-0 bottom-0 top-[72px] z-[45] overflow-y-auto bg-white lg:hidden"
      >
        <div className="flex min-h-full flex-col px-4 pb-8 pt-4 sm:px-6">
          <nav aria-label="Mobile">
            <ul className="divide-y divide-line border-b border-line">
              {mainNav.map((item, i) => (
                <li
                  key={item.href}
                  className="motion-safe:animate-rise"
                  style={{ animationDelay: `${40 + i * 35}ms` }}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className="flex items-center justify-between py-4 font-display text-[1.75rem] font-medium tracking-tight text-ink"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </span>
                    {isActive(pathname, item.href) && <span aria-hidden className="size-2 rounded-full bg-accent" />}
                  </Link>
                  {item.children && (
                    <ul className="-mt-1 grid grid-cols-2 gap-x-4 gap-y-1 pb-4 pl-8">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} className="block py-1.5 text-[15px] text-muted-ink hover:text-accent-ink">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto space-y-3 pt-10">
            <Link
              href="/contact"
              className="flex h-13 items-center justify-center gap-2 rounded-full bg-accent-strong text-base font-medium text-white shadow-glow"
            >
              Start a Project <ArrowRight aria-hidden className="size-4" />
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-13 items-center justify-center gap-2 rounded-full border border-line-strong text-base text-ink"
            >
              Talk on WhatsApp <ArrowUpRight aria-hidden className="size-4" />
            </a>
            <p className="pt-3 text-center text-sm text-muted">
              <a href={`mailto:${site.email}`} className="hover:text-accent-ink">{site.email}</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function ActiveDot() {
  return <span aria-hidden className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent" />;
}

/** Red rule that draws in under a nav link on hover */
function HoverRule() {
  return (
    <span
      aria-hidden
      className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/nav:scale-x-100"
    />
  );
}
