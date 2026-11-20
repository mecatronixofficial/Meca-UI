"use client";

import dynamic from "next/dynamic";
import localFont from "next/font/local";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { splitHighlight, type MecaBoard } from "../../lib/meca-board";
import { LAPTOP_DISMISSED_KEY, LAPTOP_EVENTS, LAPTOP_SNOOZE_MS, LaptopVisual, laptopSceneClass } from "../preview/PreviewPrompt";
import { MecaRobot, mecaRobotStyles as styles } from "./MecaRobot";
import type { RobotScene, RobotState } from "./robot3d";

// The panel (and its logic) is only downloaded when someone opens it
const MecaPanel = dynamic(() => import("./MecaPanel"), { ssr: false });

// Handwriting for MECA's board (Caveat, OFL). Not preloaded: the board appears a few seconds in.
const handwriting = localFont({ src: "../../app/fonts/caveat-latin-wght-normal.woff2", weight: "400 700", display: "swap", preload: false });

/** How long the board stays up: raise, then three shakes with still moments between. */
const BOARD_SHAKES = 3;
const BOARD_SHAKE_MS = 1400;
const BOARD_STILL_MS = 1900;

/** Speeds, px per second. */
const WALK = 70;
const RUN = 90;
const BUG = 105;
const FLY = 110;

const LEFT = -Math.PI / 2;
const RIGHT = Math.PI / 2;
const FRONT = 0;

type Fx = "zzz" | "notes" | "code" | "sparkle";
const FX_GLYPHS: Record<Fx, [string, string, string]> = {
  zzz: ["z", "Z", "z"],
  notes: ["♪", "♫", "♪"],
  code: ["</>", "{ }", "01"],
  sparkle: ["✦", "✧", "✦"],
};

class Cancelled extends Error {}
const nextFrame = () => new Promise<number>((resolve) => requestAnimationFrame(resolve));
const between = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * MECA's handwritten board, held overhead (its bottom edge sits in MECA's raised hands).
 * Links to `board.link`; a full URL opens in a new tab.
 */
