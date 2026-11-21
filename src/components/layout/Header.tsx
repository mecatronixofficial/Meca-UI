"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown, Code2, Mail, MessageCircle, Phone, Sparkles } from "lucide-react";
import { mainNav } from "../../data/navigation";
import { whatsappLink } from "../../lib/site-contact";
import { site } from "../../lib/site";
import { cn } from "../../lib/cn";
import { useSiteContact } from "./SiteContactProvider";
import { Logo } from "../ui/Logo";
import { serviceIcons } from "../ui/icons";

/*
 * Header with two states:
 *  - Top of the page: a white bar (logo + links) with a red block on the right
 *    that runs to the screen edge (contact + Let's Talk).
 *  - Scrolled: the bar folds away and only the logo stays, in a small capsule at
 *    the top centre (like the iPhone's Dynamic Island). The logo glides there
 *    from the bar (shared layoutId). Hover (desktop) or tap (phone) brings the
 *    full navigation back.
 * The bar is 72px, the space every page reserves under the header.
 */

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

const spring = { type: "spring", stiffness: 380, damping: 32 } as const;

/** Label that rolls up on hover of the nearest `group/nav` ancestor */
function Roll({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/nav:-translate-y-full">{children}</span>
      <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/nav:translate-y-0">
        {children}
      </span>
    </span>
  );
}

