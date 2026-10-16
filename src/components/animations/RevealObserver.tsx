"use client";

import { useEffect } from "react";

/**
 * Reveals [data-reveal] elements as they scroll into view by setting
 * [data-revealed]; the transition itself is plain CSS (see globals.css).
 * One observer serves the whole app, and a MutationObserver picks up
 * elements rendered later (route changes, filtered lists).
 */
export default function RevealObserver() {
  useEffect(() => {
    const reveal = (el: Element) => el.setAttribute("data-revealed", "");

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-reveal]").forEach(reveal);
      const mo = new MutationObserver(() => document.querySelectorAll("[data-reveal]:not([data-revealed])").forEach(reveal));
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const pending = () => document.querySelectorAll("[data-reveal]:not([data-revealed])");
    const scan = () => pending().forEach((el) => io.observe(el));
    scan();

    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    // A fast scroll or anchor jump can carry an element past the viewport between
    // observer checks, so it never "intersects". Once scrolling settles, reveal
    // anything that is already above the bottom of the viewport.
    let settle: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      clearTimeout(settle);
      settle = setTimeout(() => {
        pending().forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            reveal(el);
            io.unobserve(el);
          }
        });
      }, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
