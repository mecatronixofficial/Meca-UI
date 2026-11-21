"use client";

import { createContext, useContext, useEffect, useId, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Check, Clock, Loader2, Mail, MapPin, Menu, Minus, Phone, Plus, Quote, ShoppingBag, Star, Trash2, X } from "lucide-react";
import { photoUrl, type PhotoId, type PreviewBrand, type SiteTemplateDef } from "../../data/templates";
import { cn } from "../../lib/cn";
import { onColor } from "./color";
import styles from "./site.module.css";

/**
 * A complete one-page website for a visitor's brand, built from an industry template — and a
 * working one: the menu scrolls to sections, shops have a cart, checkout and order confirmation,
 * clinics and schools take bookings, software sites start trials and factories take quote requests.
 * Sections animate in as they scroll into view.
 *
 * Inside a ScaledFrame thumbnail ([data-thumbnail], inert) it renders still: no reveal, no sticky header.
 *
 * Layout uses container queries (@3xl / @5xl), not media queries, so the tablet and
 * mobile frames in the viewer reflow exactly like a real device would.
 */

const PRICES: Record<string, string[]> = {
  textile: ["₹189 / m", "₹245 / m", "₹160 / m", "₹310 / m"],
  "real-estate": ["₹1.2 Cr", "₹2.8 Cr", "₹64 L", "₹88 L"],
  automotive: ["₹11.4 L", "₹18.9 L", "₹14.2 L", "₹7.6 L"],
};
const DEFAULT_PRICES = ["₹1,499", "₹2,999", "₹899", "₹2,249"];
const SLOTS = ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM", "6:00 PM"];
const DAYS = ["Today", "Tomorrow", "Day after"];
const STATUS = ["Won", "Proposal", "Negotiation", "Qualified", "New"];
/** Commerce templates that sell online; the others (property, cars) take enquiries. */
const CART_SLUGS = new Set(["ecommerce", "textile"]);

/* ---------- Actions shared by every section ---------- */

type FormKind = "quote" | "trial" | "enquiry" | "booking" | "offer" | "contact";
type Section = "features" | "about" | "showcase" | "services" | "process" | "gallery" | "faq" | "cta" | "contact" | "booking";
type CartItem = { name: string; price: string; value: number; tile: number; qty: number };
type Overlay =
  | { type: "cart" }
  | { type: "checkout" }
  | { type: "order"; id: string; items: CartItem[]; total: number; arrives: string }
  | { type: "form"; kind: FormKind; subject?: string }
  | { type: "done"; kind: FormKind; subject?: string };
type Booking = { service: number; day: number; slot: number };

interface SiteActions {
  go: (section: Section) => void;
  primary: () => void;
  open: (kind: FormKind, subject?: string) => void;
  add: (item: Omit<CartItem, "qty">) => void;
  sells: boolean;
  booking: Booking;
  setBooking: (b: Booking) => void;
  sectionId: (s: Section) => string;
}

const Ctx = createContext<SiteActions | null>(null);
const useSite = () => useContext(Ctx)!;

const FORM_COPY: Record<FormKind, { title: string; button: string; success: string; text: (company: string) => string }> = {
  quote: { title: "Request a quote", button: "Send request", success: "Quote request received", text: (c) => `Thanks! The ${c} team will reply with pricing within one working day.` },
  trial: { title: "Start your free trial", button: "Create my workspace", success: "Your workspace is ready", text: (c) => `We've emailed your login link. Welcome to ${c}!` },
  enquiry: { title: "Send an enquiry", button: "Send enquiry", success: "Enquiry sent", text: (c) => `Thank you — someone from ${c} will call you back shortly.` },
  booking: { title: "Confirm your booking", button: "Confirm booking", success: "Booking confirmed", text: (c) => `See you soon! A confirmation SMS from ${c} is on its way.` },
  offer: { title: "Claim your 10% off", button: "Send my code", success: "Your code is on its way", text: () => "Use WELCOME10 at checkout — we've emailed it to you too." },
  contact: { title: "Get in touch", button: "Send message", success: "Message sent", text: (c) => `Thanks for reaching out. ${c} will get back to you today.` },
};

/** What a button label most likely asks for. */
const kindFor = (label: string, fallback: FormKind): FormKind =>
  /quote|sample|estimate/i.test(label) ? "quote"
  : /offer|discount|code/i.test(label) ? "offer"
  : /book|appointment|reserve|visit|table|admission|enrol|class/i.test(label) ? "booking"
  : /trial|demo|start|sign ?up|get started/i.test(label) ? "trial"
  : /enquir|contact|talk|call/i.test(label) ? "contact"
  : fallback;

/** Which section a menu item should scroll to. */
const sectionFor = (label: string, i: number): Section =>
  /contact|support|location|visit us/i.test(label) ? "contact"
  : /about|story|team|doctors|faculty|campus|company/i.test(label) ? "about"
  : /pricing|price|plans|admission|appointment|booking|reserve/i.test(label) ? "cta"
  : /faq|help|docs/i.test(label) ? "faq"
  : /gallery|projects|portfolio|work|rooms/i.test(label) ? "gallery"
  : /service|department|integration|export|fleet|capabilit/i.test(label) ? "services"
  : (["showcase", "features", "services", "gallery"] as const)[i % 4];

const priceValue = (price: string) => {
  const n = parseFloat(price.replace(/[^\d.]/g, "")) || 0;
  return /cr/i.test(price) ? n * 1e7 : /\bL\b/.test(price) ? n * 1e5 : n;
};
const rupees = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

/** Height of the visible area the site scrolls in (a dialog, a frame or the window). */
function visibleHeight(el: HTMLElement) {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const overflow = getComputedStyle(p).overflowY;
    if ((overflow === "auto" || overflow === "scroll") && p.scrollHeight > p.clientHeight) return p.clientHeight;
  }
  const top = parseFloat(getComputedStyle(el).getPropertyValue("--site-top")) || 0;
  return window.innerHeight - top;
}

