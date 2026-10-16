"use client";

import { useState } from "react";
import Icons from "../../helper/icon_help";
import { useRouter } from "next/navigation";
import { techCategories } from "../../helper/data_help";
import { accentAt, TILE, pad2 } from "../../helper/accent_help";

const ALL = "ALL";

const Technologies = () => {
  const {
    FaRocket, FaBolt, FaServer, FaCode, FaMicrochip, FaArrowRight
  } = Icons;
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(ALL);

  const allTech = techCategories.flatMap((cat) => cat.technologies);
  const visibleCategories = activeCategory === ALL
    ? techCategories
    : techCategories.filter((cat) => cat.id === activeCategory);

  const stats = [
    { value: "50+", label: "TECH_MOD", icon: <FaCode /> },
    { value: "100+", label: "DEPLOY_EXE", icon: <FaRocket /> },
    { value: "4.9", label: "STABLE_RAT", icon: <FaBolt /> },
    { value: "24/7", label: "SYS_UPTIME", icon: <FaServer /> },
  ];

  const HandleGo = () => { router.push("/openline") }

  return (
    <section id="technologies" className="relative text-white overflow-hidden py-16 md:py-24">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">

          {/* ================= HEADER + FILTER ================= */}
          <div className="col-span-2 lg:col-span-6 flex flex-col lg:flex-row lg:items-end gap-5 pb-2">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400 text-black font-black text-[9px] sm:text-[10px] uppercase tracking-[0.25em] mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" /> Resource_Directory
              </span>
              <h2 className="font-black uppercase tracking-tighter leading-[0.88] text-4xl sm:text-5xl md:text-6xl">
                Tech
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-500 to-rose-500 bg-[length:200%_auto] animate-gradient">
                  _Stack
                </span>
                <span className="text-orange-500">.</span>
              </h2>
            </div>

            <div role="tablist" aria-label="Technology categories" className="flex gap-2 overflow-x-auto [scrollbar-width:none] -mx-1 px-1">
              {[{ id: ALL, category: "All" }, ...techCategories].map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`shrink-0 px-4 py-2 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 ${isActive
                      ? "bg-orange-500 text-black"
                      : "border border-white/10 bg-white/[0.03] text-gray-400 hover:text-white hover:border-white/25"
                      }`}
                  >
                    {cat.category.split("_")[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================= INTRO TILE ================= */}
          <div className="col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 to-orange-600 text-black p-6 md:p-7 flex flex-col justify-between min-h-[260px]">
            <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full border-[16px] border-black/10" />
            <div className="relative flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]">Core Modules</span>
              <FaMicrochip className="text-lg" />
            </div>
            <div className="relative">
              <p className="text-6xl md:text-7xl font-black tracking-tighter leading-none">{pad2(allTech.length)}</p>
              <p className="mt-3 text-sm font-semibold text-black/75 leading-relaxed">
                Initializing core dependency modules for industrial-grade digital architectures.
              </p>
            </div>
          </div>

          {/* ================= CATEGORY TILES ================= */}
          {visibleCategories.map((cat) => {
            const idx = techCategories.indexOf(cat);
            const a = accentAt(idx + 1);
            return (
              <article
                key={cat.id}
                className={`col-span-2 ${visibleCategories.length > 1 ? "sm:col-span-1" : ""} lg:col-span-2 group ${TILE} p-6 ${a.hover} transition-colors animate-fade-in-up`}
              >
                <div className={`absolute -bottom-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-40 group-hover:opacity-100 transition-opacity ${a.glow}`} />

                <div className="relative flex items-center gap-4 mb-6">
                  <div className={`relative overflow-hidden shrink-0 w-12 h-12 rounded-2xl border flex items-center justify-center text-lg transition-colors ${a.chip} group-hover:text-black group-hover:border-transparent`}>
                    <span className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${a.solid}`} />
                    <span className="relative">{cat.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-black uppercase tracking-tight truncate">{cat.category}</h3>
                    <p className={`font-mono text-[10px] uppercase tracking-widest ${a.text}`}>SYS_REF::{cat.id}</p>
                  </div>
                  <span className="text-3xl font-black text-white/15 group-hover:text-white/25 transition-colors">{pad2(cat.technologies.length)}</span>
                </div>

                <div className="relative grid grid-cols-2 gap-2">
                  {cat.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/5 text-xs font-bold text-gray-300 hover:text-white hover:border-white/20 transition-colors"
                    >
                      <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${a.solid}`} />
                      <span className="truncate">{tech}</span>
                    </span>
                  ))}
                </div>
              </article>
            );
          })}

          {/* ================= STATS TILE ================= */}
          <div className={`col-span-2 ${TILE} p-3 md:p-4 grid grid-cols-2 gap-2 md:gap-3`}>
            {stats.map((stat, i) => {
              const a = accentAt(i === 0 ? 0 : i + 2);
              return (
                <div key={stat.label} className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/5 p-4 flex flex-col justify-between min-h-[110px]">
                  <span className={`${a.text} text-base`}>{stat.icon}</span>
                  <div>
                    <div className="text-2xl md:text-3xl font-black">{stat.value}</div>
                    <div className={`mt-1 font-mono text-[9px] uppercase tracking-[.25em] ${a.text}`}>{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= MARQUEE ================= */}
          <div className="col-span-2 lg:col-span-6 mt-4 md:mt-6 relative overflow-hidden py-5 border-y border-white/5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex animate-scroll">
              {[...allTech, ...allTech].map((tech, i) => (
                <span
                  key={`${tech}-${i}`}
                  className="flex items-center gap-6 px-6 text-2xl md:text-4xl font-black uppercase tracking-tighter text-white/10 hover:text-orange-500 transition-colors whitespace-nowrap"
                >
                  {tech}
                  <span className={`w-2.5 h-2.5 rounded-full ${accentAt(i).solid} opacity-60`} />
                </span>
              ))}
            </div>
          </div>

          {/* ================= CTA ================= */}
          <div className="col-span-2 lg:col-span-6 mt-4 md:mt-6 relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-[#0c0906]/90 border border-white/10">
            <div className="absolute -right-24 top-0 bottom-0 w-2/3 md:w-1/2 bg-gradient-to-br from-cyan-500/15 via-violet-500/10 to-orange-500/20 -skew-x-12 pointer-events-none" />
            <div className="absolute -bottom-6 right-6 text-[5rem] md:text-[8rem] font-black leading-none text-white/[0.04] uppercase italic select-none pointer-events-none">
              Command
            </div>
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-10 md:p-12">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300 mb-3">// Awaiting_Input</p>
                <h3 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9]">
                  Initialize_Project_
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500">Sequence?</span>
                </h3>
                <p className="mt-4 text-sm md:text-base text-gray-400 max-w-md">
                  Pick the stack, we handle the architecture, deployment and scale.
                </p>
              </div>
              <button
                onClick={HandleGo}
                className="group/btn shrink-0 inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-orange-500 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:bg-white active:scale-95 transition-all"
              >
                Execute_Command <FaArrowRight className="-rotate-45 group-hover/btn:rotate-0 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technologies;
