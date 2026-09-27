"use client";

import { useState, useEffect } from "react";
import Icons from "../../helper/icon_help";
import { useRouter } from "next/navigation";
import type { Particle } from "../../types/space";

// Circumference of the progress rings (r = 36)
const RING = 2 * Math.PI * 36;

// Teaser slots for upcoming case studies (intentionally unnamed).
// Full class names are spelled out so Tailwind can generate them.
const SLOTS = [
  {
    progress: 82, status: "Rendering",
    ring: "text-cyan-400", text: "text-cyan-300", chip: "bg-cyan-500/10 border-cyan-500/30",
    hover: "hover:border-cyan-500/50", glow: "bg-cyan-500/15",
  },
  {
    progress: 64, status: "Compiling",
    ring: "text-violet-400", text: "text-violet-300", chip: "bg-violet-500/10 border-violet-500/30",
    hover: "hover:border-violet-500/50", glow: "bg-violet-500/15",
  },
  {
    progress: 47, status: "Testing",
    ring: "text-emerald-400", text: "text-emerald-300", chip: "bg-emerald-500/10 border-emerald-500/30",
    hover: "hover:border-emerald-500/50", glow: "bg-emerald-500/15",
  },
];

const Portfolio = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const router = useRouter();

  const { FaTools, FaRocket, FaMicrochip, FaShieldAlt, FaArrowRight, FaStar } = Icons;

  const pad = (n: number) => String(n).padStart(2, "0");

  // Generate particles on mount (client-only to avoid hydration mismatch)
  useEffect(() => {
    setParticles(
      [...Array(15)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 10 + 5,
        delay: Math.random() * 5,
        duration: Math.random() * 6 + 4
      }))
    );
  }, []);

  const HandleGo = () => { router.push("/openline") }

  return (
    <section id="portfolio" className="pb-16 md:pb-24 pt-24 md:pt-32 text-white relative overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-gradient-to-r from-orange-500/20 to-orange-700/20 rounded-full animate-float"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ================= BENTO GRID ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">

          {/* ---- Title tile ---- */}
          <div className="col-span-2 lg:col-span-4 lg:row-span-2 relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0906]/80 backdrop-blur-xl p-6 sm:p-8 md:p-12 flex flex-col justify-between min-h-[380px] md:min-h-[460px]">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-500/20 blur-[110px]" />
            <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-rose-500/10 blur-[110px]" />
            <div className="absolute right-4 bottom-2 text-[5rem] sm:text-[8rem] md:text-[10rem] font-black leading-none text-white/[0.03] uppercase tracking-tighter select-none pointer-events-none">
              Archive
            </div>

            <div className="relative flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-black font-black text-[9px] sm:text-[10px] uppercase tracking-[0.25em]">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                Deployment Registry
              </span>
              <span className="hidden sm:block font-mono text-[10px] uppercase tracking-widest text-gray-500">Vol. {pad(1)} / 2026</span>
            </div>

            {/* @container: the title scales with this card's width, not the viewport */}
            <div className="@container relative mt-10">
              <h1 className="font-black uppercase tracking-tighter leading-[0.85] text-[clamp(2rem,10cqw,5.5rem)] break-words">
                <span className="block text-white">Portfolio</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-500 to-rose-500 bg-[length:200%_auto] animate-gradient">
                  Showcase
                </span>
              </h1>
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <p className="max-w-md text-gray-400 text-base md:text-lg leading-relaxed">
                  A curated selection of <span className="text-white font-medium italic">digital benchmarks</span>.
                  Engineered for performance, designed for the future.
                </p>
                <div className="flex gap-1.5 shrink-0">
                  <span className="w-8 h-2 rounded-full bg-orange-500" />
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>
              </div>
            </div>
          </div>

          {/* ---- Stat: solid orange ---- */}
          <div className="col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 to-orange-600 text-black p-6 md:p-7 flex flex-col justify-between min-h-[170px] group">
            <div className="absolute -right-6 -bottom-10 text-[9rem] font-black leading-none text-black/10 select-none">+</div>
            <div className="relative flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]">Total Ops</span>
              <FaRocket className="text-lg group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="relative text-6xl md:text-7xl font-black tracking-tighter">42+</div>
          </div>

          {/* ---- Stat: amber outline ---- */}
          <div className="col-span-1 relative overflow-hidden rounded-[2rem] border-2 border-amber-400/40 bg-amber-400/[0.06] p-5 md:p-6 flex flex-col justify-between min-h-[170px] hover:bg-amber-400/10 transition-colors">
            <span className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">Success Rate</span>
            <div>
              <div className="text-3xl md:text-4xl font-black text-white">100%</div>
              <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-amber-300 to-orange-500" />
              </div>
            </div>
          </div>

          {/* ---- Stat: rose ---- */}
          <div className="col-span-1 relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/50 backdrop-blur-md p-5 md:p-6 flex flex-col justify-between min-h-[170px] hover:border-rose-500/40 transition-colors">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-rose-500/20 rounded-full blur-2xl" />
            <span className="relative font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-rose-300">Client Satisfaction</span>
            <div className="relative">
              <div className="text-3xl md:text-4xl font-black text-white">5.0</div>
              <div className="mt-2 flex gap-0.5 text-rose-400 text-xs">
                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
              </div>
            </div>
          </div>

          {/* ---- Section label ---- */}
          <div className="col-span-2 lg:col-span-6 flex items-center gap-4 pt-6 md:pt-8 pb-1">
            <span className="font-black uppercase tracking-tighter text-2xl md:text-3xl">
              Incoming<span className="text-orange-500">.</span>
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-orange-500/60 via-white/10 to-transparent" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">{pad(SLOTS.length)} in queue</span>
          </div>

          {/* ---- Project tiles with progress rings ---- */}
          {SLOTS.map((slot, i) => (
            <div
              key={i}
              className={`col-span-2 ${i === SLOTS.length - 1 ? "sm:col-span-2" : "sm:col-span-1"} lg:col-span-2 group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/50 backdrop-blur-md p-6 ${slot.hover} transition-colors`}
            >
              <div className={`absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity ${slot.glow}`} />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <span className="block text-6xl font-black leading-none text-white/10 group-hover:text-white/20 transition-colors">
                    {pad(i + 1)}
                  </span>
                  <span className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-[10px] uppercase tracking-widest ${slot.chip} ${slot.text}`}>
                    <FaShieldAlt /> Classified
                  </span>
                </div>

                {/* Progress ring */}
                <div className={`relative shrink-0 w-24 h-24 ${slot.ring}`}>
                  <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                    <circle
                      cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={RING}
                      strokeDashoffset={RING * (1 - slot.progress / 100)}
                      className="drop-shadow-[0_0_6px_currentColor]"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-white">
                    {slot.progress}<span className="text-[10px] text-gray-400">%</span>
                  </span>
                </div>
              </div>

              <div className="relative mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
                <span className="text-gray-500">Project_{pad(i + 1)}</span>
                <span className={`flex items-center gap-1.5 ${slot.text}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {slot.status}
                </span>
              </div>
            </div>
          ))}

          {/* ---- CTA ---- */}
          <div
            className="col-span-2 lg:col-span-6 mt-6 md:mt-8 relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-[#0c0906]/90 border border-white/10 animate-fade-in-up opacity-0 fill-mode-forwards"
            style={{ animationDelay: '0.5s' }}
          >
            {/* Diagonal colour band */}
            <div className="absolute -right-24 top-0 bottom-0 w-2/3 md:w-1/2 bg-gradient-to-br from-orange-500/25 via-rose-500/10 to-violet-500/10 skew-x-[-12deg] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.05] bg-[size:32px_32px] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [mask-image:linear-gradient(to_right,black,transparent_60%)] pointer-events-none" />

            <div className="relative grid md:grid-cols-[1fr_auto] items-center gap-10 p-6 sm:p-10 md:p-14">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="relative flex w-11 h-11 items-center justify-center rounded-xl bg-orange-500 text-black">
                    <span className="absolute inset-0 rounded-xl bg-orange-500/50 animate-ping" />
                    <FaTools className="relative text-lg" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400">Status_Update</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                  System <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500">Expansion</span>
                  <br />In Progress
                </h2>

                <p className="mt-5 text-sm md:text-base text-gray-400 max-w-lg leading-relaxed">
                  Mecatronix is currently deploying <span className="text-white font-medium underline decoration-orange-500/60 underline-offset-4">Next-Gen modules</span>.
                  Our digital forge is working at 100% capacity to bring you revolutionary solutions.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400 text-black font-black text-[10px] uppercase tracking-widest">
                    <FaMicrochip /> Hardware
                  </span>
                  <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-black font-black text-[10px] uppercase tracking-widest">
                    <FaRocket /> Velocity
                  </span>
                  <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400 text-black font-black text-[10px] uppercase tracking-widest">
                    <FaShieldAlt /> Secure
                  </span>
                </div>
              </div>

              {/* Rotating badge button */}
              <button
                onClick={HandleGo}
                aria-label="Initiate project"
                className="group/cta relative mx-auto w-40 h-40 md:w-48 md:h-48 shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <svg
                  viewBox="0 0 200 200"
                  className="absolute inset-0 w-full h-full text-orange-300"
                  style={{ animation: "spin-slow 18s linear infinite" }}
                >
                  <defs>
                    <path id="portfolio-cta-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                  </defs>
                  <text className="fill-current font-mono font-bold uppercase" style={{ fontSize: 13, letterSpacing: 5 }}>
                    <textPath href="#portfolio-cta-circle">Initiate Project • Initiate Project • </textPath>
                  </text>
                </svg>
                <span className="absolute inset-[22%] rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.5)] group-hover/cta:scale-110 group-hover/cta:shadow-[0_0_60px_rgba(249,115,22,0.8)] transition-all duration-300">
                  <FaArrowRight className="text-2xl md:text-3xl text-black -rotate-45 group-hover/cta:rotate-0 transition-transform duration-300" />
                </span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 px-4 text-center text-[9px] sm:text-[10px] text-gray-600 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-mono">
          EST. 2026 // LOGISTICS &amp; DESIGN DIVISION
        </p>
      </div>
    </section>
  );
};

export default Portfolio;
