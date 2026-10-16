// Shared accent palette for the bento-style sections.
// Orange is the primary brand colour and always comes first; the others are
// supporting accents. Class names are written out in full so Tailwind can
// generate them (it cannot see dynamically built class strings).

export interface Accent {
  /** Tinted icon chip: background + border + icon colour */
  chip: string;
  /** Solid fill (pills, active states) */
  solid: string;
  /** Light text in the accent colour (labels) */
  text: string;
  /** Border colour on hover */
  hover: string;
  /** Soft background glow blob */
  glow: string;
  /** Hex value for inline styles (SVG, gradients) */
  hex: string;
}

export const ACCENTS: Accent[] = [
  { chip: "bg-orange-500/10 border-orange-500/30 text-orange-400", solid: "bg-orange-500", text: "text-orange-300", hover: "hover:border-orange-500/50", glow: "bg-orange-500/15", hex: "#f97316" },
  { chip: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400", solid: "bg-cyan-400", text: "text-cyan-300", hover: "hover:border-cyan-500/50", glow: "bg-cyan-500/15", hex: "#22d3ee" },
  { chip: "bg-violet-500/10 border-violet-500/30 text-violet-400", solid: "bg-violet-400", text: "text-violet-300", hover: "hover:border-violet-500/50", glow: "bg-violet-500/15", hex: "#a78bfa" },
  { chip: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", solid: "bg-emerald-400", text: "text-emerald-300", hover: "hover:border-emerald-500/50", glow: "bg-emerald-500/15", hex: "#34d399" },
  { chip: "bg-amber-500/10 border-amber-500/30 text-amber-400", solid: "bg-amber-400", text: "text-amber-300", hover: "hover:border-amber-500/50", glow: "bg-amber-500/15", hex: "#fbbf24" },
  { chip: "bg-rose-500/10 border-rose-500/30 text-rose-400", solid: "bg-rose-400", text: "text-rose-300", hover: "hover:border-rose-500/50", glow: "bg-rose-500/15", hex: "#fb7185" },
];

export const accentAt = (i: number): Accent => ACCENTS[((i % ACCENTS.length) + ACCENTS.length) % ACCENTS.length];

/** Base classes for a dark bento tile */
export const TILE = "relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/50 backdrop-blur-md";

/** Base classes for a "hero" bento tile (warm dark) */
export const TILE_HERO = "relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0906]/85 backdrop-blur-xl";

export const pad2 = (n: number) => String(n).padStart(2, "0");
