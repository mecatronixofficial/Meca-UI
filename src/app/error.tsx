"use client";

import { useEffect } from "react";
import Link from "next/link";

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
    <section className="relative text-white px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="max-w-3xl mx-auto p-px rounded-[2rem] bg-gradient-to-br from-orange-500/60 via-violet-500/25 to-cyan-500/40">
        <div role="alert" className="relative overflow-hidden rounded-[2rem] bg-[#0c0906]/95 p-6 sm:p-8 md:p-12">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-500/20 blur-[110px]" />

          <span className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500 text-black font-black text-[10px] uppercase tracking-[0.25em]">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" /> System_Fault
          </span>

          <h1 className="relative mt-8 font-black uppercase tracking-tighter leading-[0.9] text-4xl sm:text-5xl md:text-6xl">
            Something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-500 to-rose-500">
              Went Wrong
            </span>
          </h1>

          <p className="relative mt-5 max-w-lg text-gray-400 text-base md:text-lg leading-relaxed">
            This page hit an unexpected error. You can try again, or head back home.
          </p>

          {error.digest && (
            <p className="relative mt-3 font-mono text-[10px] uppercase tracking-widest text-gray-600">
              Ref: {error.digest}
            </p>
          )}

          <div className="relative mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-4 text-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(249,115,22,.35)] hover:bg-white transition-all"
            >
              ↻ Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-4 text-gray-300 font-black text-xs uppercase tracking-[0.2em] hover:border-white/40 hover:text-white transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
