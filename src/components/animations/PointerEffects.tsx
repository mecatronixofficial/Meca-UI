"use client";

import { useEffect } from "react";

/** Updates card hover lighting without changing the native cursor. */
export default function PointerEffects() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !(event.target instanceof Element)) return;
      const spot = event.target.closest<HTMLElement>(".spotlight");
      if (!spot) return;
      const rect = spot.getBoundingClientRect();
      spot.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      spot.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
