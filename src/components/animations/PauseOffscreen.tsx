"use client";

import { useEffect, useRef } from "react";

/**
 * Sets [data-paused] on its first child while it is outside the viewport, so
 * looping CSS animations (which honour it) stop costing CPU and battery.
 */
export function PauseOffscreen({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ref.current?.firstElementChild;
    if (!target || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => target.toggleAttribute("data-paused", !entry.isIntersecting));
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
