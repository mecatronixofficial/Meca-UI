import { Bell, Bot, Check, FileText, Mail, Package, ShoppingBag, Sparkles, Star, Webhook } from "lucide-react";
import { cn } from "../../lib/cn";

/*
 * Illustrative interface mockups used as section and service visuals.
 * All are decorative (aria-hidden) concept screens, not client work.
 */

/* ---------- Phone: order tracking app ---------- */

export function PhoneMock({ className }: { className?: string }) {
  const steps = [
    { label: "Order confirmed", time: "09:12", done: true },
    { label: "In production", time: "11:40", done: true },
    { label: "Quality checked", time: "15:05", done: true },
    { label: "Out for delivery", time: "Est. 17:30", done: false },
  ];
  return (
    <div aria-hidden className={cn("w-[236px] rounded-[2.2rem] border border-ink/10 bg-ink p-2 shadow-window", className)}>
      <div className="overflow-hidden rounded-[1.8rem] bg-[#f7f8fa] text-surface">
        <div className="relative bg-gradient-to-br from-accent to-accent-ink px-4 pb-5 pt-7 text-white">
          <span className="absolute left-1/2 top-2 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
          <p className="text-[9.5px] uppercase tracking-[0.14em] text-white/75">Order #A-1042</p>
          <p className="mt-1 text-[15px] font-semibold tracking-tight">Arriving today</p>
          <div className="mt-3 h-1.5 rounded-full bg-white/20">
            <div className="h-full w-3/4 rounded-full bg-white" />
          </div>
        </div>
        <ul className="space-y-3.5 px-4 py-4">
          {steps.map((s) => (
            <li key={s.label} className="flex items-center gap-3">
              <span className={cn("flex size-5 items-center justify-center rounded-full", s.done ? "bg-accent text-white" : "border border-line-strong bg-white")}>
                {s.done && <Check className="size-3" strokeWidth={3} />}
              </span>
              <span className="flex-1 text-[11.5px] font-medium">{s.label}</span>
              <span className="text-[10px] text-muted-ink">{s.time}</span>
            </li>
          ))}
        </ul>
        <div className="mx-3 mb-3 flex items-center gap-2.5 rounded-xl bg-white p-3 shadow-soft">
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Package className="size-4" />
          </span>
          <div className="flex-1">
            <p className="text-[11px] font-medium">3 items · 2 cartons</p>
            <p className="text-[10px] text-muted-ink">Track live location</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Storefront ---------- */

const SWATCHES = [
  "repeating-linear-gradient(135deg,#d9c6a8 0 8px,#cdb592 8px 16px)",
  "repeating-linear-gradient(90deg,#b9cddd 0 6px,#a7bfd3 6px 12px)",
  "radial-gradient(circle at 30% 30%,#f3c9b0,#e3a987)",
  "repeating-linear-gradient(45deg,#c5c0e6 0 5px,#b3acdc 5px 10px)",
];

export function StorefrontMock({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("min-w-[560px] bg-white text-surface", className)}>
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="font-display text-[13px] font-semibold tracking-[0.18em]">LOOM&amp;CO</span>
        <div className="flex gap-4 text-[10.5px] text-muted-ink">
          <span>Bedding</span><span>Bath</span><span>Table</span><span>Wholesale</span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-[10px] text-white">
          <ShoppingBag className="size-3" /> 2
        </span>
      </div>
      <div className="grid grid-cols-[1.1fr_1fr] gap-4 p-5">
        <div className="flex flex-col justify-end rounded-xl p-5" style={{ background: "linear-gradient(135deg,#efe6d8,#d9c6a8)" }}>
          <p className="text-[9.5px] uppercase tracking-[0.16em] text-[#3b2f22]/60">New season</p>
          <p className="mt-1 font-display text-[22px] font-semibold leading-tight tracking-tight text-[#3b2f22]">Woven cotton,<br />made to last.</p>
          <span className="mt-3 w-fit rounded-full bg-[#3b2f22] px-3 py-1.5 text-[10px] text-white">Shop the range</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {SWATCHES.map((bg, i) => (
            <div key={i}>
              <div className="aspect-square rounded-lg" style={{ background: bg }} />
              <p className="mt-1.5 text-[10px] font-medium">{["Herringbone throw", "Striped towel set", "Terra cushion", "Diagonal runner"][i]}</p>
              <p className="flex items-center gap-1 text-[9.5px] text-muted-ink">
                <Star className="size-2.5 fill-current" /> ₹{[1499, 899, 649, 1199][i]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Corporate website ---------- */

export function SiteMock({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("min-w-[560px] bg-white text-surface", className)}>
      <div className="flex items-center justify-between px-6 py-3.5">
        <span className="flex items-center gap-2 text-[12px] font-semibold">
          <span className="size-4 rounded bg-surface" /> Precision Works
        </span>
        <div className="flex gap-4 text-[10.5px] text-muted-ink">
          <span>Machines</span><span>Industries</span><span>About</span>
        </div>
        <span className="rounded-full bg-accent-strong px-3 py-1.5 text-[10px] text-white">Request a quote</span>
      </div>
      <div className="relative mx-4 overflow-hidden rounded-xl bg-sand px-6 py-8 text-ink">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -right-10 -top-10 size-48 glow-accent" />
        <p className="relative text-[9.5px] uppercase tracking-[0.16em] text-accent-ink">Industrial machinery</p>
        <p className="relative mt-2 max-w-[280px] font-display text-[24px] font-semibold leading-[1.05] tracking-tight">Machines built for continuous production.</p>
        <div className="relative mt-4 flex gap-2">
          <span className="rounded-full bg-ink px-3 py-1.5 text-[10px] text-white">View machines</span>
          <span className="rounded-full border border-line-strong bg-white px-3 py-1.5 text-[10px]">Talk to sales</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 p-4">
        {["Engineering", "Installation", "Service"].map((t) => (
          <div key={t} className="rounded-lg border border-line p-3">
            <span className="block size-5 rounded-md bg-accent-soft" />
            <p className="mt-2 text-[11px] font-medium">{t}</p>
            <span className="mt-1.5 block h-1.5 w-4/5 rounded bg-paper" />
            <span className="mt-1 block h-1.5 w-3/5 rounded bg-paper" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Workflow board (custom software) ---------- */

export function WorkflowMock({ className }: { className?: string }) {
  const cols = [
    { title: "Requested", tone: "bg-line-strong", cards: ["Purchase: 40s yarn", "Laptop for accounts"] },
    { title: "Approval", tone: "bg-amber-400", cards: ["Service contract renewal", "Dye house job work"] },
    { title: "In progress", tone: "bg-accent", cards: ["Sample dispatch — Lot 22"] },
    { title: "Done", tone: "bg-emerald-400", cards: ["Vendor onboarding", "Quarterly audit pack"] },
  ];
  return (
    <div aria-hidden className={cn("min-w-[600px] bg-white p-5 text-ink", className)}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[13px] font-semibold">Requests &amp; approvals</p>
        <span className="rounded-md bg-accent-strong px-2.5 py-1 text-[10px] text-white">+ New request</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {cols.map((c) => (
          <div key={c.title} className="rounded-xl bg-paper p-2.5 ring-1 ring-line">
            <p className="mb-2.5 flex items-center gap-2 px-1 text-[10.5px] text-muted">
              <span className={cn("size-1.5 rounded-full", c.tone)} /> {c.title}
            </p>
            <div className="space-y-2">
              {c.cards.map((card) => (
                <div key={card} className="rounded-lg border border-line bg-white p-2.5 shadow-soft">
                  <p className="text-[10.5px] leading-snug">{card}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="h-1 w-8 rounded bg-line" />
                    <span className="size-4 rounded-full bg-gradient-to-br from-[#ff6a5c] to-accent" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Automation flow ---------- */

export function AutomationMock({ className }: { className?: string }) {
  const nodes = [
    { icon: Mail, title: "Purchase order email", sub: "Trigger" },
    { icon: FileText, title: "Extract line items", sub: "AI · document reading" },
    { icon: Check, title: "Review if confidence < 90%", sub: "Human in the loop" },
    { icon: Webhook, title: "Create sales order", sub: "ERP integration" },
    { icon: Bell, title: "Notify production", sub: "Message" },
  ];
  return (
    <div aria-hidden className={cn("min-w-[340px] bg-white p-6 text-ink", className)}>
      <div className="mb-5 flex items-center gap-2 text-[12px] font-semibold">
        <Sparkles className="size-3.5 text-accent" /> Order intake automation
      </div>
      <ol className="relative space-y-3 before:absolute before:bottom-6 before:left-[17px] before:top-6 before:w-px before:bg-gradient-to-b before:from-accent before:to-accent/10">
        {nodes.map(({ icon: Icon, title, sub }, i) => (
          <li key={title} className="relative flex items-center gap-3">
            <span className={cn("relative z-10 flex size-9 items-center justify-center rounded-lg border", i === 1 ? "border-accent/40 bg-accent-soft text-accent" : "border-line bg-white text-muted-ink")}>
              <Icon className="size-4" />
            </span>
            <div className="flex-1 rounded-lg border border-line bg-paper px-3 py-2">
              <p className="text-[11.5px] font-medium">{title}</p>
              <p className="text-[10px] text-muted">{sub}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-[10.5px] text-emerald-700">
        <Bot className="size-3.5" /> Last run completed · 14 orders processed
      </div>
    </div>
  );
}
