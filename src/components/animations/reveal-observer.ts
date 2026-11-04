type RevealCallback = () => void;

/** Only hydrated Reveal components register here; never scan unhydrated HTML. */
function createRevealObserver() {
  const callbacks = new Map<Element, RevealCallback>();
  const pending = new Set<Element>();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let settle: ReturnType<typeof setTimeout> | undefined;

  const reveal = (element: Element) => {
    if (!pending.delete(element)) return;
    intersection?.unobserve(element);
    callbacks.get(element)?.();
  };

  const intersection =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) reveal(entry.target);
            }
          },
          { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
        )
      : null;

  // Include elements passed by a fast scroll or an anchor jump.
  const onScroll = () => {
    clearTimeout(settle);
    settle = setTimeout(() => {
      for (const element of pending) {
        if (element.getBoundingClientRect().top < window.innerHeight)
          reveal(element);
      }
    }, 150);
  };

  const onMotionChange = () => {
    if (reducedMotion.matches) pending.forEach(reveal);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  reducedMotion.addEventListener("change", onMotionChange);

  return {
    register(element: Element, callback: RevealCallback) {
      callbacks.set(element, callback);
      pending.add(element);
      if (
        !intersection ||
        reducedMotion.matches ||
        element.getBoundingClientRect().bottom < 0
      ) {
        reveal(element);
      } else {
        intersection.observe(element);
      }

      return () => {
        intersection?.unobserve(element);
        pending.delete(element);
        callbacks.delete(element);
        if (callbacks.size === 0) {
          intersection?.disconnect();
          clearTimeout(settle);
          window.removeEventListener("scroll", onScroll);
          reducedMotion.removeEventListener("change", onMotionChange);
          observer = undefined;
        }
      };
    },
  };
}

let observer: ReturnType<typeof createRevealObserver> | undefined;

export function observeReveal(element: Element, callback: RevealCallback) {
  observer ??= createRevealObserver();
  return observer.register(element, callback);
}
