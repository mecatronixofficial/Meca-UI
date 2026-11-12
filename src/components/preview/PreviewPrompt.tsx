"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type Ref } from "react";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { cn } from "../../lib/cn";
import styles from "./laptop.module.css";

/** Set when the visitor closes the laptop; MECA keeps holding it until the snooze ends. */
export const LAPTOP_DISMISSED_KEY = "meca-preview-prompt-dismissed";
export const LAPTOP_SNOOZE_MS = 3 * 24 * 60 * 60 * 1000;
/** Window events between the laptop and MECA (src/components/assistant/MecaAssistant.tsx). */
export const LAPTOP_EVENTS = {
  /** Laptop -> MECA: "come and get me", detail: { x } (laptop centre, viewport px). */
  fetch: "meca:fetch-laptop",
  /** MECA -> laptop: on the way. */
  coming: "meca:laptop-coming",
  /** MECA -> laptop: picked up, disappear now. */
  picked: "meca:laptop-picked",
} as const;

const DELAY_MS = 3000;
const CLOSE_MS = 650;

/** What the laptop screen "types": a business the visitor might run, in its brand colour. */
const BUSINESSES: [label: string, color: string][] = [
  ["clinic", "#0f9f9a"],
  ["online store", "#7c3aed"],
  ["textile mill", "#b45309"],
  ["school", "#1d4ed8"],
  ["restaurant", "#dc2626"],
  ["factory", "#c2410c"],
  ["startup", "#6d28d9"],
  ["gym", "#e11d48"],
];

type Phase = "hidden" | "open" | "closing" | "waiting" | "gone";

/**
 * "Preview your own website" notification: a tiny 3D laptop that rises in at the bottom-left,
 * opens its lid and types the kinds of business it can build a site for.
 * Closing it doesn't just hide it: the lid shuts and MECA the robot runs over, picks the
 * laptop up and carries it home (and keeps holding it for three days).
 */