export function SiteTemplate({ template: t, brand, className, embedded = false }: { template: SiteTemplateDef; brand: PreviewBrand; className?: string; embedded?: boolean }) {
  const company = brand.company.trim() || "Your Company";
  const fill = (text: string) => text.replaceAll("{company}", company);
  const services = brand.services?.map((s) => s.trim()).filter(Boolean).length ? brand.services!.map((s) => s.trim()).filter(Boolean) : t.services;
  const vars = { "--brand": brand.color, "--on-brand": onColor(brand.color) } as CSSProperties;
  const dark = t.style === "app" || t.style === "industrial";
  const phone = brand.phone?.trim() || "+91 98765 43210";
  const email = brand.email?.trim() || `hello@${slugDomain(company)}`;
  const sells = t.style === "commerce" && CART_SLUGS.has(t.slug);

  const uid = useId().replace(/:/g, "");
  const root = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [height, setHeight] = useState(640);
  const [booking, setBooking] = useState<Booking>({ service: 0, day: 1, slot: 1 });
  const count = cart.reduce((n, item) => n + item.qty, 0);

  // Scroll reveal (skipped in thumbnails and for reduced motion). Re-runs when the template changes.
  // Positions are checked directly on every scroll (any scroller, captured at the window) and resize,
  // so it works the same in the full-page dialog, a device frame or the plain window. Anything
  // already scrolled past is shown too, so jumping to a section never leaves gaps above it.
  useEffect(() => {
    const el = root.current;
    if (!el || el.closest("[data-thumbnail]") || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const limit = window.innerHeight * 0.94;
      el.querySelectorAll<HTMLElement>("[data-site-reveal]:not([data-site-shown])").forEach((item) => {
        const box = item.getBoundingClientRect();
        if (box.width > 0 && box.top < limit) item.setAttribute("data-site-shown", "");
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    el.setAttribute("data-anim", "");
    schedule();
    window.addEventListener("scroll", schedule, { capture: true, passive: true });
    window.addEventListener("resize", schedule);
    // Catches the dialog opening (the site goes from hidden to laid out)
    const observer = new ResizeObserver(schedule);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [t.slug]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const measure = () => root.current && setHeight(visibleHeight(root.current));
  const show = (next: Overlay | null) => {
    measure();
    setOverlay(next);
  };
  const notify = (text: string) => {
    measure();
    setToast({ id: Date.now(), text });
  };

  const sectionId = (s: Section) => `${uid}-${s}`;
  const go = (s: Section) => {
    setMenu(false);
    root.current?.querySelector(`#${sectionId(s)}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const open = (kind: FormKind, subject?: string) => show({ type: "form", kind, subject });
  const primary = () => {
    setMenu(false);
    if (t.style === "commerce") go("showcase");
    else if (t.style === "care") go("booking");
    else open(t.style === "app" ? "trial" : "quote");
  };
  const add = (item: Omit<CartItem, "qty">) => {
    setCart((items) => (items.some((i) => i.name === item.name) ? items.map((i) => (i.name === item.name ? { ...i, qty: i.qty + 1 } : i)) : [...items, { ...item, qty: 1 }]));
    notify(`${item.name} added to cart`);
  };
  const setQty = (name: string, qty: number) => setCart((items) => (qty <= 0 ? items.filter((i) => i.name !== name) : items.map((i) => (i.name === name ? { ...i, qty } : i))));

  const actions: SiteActions = { go, primary, open, add, sells, booking, setBooking, sectionId };
  const navLink = cn(
    "relative py-1 transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-[var(--brand)] after:transition-transform after:duration-300 hover:after:scale-x-100",
    dark ? "hover:text-white" : "hover:text-[var(--brand)]",
  );

  return (
    <Ctx.Provider value={actions}>
      <div ref={root} className={cn("@container relative overflow-clip bg-white font-sans text-[#0b0d12] antialiased", styles.site, className)} style={vars}>
        {/* Overlay layer: pinned to the top of whatever the site scrolls in */}
        <div className="sticky top-[var(--site-top,0px)] z-50 h-0">
          {overlay && (
            <OverlayView
              overlay={overlay}
              height={height}
              cart={cart}
              company={company}
              t={t}
              onClose={() => show(null)}
              onShow={show}
              onQty={setQty}
              onOrdered={() => setCart([])}
              onNotify={notify}
            />
          )}
          {toast && (
            <div key={toast.id} role="status" className={cn("absolute left-1/2 z-10 flex items-center gap-2.5 whitespace-nowrap rounded-full bg-[#0b0d12] px-4 py-2.5 text-[13.5px] font-medium text-white shadow-[0_20px_40px_-12px_rgba(11,13,18,0.5)]", styles.toast)} style={{ top: height - 76 }}>
              <span className="grid size-5 place-items-center rounded-full bg-[var(--brand)] text-[var(--on-brand)]">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {toast.text}
            </div>
          )}
        </div>

        {/* Header */}
        <header data-sticky className={cn("sticky top-[var(--site-top,0px)] z-40 border-b backdrop-blur-md", dark ? "border-white/10 bg-[#0b0d12]/90 text-white" : "border-[#eef0f3] bg-white/90")}>
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 @3xl:px-8">
            <button type="button" onClick={() => root.current?.scrollIntoView({ behavior: "smooth", block: "start" })} className="min-w-0 transition-opacity hover:opacity-80">
              <Brand brand={brand} company={company} />
            </button>
            <nav className={cn("hidden items-center gap-7 text-[14px] font-medium @3xl:flex", dark ? "text-white/70" : "text-[#4b5563]")}>
              {t.nav.map((item, i) => (
                <button key={item} type="button" onClick={() => go(sectionFor(item, i))} className={navLink}>
                  {item}
                </button>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-2">
              {sells && (
                <button
                  type="button"
                  onClick={() => show({ type: "cart" })}
                  aria-label={`Cart, ${count} items`}
                  className={cn("relative grid size-10 place-items-center rounded-full border transition-[border-color,color,translate] duration-300 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:text-[var(--brand)]", dark ? "border-white/15" : "border-[#e7e9ee]")}
                >
                  <ShoppingBag className="size-[18px]" />
                  {count > 0 && (
                    <span key={count} className={cn("absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-[var(--brand)] px-1 text-[11px] font-bold leading-5 text-[var(--on-brand)]", styles.bump)}>
                      {count}
                    </span>
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={primary}
                className="group hidden items-center gap-1.5 whitespace-nowrap rounded-full bg-[var(--brand)] px-4 py-2 text-[13px] font-semibold text-[var(--on-brand)] transition-[translate,box-shadow,filter] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-10px_var(--brand)] hover:brightness-110 active:scale-[0.97] @3xl:inline-flex"
              >
                {t.hero.cta}
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={() => setMenu((m) => !m)}
                aria-expanded={menu}
                aria-label="Menu"
                className={cn("grid size-10 shrink-0 place-items-center rounded-xl border transition-colors @3xl:hidden", dark ? "border-white/15 hover:bg-white/10" : "border-[#e7e9ee] hover:bg-[#f4f5f7]")}
              >
                {menu ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
          {menu && (
            <div className={cn("border-t px-5 pb-5 pt-2 @3xl:hidden", dark ? "border-white/10" : "border-[#eef0f3]", styles.menu)}>
              {t.nav.map((item, i) => (
                <button key={item} type="button" onClick={() => go(sectionFor(item, i))} className={cn("flex w-full items-center justify-between border-b py-3 text-left text-[15px] font-medium", dark ? "border-white/10" : "border-[#eef0f3]")}>
                  {item}
                  <ArrowRight className="size-4 opacity-50" />
                </button>
              ))}
              <button type="button" onClick={primary} className="mt-4 w-full rounded-xl bg-[var(--brand)] py-3 text-[14.5px] font-semibold text-[var(--on-brand)]">
                {t.hero.cta}
              </button>
            </div>
          )}
        </header>

        <Hero t={t} brand={brand} company={company} fill={fill} embedded={embedded} />

        {/* Features */}
        <section id={sectionId("features")} className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 @3xl:px-8 @5xl:py-24">
          <SectionHead eyebrow="Why choose us" title={`Why customers choose ${company}`} />
          <div className="mt-10 grid gap-4 @3xl:grid-cols-2 @5xl:grid-cols-4">
            {t.features.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} i={i}>
                <div className="group h-full rounded-2xl border border-[#e7e9ee] bg-white p-6 transition-[translate,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-[color-mix(in_oklab,var(--brand)_40%,white)] hover:shadow-[0_24px_50px_-24px_rgba(11,13,18,0.3)]">
                  <span className="grid size-11 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--brand)_12%,white)] text-[var(--brand)] transition-[background-color,color,rotate] duration-500 group-hover:-rotate-6 group-hover:bg-[var(--brand)] group-hover:text-[var(--on-brand)]">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-[17px] font-semibold">{title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[#5b6170]">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* About */}
        <section id={sectionId("about")} className="mx-auto grid max-w-6xl scroll-mt-20 items-center gap-12 px-5 pb-16 @3xl:px-8 @5xl:grid-cols-2 @5xl:gap-16 @5xl:pb-24">
          <Reveal className="relative">
            <div className="group overflow-hidden rounded-3xl">
              <Photo id={t.photos.about} width={900} alt={`The team at ${company}`} className="aspect-[4/3] w-full transition-transform duration-[1.2s] ease-out group-hover:scale-105 @5xl:aspect-[4/5]" />
            </div>
            <div className="absolute -bottom-5 right-5 rounded-2xl bg-white px-5 py-4 shadow-[0_20px_50px_-20px_rgba(11,13,18,0.45)]">
              <p className="font-display text-[1.8rem] font-bold leading-none text-[var(--brand)]">{t.stats[3]![0]}</p>
              <p className="mt-1.5 text-[13px] text-[#5b6170]">{t.stats[3]![1]}</p>
            </div>
          </Reveal>
          <Reveal i={1}>
            <SectionHead eyebrow="About us" title={fill(t.about.title)} />
            <p className="mt-5 text-[15.5px] leading-relaxed text-[#5b6170]">{brand.description?.trim() || fill(t.about.text)}</p>
            {brand.city?.trim() && (
              <p className="mt-4 flex items-center gap-2 text-[14px] font-medium">
                <MapPin className="size-4 text-[var(--brand)]" /> Proudly serving {brand.city.trim()} and beyond
              </p>
            )}
            <ul className="mt-8 grid gap-3 text-[14.5px] @3xl:grid-cols-2">
              {t.about.points.map((point) => (
                <li key={point} className="group flex items-start gap-3">
                  <span className="mt-px grid size-6 shrink-0 place-items-center rounded-full bg-[var(--brand)] text-[var(--on-brand)] transition-transform duration-300 group-hover:scale-110">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <Showcase t={t} />

        {/* Services */}
        <section id={sectionId("services")} className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 @3xl:px-8 @5xl:py-24">
          <SectionHead eyebrow="Our services" title={`What ${company} offers`} />
          <div className="mt-10 grid gap-3 @3xl:grid-cols-2 @5xl:grid-cols-3">
            {services.slice(0, 6).map((service, i) => (
              <Reveal key={service + i} i={i % 3}>
                <button
                  type="button"
                  onClick={() => open(t.style === "app" ? "trial" : t.style === "care" ? "booking" : "enquiry", service)}
                  className="group flex w-full items-center justify-between gap-3 rounded-xl border border-[#e7e9ee] bg-[#fafbfc] px-5 py-4 text-left transition-[background-color,border-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:bg-white hover:shadow-[0_16px_34px_-20px_rgba(11,13,18,0.35)]"
                >
                  <span className="flex min-w-0 items-center gap-3 text-[15px] font-medium">
                    <span className="font-mono text-[12px] text-[var(--brand)]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="truncate">{service}</span>
                  </span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full text-[#9aa1ad] transition-[background-color,color] duration-300 group-hover:bg-[var(--brand)] group-hover:text-[var(--on-brand)]">
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:-rotate-45" />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id={sectionId("process")} className="scroll-mt-20 bg-[#f4f5f7] py-16 @5xl:py-24">
          <div className="mx-auto max-w-6xl px-5 @3xl:px-8">
            <SectionHead eyebrow="How it works" title={t.process.title} />
            <ol className="mt-12 grid gap-4 @3xl:grid-cols-2 @5xl:grid-cols-4">
              {t.process.steps.map(([title, text], i) => (
                <Reveal key={title} i={i} as="li">
                  <div className="group h-full rounded-2xl border border-[#e2e4e9] bg-white p-6 transition-[translate,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_rgba(11,13,18,0.3)]">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--brand)] font-display text-[15px] font-bold text-[var(--on-brand)] transition-transform duration-500 group-hover:scale-110">{i + 1}</span>
                      {i < t.process.steps.length - 1 && <span aria-hidden className="hidden h-px flex-1 bg-[color-mix(in_oklab,var(--brand)_35%,white)] @5xl:block" />}
                    </div>
                    <h3 className="mt-5 text-[17px] font-semibold">{title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-[#5b6170]">{text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Gallery */}
        <section id={sectionId("gallery")} className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 @3xl:px-8 @5xl:py-24">
          <SectionHead eyebrow="Gallery" title={fill(t.gallery.title)} />
          <div className="mt-10 grid gap-4 @3xl:grid-cols-2 @5xl:grid-cols-[1.35fr_1fr]">
            {t.gallery.items.map(([id, caption], i) => (
              <Reveal
                key={id}
                i={i}
                className={cn(i === 0 ? "@3xl:col-span-2 @5xl:col-span-1 @5xl:row-span-2" : "")}
              >
                <figure className={cn("group relative h-full overflow-hidden rounded-3xl bg-[#eef0f3]", i === 0 ? "aspect-[4/3] @3xl:aspect-[16/8] @5xl:aspect-auto" : "aspect-[4/3] @5xl:aspect-[16/10]")}>
                  <Photo id={id} width={i === 0 ? 1100 : 700} alt={caption} className="absolute inset-0 size-full transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 pb-4 pt-14 text-[15px] font-semibold text-white transition-[padding] duration-500 group-hover:pb-6">{caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Stats band */}
        <section className="bg-[var(--brand)] text-[var(--on-brand)]">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 py-12 @3xl:px-8 @5xl:grid-cols-4">
            {t.stats.map(([value, label], i) => (
              <Reveal key={label} i={i}>
                <p className="font-display text-[2rem] font-bold leading-none tracking-tight @5xl:text-[2.6rem]">{value}</p>
                <p className="mt-2 text-[14px] opacity-80">{label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Testimonial */}
        <Reveal as="section" className="mx-auto max-w-4xl px-5 py-16 text-center @3xl:px-8 @5xl:py-24">
          <Quote className="mx-auto size-9 text-[var(--brand)]" />
          <div className="mt-3 flex justify-center gap-1 text-[#f5a524]">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="size-4 fill-current" />
            ))}
          </div>
          <blockquote className="mt-6 font-display text-[1.35rem] font-medium leading-snug tracking-tight @5xl:text-[1.75rem]">“{t.testimonial.quote}”</blockquote>
          <p className="mt-6 text-[14px] text-[#5b6170]">
            <span className="font-semibold text-[#0b0d12]">{t.testimonial.name}</span> · {t.testimonial.role}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[#9aa1ad]">Sample testimonial</p>
        </Reveal>

        {/* FAQ */}
        <section id={sectionId("faq")} className="mx-auto grid max-w-6xl scroll-mt-20 gap-10 px-5 pb-16 @3xl:px-8 @5xl:grid-cols-[0.8fr_1.2fr] @5xl:pb-24">
          <Reveal>
            <SectionHead eyebrow="FAQ" title="Questions, answered" />
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[#5b6170]">
              Still have a question? Call us on <span className="font-semibold text-[#0b0d12]">{phone}</span> or write to{" "}
              <span className="font-semibold text-[#0b0d12]">{email}</span>.
            </p>
          </Reveal>
          <div className="grid content-start gap-3">
            {t.faqs.map(([question, answer], i) => (
              <Reveal key={question} i={i}>
                <details open={i === 0} className="group rounded-2xl border border-[#e7e9ee] bg-white px-5 py-4 transition-[border-color,background-color] duration-300 hover:border-[color-mix(in_oklab,var(--brand)_40%,white)] open:bg-[#fafbfc]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15.5px] font-semibold [&::-webkit-details-marker]:hidden">
                    {question}
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[color-mix(in_oklab,var(--brand)_12%,white)] text-[var(--brand)] transition-colors group-open:bg-[var(--brand)] group-open:text-[var(--on-brand)]">
                      <Plus className="size-4 transition-transform duration-300 group-open:rotate-45" />
                    </span>
                  </summary>
                  <p className="mt-3 pr-10 text-[14.5px] leading-relaxed text-[#5b6170]">{answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id={sectionId("cta")} className="scroll-mt-20 px-5 pb-16 @3xl:px-8 @5xl:pb-24">
          <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#0b0d12] px-7 py-12 text-white @5xl:px-14 @5xl:py-16">
            <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full bg-[var(--brand)] opacity-40 blur-3xl" />
            <div className="relative flex flex-col gap-6 @5xl:flex-row @5xl:items-center @5xl:justify-between">
              <div>
                <h2 className="font-display text-[1.8rem] font-bold leading-tight tracking-tight @5xl:text-[2.3rem]">{t.cta.title}</h2>
                <p className="mt-3 max-w-xl text-[15px] text-white/70">{t.cta.text}</p>
              </div>
              <PrimaryButton onClick={() => (t.style === "care" ? go("booking") : open(kindFor(t.cta.button, t.style === "app" ? "trial" : "contact")))} className="self-start @5xl:self-auto">
                {t.cta.button}
              </PrimaryButton>
            </div>
          </Reveal>
        </section>

        {/* Footer */}
        <footer id={sectionId("contact")} className="scroll-mt-20 border-t border-[#e7e9ee] bg-[#fafbfc]">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 @3xl:grid-cols-[1.3fr_1fr_1fr] @3xl:px-8">
            <div>
              <Brand brand={brand} company={company} />
              <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-[#5b6170]">{brand.tagline?.trim() || t.blurb}</p>
              <button
                type="button"
                onClick={() => open("contact")}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#d9dce3] px-4 py-2 text-[13.5px] font-semibold transition-[border-color,color,translate] duration-300 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                <Mail className="size-4" /> Send us a message
              </button>
            </div>
            <div>
              <p className="text-[13px] font-semibold">Explore</p>
              <ul className="mt-3 grid gap-2 text-[14px] text-[#5b6170]">
                {t.nav.map((item, i) => (
                  <li key={item}>
                    <button type="button" onClick={() => go(sectionFor(item, i))} className="transition-[color,padding] duration-300 hover:pl-1 hover:text-[var(--brand)]">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[13px] font-semibold">Contact</p>
              <ul className="mt-3 grid gap-2.5 text-[14px] text-[#5b6170]">
                <ContactLine icon={<Phone className="size-4" />}>{phone}</ContactLine>
                <ContactLine icon={<Mail className="size-4" />}>{email}</ContactLine>
                <ContactLine icon={<MapPin className="size-4" />}>{brand.city?.trim() || "Your city"}</ContactLine>
              </ul>
            </div>
          </div>
          <p className="border-t border-[#e7e9ee] px-5 py-5 text-center text-[12.5px] text-[#9aa1ad]">
            © {new Date().getFullYear()} {company}. All rights reserved. · Sample photos from Pexels
          </p>
        </footer>
      </div>
    </Ctx.Provider>
  );
}

/* ---------- Pieces ---------- */

/** Fades and lifts its content in when it scrolls into view; `i` staggers siblings. */
function Reveal({ i = 0, as: Tag = "div", className, children }: { i?: number; as?: "div" | "li" | "section"; className?: string; children: ReactNode }) {
  return (
    <Tag data-site-reveal className={className} style={{ "--d": `${i * 90}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}

function PrimaryButton({ onClick, children, className, type = "button" }: { onClick?: () => void; children: ReactNode; className?: string; type?: "button" | "submit" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3.5 text-[15px] font-semibold text-[var(--on-brand)] shadow-[0_10px_30px_-10px_var(--brand)] transition-[translate,box-shadow,filter] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_var(--brand)] hover:brightness-110 active:translate-y-0 active:scale-[0.98]",
        className,
      )}
    >
      {children} <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
}

function Brand({ brand, company }: { brand: PreviewBrand; company: string }) {
  const initials = company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      {brand.logoUrl ? (
        // Visitor's logo: a blob: URL while editing, a storage URL afterwards
        // eslint-disable-next-line @next/next/no-img-element
        <img src={brand.logoUrl} alt={`${company} logo`} className="h-9 w-auto max-w-[120px] shrink-0 rounded-md object-contain" />
      ) : (
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--brand)] font-display text-[14px] font-bold text-[var(--on-brand)]">{initials || "Co"}</span>
      )}
      <span className="truncate font-display text-[17px] font-bold tracking-tight">{company}</span>
    </span>
  );
}

/** A stock photo for the template (see photoUrl). Plain <img> so the template renders anywhere. */
function Photo({ id, width, alt, className, eager }: { id: PhotoId; width: number; alt: string; className?: string; eager?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photoUrl(id, width)} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className={cn("object-cover", className)} />
  );
}

function SectionHead({ eyebrow, title, light }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <Reveal className="max-w-2xl">
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">{eyebrow}</p>
      <h2 className={cn("mt-3 font-display text-[1.75rem] font-bold leading-tight tracking-tight @5xl:text-[2.4rem]", light && "text-white")}>{title}</h2>
    </Reveal>
  );
}

