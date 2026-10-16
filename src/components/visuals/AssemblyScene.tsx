import { cn } from "../../lib/cn";
import s from "./AssemblyScene.module.css";

/*
 * Animated "code to production" robot cell for the home hero: code is written,
 * a robotic arm moves the compiled module from the conveyor onto the production
 * stack, and the deployment pipeline completes. Decorative (aria-hidden); all
 * motion is CSS, see AssemblyScene.module.css for the timeline.
 */

const RED = "#e10600";
const RED_INK = "#a30400";
const INK = "#171b24";
const MUTED = "#6b7080";
const LINE = "#ececef";
const LINE_STRONG = "#dcdce1";
const PAPER = "#f7f7f8";

type Token = [text: string, color: string];

const CODE: Token[][] = [
  [["import", RED], [" { cell } ", INK], ["from", RED], [' "@meca"', RED_INK], [";", MUTED]],
  [["const", RED], [" arm = cell.arm(", INK], ['"A-01"', RED_INK], [");", MUTED]],
  [["// build, test and ship", MUTED]],
  [["export async function", RED], [" ship(m) {", INK]],
  [["  await", RED], [" m.build();", INK]],
  [["  await", RED], [" m.test();", INK]],
  [["  await", RED], [" arm.place(m);", INK]],
  [["  return", RED], [" deploy(m);", INK]],
  [["}", INK]],
];

const STEPS = [
  { label: "Build", time: "38s", done: s.done1 },
  { label: "Unit tests", time: "1m 04s", done: s.done2 },
  { label: "Security scan", time: "22s", done: s.done3 },
  { label: "Deploy", time: "41s", done: s.done4 },
];

const TRACES = [
  { d: "M310 150 H350 V110 H470", delay: "0s" },
  { d: "M175 360 V464 H540", delay: "1.2s" },
  { d: "M660 464 H805", delay: "2.1s" },
  { d: "M900 420 H920 V240 H940", delay: "0.6s" },
];

/** A software module block, drawn with its top-left corner at (x, y). */
function ModuleBlock({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="60" height="30" rx="6" fill="#fff" stroke={LINE_STRONG} strokeWidth="1.5" />
      <rect x="8" y="8" width="3" height="14" rx="1.5" fill={RED} />
      <text x="18" y="19.5" fontSize="10" fill={INK} className="font-mono">
        {label}
      </text>
    </g>
  );
}

