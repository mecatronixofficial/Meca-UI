import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "../lib/seo";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist or has been moved.",
  robots: { index: false, follow: true },
};

const QUICK_LINKS = ROUTES.filter((route) => route.path !== "/");

export default function NotFound() {
  return (
    <section className="relative text-white px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
        {/* Main tile */}
        <div className="col-span-2 lg:col-span-4 relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0906]/85 backdrop-blur-xl p-6 sm:p-8 md:p-12 min-h-[360px] flex flex-col justify-between">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-500/20 blur-[110px]" />
          <div className="absolute right-4 -bottom-8 text-[8rem] md:text-[12rem] font-black leading-none text-white/[0.04] select-none pointer-events-none">
            404
          </div>

          <span className="relative inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-black font-black text-[10px] uppercase tracking-[0.25em]">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" /> Signal_Lost
          </span>

          <div className="relative mt-10">
            <h1 className="font-black uppercase tracking-tighter leading-[0.88] text-5xl sm:text-6xl md:text-7xl">
              <span className="block text-white">Page Not</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-500 to-rose-500">
                Found
              </span>
            </h1>
            <p className="mt-5 max-w-md text-gray-400 text-base md:text-lg leading-relaxed">
              The page you are looking for does not exist or has been moved.
            </p>
            <Link
              href="/"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-orange-500 py-2 pl-6 pr-2 text-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(249,115,22,.35)] hover:bg-white transition-all"
            >
              Back to Home
              <span className="flex h-9 w-9 -rotate-45 items-center justify-center rounded-full bg-black text-orange-400 transition-transform group-hover:rotate-0">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Quick links */}
        <nav aria-label="Popular pages" className="col-span-2 relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/50 backdrop-blur-md p-5 md:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300 mb-4">Try these instead</p>
          <ul className="space-y-2">
            {QUICK_LINKS.map((route, i) => (
              <li key={route.path}>
                <Link
                  href={route.path}
                  className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 hover:border-orange-500/40 hover:bg-orange-500/[0.06] transition-colors"
                >
                  <span className="font-mono text-[10px] text-gray-600">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-sm font-black uppercase tracking-tight text-gray-200 group-hover:text-white">
                    {route.label}
                  </span>
                  <span className="text-gray-600 -rotate-45 group-hover:rotate-0 group-hover:text-orange-400 transition-all">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
