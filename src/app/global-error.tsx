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
      <body className="flex min-h-screen items-center justify-center bg-white px-4 text-[#0b0d12]" style={{ fontFamily: "system-ui, sans-serif" }}>
        <div role="alert" className="w-full max-w-xl rounded-[1.75rem] border border-[#ececef] bg-white p-8 shadow-[0_18px_48px_-12px_rgb(11_13_18/0.18)] text-center md:p-12">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#a30400]">Mecatronix</p>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">We&apos;ll be right back</h1>
          <p className="mt-4 text-[#555a66]">The site ran into a problem loading. Please try again in a moment.</p>
          {error.digest && <p className="mt-3 font-mono text-xs text-[#555a66]">Reference: {error.digest}</p>}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="h-12 rounded-full bg-[#c40500] px-6 text-[15px] font-medium text-white hover:bg-[#a30400]"
            >
              Try again
            </button>
            {/* Plain <a>: a full reload is the safest recovery when the layout itself failed */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="inline-flex h-12 items-center justify-center rounded-full border border-[#dcdce1] px-6 text-[15px] font-medium text-[#0b0d12] hover:border-[#0b0d12]">
              Reload home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