function ContactLine({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="group flex items-center gap-2.5">
      <span className="text-[var(--brand)] transition-transform duration-300 group-hover:scale-110">{icon}</span>
      <span className="truncate transition-colors group-hover:text-[#0b0d12]">{children}</span>
    </li>
  );
}

const slugDomain = (company: string) => `${company.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 20) || "company"}.com`;

function Buttons({ t, light }: { t: SiteTemplateDef; light?: boolean }) {
  const { primary, go } = useSite();
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <PrimaryButton onClick={primary}>{t.hero.cta}</PrimaryButton>
      <button
        type="button"
        onClick={() => go(t.style === "commerce" ? "about" : "services")}
        className={cn(
          "inline-flex items-center rounded-full border px-6 py-3.5 text-[15px] font-semibold transition-[background-color,border-color,color,translate] duration-300 hover:-translate-y-0.5",
          light ? "border-white/25 text-white hover:border-white/60 hover:bg-white/10" : "border-[#d9dce3] text-[#0b0d12] hover:border-[var(--brand)] hover:text-[var(--brand)]",
        )}
      >
        {t.hero.secondary}
      </button>
    </div>
  );
}

/* ---------- Heroes (one per layout family) ---------- */

function Hero({ t, brand, company, fill, embedded }: { t: SiteTemplateDef; brand: PreviewBrand; company: string; fill: (s: string) => string; embedded: boolean }) {
  const Heading = embedded ? "h2" : "h1";
  const { add, sells, open, sectionId } = useSite();
  const Icon = t.icon;
  const title = fill(t.hero.title);
  const text = brand.tagline?.trim() ? `${brand.tagline.trim()}. ${t.hero.text}` : t.hero.text;

  if (t.style === "app") {
    return (
      <section className="relative overflow-hidden bg-[#0b0d12] text-white">
        <div aria-hidden className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[var(--brand)] opacity-30 blur-[110px]" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-5 pt-16 text-center @3xl:px-8 @5xl:pt-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12.5px] text-white/80">
              <span className="size-1.5 animate-pulse rounded-full bg-[var(--brand)]" /> {t.hero.eyebrow}
            </span>
            <Heading className="mx-auto mt-6 max-w-3xl font-display text-[2.3rem] font-bold leading-[1.05] tracking-tight @3xl:text-[3.2rem] @5xl:text-[4rem]">{title}</Heading>
            <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-white/70 @5xl:text-[18px]">{text}</p>
            <div className="flex justify-center">
              <Buttons t={t} light />
            </div>
          </Reveal>
          <Reveal i={2} className="relative mx-auto mt-14 max-w-5xl [perspective:1600px]">
            <div className="origin-bottom rounded-t-2xl border border-white/10 bg-[#11141b] p-2 shadow-[0_-20px_80px_-30px_var(--brand)] transition-transform duration-700 hover:[transform:rotateX(0deg)] @5xl:[transform:rotateX(8deg)]">
              <Dashboard t={t} company={company} />
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  if (t.style === "commerce") {
    const prices = PRICES[t.slug] ?? DEFAULT_PRICES;
    return (
      <section className="relative overflow-hidden bg-[#faf7f2]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 @3xl:px-8 @5xl:grid-cols-2 @5xl:py-24">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">{t.hero.eyebrow}</p>
            <Heading className="mt-5 font-display text-[2.3rem] font-bold leading-[1.05] tracking-tight @3xl:text-[3.1rem] @5xl:text-[3.6rem]">{title}</Heading>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-[#5b6170]">{text}</p>
            <Buttons t={t} />
          </Reveal>
          <Reveal i={2} className="relative">
            <div className="group overflow-hidden rounded-[2rem]">
              <Photo id={t.photos.hero} width={1000} eager alt={`${t.name} at ${company}`} className="aspect-[4/3] w-full transition-transform duration-[1.4s] ease-out group-hover:scale-105 @5xl:aspect-[4/5]" />
            </div>
            {/* Featured item */}
            <div className="absolute inset-x-4 bottom-4 flex items-center gap-4 rounded-2xl bg-white/95 p-4 shadow-[0_20px_50px_-20px_rgba(11,13,18,0.5)] backdrop-blur transition-transform duration-500 hover:-translate-y-1 @3xl:right-auto @3xl:w-[320px] @5xl:-left-8 @5xl:bottom-10">
              <span className="grid size-14 shrink-0 place-items-center rounded-xl" style={{ background: tileBackground(0) }}>
                <Icon className="size-7 text-[var(--brand)]" strokeWidth={1.6} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">Featured</p>
                <p className="truncate text-[15px] font-semibold">{t.showcase.items[0]}</p>
                <p className="text-[13px] text-[#5b6170]">{prices[0]}</p>
              </div>
              <button
                type="button"
                aria-label={sells ? `Add ${t.showcase.items[0]} to cart` : `Enquire about ${t.showcase.items[0]}`}
                onClick={() => (sells ? add({ name: t.showcase.items[0]!, price: prices[0]!, value: priceValue(prices[0]!), tile: 0 }) : open("enquiry", t.showcase.items[0]))}
                className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--brand)] text-[var(--on-brand)] transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_var(--brand)] active:scale-95"
              >
                {sells ? <Plus className="size-5" /> : <ArrowRight className="size-4" />}
              </button>
            </div>
            {/* Headline stat */}
            <div className="absolute right-4 top-4 rounded-2xl bg-white px-4 py-3 shadow-[0_20px_50px_-20px_rgba(11,13,18,0.5)] @5xl:-right-5 @5xl:top-10">
              <p className="font-display text-[1.35rem] font-bold leading-none text-[var(--brand)]">{t.stats[0]![0]}</p>
              <p className="mt-1 text-[12px] text-[#5b6170]">{t.stats[0]![1]}</p>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  if (t.style === "care") {
    return (
      <section className="relative overflow-hidden bg-[color-mix(in_oklab,var(--brand)_7%,white)]">
        <div aria-hidden className="absolute -right-32 -top-32 size-[520px] rounded-full bg-[var(--brand)] opacity-15 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 @3xl:px-8 @5xl:grid-cols-[1.15fr_0.85fr] @5xl:py-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--brand)] shadow-sm">
              <Icon className="size-3.5" /> {t.hero.eyebrow}
            </span>
            <Heading className="mt-6 font-display text-[2.3rem] font-bold leading-[1.05] tracking-tight @3xl:text-[3.1rem] @5xl:text-[3.7rem]">{title}</Heading>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-[#5b6170]">{text}</p>
            <Buttons t={t} />
            <div className="mt-10 flex flex-wrap gap-6">
              {t.stats.slice(0, 3).map(([value, label]) => (
                <div key={label}>
                  <p className="font-display text-[1.6rem] font-bold leading-none">{value}</p>
                  <p className="mt-1 text-[13px] text-[#5b6170]">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal i={2} className="relative">
            <div className="group overflow-hidden rounded-[2rem]">
              <Photo id={t.photos.hero} width={1000} eager alt={`${t.name} at ${company}`} className="aspect-[4/3] w-full transition-transform duration-[1.4s] ease-out group-hover:scale-105 @5xl:aspect-[4/5]" />
            </div>
            <div id={sectionId("booking")} className="relative -mt-16 scroll-mt-24 px-4 @3xl:ml-auto @3xl:max-w-sm @5xl:absolute @5xl:-left-10 @5xl:bottom-8 @5xl:mt-0 @5xl:w-[310px] @5xl:px-0">
              <BookingCard t={t} />
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  // industrial
  return (
    <section className="relative overflow-hidden bg-[#0b0d12] text-white">
      <Photo id={t.photos.hero} width={1600} eager alt="" className="absolute inset-0 size-full" />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,13,18,0.95)_0%,rgba(11,13,18,0.82)_50%,rgba(11,13,18,0.6)_100%)]" />
      <div aria-hidden className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.035)_0_2px,transparent_2px_26px)]" />
      <div aria-hidden className="absolute -bottom-40 -left-20 size-[520px] rounded-full bg-[var(--brand)] opacity-25 blur-[100px]" />
      <div className="relative mx-auto max-w-6xl px-5 py-16 @3xl:px-8 @5xl:py-28">
        <Reveal>
          <p className="inline-flex items-center gap-2 border-l-4 border-[var(--brand)] pl-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-white/80">{t.hero.eyebrow}</p>
          <Heading className="mt-6 max-w-4xl font-display text-[2.4rem] font-bold uppercase leading-[1] tracking-tight @3xl:text-[3.4rem] @5xl:text-[4.4rem]">{title}</Heading>
          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/70 @5xl:text-[18px]">{text}</p>
          <Buttons t={t} light />
        </Reveal>
        <div className="mt-14 grid grid-cols-2 border-t border-white/15 @5xl:grid-cols-4">
          {t.stats.map(([value, label], i) => (
            <Reveal key={label} i={i + 1} className="group border-b border-white/10 py-6 pr-4 @5xl:border-b-0">
              <p className="font-display text-[1.9rem] font-bold leading-none text-[var(--brand)] transition-transform duration-500 group-hover:-translate-y-1 @5xl:text-[2.4rem]">{value}</p>
              <p className="mt-2 text-[13px] uppercase tracking-wider text-white/60">{label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Showcases ---------- */

function Showcase({ t }: { t: SiteTemplateDef }) {
  const { add, sells, open, setBooking, booking, sectionId } = useSite();
  const [added, setAdded] = useState<string | null>(null);
  const s = t.showcase;
  const Icon = t.icon;
  const id = sectionId("showcase");

  if (t.style === "commerce") {
    const prices = PRICES[t.slug] ?? DEFAULT_PRICES;
    return (
      <section id={id} className="scroll-mt-20 bg-[#fafbfc] py-16 @5xl:py-24">
        <div className="mx-auto max-w-6xl px-5 @3xl:px-8">
          <SectionHead eyebrow={s.eyebrow} title={s.title} />
          <div className="mt-10 grid grid-cols-2 gap-4 @5xl:grid-cols-4">
            {s.items.map((item, i) => {
              const price = prices[i % prices.length]!;
              const isAdded = added === item;
              return (
                <Reveal key={item} i={i % 4}>
                  <div className="group h-full overflow-hidden rounded-2xl border border-[#e7e9ee] bg-white transition-[translate,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-[color-mix(in_oklab,var(--brand)_35%,white)] hover:shadow-[0_24px_50px_-24px_rgba(11,13,18,0.35)]">
                    <div className="relative grid aspect-[4/3] place-items-center overflow-hidden" style={{ background: tileBackground(i + 1) }}>
                      <Icon className="size-14 text-[var(--brand)] opacity-60 transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-125" strokeWidth={1.2} />
                      {i === 0 && <span className="absolute left-3 top-3 rounded-full bg-[var(--brand)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--on-brand)]">Bestseller</span>}
                    </div>
                    <div className="p-4">
                      <p className="text-[14.5px] font-semibold leading-snug">{item}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-[14px] font-semibold text-[var(--brand)]">{price}</p>
                        <span className="flex items-center gap-1 text-[12px] text-[#5b6170]">
                          <Star className="size-3.5 fill-[#f5a524] text-[#f5a524]" /> 4.{8 - (i % 3)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!sells) return open("enquiry", item);
                          add({ name: item, price, value: priceValue(price), tile: i + 1 });
                          setAdded(item);
                          setTimeout(() => setAdded((a) => (a === item ? null : a)), 1400);
                        }}
                        className={cn(
                          "mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13.5px] font-semibold transition-[background-color,color,box-shadow] duration-300 active:scale-[0.98]",
                          isAdded
                            ? "bg-emerald-500 text-white"
                            : "bg-[color-mix(in_oklab,var(--brand)_10%,white)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-[var(--on-brand)] hover:shadow-[0_10px_24px_-10px_var(--brand)]",
                        )}
                      >
                        {isAdded ? <Check className="size-4" strokeWidth={3} /> : sells ? <ShoppingBag className="size-4" /> : <ArrowRight className="size-4" />}
                        {isAdded ? "Added" : sells ? "Add to cart" : "Enquire now"}
                      </button>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (t.style === "care") {
    return (
      <section id={id} className="scroll-mt-20 bg-[#fafbfc] py-16 @5xl:py-24">
        <div className="mx-auto max-w-6xl px-5 @3xl:px-8">
          <SectionHead eyebrow={s.eyebrow} title={s.title} />
          <p className="mt-3 text-[15px] text-[#5b6170]">{s.text}</p>
          <div className="mt-10 grid gap-4 @3xl:grid-cols-2 @5xl:grid-cols-4">
            {s.items.map((item, i) => (
              <Reveal key={item} i={i % 4}>
                <div className="group h-full rounded-2xl border border-[#e7e9ee] bg-white p-5 transition-[translate,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-[color-mix(in_oklab,var(--brand)_35%,white)] hover:shadow-[0_24px_50px_-24px_rgba(11,13,18,0.3)]">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-[color-mix(in_oklab,var(--brand)_12%,white)] text-[var(--brand)] transition-[background-color,color] duration-300 group-hover:bg-[var(--brand)] group-hover:text-[var(--on-brand)]">
                      <Icon className="size-5" />
                    </span>
                    <p className="text-[15px] font-semibold">{item}</p>
                  </div>
                  <p className="mt-4 flex items-center gap-1.5 text-[12.5px] text-[#5b6170]">
                    <Clock className="size-3.5" /> Next available — tap a time
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SLOTS.slice(i % 2, (i % 2) + 3).map((slot) => {
                      const slotIndex = SLOTS.indexOf(slot);
                      const picked = booking.service === i % s.items.length && booking.slot === slotIndex && booking.day === 0;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setBooking({ service: i, day: 0, slot: slotIndex });
                            open("booking", `${item} · Today · ${slot}`);
                          }}
                          className={cn(
                            "rounded-lg border px-2.5 py-1.5 text-[12.5px] font-medium transition-[background-color,border-color,color,translate] duration-300 hover:-translate-y-0.5",
                            picked ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--on-brand)]" : "border-[#e7e9ee] text-[#374151] hover:border-[var(--brand)] hover:text-[var(--brand)]",
                          )}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (t.style === "industrial") {
    return (
      <section id={id} className="scroll-mt-20 bg-[#f4f5f7] py-16 @5xl:py-24">
        <div className="mx-auto max-w-6xl px-5 @3xl:px-8">
          <SectionHead eyebrow={s.eyebrow} title={s.title} />
          <p className="mt-3 text-[15px] text-[#5b6170]">{s.text}</p>
          <ol className="mt-12 grid gap-4 @3xl:grid-cols-3 @5xl:grid-cols-5">
            {s.items.map((step, i) => (
              <Reveal key={step} i={i} as="li">
                <div className="group relative h-full overflow-hidden rounded-2xl border border-[#e2e4e9] bg-white p-5 transition-[translate,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_rgba(11,13,18,0.3)]">
                  <span className="font-display text-[2.2rem] font-bold leading-none text-[var(--brand)] transition-transform duration-500 group-hover:scale-110">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-4 text-[15px] font-semibold">{step}</p>
                  <span aria-hidden className="absolute inset-x-5 top-0 h-1 rounded-b bg-[var(--brand)] transition-[left,right] duration-500 group-hover:inset-x-0" style={{ opacity: 0.25 + (i / s.items.length) * 0.75 }} />
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  // app: detailed data table
  return (
    <section id={id} className="scroll-mt-20 bg-[#fafbfc] py-16 @5xl:py-24">
      <div className="mx-auto max-w-6xl px-5 @3xl:px-8">
        <SectionHead eyebrow={s.eyebrow} title={s.title} />
        <p className="mt-3 text-[15px] text-[#5b6170]">{s.text}</p>
        <Reveal className="mt-10 overflow-hidden rounded-2xl border border-[#e7e9ee] bg-white">
          {s.items.map((item, i) => (
            <button
              key={item}
              type="button"
              onClick={() => open("trial", item)}
              className="group flex w-full items-center justify-between gap-4 border-b border-[#eef0f3] px-5 py-4 text-left transition-colors duration-300 last:border-0 hover:bg-[color-mix(in_oklab,var(--brand)_5%,white)]"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[color-mix(in_oklab,var(--brand)_12%,white)] font-display text-[13px] font-bold text-[var(--brand)] transition-[background-color,color] duration-300 group-hover:bg-[var(--brand)] group-hover:text-[var(--on-brand)]">
                  {item[0]}
                </span>
                <span className="truncate text-[14.5px] font-medium transition-transform duration-300 group-hover:translate-x-1">{item}</span>
              </span>
              <span className="hidden text-[14px] text-[#5b6170] @3xl:block">₹{(4.2 + i * 1.7).toFixed(1)}L</span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold",
                  i === 0 ? "bg-[var(--brand)] text-[var(--on-brand)]" : "bg-[color-mix(in_oklab,var(--brand)_10%,white)] text-[var(--brand)]",
                )}
              >
                {STATUS[i % STATUS.length]}
              </span>
            </button>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/** Product dashboard mock for app-style heroes; the sidebar switches views. */
function Dashboard({ t, company }: { t: SiteTemplateDef; company: string }) {
  const [tab, setTab] = useState(0);
  const tabs = ["Overview", ...t.nav.slice(0, 4)];
  const shift = tab * 7;
  return (
    <div className="grid overflow-hidden rounded-xl bg-[#0f1219] text-left @3xl:grid-cols-[180px_1fr]">
      <aside className="hidden border-r border-white/5 p-4 @3xl:block">
        <p className="truncate font-display text-[13px] font-bold text-white">{company}</p>
        <ul className="mt-5 grid gap-1 text-[12.5px] text-white/50">
          {tabs.map((item, i) => (
            <li key={item}>
              <button
                type="button"
                onClick={() => setTab(i)}
                className={cn("w-full rounded-md px-2.5 py-2 text-left transition-colors duration-300", i === tab ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white/80")}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div key={tab} className={cn("p-4 @5xl:p-6", styles.backdrop)}>
        <div className="grid grid-cols-2 gap-3 @5xl:grid-cols-4">
          {t.stats.map(([value, label], i) => (
            <div key={label} className="rounded-lg border border-white/5 bg-white/[0.03] p-3 transition-colors duration-300 hover:border-[var(--brand)]/40 hover:bg-white/[0.06]">
              <p className="truncate text-[11px] text-white/45">{label}</p>
              <p className="mt-1.5 font-display text-[18px] font-bold text-white">{value}</p>
              <p className={cn("mt-1 text-[11px]", i % 3 === 2 ? "text-white/40" : "text-emerald-400")}>{i % 3 === 2 ? "steady" : `▲ ${8 + i * 3 + shift}%`}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border border-white/5 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between text-[11px] text-white/45">
            <span>{tabs[tab]} · performance</span>
            <span>Last 12 weeks</span>
          </div>
          <svg viewBox="0 0 400 110" className="mt-2 h-28 w-full" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id={`fill-${t.slug}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="var(--brand)" stopOpacity="0.45" />
                <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`M0 90 C40 ${82 - shift} 60 70 100 ${72 - shift} S160 50 200 ${54 - shift / 2} S260 30 300 36 S360 14 400 18 L400 110 L0 110 Z`} fill={`url(#fill-${t.slug})`} />
            <path d={`M0 90 C40 ${82 - shift} 60 70 100 ${72 - shift} S160 50 200 ${54 - shift / 2} S260 30 300 36 S360 14 400 18`} fill="none" stroke="var(--brand)" strokeWidth="2.5" />
            <path d="M0 100 C50 96 90 92 130 90 S210 80 250 82 S330 70 400 64" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/** Booking widget for care-style heroes: pick a service, day and time, then confirm. */
function BookingCard({ t }: { t: SiteTemplateDef }) {
  const { booking, setBooking, open } = useSite();
  const items = t.showcase.items;
  const service = items[booking.service % items.length]!;
  return (
    <div className="relative rounded-3xl border border-white bg-white/90 p-6 shadow-[0_30px_80px_-30px_rgba(11,13,18,0.35)] backdrop-blur">
      <p className="font-display text-[19px] font-bold">{t.hero.cta}</p>
      <p className="mt-1 text-[13.5px] text-[#5b6170]">Takes less than a minute</p>
      <label className="mt-5 block rounded-xl border border-[#e7e9ee] bg-white px-4 py-2.5 transition-colors focus-within:border-[var(--brand)] hover:border-[#cfd3db]">
        <span className="block text-[11px] text-[#9aa1ad]">{t.showcase.eyebrow === "Classes" ? "Class" : "Service"}</span>
        <select
          value={booking.service % items.length}
          onChange={(e) => setBooking({ ...booking, service: Number(e.target.value) })}
          className="w-full cursor-pointer bg-transparent text-[14px] font-medium outline-none"
        >
          {items.map((item, i) => (
            <option key={item} value={i}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {DAYS.map((day, i) => (
          <button
            key={day}
            type="button"
            onClick={() => setBooking({ ...booking, day: i })}
            className={cn("rounded-lg border py-2 text-[12.5px] font-medium transition-colors duration-300", i === booking.day ? "border-[#0b0d12] bg-[#0b0d12] text-white" : "border-[#e7e9ee] hover:border-[#0b0d12]")}
          >
            {day}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[12.5px] font-medium text-[#5b6170]">Available times</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {SLOTS.slice(0, 3).map((slot, i) => (
          <button
            key={slot}
            type="button"
            onClick={() => setBooking({ ...booking, slot: i })}
            className={cn(
              "rounded-lg border py-2 text-center text-[12.5px] font-medium transition-[background-color,border-color,color,translate] duration-300 hover:-translate-y-0.5",
              i === booking.slot ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--on-brand)]" : "border-[#e7e9ee] hover:border-[var(--brand)] hover:text-[var(--brand)]",
            )}
          >
            {slot}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => open("booking", `${service} · ${DAYS[booking.day]} · ${SLOTS[booking.slot]}`)}
        className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b0d12] py-3.5 text-[14.5px] font-semibold text-white transition-[background-color,translate] duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand)] hover:text-[var(--on-brand)] active:scale-[0.98]"
      >
        Confirm booking <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
}

/* ---------- Overlays: cart, checkout, order confirmation, forms ---------- */

function OverlayView({
  overlay,
  height,
  cart,
  company,
  t,
  onClose,
  onShow,
  onQty,
  onOrdered,
  onNotify,
}: {
  overlay: Overlay;
  height: number;
  cart: CartItem[];
  company: string;
  t: SiteTemplateDef;
  onClose: () => void;
  onShow: (o: Overlay) => void;
  onQty: (name: string, qty: number) => void;
  onOrdered: () => void;
  onNotify: (text: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const subtotal = cart.reduce((sum, item) => sum + item.value * item.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 49;
  const drawer = overlay.type === "cart" || overlay.type === "checkout";

  const submit = (e: FormEvent<HTMLFormElement>, done: () => void) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      done();
    }, 1100);
  };

  return (
    <div className="absolute inset-x-0 top-0 z-0 overflow-hidden" style={{ height }} role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" onClick={onClose} className={cn("absolute inset-0 bg-[#0b0d12]/55 backdrop-blur-[3px]", styles.backdrop)} />

      {drawer ? (
        <div className={cn("absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-white shadow-[-30px_0_80px_-30px_rgba(11,13,18,0.5)]", styles.drawer)}>
          <div className="flex items-center justify-between border-b border-[#eef0f3] px-5 py-4">
            <p className="font-display text-[18px] font-bold">{overlay.type === "cart" ? `Your cart (${cart.reduce((n, i) => n + i.qty, 0)})` : "Checkout"}</p>
            <CloseButton onClick={onClose} />
          </div>

          {overlay.type === "cart" ? (
            cart.length === 0 ? (
              <div className="grid flex-1 place-items-center px-6 text-center">
                <div>
                  <span className="mx-auto grid size-16 place-items-center rounded-full bg-[color-mix(in_oklab,var(--brand)_10%,white)] text-[var(--brand)]">
                    <ShoppingBag className="size-7" />
                  </span>
                  <p className="mt-4 text-[16px] font-semibold">Your cart is empty</p>
                  <p className="mt-1 text-[14px] text-[#5b6170]">Add a few favourites and they&apos;ll show up here.</p>
                  <button type="button" onClick={onClose} className="mt-5 rounded-full bg-[var(--brand)] px-5 py-2.5 text-[14px] font-semibold text-[var(--on-brand)] transition-transform hover:-translate-y-0.5">
                    Start shopping
                  </button>
                </div>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-[#eef0f3] overflow-y-auto px-5">
                  {cart.map((item) => (
                    <li key={item.name} className="flex items-center gap-3 py-4">
                      <span className="grid size-14 shrink-0 place-items-center rounded-xl" style={{ background: tileBackground(item.tile) }}>
                        <t.icon className="size-6 text-[var(--brand)]" strokeWidth={1.5} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14.5px] font-semibold">{item.name}</p>
                        <p className="text-[13px] text-[#5b6170]">{item.price}</p>
                        <div className="mt-2 inline-flex items-center rounded-full border border-[#e7e9ee]">
                          <QtyButton label="Decrease" onClick={() => onQty(item.name, item.qty - 1)}>
                            <Minus className="size-3.5" />
                          </QtyButton>
                          <span className="w-7 text-center text-[13.5px] font-semibold">{item.qty}</span>
                          <QtyButton label="Increase" onClick={() => onQty(item.name, item.qty + 1)}>
                            <Plus className="size-3.5" />
                          </QtyButton>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[14.5px] font-semibold">{rupees(item.value * item.qty)}</p>
                        <button type="button" onClick={() => onQty(item.name, 0)} aria-label={`Remove ${item.name}`} className="mt-2 text-[#9aa1ad] transition-colors hover:text-red-500">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-[#eef0f3] bg-[#fafbfc] px-5 py-4">
                  <Totals subtotal={subtotal} shipping={shipping} />
                  <button
                    type="button"
                    onClick={() => onShow({ type: "checkout" })}
                    className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] py-3.5 text-[15px] font-semibold text-[var(--on-brand)] transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_var(--brand)] active:scale-[0.98]"
                  >
                    Checkout <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </>
            )
          ) : (
            <form
              className="flex flex-1 flex-col overflow-hidden"
              onSubmit={(e) =>
                submit(e, () => {
                  const id = `${company.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "OR"}-${Math.floor(10000 + Math.random() * 90000)}`;
                  const arrives = new Date(Date.now() + 3 * 86400000).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
                  onShow({ type: "order", id, items: cart, total: subtotal + shipping, arrives });
                  onOrdered();
                })
              }
            >
              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                <Field label="Full name" name="name" placeholder="Priya Raman" required />
                <Field label="Mobile number" name="phone" type="tel" placeholder="+91 98765 43210" required />
                <Field label="Delivery address" name="address" placeholder="12, Race Course Road, Coimbatore 641018" textarea required />
                <fieldset>
                  <legend className="text-[12.5px] font-medium text-[#5b6170]">Payment</legend>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {["UPI", "Card", "Cash on delivery"].map((method, i) => (
                      <label key={method} className="cursor-pointer">
                        <input type="radio" name="payment" defaultChecked={i === 0} className="peer sr-only" />
                        <span className="block rounded-xl border border-[#e7e9ee] px-2 py-2.5 text-center text-[12.5px] font-semibold transition-colors peer-checked:border-[var(--brand)] peer-checked:bg-[color-mix(in_oklab,var(--brand)_8%,white)] peer-checked:text-[var(--brand)] hover:border-[#cfd3db]">
                          {method}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
              <div className="border-t border-[#eef0f3] bg-[#fafbfc] px-5 py-4">
                <Totals subtotal={subtotal} shipping={shipping} />
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => onShow({ type: "cart" })} className="rounded-xl border border-[#d9dce3] px-4 text-[14px] font-semibold transition-colors hover:bg-white">
                    Back
                  </button>
                  <SubmitButton busy={busy}>Place order · {rupees(subtotal + shipping)}</SubmitButton>
                </div>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center overflow-y-auto p-4">
          <div className={cn("relative w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_40px_100px_-30px_rgba(11,13,18,0.6)] @3xl:p-8", styles.modal)}>
            <CloseButton onClick={onClose} className="absolute right-4 top-4" />

            {overlay.type === "order" && (
              <div className="text-center">
                <SuccessMark />
                <h3 className="mt-5 font-display text-[1.6rem] font-bold leading-tight">Order placed successfully!</h3>
                <p className="mt-2 text-[14.5px] text-[#5b6170]">
                  Thank you for shopping with {company}. Order <span className="whitespace-nowrap font-semibold text-[#0b0d12]">#{overlay.id}</span> arrives by {overlay.arrives}.
                </p>
                <ul className="mt-5 divide-y divide-[#eef0f3] rounded-2xl border border-[#eef0f3] text-left">
                  {overlay.items.map((item) => (
                    <li key={item.name} className="flex justify-between gap-3 px-4 py-2.5 text-[13.5px]">
                      <span className="truncate">
                        {item.qty} × {item.name}
                      </span>
                      <span className="shrink-0 font-semibold">{rupees(item.value * item.qty)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between bg-[#fafbfc] px-4 py-3 text-[14.5px] font-bold">
                    <span>Paid</span>
                    <span className="text-[var(--brand)]">{rupees(overlay.total)}</span>
                  </li>
                </ul>
                <OrderSteps />
                <div className="mt-6 flex gap-2">
                  <button type="button" onClick={() => onNotify("Tracking link sent to your phone")} className="flex-1 rounded-xl border border-[#d9dce3] py-3 text-[14px] font-semibold transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]">
                    Track order
                  </button>
                  <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-[var(--brand)] py-3 text-[14px] font-semibold text-[var(--on-brand)] transition-transform hover:-translate-y-0.5">
                    Continue shopping
                  </button>
                </div>
              </div>
            )}

            {overlay.type === "form" && (
              <form onSubmit={(e) => submit(e, () => onShow({ type: "done", kind: overlay.kind, subject: overlay.subject }))}>
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">{company}</p>
                <h3 className="mt-2 pr-8 font-display text-[1.45rem] font-bold leading-tight">{FORM_COPY[overlay.kind].title}</h3>
                {overlay.subject && (
                  <p className="mt-3 rounded-xl bg-[color-mix(in_oklab,var(--brand)_8%,white)] px-3.5 py-2.5 text-[13.5px] font-medium text-[var(--brand)]">{overlay.subject}</p>
                )}
                <div className="mt-5 space-y-3">
                  <FormFields kind={overlay.kind} subject={overlay.subject} />
                </div>
                <div className="mt-6">
                  <SubmitButton busy={busy} wide>
                    {FORM_COPY[overlay.kind].button}
                  </SubmitButton>
                </div>
                <p className="mt-3 text-center text-[11.5px] text-[#9aa1ad]">Demo website — nothing is actually sent.</p>
              </form>
            )}

            {overlay.type === "done" && (
              <div className="text-center">
                <SuccessMark />
                <h3 className="mt-5 font-display text-[1.6rem] font-bold leading-tight">{FORM_COPY[overlay.kind].success}</h3>
                {overlay.subject && <p className="mt-2 text-[14px] font-semibold text-[var(--brand)]">{overlay.subject}</p>}
                <p className="mt-2 text-[14.5px] text-[#5b6170]">{FORM_COPY[overlay.kind].text(company)}</p>
                {overlay.kind === "offer" && (
                  <p className="mx-auto mt-4 w-fit rounded-xl border-2 border-dashed border-[var(--brand)] px-5 py-2 font-mono text-[18px] font-bold tracking-[0.2em] text-[var(--brand)]">WELCOME10</p>
                )}
                <button type="button" onClick={onClose} className="mt-6 w-full rounded-xl bg-[var(--brand)] py-3 text-[14.5px] font-semibold text-[var(--on-brand)] transition-transform hover:-translate-y-0.5">
                  Back to {company}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FormFields({ kind, subject }: { kind: FormKind; subject?: string }) {
  switch (kind) {
    case "quote":
      return (
        <>
          <Field label="Your name" name="name" placeholder="Arun Kumar" required />
          <Field label="Company" name="company" placeholder="Kumar Exports" />
          <Field label="Phone" name="phone" type="tel" placeholder="+91 98765 43210" required />
          <Field label="Requirement" name="details" placeholder="Quantity, specification and delivery timeline" textarea defaultValue={subject} />
        </>
      );
    case "trial":
      return (
        <>
          <Field label="Your name" name="name" placeholder="Neha Sharma" required />
          <Field label="Work email" name="email" type="email" placeholder="neha@company.com" required />
          <Field label="Company" name="company" placeholder="Company name" />
        </>
      );
    case "booking":
      return (
        <>
          <Field label="Your name" name="name" placeholder="Priya Raman" required />
          <Field label="Mobile number" name="phone" type="tel" placeholder="+91 98765 43210" required />
        </>
      );
    case "offer":
      return <Field label="Email address" name="email" type="email" placeholder="you@example.com" required />;
    case "enquiry":
      return (
        <>
          <Field label="Your name" name="name" placeholder="Arun Kumar" required />
          <Field label="Phone" name="phone" type="tel" placeholder="+91 98765 43210" required />
          <Field label="Message" name="message" textarea defaultValue={subject ? `I'm interested in ${subject}. Please share more details.` : ""} />
        </>
      );
    default:
      return (
        <>
          <Field label="Your name" name="name" placeholder="Your name" required />
          <Field label="Email" name="email" type="email" placeholder="you@example.com" required />
          <Field label="Message" name="message" placeholder="How can we help?" textarea />
        </>
      );
  }
}

function Field({ label, name, type = "text", placeholder, required, textarea, defaultValue }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean; textarea?: boolean; defaultValue?: string }) {
  const base = "mt-1.5 w-full rounded-xl border border-[#e2e4e9] bg-white px-3.5 py-2.5 text-[14px] outline-none transition-[border-color,box-shadow] placeholder:text-[#a8aebb] hover:border-[#cfd3db] focus:border-[var(--brand)] focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand)_15%,transparent)]";
  return (
    <label className="block">
      <span className="text-[12.5px] font-medium text-[#5b6170]">
        {label}
        {required && <span className="text-[var(--brand)]"> *</span>}
      </span>
      {textarea ? (
        <textarea name={name} placeholder={placeholder} required={required} defaultValue={defaultValue} rows={3} className={cn(base, "resize-none")} />
      ) : (
        <input name={name} type={type} placeholder={placeholder} required={required} defaultValue={defaultValue} className={base} />
      )}
    </label>
  );
}

function SubmitButton({ busy, wide, children }: { busy: boolean; wide?: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] py-3.5 text-[14.5px] font-semibold text-[var(--on-brand)] transition-[translate,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_var(--brand)] active:scale-[0.98] disabled:translate-y-0 disabled:opacity-80",
        wide && "w-full",
      )}
    >
      {busy ? (
        <>
          <Loader2 className={cn("size-4", styles.spin)} /> Processing…
        </>
      ) : (
        children
      )}
    </button>
  );
}

function Totals({ subtotal, shipping }: { subtotal: number; shipping: number }) {
  return (
    <dl className="space-y-1.5 text-[14px]">
      <div className="flex justify-between text-[#5b6170]">
        <dt>Subtotal</dt>
        <dd>{rupees(subtotal)}</dd>
      </div>
      <div className="flex justify-between text-[#5b6170]">
        <dt>Delivery</dt>
        <dd>{shipping ? rupees(shipping) : <span className="font-semibold text-emerald-600">Free</span>}</dd>
      </div>
      <div className="flex justify-between border-t border-[#e7e9ee] pt-2 text-[16px] font-bold">
        <dt>Total</dt>
        <dd>{rupees(subtotal + shipping)}</dd>
      </div>
    </dl>
  );
}

/** Order progress: placed now, then packed, shipped and delivered. */
function OrderSteps() {
  const steps = ["Placed", "Packed", "Shipped", "Delivered"];
  return (
    <ol className="mt-5 grid grid-cols-4 gap-1">
      {steps.map((step, i) => (
        <li key={step} className="text-center">
          <span className={cn("block h-1.5 rounded-full", i === 0 ? "bg-[var(--brand)]" : "bg-[#eef0f3]")} />
          <span className={cn("mt-1.5 block text-[11.5px] font-medium", i === 0 ? "text-[var(--brand)]" : "text-[#9aa1ad]")}>{step}</span>
        </li>
      ))}
    </ol>
  );
}

function SuccessMark() {
  return (
    <div className="relative mx-auto size-20">
      <span className={styles.burst} aria-hidden>
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i} style={{ "--a": `${i * 36}deg` } as CSSProperties} />
        ))}
      </span>
      <svg viewBox="0 0 80 80" className={cn("relative size-20", styles.check)} aria-hidden>
        <circle cx="40" cy="40" r="36" pathLength={1} fill="color-mix(in oklab, var(--brand) 10%, white)" stroke="var(--brand)" strokeWidth="4" />
        <path d="M25 41 L35 51 L56 30" pathLength={1} fill="none" stroke="var(--brand)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function CloseButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label="Close" className={cn("grid size-9 place-items-center rounded-full bg-[#f4f5f7] text-[#5b6170] transition-[background-color,color,rotate] duration-300 hover:rotate-90 hover:bg-[#0b0d12] hover:text-white", className)}>
      <X className="size-4" />
    </button>
  );
}

function QtyButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="grid size-7 place-items-center rounded-full text-[#5b6170] transition-colors hover:bg-[var(--brand)] hover:text-[var(--on-brand)]">
      {children}
    </button>
  );
}

/** Soft brand-tinted gradients for product tiles. */
function tileBackground(i: number) {
  const mixes = [
    "linear-gradient(145deg, color-mix(in oklab, var(--brand) 22%, white), color-mix(in oklab, var(--brand) 6%, white))",
    "linear-gradient(145deg, color-mix(in oklab, var(--brand) 10%, #fff7ed), #ffffff)",
    "linear-gradient(145deg, color-mix(in oklab, var(--brand) 14%, #eef2ff), #f8fafc)",
    "linear-gradient(145deg, color-mix(in oklab, var(--brand) 8%, #f0fdf4), #ffffff)",
    "linear-gradient(145deg, color-mix(in oklab, var(--brand) 16%, #fdf2f8), #ffffff)",
  ];
  return mixes[i % mixes.length];
}
