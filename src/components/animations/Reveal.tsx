"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type HTMLAttributes,
} from "react";
import Link from "next/link";
import { observeReveal } from "./reveal-observer";

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    return observeReveal(ref.current, () => setRevealed(true));
  }, []);

  return {
    ref,
    "data-reveal": true,
    "data-revealed": revealed ? "" : undefined,
  };
}

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "p" | "h2" | "article" | "li" | "section";
};

/** The first client render matches the server; React owns the reveal attribute. */
export function Reveal({ as = "div", children, ...props }: RevealProps) {
  const reveal = useReveal<HTMLElement>();
  return createElement(as, { ...props, ...reveal }, children);
}

/** Keep Next.js link navigation and prefetching on animated service rows. */
export function RevealLink(props: ComponentProps<typeof Link>) {
  const reveal = useReveal<HTMLAnchorElement>();
  return <Link {...props} {...reveal} />;
}
