"use client";

import { useEffect } from "react";
import "./globals.css";

/**
 * Last-resort error screen for crashes in the root layout itself.
 * It replaces the whole document, so it renders its own <html>/<body>
 * and deliberately depends on nothing else in the app.
 */
export default function GlobalError({
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
    <html lang="en-IN">
      <body className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div role="alert" className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#0c0906] p-8 md:p-12 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400">Mecatronix // Critical_Fault</p>
          <h1 className="mt-5 font-black uppercase tracking-tighter text-4xl md:text-5xl">
            We&apos;ll be right back
          </h1>
          <p className="mt-4 text-gray-400">
            The site ran into a problem loading. Please try again in a moment.
          </p>
          {error.digest && (
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-gray-600">Ref: {error.digest}</p>
          )}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-orange-500 px-7 py-4 text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all"
            >
              ↻ Try Again
            </button>
            {/* Plain <a>: a full reload is the safest recovery when the layout itself failed */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="rounded-full border border-white/15 px-7 py-4 text-gray-300 font-black text-xs uppercase tracking-[0.2em] hover:border-white/40 hover:text-white transition-all"
            >
              Reload Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
