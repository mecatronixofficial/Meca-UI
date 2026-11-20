"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Maximize2, X } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Renders children at a fixed "desktop" width and scales them down to fit the
 * available space — a live thumbnail of a full page, inside a browser window.
 * "View full page" opens the same page at real size in a full-screen dialog.
 */
export function ScaledFrame({ children, width = 1280, url, className, maxHeight }: { children: ReactNode; width?: number; url?: string; className?: string; maxHeight?: number }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [scale, setScale] = useState(0.4);
  const [height, setHeight] = useState(0);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const measure = () => {
      setScale(o.clientWidth / width);
      setHeight(i.offsetHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(o);
    observer.observe(i);
    return () => observer.disconnect();
  }, [width]);

  // Modal dialog (Esc closes it, focus stays inside); the page behind stops scrolling
  useEffect(() => {
    if (!full) return;
    dialog.current?.showModal();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [full]);

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-line bg-white shadow-window", className)}>
      <div className="flex items-center gap-3 border-b border-line bg-paper px-4 py-2.5">
        <TrafficLights />
        {url && <span className="min-w-0 flex-1 truncate rounded-md bg-white px-3 py-1 text-center font-mono text-[11.5px] text-muted-ink">{url}</span>}
        <button
          type="button"
          onClick={() => setFull(true)}
          className="group ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-[12px] font-semibold text-surface transition-[color,background-color,border-color,box-shadow] duration-300 hover:border-accent hover:bg-accent hover:text-white hover:shadow-glow"
        >
          <Maximize2 aria-hidden className="size-3.5 transition-transform duration-300 group-hover:scale-110" />
          <span className="hidden sm:inline">View full page</span>
          <span className="sm:hidden">Full page</span>
        </button>
      </div>
      <div ref={outer} className="overflow-y-auto overscroll-contain" style={{ height: maxHeight ? Math.min(maxHeight, height * scale) : height * scale }}>
        {/* Sized to the scaled height, so the scroll area matches what you see */}
        <div className="overflow-hidden" style={{ height: height * scale }}>
          <div ref={inner} data-thumbnail className="[&_[data-sticky]]:static" style={{ width, transform: `scale(${scale})`, transformOrigin: "top left" }} aria-hidden inert>
            {children}
          </div>
        </div>
      </div>

      {full && (
        <dialog
          ref={dialog}
          onClose={() => setFull(false)}
          aria-label={url ? `Full page preview of ${url}` : "Full page preview"}
          className="m-0 hidden h-dvh max-h-none w-screen max-w-none flex-col bg-white p-0 text-ink open:flex backdrop:bg-ink/60 backdrop:backdrop-blur-sm motion-safe:animate-fade"
        >
          <div className="flex shrink-0 items-center gap-3 border-b border-line bg-paper px-4 py-2.5 sm:px-6">
            <TrafficLights />
            {url && <span className="min-w-0 flex-1 truncate rounded-md bg-white px-3 py-1.5 text-center font-mono text-[12px] text-muted-ink">{url}</span>}
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              autoFocus
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-accent-strong"
            >
              <X aria-hidden className="size-3.5" />
              Exit full page
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>
        </dialog>
      )}
    </div>
  );
}

function TrafficLights() {
  return (
    <span className="flex shrink-0 gap-1.5" aria-hidden>
      <span className="size-2.5 rounded-full bg-[#ff5f57]" />
      <span className="size-2.5 rounded-full bg-[#febc2e]" />
      <span className="size-2.5 rounded-full bg-[#28c840]" />
    </span>
  );
}
