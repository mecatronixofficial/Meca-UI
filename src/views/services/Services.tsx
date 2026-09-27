"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Icons from "../../helper/icon_help";
import { Project_Process, Short_Services, Services_List, Most_Used_Tech_Stack, ServiceCategories } from "../../helper/data_help";
import type { Particle } from "../../types/space";
const Services = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeProcess, setActiveProcess] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const router = useRouter();
  const {
    FaArrowRight,
    FaPlay,
    FaPause,
    FaArrowLeft } = Icons;


  // Generate particles on mount (client-only to avoid hydration mismatch)
  useEffect(() => {


    const newParticles = [...Array(15)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 10 + 5,
      delay: Math.random() * 5,
      duration: Math.random() * 6 + 4
    }));
    setParticles(newParticles);
  }, []);


  const filteredServices = activeCategory === "all"
    ? Services_List
    : Services_List.filter(service => service.category === activeCategory);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveProcess((prev) => (prev + 1) % Project_Process.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleGo = (path = "/openline") => {
    router.push(path);
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  // Accent palette (orange stays the primary brand colour).
  // Full class names are spelled out so Tailwind can generate them.
  const ACCENTS = [
    { chip: "bg-orange-500/10 border-orange-500/30 text-orange-400", solid: "bg-orange-500", text: "text-orange-300", hover: "hover:border-orange-500/50", glow: "bg-orange-500/15", dot: "bg-orange-500" },
    { chip: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400", solid: "bg-cyan-400", text: "text-cyan-300", hover: "hover:border-cyan-500/50", glow: "bg-cyan-500/15", dot: "bg-cyan-400" },
    { chip: "bg-violet-500/10 border-violet-500/30 text-violet-400", solid: "bg-violet-400", text: "text-violet-300", hover: "hover:border-violet-500/50", glow: "bg-violet-500/15", dot: "bg-violet-400" },
    { chip: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", solid: "bg-emerald-400", text: "text-emerald-300", hover: "hover:border-emerald-500/50", glow: "bg-emerald-500/15", dot: "bg-emerald-400" },
    { chip: "bg-amber-500/10 border-amber-500/30 text-amber-400", solid: "bg-amber-400", text: "text-amber-300", hover: "hover:border-amber-500/50", glow: "bg-amber-500/15", dot: "bg-amber-400" },
    { chip: "bg-rose-500/10 border-rose-500/30 text-rose-400", solid: "bg-rose-400", text: "text-rose-300", hover: "hover:border-rose-500/50", glow: "bg-rose-500/15", dot: "bg-rose-400" },
  ];
  const accentAt = (i: number) => ACCENTS[i % ACCENTS.length];

  const tileBase = "relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/50 backdrop-blur-md";
  const current = Project_Process[activeProcess];
  const currentAccent = accentAt(activeProcess);

  return (
    <section className="pb-16 md:pb-24 pt-28 md:pt-32 text-white relative overflow-hidden">
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
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">

          {/* ================= TITLE TILE ================= */}
          <div className="col-span-2 lg:col-span-4 lg:row-span-2 relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0906]/80 backdrop-blur-xl p-6 sm:p-8 md:p-12 flex flex-col justify-between min-h-[380px] md:min-h-[460px]">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-500/20 blur-[110px]" />
            <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-violet-500/10 blur-[110px]" />
            <div className="absolute right-4 bottom-2 text-[5rem] sm:text-[8rem] md:text-[10rem] font-black leading-none text-white/[0.03] uppercase tracking-tighter select-none pointer-events-none">
              Build
            </div>

            <div className="relative flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-black font-black text-[9px] sm:text-[10px] uppercase tracking-[0.25em]">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                Precision Web Solutions
              </span>
              <span className="hidden sm:block font-mono text-[10px] uppercase tracking-widest text-gray-500">Services / {pad(Services_List.length)}</span>
            </div>

            {/* @container: the title scales with this card's width, not the viewport */}
            <div className="@container relative mt-10">
              <h1 className="font-black uppercase tracking-tighter leading-[0.88] text-[clamp(2rem,9cqw,5.25rem)] break-words">
                <span className="block text-white">Crafting</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-500 to-rose-500 bg-[length:200%_auto] animate-gradient">
                  Scalable
                </span>
                <span className="block text-white">Experiences</span>
              </h1>

              <p className="mt-6 max-w-xl text-gray-400 text-base md:text-lg leading-relaxed">
                Mecatronix is a trusted <span className="text-white font-medium">web development company in Coimbatore</span> delivering
                ecommerce websites, mobile applications, and scalable digital solutions. We focus on performance, security,
                and future-ready architecture to grow your business online.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleGo("/openline")}
                  className="group/btn inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-orange-500 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(249,115,22,0.35)] hover:bg-white active:scale-95 transition-all"
                >
                  Start Project <FaArrowRight className="-rotate-45 group-hover/btn:rotate-0 transition-transform" />
                </button>
                <a
                  href="#Eco"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/15 text-gray-300 font-black text-xs uppercase tracking-widest hover:border-cyan-400/60 hover:text-cyan-300 transition-all"
                >
                  View Ecosystem
                </a>
              </div>
            </div>
          </div>

          {/* ================= SERVICE INDEX TILE ================= */}
          <div className="col-span-2 lg:row-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 to-orange-600 text-black p-6 md:p-7 flex flex-col">
            <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full border-[16px] border-black/10" />
            <div className="relative flex items-end justify-between mb-6">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]">Core Services</p>
                <p className="text-6xl md:text-7xl font-black tracking-tighter leading-none mt-2">{pad(Short_Services.length)}</p>
              </div>
            </div>
            <ul className="relative mt-auto divide-y divide-black/15 border-t border-black/15">
              {Short_Services.map((service, i) => (
                <li key={service.title} className="group flex items-center gap-3 py-3">
                  <span className="font-mono text-[10px] font-bold text-black/50 w-5">{pad(i + 1)}</span>
                  <span className="flex-1 min-w-0 text-sm font-black uppercase tracking-tight truncate">{service.title}</span>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-black/10 font-mono text-[9px] font-bold uppercase tracking-wider">
                    {service.code}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= CATALOGUE HEADER + FILTER ================= */}
          <div className="col-span-2 lg:col-span-6 flex flex-col md:flex-row md:items-center gap-4 pt-8 md:pt-12 pb-1">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <span className="font-black uppercase tracking-tighter text-2xl md:text-3xl whitespace-nowrap">
                Catalogue<span className="text-orange-500">.</span>
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500/60 via-white/10 to-transparent" />
            </div>
            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] -mx-1 px-1">
              {ServiceCategories.map((category) => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 ${isActive
                      ? "bg-orange-500 text-black"
                      : "border border-white/10 bg-white/[0.03] text-gray-400 hover:text-white hover:border-white/25"
                      }`}
                  >
                    {category.label}
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${isActive ? "bg-black/15" : "bg-white/10"}`}>{category.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================= SERVICE CARDS ================= */}
          {filteredServices.map((service, index) => {
            const a = accentAt(index);
            return (
              <div
                key={service.title}
                className={`col-span-2 sm:col-span-1 lg:col-span-2 group ${tileBase} p-6 flex flex-col ${a.hover} hover:-translate-y-1 transition-all duration-300 animate-zoom-in opacity-0 fill-mode-forwards`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`absolute -bottom-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-40 group-hover:opacity-100 transition-opacity ${a.glow}`} />

                <div className="relative flex items-start justify-between gap-4 mb-5">
                  <div className={`relative overflow-hidden w-14 h-14 rounded-2xl border flex items-center justify-center [&_svg]:!text-2xl transition-colors ${a.chip} group-hover:text-black group-hover:border-transparent`}>
                    <span className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${a.solid}`} />
                    <span className="relative">{service.icon}</span>
                  </div>
                  <span className="text-4xl font-black leading-none text-white/10 group-hover:text-white/20 transition-colors">{pad(index + 1)}</span>
                </div>

                <p className={`relative font-mono text-[10px] uppercase tracking-[.25em] ${a.text}`}>{service.category}</p>
                <h3 className="relative mt-1 text-lg md:text-xl font-black uppercase tracking-tight text-white">{service.title}</h3>
                <p className="relative mt-2 text-gray-400 leading-relaxed text-sm">{service.desc}</p>

                <div className="relative mt-auto pt-5 flex flex-wrap gap-1.5">
                  {service.features.map((f) => (
                    <span key={f} className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] text-gray-300">{f}</span>
                  ))}
                </div>
              </div>
            );
          })}

          {/* ================= TECH STACK ================= */}
          <div className="col-span-2 lg:col-span-2 mt-6 md:mt-8 relative overflow-hidden rounded-[2rem] bg-[#0c0906]/90 border border-white/10 p-6 md:p-8 flex flex-col justify-between min-h-[260px]">
            <div className="absolute -top-20 -left-20 w-56 h-56 bg-cyan-500/15 rounded-full blur-[90px]" />
            <span className="relative inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400 text-black font-black text-[10px] uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" /> Technology Stack
            </span>
            <div className="relative mt-8">
              <h2 className="font-black uppercase tracking-tighter leading-[0.9] text-4xl md:text-5xl">
                Web <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500">Development</span>
              </h2>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[.4em] text-gray-500">Services</p>
              <p className="mt-5 text-sm text-gray-400 leading-relaxed">
                Crafting digital experiences with{" "}
                <span className="text-white font-semibold underline decoration-orange-500/60 underline-offset-4">modern technologies</span>{" "}
                that drive results and exceed expectations.
              </p>
            </div>
          </div>

          <div className={`col-span-2 lg:col-span-4 mt-0 lg:mt-8 ${tileBase} p-4 md:p-6`}>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3 h-full content-center">
              {Most_Used_Tech_Stack.slice(0, 12).map((tech, index) => {
                const a = accentAt(index);
                return (
                  <div
                    key={tech.name}
                    className={`group relative overflow-hidden aspect-square rounded-2xl bg-white/[0.03] border border-white/10 ${a.hover} flex flex-col items-center justify-center gap-1.5 p-2 hover:-translate-y-1 transition-all duration-300`}
                  >
                    <span className={`absolute inset-x-0 bottom-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity ${a.solid}`} />
                    <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">{tech.icon}</span>
                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-white truncate max-w-full transition-colors">{tech.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= PROCESS ================= */}
          <div id="Eco" className="col-span-2 lg:col-span-6 flex flex-col sm:flex-row sm:items-center gap-4 pt-8 md:pt-12 pb-1 scroll-mt-28">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <span className="font-black uppercase tracking-tighter text-2xl md:text-3xl whitespace-nowrap">
                Process<span className="text-orange-500">.</span>
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500/60 via-white/10 to-transparent" />
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="shrink-0 inline-flex items-center gap-3 pl-2 pr-5 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:border-orange-500/50 transition-all"
            >
              <span className="w-8 h-8 rounded-full bg-orange-500 text-black flex items-center justify-center">
                {isPlaying ? <FaPause className="w-3 h-3" /> : <FaPlay className="w-3 h-3 translate-x-px" />}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-300">
                {isPlaying ? "Pause Auto-Play" : "Auto-Play Process"}
              </span>
            </button>
          </div>

          <p className="col-span-2 lg:col-span-6 -mt-1 text-sm text-gray-500">
            Click through each phase to understand our comprehensive workflow
          </p>

          {/* Active phase */}
          <div key={activeProcess} className="col-span-2 lg:col-span-4 relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0906]/90 p-6 sm:p-8 md:p-10 animate-fade-in">
            <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[100px] ${currentAccent.glow}`} />
            <div className="absolute right-4 md:right-8 -bottom-6 text-[8rem] md:text-[12rem] font-black leading-none text-white/[0.04] select-none pointer-events-none">
              {pad(activeProcess + 1)}
            </div>

            <div className="relative flex flex-wrap items-center gap-3 mb-6">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-black font-black text-[10px] uppercase tracking-widest ${currentAccent.solid}`}>
                Phase {pad(activeProcess + 1)} / {pad(Project_Process.length)}
              </span>
              {current?.duration && (
                <span className="px-3 py-1.5 rounded-full border border-white/10 font-mono text-[10px] uppercase tracking-widest text-gray-400">
                  {current.duration}
                </span>
              )}
            </div>

            <div className="relative flex items-center gap-4 md:gap-5">
              <div className={`shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl border flex items-center justify-center ${currentAccent.chip}`}>
                {current?.icon}
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.95]">{current?.step}</h3>
            </div>

            <p className="relative mt-5 text-gray-300 text-sm md:text-lg max-w-2xl leading-relaxed">{current?.detail}</p>

            <div className="relative mt-8 pt-6 border-t border-white/10">
              <p className="font-mono text-[10px] uppercase tracking-[.3em] text-gray-500 mb-4">Key Deliverables</p>
              <div className="flex flex-wrap gap-2">
                {current?.deliverables.map((d) => (
                  <span key={d} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-sm text-gray-200">
                    <span className={`w-1.5 h-1.5 rounded-full ${currentAccent.dot}`} /> {d}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Phase list */}
          <div className={`col-span-2 lg:col-span-2 ${tileBase} p-3 md:p-4 flex flex-col`}>
            <ol className="flex-1 space-y-1.5">
              {Project_Process.map((step, index) => {
                const isActive = activeProcess === index;
                const a = accentAt(index);
                return (
                  <li key={step.step}>
                    <button
                      onClick={() => setActiveProcess(index)}
                      aria-current={isActive ? "step" : undefined}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-300 ${isActive ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"}`}
                    >
                      <span className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black transition-colors ${isActive ? `${a.solid} text-black` : "bg-white/5 text-gray-500"}`}>
                        {index + 1}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className={`block text-sm font-black uppercase tracking-tight truncate ${isActive ? "text-white" : "text-gray-400"}`}>{step.step}</span>
                        <span className="block text-[10px] font-mono uppercase tracking-wider text-gray-600 truncate">{step.deliverables[0]}</span>
                      </span>
                      {isActive && <span className={`shrink-0 w-1.5 h-8 rounded-full ${a.solid}`} />}
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* Progress + controls */}
            <div className="mt-4 px-2 pb-1">
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-rose-500 transition-all duration-700 ease-out"
                  style={{ width: `${((activeProcess + 1) / Project_Process.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => setActiveProcess(prev => Math.max(0, prev - 1))}
                  disabled={activeProcess === 0}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <FaArrowLeft className="w-3 h-3" /> Previous
                </button>
                <button
                  onClick={() => setActiveProcess(prev => Math.min(Project_Process.length - 1, prev + 1))}
                  disabled={activeProcess === Project_Process.length - 1}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next <FaArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* ================= FINAL CTA ================= */}
          <div
            className="col-span-2 lg:col-span-6 mt-6 md:mt-8 relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-[#0c0906]/90 border border-white/10 animate-zoom-in opacity-0 fill-mode-forwards"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="absolute -right-24 top-0 bottom-0 w-2/3 md:w-1/2 bg-gradient-to-br from-orange-500/25 via-rose-500/10 to-violet-500/10 -skew-x-12 pointer-events-none" />

            <div className="relative grid md:grid-cols-[1fr_auto] items-center gap-10 p-6 sm:p-10 md:p-14">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400 mb-4">// Next_Step</p>
                <h3 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                  Start Your Project{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500">Today</span>
                </h3>
                <p className="mt-5 text-sm md:text-base text-gray-400 max-w-lg">
                  Let&apos;s build a stunning, fast, and future-ready website together.
                </p>
              </div>

              {/* Rotating badge button */}
              <button
                onClick={() => handleGo("/openline")}
                aria-label="Consult now"
                className="group/cta relative mx-auto w-40 h-40 md:w-48 md:h-48 shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <svg
                  viewBox="0 0 200 200"
                  className="absolute inset-0 w-full h-full text-orange-300"
                  style={{ animation: "spin-slow 18s linear infinite" }}
                >
                  <defs>
                    <path id="services-cta-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                  </defs>
                  <text className="fill-current font-mono font-bold uppercase" style={{ fontSize: 13, letterSpacing: 5 }}>
                    <textPath href="#services-cta-circle">Consult Now • Consult Now • Consult Now • </textPath>
                  </text>
                </svg>
                <span className="absolute inset-[22%] rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.5)] group-hover/cta:scale-110 group-hover/cta:shadow-[0_0_60px_rgba(249,115,22,0.8)] transition-all duration-300">
                  <FaArrowRight className="text-2xl md:text-3xl text-black -rotate-45 group-hover/cta:rotate-0 transition-transform duration-300" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