export default function Header() {
  const contact = useSiteContact();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false); // full bar brought back while scrolled
  const [focusInside, setFocusInside] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const dropdownId = useId();
  const mobileServicesId = useId();
  const servicesRef = useRef<HTMLLIElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canHover = useRef(false);

  const island = scrolled && !expanded && !menuOpen && !servicesOpen && !focusInside;

  // Close everything on navigation
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
    setExpanded(false);
  }, [pathname]);

  useEffect(() => {
    canHover.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 80);
      if (y <= 80) setExpanded(false);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* ---------- Services panel ---------- */

  const openServices = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  }, []);

  const closeServicesSoon = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 150);
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

  /* ---------- Phone menu: scroll lock, Escape, focus trap ---------- */

  useEffect(() => {
    if (!menuOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    // The toggle button lives in the bar, so it's part of the trap too
    const focusables = () => [
      ...(menuButtonRef.current ? [menuButtonRef.current] : []),
      ...Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []).filter(
        (el) => !el.closest("[inert]"),
      ),
    ];
    const focusTimer = setTimeout(() => focusables()[1]?.focus(), 50);

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
      clearTimeout(focusTimer);
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  /** Island tapped/clicked: phones open the menu, desktops bring the bar back */
  const openFromIsland = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) setExpanded(true);
    else setMenuOpen(true);
  };

  /* Desktop link: red pill rises from the bottom, label rolls, text turns white */
  const navItemClass = (active: boolean) =>
    cn(
      "group/nav relative isolate flex h-10 items-center gap-1 overflow-hidden whitespace-nowrap rounded-full px-2.5 text-[14px] font-semibold transition-colors duration-300 hover:text-white xl:px-3.5 xl:text-[14.5px]",
      active ? "text-accent" : "text-muted-ink",
    );
  const navFill = (active: boolean) => (
    <>
      <span
        aria-hidden
        className="absolute inset-0 -z-10 origin-bottom scale-y-0 rounded-full bg-linear-to-t from-accent-strong to-accent transition-transform duration-300 ease-out group-hover/nav:scale-y-100"
      />
      {active && (
        <span aria-hidden className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent transition-colors group-hover/nav:bg-white" />
      )}
    </>
  );

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-accent-strong focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[72px]">
        <AnimatePresence initial={false}>
          {island ? (
            /* ---------------- Logo island ---------------- */
            <motion.button
              key="island"
              type="button"
              aria-label="Show navigation"
              onClick={openFromIsland}
              onMouseEnter={() => canHover.current && setExpanded(true)}
              initial={{ scale: 0.5, y: -72 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.6, y: -72, transition: { duration: 0.2 } }}
              transition={spring}
              className="pointer-events-auto absolute left-1/2 top-2.5 flex h-[52px] -translate-x-1/2 items-center rounded-full bg-white/90 pl-2 pr-5 shadow-[0_14px_34px_-12px_rgb(225_6_0/0.45),0_2px_6px_-2px_rgb(110_10_15/0.12)] ring-1 ring-accent/15 backdrop-blur-xl backdrop-saturate-150"
            >
              <motion.span layoutId="brand" transition={spring} className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-full bg-accent-soft ring-1 ring-accent/15">
                  <Image src={site.logo} alt="" width={site.logoWidth} height={site.logoHeight} className="h-5 w-auto" />
                </span>
                <span className="flex flex-col items-start whitespace-nowrap leading-none">
                  <span className="font-display text-[15px] font-semibold tracking-[0.08em] text-accent-strong">MECATRONIX</span>
                  <span className="mt-1 font-mono text-[7.5px] tracking-[0.28em] text-accent/75">SOFTWARE DEVELOPMENT</span>
                </span>
              </motion.span>
            </motion.button>
          ) : (
            /* ---------------- Full bar ---------------- */
            <motion.div
              key="bar"
              initial={{ y: -80 }}
              animate={{ y: 0 }}
              exit={{ y: -80, transition: { duration: 0.25 } }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onMouseLeave={() => {
                if (canHover.current && !servicesOpen) setExpanded(false);
              }}
              onFocus={() => setFocusInside(true)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocusInside(false);
              }}
              className={cn(
                // Full white frosted glass
                "pointer-events-auto relative flex h-[72px] border-b bg-linear-to-b from-white/80 to-white/65 shadow-[inset_0_1px_0_rgb(255_255_255/0.9)] backdrop-blur-2xl backdrop-saturate-[1.8] transition-shadow duration-300",
                scrolled || menuOpen
                  ? "border-white/80 shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_12px_30px_-18px_rgb(110_10_15/0.35)]"
                  : "border-white/70",
              )}
            >
              {/* Logo */}
              <div className="flex shrink-0 items-center pl-4 pr-4 sm:pl-6 lg:pr-6 xl:pl-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))]">
                <motion.div layoutId="brand" transition={spring}>
                  <Logo priority tone="brand" />
                </motion.div>
              </div>

              {/* Desktop navigation */}
              <nav aria-label="Main" className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
                <ul className="flex items-center gap-0.5">
                  {mainNav.map((item) => {
                    const active = isActive(pathname, item.href);

                    if (item.children) {
                      return (
                        // Not `relative`: the panel spans the whole bar
                        <li
                          key={item.href}
                          ref={servicesRef}
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
                            className={cn(navItemClass(active), servicesOpen && "text-white")}
                          >
                            {navFill(active)}
                            {servicesOpen && <span aria-hidden className="absolute inset-0 -z-10 rounded-full bg-accent" />}
                            <Roll>{item.label}</Roll>
                            <ChevronDown aria-hidden className={cn("size-3.5 transition-transform duration-300", servicesOpen && "rotate-180")} />
                          </button>

                          {/* Full-width services panel */}
                          <div
                            id={dropdownId}
                            className={cn(
                              "absolute inset-x-0 top-full border-b border-line bg-white shadow-[0_30px_60px_-30px_rgb(110_10_15/0.35)] transition-[opacity,visibility,clip-path] duration-300 ease-out",
                              servicesOpen
                                ? "visible opacity-100 [clip-path:inset(0_0_0_0)]"
                                : "pointer-events-none invisible opacity-0 [clip-path:inset(0_0_100%_0)]",
                            )}
                          >
                            <div className="mx-auto grid max-w-[1320px] grid-cols-[1fr_280px] gap-8 px-10 py-8">
                              <ul className="grid grid-cols-3 gap-3">
                                {item.children.map((child, i) => {
                                  const Icon = serviceIcons[child.slug] ?? Code2;
                                  const here = pathname === child.href;
                                  return (
                                    <li key={child.href}>
                                      <Link
                                        href={child.href}
                                        prefetch={false}
                                        aria-current={here ? "page" : undefined}
                                        className={cn(
                                          "group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-[border-color,translate,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_18px_36px_-18px_rgb(225_6_0/0.6)]",
                                          here ? "border-accent/40 bg-sand" : "border-line bg-white",
                                        )}
                                      >
                                        {/* Red wash rises on hover */}
                                        <span aria-hidden className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-linear-to-t from-accent-strong to-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
                                        <span className="flex items-center justify-between">
                                          <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent transition-colors duration-300 group-hover:bg-white">
                                            <Icon aria-hidden className="size-5" strokeWidth={1.8} />
                                          </span>
                                          <span className="font-mono text-[11px] font-semibold text-accent/50 transition-colors group-hover:text-white/80">
                                            {String(i + 1).padStart(2, "0")}
                                          </span>
                                        </span>
                                        <span className="mt-4 flex items-center gap-1 text-[15px] font-bold text-accent-ink transition-colors duration-300 group-hover:text-white">
                                          {child.label}
                                          <ArrowUpRight aria-hidden className="size-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        </span>
                                        <span className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-muted-ink transition-colors duration-300 group-hover:text-white/85">
                                          {child.summary}
                                        </span>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>

                              <div className="flex flex-col gap-3">
                                <Link
                                  href="/preview"
                                  className="group/cta relative isolate flex flex-1 flex-col overflow-hidden rounded-2xl bg-linear-to-br from-accent via-accent-strong to-wine p-6 text-white"
                                >
                                  <span aria-hidden className="absolute inset-0 -z-10 bg-grid-inverse [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_80%)]" />
                                  <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-white/90">
                                    <Sparkles aria-hidden className="size-3.5" /> Free website preview
                                  </span>
                                  <span className="mt-3 font-display text-[22px] font-bold leading-[1.1] tracking-tight">
                                    See your new website before you commit.
                                  </span>
                                  <span className="mt-2 text-[13px] text-white/85">Preview your own website — free, in 60 seconds.</span>
                                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[13px] font-bold">
                                    Try it free <ArrowRight aria-hidden className="size-4 transition-transform group-hover/cta:translate-x-1" />
                                  </span>
                                </Link>
                                <Link
                                  href="/services"
                                  className="group/all flex items-center justify-between rounded-2xl border border-line px-5 py-3.5 text-[13.5px] font-bold text-accent-ink transition-colors hover:border-accent hover:bg-accent hover:text-white"
                                >
                                  View all services
                                  <ArrowRight aria-hidden className="size-4 transition-transform group-hover/all:translate-x-1" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    }

                    return (
                      <li key={item.href}>
                        <Link href={item.href} aria-current={active ? "page" : undefined} className={navItemClass(active)}>
                          {navFill(active)}
                          <Roll>{item.label}</Roll>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Actions on white, aligned with the site's container */}
              <div className="ml-auto flex shrink-0 items-center gap-2.5 pl-4 pr-3 sm:pr-4 lg:pr-6 xl:pr-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))]">
                <a
                  href={`tel:${contact.phone}`}
                  className="group/tel mr-1 hidden items-center gap-2.5 text-accent-ink 2xl:flex"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-accent ring-1 ring-accent/15 transition-colors group-hover/tel:bg-accent group-hover/tel:text-white">
                    <Phone aria-hidden className="size-4" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">Call us</span>
                    <span className="block text-[14px] font-bold">{contact.phoneDisplay}</span>
                  </span>
                </a>

                <a
                  href={whatsappLink(contact)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  className="hidden size-10 items-center justify-center rounded-full text-accent ring-1 ring-accent/30 transition-[background-color,color,scale] duration-300 hover:scale-105 hover:bg-accent hover:text-white xl:flex"
                >
                  <MessageCircle aria-hidden className="size-[18px]" />
                </a>

                <Link
                  href="/contact"
                  className="group/cta relative isolate hidden h-11 items-center gap-2 overflow-hidden whitespace-nowrap rounded-full bg-accent-strong pl-5 pr-1.5 text-[14px] font-bold text-white shadow-[0_8px_20px_-8px_rgb(225_6_0/0.7)] transition-colors duration-300 sm:inline-flex"
                >
                  <span aria-hidden className="absolute inset-0 -z-10 origin-left scale-x-0 bg-wine transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/cta:scale-x-100" />
                  Let&apos;s Talk
                  <span className="flex size-8 items-center justify-center rounded-full bg-white text-accent transition-[rotate] duration-300 group-hover/cta:-rotate-45">
                    <ArrowRight aria-hidden className="size-4" />
                  </span>
                </Link>

                <button
                  ref={menuButtonRef}
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-expanded={menuOpen}
                  aria-controls="mobile-menu"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  className="flex size-11 items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_20px_-8px_rgb(225_6_0/0.7)] lg:hidden"
                >
                  <span aria-hidden className="relative block h-3 w-[18px]">
                    <span className={cn("absolute left-0 top-0 h-[2px] w-full rounded-full bg-current transition-transform duration-300", menuOpen && "translate-y-[5px] rotate-45")} />
                    <span className={cn("absolute left-0 top-[5px] h-[2px] w-full rounded-full bg-current transition-opacity duration-200", menuOpen && "opacity-0")} />
                    <span className={cn("absolute bottom-0 right-0 h-[2px] rounded-full bg-current transition-[transform,width] duration-300", menuOpen ? "w-full -translate-y-[5px] -rotate-45" : "w-1/2")} />
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ---------- Phone / tablet menu ---------- */}
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!menuOpen}
        className={cn(
          "fixed inset-x-0 bottom-0 top-[72px] z-[49] flex flex-col overflow-y-auto overscroll-contain bg-white transition-[opacity,visibility,clip-path] duration-300 ease-out lg:hidden",
          menuOpen ? "visible opacity-100 [clip-path:inset(0_0_0_0)]" : "invisible opacity-0 [clip-path:inset(0_0_100%_0)]",
        )}
      >
        <nav aria-label="Mobile" className="px-4 pt-2 sm:px-6">
          <ul>
            {mainNav.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className={cn("border-b border-line", menuOpen && "motion-safe:animate-rise")} style={{ animationDelay: `${40 + i * 35}ms` }}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex flex-1 items-center gap-4 py-4 font-display text-[1.6rem] font-bold tracking-tight transition-colors sm:text-[2rem]",
                        active ? "text-accent" : "text-accent-ink hover:text-accent",
                      )}
                    >
                      <span className="w-6 font-mono text-[11px] font-semibold tracking-normal text-accent/50">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                      {active && <span aria-hidden className="ml-auto mr-1 size-2.5 rounded-full bg-accent" />}
                    </Link>
                    {item.children ? (
                      <button
                        type="button"
                        aria-expanded={mobileServicesOpen}
                        aria-controls={mobileServicesId}
                        aria-label={`${mobileServicesOpen ? "Hide" : "Show"} all ${item.label.toLowerCase()}`}
                        onClick={() => setMobileServicesOpen((v) => !v)}
                        className={cn(
                          "ml-2 flex size-11 items-center justify-center rounded-full transition-colors",
                          mobileServicesOpen ? "bg-accent text-white" : "bg-accent-soft text-accent",
                        )}
                      >
                        <ChevronDown aria-hidden className={cn("size-5 transition-transform duration-300", mobileServicesOpen && "rotate-180")} />
                      </button>
                    ) : (
                      !active && <ArrowUpRight aria-hidden className="size-5 text-accent/40" />
                    )}
                  </div>

                  {item.children && (
                    <div
                      id={mobileServicesId}
                      className={cn("grid transition-[grid-template-rows] duration-300 ease-out", mobileServicesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                    >
                      <div className="overflow-hidden" inert={!mobileServicesOpen}>
                        <ul className="mb-4 grid grid-cols-2 gap-2">
                          {item.children.map((child) => {
                            const Icon = serviceIcons[child.slug] ?? Code2;
                            return (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className={cn(
                                    "flex h-full items-center gap-2.5 rounded-xl border border-line p-3 text-[13.5px] font-semibold transition-colors hover:border-accent hover:bg-accent hover:text-white",
                                    pathname === child.href ? "border-accent/40 bg-sand text-accent" : "text-accent-ink",
                                  )}
                                >
                                  <Icon aria-hidden className="size-4 shrink-0" strokeWidth={2} />
                                  {child.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto pt-8">
          <div className="grid grid-cols-2 border-t border-line">
            <a href={`tel:${contact.phone}`} className="flex items-center gap-2.5 px-4 py-4 text-accent-ink transition-colors hover:bg-sand sm:px-6">
              <Phone aria-hidden className="size-4 shrink-0 text-accent" />
              <span className="min-w-0">
                <span className="block text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">Call us</span>
                <span className="block truncate text-[14px] font-bold">{contact.phoneDisplay}</span>
              </span>
            </a>
            <a
              href={whatsappLink(contact)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 border-l border-line px-4 py-4 text-accent-ink transition-colors hover:bg-sand sm:px-6"
            >
              <MessageCircle aria-hidden className="size-4 shrink-0 text-accent" />
              <span className="min-w-0">
                <span className="block text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">Chat</span>
                <span className="block text-[14px] font-bold">WhatsApp</span>
              </span>
            </a>
          </div>
          <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 border-t border-line px-4 py-3.5 text-[13.5px] text-muted-ink hover:text-accent sm:px-6">
            <Mail aria-hidden className="size-4 shrink-0 text-accent" />
            <span className="break-all">{contact.email}</span>
          </a>
          <Link
            href="/contact"
            className="flex h-16 items-center justify-between bg-linear-to-r from-accent to-accent-strong px-4 text-[16px] font-bold text-white sm:px-6"
          >
            Let&apos;s Talk
            <span className="flex size-10 items-center justify-center rounded-full bg-white text-accent">
              <ArrowRight aria-hidden className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </MotionConfig>
  );
}
