import type { CSSProperties, Ref } from "react";
import { brandLogo } from "../../lib/brand";
import { cn } from "../../lib/cn";
import styles from "./meca-robot.module.css";

/**
 * MECA, the mini robot mascot (decorative SVG, 64x80 units): a white shell with
 * a screen face that shows moods. Poses and moods are pure CSS (see
 * meca-robot.module.css); MecaAssistant moves it around and switches them.
 */

export type RobotPose =
  | "idle"
  | "walk"
  | "run"
  | "carry"
  | "hold"
  | "crouch"
  | "jump"
  | "wave"
  | "type"
  | "dance"
  | "sleep"
  | "fly"
  | "charge"
  /** Hovered while holding the preview laptop: lifts it up to show the visitor. */
  | "present";

export type RobotMood = "normal" | "happy" | "focus" | "sleep" | "wow";

const CYAN = "#7df9ff";
const SHELL = "#ffffff";
const SHELL_LINE = "#cdd3dc";

/** A cardboard box with tape and a little brand label. */
export function BoxArt({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill="#c98d4f" stroke="#8a5a2b" strokeWidth="1" />
      <line x1={x} y1={y + 4} x2={x + w} y2={y + 4} stroke="#8a5a2b" strokeWidth="0.8" opacity="0.55" />
      <rect x={x + w / 2 - 2.5} y={y} width="5" height={h} fill="#ecc690" opacity="0.9" />
      <rect x={x + 3} y={y + h - 6} width="6" height="3" rx="0.8" fill="var(--color-accent)" />
    </g>
  );
}

/** A little green software bug (faces left). */
export function BugArt() {
  return (
    <g>
      <g className={styles.bugLegs} stroke="var(--color-ink)" strokeWidth="1" strokeLinecap="round">
        <path d="M7 8.5 L5 11.5" />
        <path d="M11 9 L11 12" />
        <path d="M15 8.5 L17 11.5" />
      </g>
      <path d="M3.4 4.6 Q2 1.6 0.6 1.8 M4.6 4.2 Q4.4 1 3 0.6" fill="none" stroke="var(--color-ink)" strokeWidth="0.8" strokeLinecap="round" />
      <ellipse cx="11.5" cy="6.5" rx="6.8" ry="4.6" fill="#16a34a" />
      <path d="M11.5 2 V11" stroke="#0e6b31" strokeWidth="0.8" />
      <circle cx="9" cy="5.2" r="1" fill="#0e6b31" />
      <circle cx="14" cy="7.6" r="1" fill="#0e6b31" />
      <circle cx="4.4" cy="6.6" r="2.7" fill="var(--color-ink)" />
      <circle cx="3.6" cy="5.9" r="0.7" fill="#fff" />
    </g>
  );
}

