import { cn } from "../../lib/cn";
import { PauseOffscreen } from "../animations/PauseOffscreen";
import styles from "./Backdrop.module.css";

type Css = React.CSSProperties & Record<`--${string}`, string | number>;

// Fixed positions (not Math.random) so server and client render the same markup
const BEAMS_Y = [
  { at: 3, dur: "7s", delay: "0s" },
  { at: 8, dur: "9s", delay: "2.4s" },
  { at: 13, dur: "8s", delay: "4.1s" },
  { at: 17, dur: "10s", delay: "1.2s" },
  { at: 22, dur: "7.5s", delay: "5.6s" },
  { at: 26, dur: "9.5s", delay: "3.3s" },
];

const BEAMS_X = [
  { at: 2, dur: "11s", delay: "1.8s" },
  { at: 6, dur: "9s", delay: "6s" },
  { at: 11, dur: "12s", delay: "3.7s" },
];

const MOTES = [
  { x: "8%", y: "72%", s: "3px", dx: "18px", dur: "11s", delay: "0s" },
  { x: "17%", y: "40%", s: "2px", dx: "-14px", dur: "13s", delay: "3s" },
  { x: "29%", y: "86%", s: "4px", dx: "22px", dur: "12s", delay: "6s" },
  { x: "41%", y: "58%", s: "2px", dx: "-20px", dur: "10s", delay: "1.5s" },
  { x: "53%", y: "78%", s: "3px", dx: "12px", dur: "14s", delay: "4.5s" },
  { x: "64%", y: "35%", s: "2px", dx: "-10px", dur: "11s", delay: "7s" },
  { x: "72%", y: "66%", s: "4px", dx: "16px", dur: "13s", delay: "2.2s" },
  { x: "83%", y: "48%", s: "3px", dx: "-18px", dur: "12s", delay: "5.2s" },
  { x: "91%", y: "80%", s: "2px", dx: "10px", dur: "10s", delay: "8s" },
  { x: "47%", y: "26%", s: "2px", dx: "14px", dur: "15s", delay: "9.5s" },
];

const RINGS = ["0%", "12%", "24%", "36%"];

export interface BackdropProps {
  tone?: "light" | "dark";
  /** Background artwork from /public/assets/backgrounds */
  image?: "circuit" | "contours";
  /** Extra classes for the image layer, e.g. a mask that fades it out */
  imageClassName?: string;
  aurora?: boolean;
  beams?: boolean;
  motes?: boolean;
  rings?: boolean;
  sweep?: boolean;
  grain?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Decorative, animated section background. Place it as the first child of a
 * `relative` section; following content needs `relative` to sit above it.
 */
export function Backdrop({
  tone = "light",
  image,
  imageClassName,
  aurora,
  beams,
  motes,
  rings,
  sweep,
  grain = true,
  className,
  children,
}: BackdropProps) {
  return (
    <PauseOffscreen className={cn("pointer-events-none absolute inset-0", className)}>
      <div aria-hidden className={cn(styles.root, tone === "dark" && styles.dark)}>
        {image && <div className={cn(styles.image, styles[image], imageClassName)} />}

        {aurora && (
          <>
            <div className={cn(styles.blob, styles.blobA)} />
            <div className={cn(styles.blob, styles.blobB)} />
            <div className={cn(styles.blob, styles.blobC)} />
          </>
        )}

        {beams && (
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_35%,black,transparent)]">
            <div className={styles.grid} />
            {BEAMS_Y.map((b) => (
              <span key={`y${b.at}`} className={cn(styles.beam, styles.beamY)} style={{ "--at": b.at, "--dur": b.dur, "--delay": b.delay } as Css} />
            ))}
            {BEAMS_X.map((b) => (
              <span key={`x${b.at}`} className={cn(styles.beam, styles.beamX)} style={{ "--at": b.at, "--dur": b.dur, "--delay": b.delay } as Css} />
            ))}
          </div>
        )}

        {rings && (
          <div className={styles.rings}>
            {RINGS.map((inset, i) => (
              <span key={inset} className={cn(styles.ring, i === 1 && styles.ringDashed, i === 2 && styles.ringSpin)} style={{ "--inset": inset } as Css} />
            ))}
            {["0s", "2.3s", "4.6s"].map((delay) => (
              <span key={delay} className={styles.pulse} style={{ "--delay": delay } as Css} />
            ))}
          </div>
        )}

        {motes &&
          MOTES.map((m) => (
            <span
              key={m.x + m.y}
              className={styles.mote}
              style={{ "--x": m.x, "--y": m.y, "--s": m.s, "--dx": m.dx, "--dur": m.dur, "--delay": m.delay } as Css}
            />
          ))}

        {sweep && <div className={styles.sweep} />}
        {grain && <div className={styles.grain} />}
        {children}
      </div>
    </PauseOffscreen>
  );
}
