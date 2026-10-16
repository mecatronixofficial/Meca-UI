"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

/**
 * Route-level error boundary. Renders inside the root layout (nav + footer stay),
 * replacing only the page that crashed.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative isolate overflow-hidden bg-white px-4 pb-24 pt-40 text-ink sm:px-6 lg:pb-32 lg:pt-48">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <div role="alert" className="mx-auto max-w-2xl text-center">
        <p className="text-label text-accent-ink">Something went wrong</p>
        <h1 className="text-h1 mt-6">This page hit an unexpected error.</h1>
        <p className="text-lead mx-auto mt-6 max-w-lg text-muted-ink">You can try again, or head back to the homepage.</p>
        {error.digest && <p className="mt-4 font-mono text-xs text-muted">Reference: {error.digest}</p>}
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent-strong px-6 text-[15px] font-medium text-white shadow-glow transition-[background-color,box-shadow] hover:bg-accent-ink hover:shadow-glow-lg"
          >
            <RotateCcw aria-hidden className="size-4" /> Try again
          </button>
          <Link href="/" className="inline-flex h-12 items-center justify-center rounded-full border border-line-strong px-6 text-[15px] font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