function BoardSign({
  board,
  shaking,
  onPointerEnter,
  onPointerLeave,
}: {
  board: MecaBoard;
  shaking: boolean;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  const [before, marked, after] = splitHighlight(board.text, board.highlight);
  const external = /^https?:\/\//i.test(board.link);
  const className = cn(styles.board, handwriting.className, "pointer-events-auto");
  // The shake is on an inner wrapper, so the board's pop-in plays only once
  const content = (
    <span className={cn(styles.boardSwing, shaking && styles.boardShake)}>
      <span className={styles.boardFace}>
        {before}
        {marked && <mark className={styles.boardMark}>{marked}</mark>}
        {after}
        <span aria-hidden className={styles.boardCta}>
          Try it <ArrowRight className="size-3" />
        </span>
      </span>
      <span aria-hidden className={cn(styles.boardGrip, styles.boardGripL)} />
      <span aria-hidden className={cn(styles.boardGrip, styles.boardGripR)} />
    </span>
  );
  return external ? (
    <a href={board.link} target="_blank" rel="noopener noreferrer" className={className} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      {content}
    </a>
  ) : (
    <Link href={board.link} className={className} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      {content}
    </Link>
  );
}

/** The angle equivalent to `target` (mod 2π) closest to `from`, so turns take the short way. */
const nearest = (from: number, target: number) => target + Math.round((from - target) / (Math.PI * 2)) * Math.PI * 2;

/**
 * MECA: a 3D mini robot (three.js, loaded after the page is idle) that lives in the
 * bottom-right corner and opens the chat. Between rests it delivers project boxes,
 * codes, hunts bugs, patrols, dances and spins, naps, flies a jetpack and recharges:
 * turning its body, making U-turns and turning its head as it goes. Hovering stops
 * it to face you; its head follows the cursor. A flat SVG MECA shows until the 3D
 * one is ready (and stays if WebGL is unavailable).
 *
 * MECA's board (`board`, from the admin panel): when the site opens, MECA raises a handwritten
 * board ("Preview your website for free") overhead and shakes it, then again every
 * `board.intervalMinutes`. Clicking the board opens `board.link`. Not shown on the preview pages.
 */
export default function MecaAssistant({ board = null }: { board?: MecaBoard | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  /** The board is up / being shaken. */
  const [sign, setSign] = useState(false);
  const [signShake, setSignShake] = useState(false);
  const activeBoard = pathname?.startsWith("/preview") ? null : board;
  // Read by the running routine without restarting it
  const boardRef = useRef(activeBoard);
  boardRef.current = activeBoard;
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [ready, setReady] = useState(false);
  /** Bumped when the visitor closes the preview laptop, to start the fetch. */
  const [fetchKey, setFetchKey] = useState(0);
  const [fx, setFx] = useState<Fx | null>(null);
  const [say, setSay] = useState<string | null>(null);
  /** Mirrors scene.state.holdingLaptop, for the "want a preview?" card. */
  const [holding, setHolding] = useState(false);
  const leaveTimer = useRef(0);
  /** Pointer is on the laptop in MECA's hand (stays on while over the robot or the card). */
  const [laptopHot, setLaptopHot] = useState(false);
  /** Pointer over the robot button or the card. */
  const overRef = useRef(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<RobotScene | null>(null);
  /** `lastSign`: when the board was last raised (0 = not yet, so it goes up when the site opens). */
  const ctl = useRef<{ gen: number; paused: boolean; laptopX: number | null; lastSign: number }>({ gen: 0, paused: false, laptopX: null, lastSign: 0 });

  // Load the 3D robot once the page is idle
  useEffect(() => {
    let cancelled = false;
    const start = () => {
      import("./robot3d")
        .then(({ createRobotScene }) => {
          if (cancelled || !canvasRef.current || !overlayRef.current) return;
          sceneRef.current = createRobotScene(canvasRef.current, overlayRef.current, {
            reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            onLaptopHover: (over) => {
              if (over) {
                window.clearTimeout(leaveTimer.current);
                setLoaded(true);
                setLaptopHot(true);
              } else if (!overRef.current) {
                leaveRef.current();
              }
            },
          });
          // Still holding the laptop the visitor put away earlier
          try {
            sceneRef.current.state.holdingLaptop = Date.now() - Number(localStorage.getItem(LAPTOP_DISMISSED_KEY) ?? 0) < LAPTOP_SNOOZE_MS;
            setHolding(sceneRef.current.state.holdingLaptop);
          } catch {
            // Storage blocked
          }
          setReady(true);
        })
        .catch((error) => console.warn("MECA 3D is unavailable, using the flat robot.", error));
    };
    const idle = window.requestIdleCallback ? window.requestIdleCallback(start, { timeout: 2500 }) : window.setTimeout(start, 1200);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    const engaged = hovered || laptopHot;
    ctl.current.paused = engaged;
    if (sceneRef.current) {
      sceneRef.current.state.hovered = engaged;
      sceneRef.current.state.presenting = laptopHot;
    }
  }, [hovered, laptopHot, ready]);

  // The visitor closed the preview laptop: answer at once (so it waits for us), then go and get it
  useEffect(() => {
    if (!ready || open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onFetch = (event: Event) => {
      ctl.current.laptopX = (event as CustomEvent<{ x: number }>).detail?.x ?? 80;
      window.dispatchEvent(new Event(LAPTOP_EVENTS.coming));
      setFetchKey((k) => k + 1);
    };
    window.addEventListener(LAPTOP_EVENTS.fetch, onFetch);
    return () => window.removeEventListener(LAPTOP_EVENTS.fetch, onFetch);
  }, [ready, open]);

  // The routine (or the walk home while the chat is open)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!ready || !scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const s: RobotState = scene.state;
    const c = ctl.current;
    const gen = ++c.gen;
    const alive = () => {
      if (c.gen !== gen) throw new Cancelled();
    };

    async function wait(ms: number, ignorePause = false) {
      let last = await nextFrame();
      while (ms > 0) {
        const now = await nextFrame();
        alive();
        if (ignorePause || !c.paused) ms -= Math.min(now - last, 100);
        last = now;
      }
    }

    /** Moves something along the ground at `speed` px/s (pauses while hovered unless told not to). */
    async function glide(get: () => number, set: (x: number) => void, target: number, speed: number, ignorePause = false) {
      let last = await nextFrame();
      while (get() !== target) {
        const now = await nextFrame();
        alive();
        if (ignorePause || !c.paused) {
          const step = (speed * Math.min(now - last, 100)) / 1000;
          const x = get();
          set(x < target ? Math.min(target, x + step) : Math.max(target, x - step));
        }
        last = now;
      }
    }
    const walkTo = (target: number, speed = WALK, ignorePause = false) => glide(() => s.x, (x) => (s.x = x), target, speed, ignorePause);

    /** Turns the body (short way round) and waits for the turn. */
    async function turn(angle: number, ms = 450, ignorePause = false) {
      s.yaw = nearest(s.yaw, angle);
      await wait(ms, ignorePause);
    }
    /** About-face, swinging round through the back (or the front). */
    async function uTurn(via: "back" | "front" = "back") {
      const facingLeft = Math.sin(s.yaw) < 0;
      s.yaw += (facingLeft === (via === "back") ? -1 : 1) * Math.PI;
      await wait(650);
    }

    const reach = () => {
      const w = window.innerWidth;
      return Math.round(w < 640 ? w * 0.4 : Math.min(440, w * 0.3));
    };

    const reset = () => {
      Object.assign(s, { carrying: false, placed: false, box: null, bug: null, headYaw: null, altitude: 0, mood: "normal", signShake: false });
      if (s.pose === "sign") s.pose = "idle";
      setFx(null);
      setSay(null);
      setSign(false);
      setSignShake(false);
    };

    async function goHome() {
      reset();
      if (s.x > 0) {
        s.pose = "walk";
        await turn(RIGHT, 350, true);
        await walkTo(0, WALK, true);
      }
      s.pose = "idle";
      await turn(FRONT, 0, true);
    }

    async function walkHome() {
      s.pose = "idle";
      await turn(RIGHT, 400);
      s.pose = "walk";
      await walkTo(0);
      s.pose = "idle";
      await turn(FRONT, 400);
    }

    /* ---------- Activities ---------- */

    /** A project box drops in; MECA fetches it, U-turns, carries it home and celebrates. */
    async function deliver() {
      const d = reach();
      s.box = d + 26;
      s.headYaw = -1;
      s.mood = "wow";
      setSay("Ooh, a new project!");
      await wait(1500);
      setSay(null);
      s.headYaw = null;
      s.mood = "normal";
      await turn(LEFT);
      s.pose = "walk";
      await walkTo(d);
      s.pose = "crouch";
      await wait(450);
      s.box = null;
      s.carrying = true;
      s.mood = "happy";
      await wait(350);
      s.pose = "hold";
      await uTurn("back");
      s.pose = "carry";
      setSay("Delivering…");
      await walkTo(0);
      setSay(null);
      s.pose = "hold";
      await turn(FRONT);
      s.pose = "crouch";
      await wait(350);
      s.carrying = false;
      s.placed = true;
      await wait(300);
      s.pose = "jump";
      setSay("Shipped!");
      await wait(1000);
      s.placed = false;
      s.pose = "wave";
      await wait(1500);
      setSay(null);
    }

    /** Types away on a laptop, then deploys. */
    async function code() {
      await turn(FRONT, 300);
      s.pose = "type";
      s.mood = "focus";
      setFx("code");
      setSay("Writing code…");
      await wait(1800);
      setSay(null);
      await wait(2400);
      setFx(null);
      s.mood = "happy";
      s.pose = "jump";
      setSay("Deployed!");
      await wait(1000);
      s.pose = "idle";
      await wait(600);
      setSay(null);
    }

    /** A bug scuttles off; MECA turns its head, chases it down and stomps it. */
    async function bugHunt() {
      const d = reach();
      s.bug = { x: 84, squashed: false };
      s.headYaw = -1.1;
      s.mood = "wow";
      setSay("A bug?!");
      await wait(900);
      setSay(null);
      s.headYaw = null;
      s.mood = "normal";
      await turn(LEFT, 300);
      s.pose = "run";
      const bug = s.bug;
      await Promise.all([
        glide(() => bug.x, (x) => (bug.x = x), d + 31, BUG),
        (async () => {
          await wait(300);
          await walkTo(d, RUN);
        })(),
      ]);
      s.pose = "jump";
      await wait(480);
      bug.squashed = true;
      s.pose = "idle";
      await turn(FRONT, 200);
      s.mood = "happy";
      setFx("sparkle");
      setSay("Bug fixed!");
      await wait(1500);
      setFx(null);
      setSay(null);
      s.bug = null;
      s.mood = "normal";
      await walkHome();
    }

    /** Walks out, looks around (head turns), about-faces and heads back. */
    async function patrol() {
      await turn(LEFT);
      s.pose = "walk";
      await walkTo(Math.round(reach() * 0.6));
      s.pose = "idle";
      await turn(FRONT);
      s.headYaw = -1;
      await wait(800);
      s.headYaw = 1;
      await wait(900);
      s.headYaw = null;
      s.mood = "happy";
      setSay("All systems go!");
      await wait(1400);
      setSay(null);
      s.mood = "normal";
      await walkHome();
    }

    /** Dances, then finishes with a full spin. */
    async function dance() {
      await turn(FRONT, 300);
      s.pose = "dance";
      s.mood = "happy";
      setFx("notes");
      await wait(3200);
      s.yaw += Math.PI * 2;
      await wait(900);
      setFx(null);
      s.pose = "idle";
      s.mood = "normal";
    }

    /** Dozes off, then wakes with a start. */
    async function nap() {
      await turn(FRONT, 300);
      s.pose = "sleep";
      s.mood = "sleep";
      setFx("zzz");
      await wait(4800);
      setFx(null);
      s.pose = "idle";
      s.mood = "wow";
      setSay("Huh? I'm awake!");
      await wait(1600);
      setSay(null);
      s.mood = "normal";
    }

    /** Jetpack: lifts off, flies left, U-turns in the air and lands back home. */
    async function jetpack() {
      await turn(FRONT, 300);
      s.pose = "crouch";
      await wait(300);
      s.pose = "fly";
      s.mood = "happy";
      s.altitude = 1.5;
      setSay("Wheee!");
      await wait(600);
      await turn(LEFT, 300);
      await walkTo(FLY, FLY);
      setSay(null);
      await uTurn("front");
      await walkTo(0, FLY);
      await turn(FRONT, 300);
      s.altitude = 0;
      await wait(700);
      s.pose = "idle";
      s.mood = "normal";
    }

    async function recharge() {
      await turn(FRONT, 300);
      s.pose = "charge";
      s.mood = "sleep";
      await wait(3200);
      s.mood = "happy";
      s.pose = "jump";
      setSay("100% charged!");
      await wait(1000);
      s.pose = "idle";
      await wait(700);
      setSay(null);
      s.mood = "normal";
    }

    async function hello() {
      await turn(FRONT, 300);
      s.pose = "wave";
      s.mood = "happy";
      setSay("Need software? Ask me!");
      await wait(2400);
      setSay(null);
      s.mood = "normal";
    }

    /** Raises the board overhead and shakes it a few times, then lowers it. */
    async function signBoard() {
      c.lastSign = Date.now();
      await turn(FRONT, 300);
      s.headYaw = null;
      s.pose = "sign";
      s.mood = "happy";
      await wait(350);
      setSign(true);
      await wait(400);
      for (let i = 0; i < BOARD_SHAKES; i++) {
        s.signShake = true;
        setSignShake(true);
        await wait(BOARD_SHAKE_MS);
        s.signShake = false;
        setSignShake(false);
        await wait(BOARD_STILL_MS);
      }
      setSign(false);
      await wait(250);
      s.pose = "idle";
      s.mood = "normal";
    }

    /** Time for the board again (first time: as soon as the site opens). */
    const boardDue = () => {
      const b = boardRef.current;
      return Boolean(b) && Date.now() - c.lastSign >= (b?.intervalMinutes ?? 3) * 60_000;
    };

    /** Runs across to the closed laptop, picks it up and carries it home. */
    async function fetchLaptop(laptopX: number) {
      reset();
      const margin = window.innerWidth >= 640 ? 20 : 12;
      // Stop just to the right of the laptop, facing it
      const target = Math.max(0, Math.round(window.innerWidth - margin - 42 - laptopX - 56));
      s.pose = "idle";
      await turn(FRONT, 200);
      s.headYaw = -1.1;
      s.mood = "wow";
      setSay("Oh! I'll grab that!");
      await wait(800);
      setSay(null);
      s.headYaw = null;
      s.mood = "normal";
      await turn(LEFT, 300);
      s.pose = "run";
      await walkTo(target, 320);
      s.pose = "crouch";
      await wait(450);
      window.dispatchEvent(new Event(LAPTOP_EVENTS.picked));
      s.holdingLaptop = true;
      setHolding(true);
      s.mood = "happy";
      await wait(350);
      s.pose = "idle";
      await uTurn("back");
      s.pose = "walk";
      setSay("Got it! I'll keep it safe.");
      await walkTo(0, 240);
      setSay(null);
      s.pose = "idle";
      await turn(FRONT, 400);
      s.mood = "normal";
    }

    async function routine() {
      if (c.laptopX !== null) {
        const x = c.laptopX;
        c.laptopX = null;
        await fetchLaptop(x);
      } else {
        await goHome();
      }
      await wait(2500);
      const acts = [deliver, code, bugHunt, dance, patrol, hello, jetpack, nap, deliver, recharge, bugHunt];
      for (let i = 0; ; i++) {
        // The board comes first when the site opens, then whenever its interval has passed
        if (boardDue()) {
          await signBoard();
          s.pose = "idle";
          await wait(between(3000, 5000));
        }
        await acts[i % acts.length]();
        s.pose = "idle";
        await wait(between(4000, 7000));
      }
    }

    (open ? goHome() : routine()).catch((error) => {
      if (!(error instanceof Cancelled)) console.error(error);
    });
    return () => {
      c.gen++;
    };
  }, [open, ready, fetchKey]);

  // On the laptop in MECA's hand: it lifts the laptop and offers a preview. On the robot itself: the usual hello.
  const presenting = laptopHot && holding && ready && !open;
  const showBoard = sign && !open && activeBoard !== null;
  const bubble = showBoard ? null : (hovered || laptopHot) && !open ? (presenting ? null : "Hi, I'm MECA! Click to chat.") : say;

  // Shared by the robot and the card, with a short grace period to move between them
  const enter = () => {
    overRef.current = true;
    window.clearTimeout(leaveTimer.current);
    setLoaded(true);
    setHovered(true);
  };
  const leave = () => {
    overRef.current = false;
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => {
      setHovered(false);
      setLaptopHot(false);
    }, 280);
  };
  const leaveRef = useRef(leave);
  leaveRef.current = leave;
  const shownFx = hovered ? null : fx;

  return (
    <>
      {loaded && <MecaPanel open={open} onClose={() => setOpen(false)} />}

      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn("pointer-events-none fixed bottom-0 right-0 z-40 transition-opacity duration-500", ready ? "opacity-100" : "opacity-0")}
      />

      <div className="pointer-events-none fixed bottom-3 right-3 z-40 sm:bottom-5 sm:right-5">
        <div ref={overlayRef} className="relative will-change-transform">
          {shownFx && (
            <span aria-hidden className={cn(styles.fx, "absolute bottom-[96px] right-3 h-0 w-16 font-mono text-[15px] text-accent-ink")}>
              {FX_GLYPHS[shownFx].map((glyph, i) => (
                <span key={i}>{glyph}</span>
              ))}
            </span>
          )}

          {bubble && (
            <span
              key={bubble}
              aria-hidden
              className={cn(
                styles.bubble,
                "absolute bottom-full right-0 mb-1 whitespace-nowrap rounded-2xl rounded-br-sm border border-line bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink shadow-window",
              )}
            >
              {bubble}
            </span>
          )}

          {showBoard && activeBoard && <BoardSign board={activeBoard}shaking={signShake && !hovered} onPointerEnter={enter} onPointerLeave={leave} />}

          {presenting && (
            <div
              onPointerEnter={enter}
              onPointerLeave={leave}
              className={cn(styles.bubble, "pointer-events-auto absolute bottom-full right-0 mb-2 w-[224px] rounded-2xl border border-line bg-white p-3.5 shadow-window")}
            >
              <p className="font-display text-[15px] font-semibold leading-snug text-ink">Want to preview your website?</p>
              <p className="mt-0.5 text-[12px] text-muted-ink">Free · ready in 60 seconds</p>
              <Link href="/preview" className="mt-2 block rounded-xl focus-visible:outline-2 focus-visible:outline-accent" aria-label="Preview your own website">
                <span className="relative mx-auto block h-[134px] w-[160px]">
                  <span className={cn(laptopSceneClass, "absolute left-0 top-0 origin-top-left scale-[0.6]")}>
                    <LaptopVisual />
                  </span>
                </span>
              </Link>
              <Link
                href="/preview"
                className="mt-2 flex h-9 items-center justify-center gap-1.5 rounded-xl bg-accent-strong text-[13px] font-semibold text-white hover:bg-accent-ink"
              >
                Yes, show me <ArrowRight className="size-4" />
              </Link>
              <span aria-hidden className="absolute -bottom-1.5 right-9 size-3 rotate-45 border-b border-r border-line bg-white" />
            </div>
          )}

          <button
            type="button"
            onClick={(event) => {
              setLoaded(true);
              // A click or tap on the laptop offers the preview instead of opening the chat
              if (!open && event.detail > 0 && sceneRef.current?.hitsLaptop(event.clientX, event.clientY)) {
                setLaptopHot(true);
                return;
              }
              setOpen((v) => !v);
            }}
            onPointerEnter={enter}
            onPointerLeave={leave}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            aria-expanded={open}
            aria-controls="meca-panel"
            aria-label={open ? "Close MECA chat" : "Ask MECA, the Mecatronix assistant"}
            className="pointer-events-auto flex h-[112px] w-[84px] cursor-pointer items-end justify-center rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {/* Flat MECA until the 3D one is ready */}
            {!ready && <MecaRobot className="h-[98px] w-[78px]" />}
          </button>
        </div>
      </div>
    </>
  );
}
