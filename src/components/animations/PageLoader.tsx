"use client";

import { useEffect, useState } from "react";
import BrandLoader from "./BrandLoader";

/** The initial brand reveal waits for page load, with a cap for slow resources. */
export default function PageLoader() {
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">("loading");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let finishing = false;
    let revealTimer: ReturnType<typeof setTimeout>;
    let removeTimer: ReturnType<typeof setTimeout>;

    const finish = () => {
      if (finishing) return;
      finishing = true;
      window.clearTimeout(maximumTimer);
      const remaining = reducedMotion ? 0 : Math.max(0, 1200 - (performance.now() - started));
      revealTimer = setTimeout(() => {
        setPhase("leaving");
        removeTimer = setTimeout(() => {
          setPhase("done");
          document.body.style.overflow = previousOverflow;
        }, reducedMotion ? 0 : 450);
      }, remaining);
    };

    const maximumTimer = setTimeout(finish, 4500);
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(maximumTimer);
      clearTimeout(revealTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (phase === "done") return null;
  return <BrandLoader initial leaving={phase === "leaving"} />;
}