export function AssemblyScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 520"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={cn(s.scene, "font-sans", className)}
    >
      <defs>
        <linearGradient id="scene-red" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff3b2f" />
          <stop offset="100%" stopColor="#c40500" />
        </linearGradient>
        <filter id="scene-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#0b0d12" floodOpacity="0.09" />
        </filter>
      </defs>

      {/* Circuit traces with travelling pulses */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {TRACES.map((t) => (
          <g key={t.d}>
            <path d={t.d} stroke={LINE} strokeWidth="2" />
            <path d={t.d} stroke={RED} strokeWidth="2" className={s.trace} style={{ animationDelay: t.delay }} />
          </g>
        ))}
      </g>
      <circle cx="470" cy="110" r="4" fill="#fff" stroke={LINE_STRONG} strokeWidth="1.5" />

      {/* Ground and station labels */}
      <line x1="30" x2="1170" y1="470" y2="470" stroke={LINE_STRONG} strokeWidth="1.5" />
      <g fontSize="10" letterSpacing="2.2" fill={MUTED} textAnchor="middle" className="font-mono">
        <text x="175" y="500">SOURCE</text>
        <text x="600" y="500">ROBOT CELL</text>
        <text x="850" y="500">PRODUCTION</text>
        <text x="1050" y="500">PIPELINE</text>
      </g>

      {/* ---------- Conveyor (drawn first so new modules emerge from behind the editor) ---------- */}
      <rect x="310" y="370" width="120" height="10" rx="5" fill={PAPER} stroke={LINE_STRONG} strokeWidth="1.5" />
      <line x1="316" x2="424" y1="375" y2="375" stroke={LINE_STRONG} strokeWidth="2" strokeDasharray="4 6" className={s.belt} />
      <circle cx="316" cy="386" r="4" fill="#fff" stroke={LINE_STRONG} strokeWidth="1.5" />
      <circle cx="424" cy="386" r="4" fill="#fff" stroke={LINE_STRONG} strokeWidth="1.5" />
      <g className={s.source}>
        <ModuleBlock x={330} y={340} label="ui" />
      </g>

      {/* ---------- Code editor ---------- */}
      <g filter="url(#scene-shadow)">
        <rect x="40" y="70" width="270" height="290" rx="14" fill="#fff" stroke={LINE} strokeWidth="1.5" />
      </g>
      <path d="M41 103 V84 a13 13 0 0 1 13 -13 H296 a13 13 0 0 1 13 13 V103 Z" fill={PAPER} />
      <line x1="41" x2="309" y1="103" y2="103" stroke={LINE} />
      <circle cx="60" cy="87" r="4" fill={RED} />
      <circle cx="74" cy="87" r="4" fill={LINE_STRONG} />
      <circle cx="88" cy="87" r="4" fill={LINE_STRONG} />
      <text x="290" y="91" fontSize="10.5" fill={MUTED} textAnchor="end" className="font-mono">
        ship.ts
      </text>

      <g fontSize="11" className="font-mono">
        {CODE.map((tokens, i) => {
          const y = 128 + i * 20;
          return (
            <g key={i}>
              <text x="62" y={y} fill={LINE_STRONG} textAnchor="end">
                {i + 1}
              </text>
              <text x="74" y={y} xmlSpace="preserve">
                {tokens.map(([text, color], j) => (
                  <tspan key={j} fill={color}>
                    {text}
                  </tspan>
                ))}
              </text>
              <rect
                x="72"
                y={y - 12}
                width="232"
                height="16"
                fill="#fff"
                className={s.cover}
                style={{ "--line": i } as React.CSSProperties}
              />
            </g>
          );
        })}
        <rect x="86" y="278" width="6.5" height="13" rx="1" fill={RED} className={s.cursor} />
      </g>

      <line x1="41" x2="309" y1="322" y2="322" stroke={LINE} />
      <circle cx="60" cy="341" r="3.5" fill={RED} className={s.led} />
      <text x="72" y="345" fontSize="10.5" fill={MUTED} className="font-mono">
        ui.module · compiled
      </text>

      {/* ---------- Production stack ---------- */}
      <rect x="805" y="450" width="90" height="9" rx="4.5" fill={LINE_STRONG} />
      <ModuleBlock x={820} y={420} label="core" />
      <ModuleBlock x={820} y={390} label="auth" />
      <ModuleBlock x={820} y={360} label="api" />
      <g className={s.placed}>
        <ModuleBlock x={820} y={330} label="ui" />
      </g>
      <circle cx="850" cy="345" r="18" fill="none" stroke={RED} strokeWidth="2" className={s.pulse} />

      {/* ---------- Robotic arm ---------- */}
      <rect x="540" y="458" width="120" height="12" rx="6" fill={INK} />
      <path d="M566 458 L586 412 H614 L634 458 Z" fill="#fff" stroke={LINE_STRONG} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="600" cy="440" r="3.5" fill={RED} className={s.led} />

      <g transform="translate(600 400)">
        <g className={s.upper}>
          <rect x="-16" y="-180" width="32" height="180" rx="16" fill="#fff" stroke={LINE_STRONG} strokeWidth="1.5" />
          <rect x="-3" y="-148" width="6" height="100" rx="3" fill={RED} />

          <g transform="translate(0 -180)">
            <g className={s.fore}>
              <rect x="-12" y="-170" width="24" height="170" rx="12" fill="#fff" stroke={LINE_STRONG} strokeWidth="1.5" />
              <rect x="-2" y="-128" width="4" height="70" rx="2" fill={LINE_STRONG} />

              <g transform="translate(0 -170)">
                <g className={s.wrist}>
                  <rect x="-6" y="0" width="12" height="10" fill={LINE_STRONG} />
                  <rect x="-42" y="8" width="84" height="20" rx="7" fill="#fff" stroke={LINE_STRONG} strokeWidth="1.5" />
                  <rect x="-18" y="15" width="36" height="6" rx="3" fill={RED} />
                  <g transform="translate(-36 28)">
                    <rect x="-4" width="8" height="34" rx="3" fill={INK} className={s.fingerL} />
                  </g>
                  <g transform="translate(36 28)">
                    <rect x="-4" width="8" height="34" rx="3" fill={INK} className={s.fingerR} />
                  </g>
                  <g className={s.carried}>
                    <ModuleBlock x={-30} y={30} label="ui" />
                  </g>
                </g>
                <circle r="12" fill="#fff" stroke={LINE_STRONG} strokeWidth="1.5" />
                <circle r="4" fill={INK} />
              </g>
            </g>
            <circle r="19" fill="#fff" stroke={LINE_STRONG} strokeWidth="1.5" />
            <circle r="7" fill="url(#scene-red)" />
          </g>
        </g>
        <circle r="26" fill="#fff" stroke={LINE_STRONG} strokeWidth="2" />
        <circle r="11" fill="url(#scene-red)" />
      </g>

      {/* ---------- Deployment pipeline ---------- */}
      <g filter="url(#scene-shadow)">
        <rect x="940" y="70" width="220" height="330" rx="14" fill="#fff" stroke={LINE} strokeWidth="1.5" />
      </g>
      <text x="960" y="101" fontSize="13" fontWeight="600" fill={INK}>
        Pipeline
      </text>
      <rect x="1098" y="87" width="46" height="20" rx="10" fill="#fff0ef" />
      <text x="1121" y="101" fontSize="10" fill={RED_INK} textAnchor="middle" className="font-mono">
        main
      </text>
      <line x1="941" x2="1159" y1="118" y2="118" stroke={LINE} />

      {STEPS.map((step, i) => {
        const y = 150 + i * 46;
        return (
          <g key={step.label}>
            {i < STEPS.length - 1 && <line x1="966" x2="966" y1={y + 10} y2={y + 36} stroke={LINE} strokeWidth="1.5" />}
            <circle cx="966" cy={y} r="9" fill="#fff" stroke={LINE_STRONG} strokeWidth="1.5" />
            <g className={cn(s.done, step.done)}>
              <circle cx="966" cy={y} r="9" fill={RED} />
              <path d={`M961.5 ${y} l3 3 l5.5 -6`} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x="986" y={y + 4.5} fontSize="12.5" fill={INK}>
              {step.label}
            </text>
            <text x="1144" y={y + 4} fontSize="10" fill={MUTED} textAnchor="end" className="font-mono">
              {step.time}
            </text>
          </g>
        );
      })}

      <rect x="960" y="322" width="184" height="6" rx="3" fill={PAPER} />
      <rect x="960" y="322" width="184" height="6" rx="3" fill={RED} className={s.progress} />

      <g className={s.building}>
        <circle cx="964" cy="356" r="4" fill={LINE_STRONG} />
        <text x="976" y="360" fontSize="11.5" fill={MUTED}>
          Deploying…
        </text>
      </g>
      <g className={s.live}>
        <circle cx="964" cy="356" r="4" fill={RED} className={s.led} />
        <text x="976" y="360" fontSize="11.5" fontWeight="600" fill={RED_INK}>
          Live in production
        </text>
      </g>
      <text x="1144" y="383" fontSize="10" fill={MUTED} textAnchor="end" className="font-mono">
        v2.4.0
      </text>
    </svg>
  );
}
