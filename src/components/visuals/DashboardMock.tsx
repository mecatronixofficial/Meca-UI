import { BarChart3, Boxes, ClipboardList, Factory, FileText, LayoutGrid, Search, Truck } from "lucide-react";

/**
 * Illustrative operations / ERP dashboard. Decorative only: the figures are
 * demo data inside a concept interface, not claims about any business.
 */

const NAV = [
  { icon: LayoutGrid, label: "Overview", active: true },
  { icon: Factory, label: "Production" },
  { icon: Boxes, label: "Inventory" },
  { icon: ClipboardList, label: "Orders" },
  { icon: FileText, label: "Billing" },
  { icon: Truck, label: "Dispatch" },
  { icon: BarChart3, label: "Reports" },
];

const KPIS = [
  { label: "Orders in progress", value: "128", delta: "+12" },
  { label: "Units produced · week", value: "4,860", delta: "+6.2%" },
  { label: "Ready to dispatch", value: "312", delta: "+28" },
  { label: "On-time delivery", value: "96.4%", delta: "+1.1" },
];

// Weekly output (two series) for the chart
const OUTPUT = [52, 61, 58, 70, 66, 78, 74, 83, 79, 88, 85, 92];
const PLAN = [55, 58, 60, 64, 66, 70, 72, 76, 78, 82, 84, 88];

const ORDERS = [
  { id: "SO-2481", customer: "Northline Retail", stage: "Weaving", progress: 72, status: "On track" },
  { id: "SO-2479", customer: "Harbor Home Co.", stage: "Finishing", progress: 90, status: "On track" },
  { id: "SO-2476", customer: "Vela Interiors", stage: "Dyeing", progress: 41, status: "Attention" },
  { id: "SO-2472", customer: "Kestrel Supply", stage: "Packing", progress: 96, status: "Ready" },
];

function linePath(values: number[], w: number, h: number) {
  const max = 100;
  const step = w / (values.length - 1);
  return values.map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(h - (v / max) * h).toFixed(1)}`).join(" ");
}

export function DashboardMock() {
  const W = 520;
  const H = 150;
  const out = linePath(OUTPUT, W, H);

  return (
    <div className="flex min-w-[920px] bg-white text-ink" aria-hidden>
      {/* Sidebar */}
      <aside className="w-[188px] shrink-0 border-r border-line bg-paper/70 p-3">
        <div className="mb-5 flex items-center gap-2 px-2 pt-1">
          <span className="size-5 rounded-md bg-gradient-to-br from-accent to-wine" />
          <span className="text-[12px] font-semibold tracking-wide">Operations</span>
        </div>
        <ul className="space-y-0.5">
          {NAV.map(({ icon: Icon, label, active }) => (
            <li
              key={label}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11.5px] ${active ? "bg-white font-medium text-ink shadow-soft ring-1 ring-line" : "text-muted"}`}
            >
              <Icon className="size-3.5" />
              {label}
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-lg border border-line bg-white p-3">
          <p className="text-[10px] text-muted">Shift A · Line 2</p>
          <p className="mt-1 text-[12px] font-medium">Running</p>
          <div className="mt-2 h-1 rounded-full bg-line">
            <div className="h-full w-[68%] rounded-full bg-emerald-500" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted">Production overview</p>
            <p className="mt-1 text-[17px] font-semibold tracking-tight">Good morning — here&apos;s today</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-44 items-center gap-2 rounded-md bg-paper px-2.5 ring-1 ring-line text-[10.5px] text-muted">
              <Search className="size-3" /> Search orders, items…
            </div>
            <span className="rounded-md bg-paper px-2.5 ring-1 ring-line py-1.5 text-[10.5px] text-muted">This week</span>
            <span className="size-7 rounded-full bg-gradient-to-br from-[#ff6a5c] to-accent" />
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-5 grid grid-cols-4 gap-3">
          {KPIS.map((k) => (
            <div key={k.label} className="rounded-xl border border-line bg-white p-3.5">
              <p className="text-[10.5px] text-muted">{k.label}</p>
              <div className="mt-2 flex items-end justify-between">
                <p className="text-[20px] font-semibold tracking-tight">{k.value}</p>
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9.5px] text-emerald-700">{k.delta}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-[1.5fr_1fr] gap-3">
          {/* Chart */}
          <div className="rounded-xl border border-line bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11.5px] font-medium">Weekly output vs plan</p>
              <div className="flex gap-3 text-[10px] text-muted">
                <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded bg-accent" />Output</span>
                <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded bg-ink/30" />Plan</span>
              </div>
            </div>
            <svg viewBox={`0 0 ${W} ${H + 10}`} className="mt-3 h-[150px] w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="dash-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#e10600" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#e10600" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map((g) => (
                <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="rgba(11,13,18,0.06)" />
              ))}
              <path d={`${out} L${W},${H} L0,${H} Z`} fill="url(#dash-fill)" />
              <path d={linePath(PLAN, W, H)} fill="none" stroke="rgba(11,13,18,0.28)" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d={out} fill="none" stroke="#e10600" strokeWidth="2" />
            </svg>
          </div>

          {/* Inventory */}
          <div className="rounded-xl border border-line bg-white p-4">
            <p className="text-[11.5px] font-medium">Stock levels</p>
            <ul className="mt-3 space-y-3">
              {[
                ["Cotton yarn 40s", 78],
                ["Greige fabric", 54],
                ["Dyes & chemicals", 31],
                ["Packing material", 86],
              ].map(([name, pct]) => (
                <li key={name as string}>
                  <div className="flex justify-between text-[10.5px]">
                    <span className="text-muted">{name}</span>
                    <span className="text-muted">{pct}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-line">
                    <div
                      className={`h-full rounded-full ${(pct as number) < 40 ? "bg-amber-400" : "bg-accent"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Orders */}
        <div className="mt-3 rounded-xl border border-line bg-white">
          <div className="grid grid-cols-[90px_1.3fr_1fr_1.2fr_90px] gap-3 border-b border-line px-4 py-2.5 text-[10px] uppercase tracking-[0.1em] text-muted">
            <span>Order</span><span>Customer</span><span>Stage</span><span>Progress</span><span>Status</span>
          </div>
          {ORDERS.map((o) => (
            <div key={o.id} className="grid grid-cols-[90px_1.3fr_1fr_1.2fr_90px] items-center gap-3 border-b border-line/70 px-4 py-2.5 text-[11px] last:border-0">
              <span className="font-mono text-muted">{o.id}</span>
              <span>{o.customer}</span>
              <span className="text-muted">{o.stage}</span>
              <span className="h-1.5 rounded-full bg-line">
                <span className="block h-full rounded-full bg-accent/80" style={{ width: `${o.progress}%` }} />
              </span>
              <span
                className={`w-fit rounded px-1.5 py-0.5 text-[9.5px] ${
                  o.status === "Attention" ? "bg-amber-50 text-amber-700" : o.status === "Ready" ? "bg-emerald-50 text-emerald-700" : "bg-paper text-muted"
                }`}
              >
                {o.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