export function MecaRobot({
  className,
  style,
  ref,
  pose = "idle",
  mood = "normal",
  dir = "right",
  carrying = false,
  placed = false,
  paused = false,
}: {
  className?: string;
  style?: CSSProperties;
  ref?: Ref<SVGSVGElement>;
  pose?: RobotPose;
  mood?: RobotMood;
  dir?: "left" | "right";
  carrying?: boolean;
  placed?: boolean;
  paused?: boolean;
}) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 64 80"
      aria-hidden
      className={cn(styles.robot, className)}
      style={style}
      data-pose={pose}
      data-mood={mood}
      data-dir={dir}
      data-carrying={carrying || undefined}
      data-placed={placed || undefined}
      data-paused={paused || undefined}
    >
      <ellipse className={styles.shadow} cx="32" cy="77" rx="15" ry="2.5" fill="var(--color-ink)" opacity="0.15" />

      <g className={styles.lean}>
        <g className={styles.bot}>
          {/* Jetpack flames */}
          <g className={styles.flame}>
            <path d="M21.5 75 Q25 88 28.5 75 Z" fill="#ffb020" />
            <path d="M23.5 75 Q25 82 26.5 75 Z" fill="#fff3b0" />
            <path d="M35.5 75 Q39 88 42.5 75 Z" fill="#ffb020" />
            <path d="M37.5 75 Q39 82 40.5 75 Z" fill="#fff3b0" />
          </g>

          {/* Legs + boots */}
          <g className={styles.legL}>
            <rect x="23" y="57" width="6" height="12" rx="3" fill="var(--color-ink)" />
            <rect x="19.5" y="67.5" width="11" height="8" rx="4" fill="var(--color-accent-strong)" />
            <rect x="21" y="68.5" width="5" height="2" rx="1" fill="#fff" opacity="0.3" />
          </g>
          <g className={styles.legR}>
            <rect x="35" y="57" width="6" height="12" rx="3" fill="var(--color-ink)" />
            <rect x="33.5" y="67.5" width="11" height="8" rx="4" fill="var(--color-accent-strong)" />
            <rect x="35" y="68.5" width="5" height="2" rx="1" fill="#fff" opacity="0.3" />
          </g>

          {/* Torso with the Mecatronix logo */}
          <rect x="17" y="39" width="30" height="22" rx="11" fill={SHELL} stroke={SHELL_LINE} strokeWidth="1.2" />
          <path d="M19.5 55.5 H44.5" stroke="#e6e9ee" strokeWidth="1.2" />
          <rect x="26" y="42.5" width="12" height="12" rx="3" fill="var(--color-ink)" />
          <image className={styles.badge} href={brandLogo.src} x="27.3" y="43.3" width="9.4" height="10.4" preserveAspectRatio="xMidYMid meet" />
          <rect x="28" y="35.5" width="8" height="4.5" rx="1.5" fill="var(--color-ink)" />

          {/* Battery (recharging) */}
          <g className={styles.battery}>
            <rect x="24" y="-17" width="15" height="9" rx="2" fill="#fff" stroke="var(--color-ink)" strokeWidth="1.2" />
            <rect x="39" y="-14.5" width="2" height="4" rx="0.8" fill="var(--color-ink)" />
            <rect className={styles.batteryFill} x="25.5" y="-15.5" width="12" height="6" rx="1" fill="#22c55e" />
            <path d="M32.5 -16 L29.5 -12.2 H32 L30.8 -9 L34 -13 H31.6 Z" fill="var(--color-ink)" />
          </g>

          {/* Head */}
          <g className={styles.head}>
            <path d="M32 9 Q32 5 35 3.2" fill="none" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" />
            <circle className={styles.antennaTip} cx="35.6" cy="2.8" r="2.7" fill="var(--color-accent)" />
            <circle cx="10" cy="24" r="5" fill="var(--color-accent-strong)" />
            <circle cx="10" cy="24" r="2" fill="#fff" opacity="0.45" />
            <circle cx="54" cy="24" r="5" fill="var(--color-accent-strong)" />
            <circle cx="54" cy="24" r="2" fill="#fff" opacity="0.45" />
            <rect x="10" y="8" width="44" height="30" rx="14" fill={SHELL} stroke={SHELL_LINE} strokeWidth="1.2" />
            <rect x="15" y="13" width="34" height="20" rx="9" fill="var(--color-ink)" />
            <path d="M18.5 17 Q20 14.8 24 14.6" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.28" />

            {/* Screen faces, one per mood */}
            <g className={cn(styles.face, styles.faceNormal)}>
              <g className={styles.eyes}>
                <g className={styles.pupils}>
                  <rect x="22" y="19" width="5" height="7" rx="2.5" fill={CYAN} />
                  <rect x="37" y="19" width="5" height="7" rx="2.5" fill={CYAN} />
                </g>
              </g>
              <path d="M29 29 Q32 31 35 29" fill="none" stroke={CYAN} strokeWidth="1.4" strokeLinecap="round" />
            </g>
            <g className={cn(styles.face, styles.faceHappy)} fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round">
              <path d="M21.5 24 Q24.5 19 27.5 24" />
              <path d="M36.5 24 Q39.5 19 42.5 24" />
              <path d="M28.5 27.6 Q32 32.4 35.5 27.6 Z" fill={CYAN} strokeWidth="1" />
            </g>
            <g className={cn(styles.face, styles.faceSleep)} stroke={CYAN} strokeWidth="1.8" strokeLinecap="round">
              <path d="M21.5 23 Q24.5 25 27.5 23" fill="none" />
              <path d="M36.5 23 Q39.5 25 42.5 23" fill="none" />
              <circle cx="32" cy="29" r="1.2" fill={CYAN} stroke="none" />
            </g>
            <g className={cn(styles.face, styles.faceFocus)}>
              <rect x="22" y="22.5" width="5" height="3" rx="1.5" fill={CYAN} />
              <rect x="37" y="22.5" width="5" height="3" rx="1.5" fill={CYAN} />
              <path d="M30 29.5 H34" stroke={CYAN} strokeWidth="1.4" strokeLinecap="round" />
            </g>
            <g className={cn(styles.face, styles.faceWow)}>
              <circle cx="24.5" cy="22" r="3.4" fill={CYAN} />
              <circle cx="39.5" cy="22" r="3.4" fill={CYAN} />
              <ellipse cx="32" cy="29.2" rx="1.9" ry="2.3" fill="none" stroke={CYAN} strokeWidth="1.4" />
            </g>
          </g>

          {/* Props held in front */}
          <g className={styles.carried}>
            <BoxArt x={19} y={43} w={26} h={19} />
          </g>
          <g className={styles.laptop}>
            <rect x="19" y="42.5" width="26" height="14.5" rx="2" fill="#2b3242" stroke="#4a5366" strokeWidth="1" />
            <circle className={styles.laptopLogo} cx="32" cy="49.5" r="2" fill="var(--color-accent)" />
            <path d="M15.5 60 H48.5 L45.5 56.5 H18.5 Z" fill="#b8c0cc" />
          </g>

          {/* Arms (drawn last so hands sit on the props) */}
          <g className={styles.armL}>
            <rect x="13.5" y="41" width="5" height="14" rx="2.5" fill="var(--color-ink)" />
            <circle cx="16" cy="56.5" r="3.6" fill={SHELL} stroke={SHELL_LINE} strokeWidth="1.2" />
          </g>
          <g className={styles.armR}>
            <rect x="45.5" y="41" width="5" height="14" rx="2.5" fill="var(--color-ink)" />
            <circle cx="48" cy="56.5" r="3.6" fill={SHELL} stroke={SHELL_LINE} strokeWidth="1.2" />
          </g>
        </g>
      </g>

      {/* Box set down at its feet */}
      <g className={styles.placed}>
        <BoxArt x={19} y={61} w={26} h={16} />
      </g>
    </svg>
  );
}

export { styles as mecaRobotStyles };
