import { cn } from "../../lib/cn";
import s from "./VisionScene.module.css";

/*
 * Line-art loop for the home intro, "Your vision → Our engineering":
 * an idea lights up, a signal runs through Discover and Design, and a
 * product window assembles while two gears turn. Decorative (aria-hidden);
 * timeline in VisionScene.module.css.
 */

const RED = "#e10600";
const INK = "#171b24";
const MUTED = "#6b7080";
const LINE = "#ececef";
const LINE_STRONG = "#dcdce1";
const SOFT = "#fff0ef";

const CIRCUIT = "M122 100 H200 C220 100 220 70 240 70 H300 C320 70 320 130 340 130 H400 C420 130 420 100 440 100";

/** Gear outline centred on (0, 0). */
function gearPath(radius: number, teeth: number, depth = 4.5) {
  const step = (Math.PI * 2) / teeth;
  const at = (r: number, a: number) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
  const inner = radius - depth;
  let d = "";
  for (let k = 0; k < teeth; k++) {
    const a = k * step;
    d += `${k === 0 ? "M" : "L"}${at(inner, a)} L${at(radius, a + step * 0.12)} L${at(radius, a + step * 0.42)} L${at(inner, a + step * 0.54)} `;
  }
  return `${d}Z`;
}

const BIG_GEAR = gearPath(22, 10);
const SMALL_GEAR = gearPath(14, 7, 4);

// Rays above the bulb, fanned around its centre
const RAYS = [-150, -120, -90, -60, -30].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return { x1: 80 + 44 * Math.cos(a), y1: 84 + 44 * Math.sin(a), x2: 80 + 54 * Math.cos(a), y2: 84 + 54 * Math.sin(a) };
});

export function VisionScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 220" aria-hidden className={cn(s.scene, "font-mono", className)}>
      <defs>
        <pattern id="vision-dots" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill={LINE_STRONG} />
        </pattern>
        <radialGradient id="vision-dots-fade">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <mask id="vision-dots-mask">
          <rect width="640" height="220" fill="url(#vision-dots-fade)" />
        </mask>
        <radialGradient id="vision-glow">
          <stop offset="0%" stopColor={RED} stopOpacity="0.28" />
          <stop offset="100%" stopColor={RED} stopOpacity="0" />
        </radialGradient>
        <filter id="vision-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0b0d12" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Blueprint dots */}
      <rect width="640" height="220" fill="url(#vision-dots)" mask="url(#vision-dots-mask)" />

      {/* ---------- Vision: the idea ---------- */}
      <circle cx="80" cy="88" r="48" fill="url(#vision-glow)" className={s.glow} />
      {RAYS.map((r, i) => (
        <line
          key={i}
          {...r}
          stroke={RED}
          strokeWidth="2"
          strokeLinecap="round"
          className={s.ray}
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}
      <path
        d="M80 52 a34 34 0 0 1 20 61.5 V126 H60 V113.5 A34 34 0 0 1 80 52 Z"
        pathLength="1"
        fill="#fff"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
        className={s.draw}
      />
      <path d="M62 134 H98 M66 142 H94" pathLength="1" stroke={INK} strokeWidth="1.8" strokeLinecap="round" className={s.draw} />
      <path
        d="M73 114 V104 M87 114 V104 M73 104 Q80 90 87 104"
        fill="none"
        stroke={RED}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={s.filament}
      />
      <text x="80" y="200" fontSize="10" letterSpacing="2.2" fill={MUTED} textAnchor="middle">
        VISION
      </text>

      {/* ---------- Circuit: Discover → Design ---------- */}
      <path d={CIRCUIT} fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
      <path d={CIRCUIT} pathLength="1000" fill="none" stroke={RED} strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" className={s.trail} />
      <path d={CIRCUIT} pathLength="1000" fill="none" stroke={RED} strokeWidth="3" strokeLinecap="round" className={s.pulse} />

      {[
        { cx: 270, cy: 70, label: "DISCOVER", ly: 52, cls: s.node1 },
        { cx: 370, cy: 130, label: "DESIGN", ly: 156, cls: s.node2 },
      ].map((n) => (
        <g key={n.label}>
          <circle cx={n.cx} cy={n.cy} r="7" fill="#fff" stroke={LINE_STRONG} strokeWidth="1.5" />
          <g className={n.cls}>
            <circle cx={n.cx} cy={n.cy} r="12" fill={RED} fillOpacity="0.12" />
            <circle cx={n.cx} cy={n.cy} r="7" fill={RED} />
            <circle cx={n.cx} cy={n.cy} r="2.5" fill="#fff" />
          </g>
          <text x={n.cx} y={n.ly} fontSize="9.5" letterSpacing="1.8" fill={MUTED} textAnchor="middle">
            {n.label}
          </text>
        </g>
      ))}

      {/* ---------- Engineering: the product ---------- */}
      <g filter="url(#vision-shadow)">
        <rect x="450" y="34" width="160" height="126" rx="12" fill="#fff" stroke={LINE_STRONG} strokeWidth="1.5" />
      </g>
      <line x1="451" x2="609" y1="58" y2="58" stroke={LINE} />
      <circle cx="464" cy="46" r="3.5" fill={RED} />
      <circle cx="475" cy="46" r="3.5" fill={LINE_STRONG} />
      <circle cx="486" cy="46" r="3.5" fill={LINE_STRONG} />

      <rect x="464" y="70" width="70" height="8" rx="4" fill={INK} fillOpacity="0.85" className={cn(s.block, s.b1)} />
      <rect x="464" y="86" width="112" height="6" rx="3" fill={LINE_STRONG} className={cn(s.block, s.b2)} />
      <rect x="464" y="97" width="86" height="6" rx="3" fill={LINE_STRONG} className={cn(s.block, s.b3)} />
      <rect x="464" y="112" width="64" height="36" rx="7" fill={SOFT} stroke={RED} strokeOpacity="0.5" className={cn(s.block, s.b4)} />
      <rect x="534" y="112" width="62" height="36" rx="7" fill="#f7f7f8" stroke={LINE_STRONG} className={cn(s.block, s.b5)} />
      <polyline
        points="471,140 482,131 492,135 503,124 514,128 521,120"
        pathLength="1"
        fill="none"
        stroke={RED}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={s.chart}
      />

      {/* Check badge on the window's corner */}
      <g className={s.badge}>
        <circle cx="608" cy="36" r="13" fill={RED} />
        <path d="M602.5 36 l3.5 3.5 l6.5 -7" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Interlocking gears */}
      <g transform="translate(600 170)">
        <g className={s.gear}>
          <path d={BIG_GEAR} fill="#fff" stroke={RED} strokeWidth="1.6" strokeLinejoin="round" />
          <circle r="7" fill="#fff" stroke={RED} strokeWidth="1.6" />
          <circle r="2.5" fill={RED} />
        </g>
      </g>
      <g transform="translate(574 189)">
        <g className={s.gearSmall}>
          <path d={SMALL_GEAR} fill="#fff" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
          <circle r="3.5" fill="#fff" stroke={INK} strokeWidth="1.4" />
        </g>
      </g>

      <text x="500" y="200" fontSize="10" letterSpacing="2.2" fill={MUTED} textAnchor="middle">
        ENGINEERING
      </text>
    </svg>
  );
}