export default function PreviewPrompt() {
  const pathname = usePathname() ?? "";
  const [phase, setPhase] = useState<Phase>("hidden");
  const laptopRef = useRef<HTMLDivElement>(null);
  const skip = pathname.startsWith("/preview") || pathname.startsWith("/contact");

  useEffect(() => {
    if (skip) return;
    let snoozed = false;
    try {
      snoozed = Date.now() - Number(localStorage.getItem(LAPTOP_DISMISSED_KEY) ?? 0) < LAPTOP_SNOOZE_MS;
    } catch {
      // Storage blocked: just show it
    }
    if (snoozed) return;
    const timer = window.setTimeout(() => setPhase("open"), DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [skip]);

  useEffect(() => {
    if (phase !== "waiting") return;
    const onPicked = () => setPhase("gone");
    window.addEventListener(LAPTOP_EVENTS.picked, onPicked);
    // Safety net: never leave a closed laptop lying around
    const timer = window.setTimeout(() => setPhase("gone"), 20000);
    return () => {
      window.removeEventListener(LAPTOP_EVENTS.picked, onPicked);
      window.clearTimeout(timer);
    };
  }, [phase]);

  if (skip || phase === "hidden") return null;

  const dismiss = () => {
    try {
      localStorage.setItem(LAPTOP_DISMISSED_KEY, String(Date.now()));
    } catch {
      // Ignore
    }
    setPhase("closing");
    // Once the lid is shut, call MECA over. It answers synchronously; no answer means it can't come.
    window.setTimeout(() => {
      let coming = false;
      const onComing = () => (coming = true);
      window.addEventListener(LAPTOP_EVENTS.coming, onComing);
      const rect = laptopRef.current?.getBoundingClientRect();
      window.dispatchEvent(new CustomEvent(LAPTOP_EVENTS.fetch, { detail: { x: rect ? rect.left + rect.width / 2 : 80 } }));
      window.removeEventListener(LAPTOP_EVENTS.coming, onComing);
      setPhase(coming ? "waiting" : "gone");
    }, CLOSE_MS);
  };

  const closed = phase !== "open";

  return (
    <aside
      aria-label="Free website preview"
      aria-hidden={closed || undefined}
      className="fixed bottom-3 left-3 z-[45] sm:bottom-5 sm:left-5"
      onAnimationEnd={(e) => e.animationName.includes("picked") && setPhase("hidden")}
    >
      <div className={cn(styles.notify, closed && styles.closed, phase === "gone" && styles.picked)}>
        <div className={styles.float}>
          {/* Notification header */}
          <div className={cn(styles.header, "mb-1 flex items-center justify-between gap-2 pl-1")}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white shadow-soft">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-glow opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent-glow" />
              </span>
              New · Free website preview
            </span>
            <button
              type="button"
              onClick={dismiss}
              disabled={closed}
              aria-label="Close"
              className="grid size-7 place-items-center rounded-full border border-line bg-white text-muted shadow-soft hover:text-accent-ink"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <Link
            href="/preview"
            tabIndex={closed ? -1 : undefined}
            className={cn(styles.scene, "rounded-2xl focus-visible:outline-2 focus-visible:outline-accent", closed && "pointer-events-none")}
          >
            <span className="sr-only">Preview your own website — free, in 60 seconds</span>
            <LaptopVisual ref={laptopRef} />
          </Link>
        </div>
      </div>
    </aside>
  );
}

/** Wrap LaptopVisual in an element with this class to give it its 3D perspective. */
export const laptopSceneClass = styles.scene;

/**
 * The 3D laptop: the lid opens on mount and the screen types business names.
 * Natural size is about 264 x 200px; scale it with a transform.
 */
export function LaptopVisual({ ref }: { ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className={styles.laptop} aria-hidden>
      <div className={styles.lid}>
        <div className={styles.screen}>
          <Screen />
        </div>
      </div>
      <div className={styles.deck} />
      <div className={styles.lip} />
    </div>
  );
}

/** The mini website on the laptop screen. */
function Screen() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(BUSINESSES[0]![0]);
  const [label, color] = BUSINESSES[index]!;

  // Type the business name, hold, erase, move on to the next one
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let chars = 0;
    let phase: "type" | "hold" | "erase" = "type";
    let wait = 0;
    const timer = window.setInterval(() => {
      if (phase === "type") {
        chars += 1;
        setTyped(label.slice(0, chars));
        if (chars >= label.length) phase = "hold";
      } else if (phase === "hold") {
        wait += 1;
        if (wait > 22) phase = "erase";
      } else {
        chars -= 1;
        setTyped(label.slice(0, Math.max(0, chars)));
        if (chars <= 0) {
          window.clearInterval(timer);
          setIndex((i) => (i + 1) % BUSINESSES.length);
        }
      }
    }, 70);
    return () => window.clearInterval(timer);
  }, [label]);

  return (
    <div className="flex h-full flex-col" style={{ "--brand": color } as CSSProperties}>
      {/* Browser bar */}
      <div className="flex items-center gap-1 border-b border-line bg-paper px-2 py-1">
        <span className="size-1.5 rounded-full bg-[#ff5f57]" />
        <span className="size-1.5 rounded-full bg-[#febc2e]" />
        <span className="size-1.5 rounded-full bg-[#28c840]" />
        <span className="ml-1.5 flex-1 truncate rounded bg-white px-1.5 py-px text-center font-mono text-[6.5px] text-muted-ink">www.your{label.replace(/\s+/g, "")}.com</span>
      </div>

      {/* Page */}
      <div className="relative flex flex-1 gap-2 overflow-hidden px-2.5 pt-2">
        <div aria-hidden className={cn(styles.brandFill, "absolute -right-6 -top-8 size-24 rounded-full opacity-20 blur-xl")} style={{ background: color }} />
        <div className="relative flex min-w-0 flex-1 flex-col">
          <span className={cn(styles.brandFill, "inline-flex w-fit items-center gap-1 rounded-full px-1.5 py-px text-[7.5px] font-semibold text-white")} style={{ background: color }}>
            <Sparkles className="size-2" /> Free · 60 sec
          </span>
          <p className="mt-1.5 font-display text-[15px] font-bold leading-[1.05] tracking-tight text-ink">Preview your own website</p>
          <p className="mt-1 h-3.5 text-[10px] font-medium text-muted-ink">
            for your{" "}
            <span className={styles.brandFill} style={{ color }}>
              {typed}
            </span>
            <span className={styles.caret} style={{ color }} />
          </p>
          <span
            className={cn(styles.brandFill, styles.pulse, "mt-1.5 inline-flex w-fit items-center gap-1 rounded-full px-2 py-1 text-[9.5px] font-semibold text-white")}
            style={{ background: color }}
          >
            Try it free <ArrowRight className="size-2.5" />
          </span>
        </div>
        {/* Mini hero image + cards */}
        <div className="relative flex w-[64px] shrink-0 flex-col gap-1">
          <div className={cn(styles.brandFill, "h-11 rounded-md")} style={{ background: `linear-gradient(140deg, ${color}, color-mix(in oklab, ${color} 35%, white))` }} />
          <div className="grid grid-cols-2 gap-1">
            <div className="h-6 rounded bg-paper ring-1 ring-line" />
            <div className="h-6 rounded bg-paper ring-1 ring-line" />
          </div>
          <div className="h-1.5 w-3/4 rounded-full bg-line" />
        </div>
      </div>

      {/* Footer strip */}
      <div className="flex gap-1 px-2.5 pb-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-3 flex-1 rounded bg-paper ring-1 ring-line" />
        ))}
      </div>
    </div>
  );
}
