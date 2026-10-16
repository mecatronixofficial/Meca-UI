"use client";

import React, { useState, useEffect } from "react";
import Icons from "../../helper/icon_help";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Our_Features, Our_working_lines, Our_Team, Our_Values, Our_Stats, Our_tabs } from "../../helper/data_help";
import Img_Helper from "../../helper/img_help";
import type { Particle } from "../../types/space";

const Ourworld = () => {
  const [activeTab, setActiveTab] = useState("features");
  const [particles, setParticles] = useState<Particle[]>([]);
  const router = useRouter();
  const { FaRocket,
    FaArrowRight,
    FaCheckCircle } = Icons;


  // Generate particles on mount (client-only to avoid hydration mismatch)
  useEffect(() => {


    const newParticles = [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 10 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10
    }));
    setParticles(newParticles);
  }, []);

  const HandleGo = () => { router.push("/openline") }

  const pad = (n: number) => String(n).padStart(2, "0");

  // Accent palette (orange stays the primary brand colour).
  // Full class names are spelled out so Tailwind can generate them.
  const ACCENTS = [
    { chip: "bg-orange-500/10 border-orange-500/30 text-orange-400", solid: "bg-orange-500", text: "text-orange-300", hover: "hover:border-orange-500/50", glow: "bg-orange-500/15" },
    { chip: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400", solid: "bg-cyan-400", text: "text-cyan-300", hover: "hover:border-cyan-500/50", glow: "bg-cyan-500/15" },
    { chip: "bg-violet-500/10 border-violet-500/30 text-violet-400", solid: "bg-violet-400", text: "text-violet-300", hover: "hover:border-violet-500/50", glow: "bg-violet-500/15" },
    { chip: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", solid: "bg-emerald-400", text: "text-emerald-300", hover: "hover:border-emerald-500/50", glow: "bg-emerald-500/15" },
    { chip: "bg-amber-500/10 border-amber-500/30 text-amber-400", solid: "bg-amber-400", text: "text-amber-300", hover: "hover:border-amber-500/50", glow: "bg-amber-500/15" },
    { chip: "bg-rose-500/10 border-rose-500/30 text-rose-400", solid: "bg-rose-400", text: "text-rose-300", hover: "hover:border-rose-500/50", glow: "bg-rose-500/15" },
  ];
  const accentAt = (i: number) => ACCENTS[i % ACCENTS.length];

  const tileBase = "relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/50 backdrop-blur-md";

  // Icon chip that fills with its accent colour on hover
  const iconChip = (icon: React.ReactNode, a: (typeof ACCENTS)[number], size = "w-12 h-12") => (
    <div className={`relative overflow-hidden shrink-0 ${size} rounded-2xl border flex items-center justify-center text-lg transition-colors ${a.chip} group-hover:text-black group-hover:border-transparent`}>
      <span className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${a.solid}`} />
      <span className="relative">{icon}</span>
    </div>
  );

  return (
    <section id="ourworld" className="relative w-full overflow-hidden text-white font-sans selection:bg-orange-500/30">
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full opacity-20 bg-white"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animation: `float ${p.duration}s infinite linear`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">

          {/* ================= TITLE TILE ================= */}
          <div className="col-span-2 lg:col-span-4 lg:row-span-2 relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0906]/80 backdrop-blur-xl p-6 sm:p-8 md:p-12 flex flex-col justify-between min-h-[380px] md:min-h-[460px]">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-500/20 blur-[110px]" />
            <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-violet-500/10 blur-[110px]" />
            <div className="absolute right-4 bottom-2 text-[5rem] sm:text-[8rem] md:text-[10rem] font-black leading-none text-white/[0.03] uppercase tracking-tighter select-none pointer-events-none">
              World
            </div>

            <div className="relative flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-black font-black text-[9px] sm:text-[10px] uppercase tracking-[0.25em]">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                Discover Mecatronix
              </span>
              <span className="hidden sm:block font-mono text-[10px] uppercase tracking-widest text-gray-500">Est. 2026 / CBE</span>
            </div>

            {/* @container: the title scales with this card's width, not the viewport */}
            <div className="@container relative mt-10">
              <h1 className="font-black uppercase tracking-tighter leading-[0.88] text-[clamp(2rem,10cqw,5.5rem)] break-words">
                <span className="block text-white">Welcome to</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-500 to-rose-500 bg-[length:200%_auto] animate-gradient">
                  Our World
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg md:text-2xl text-gray-200 leading-snug">
                <span className="text-orange-400 font-bold">Mecatronix</span> is a leading{" "}
                <strong className="text-white">software company in Coimbatore</strong> delivering
                web development, ecommerce solutions, and scalable digital platforms.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-base md:text-lg font-light text-white">
                  Born in the Future. <span className="text-orange-400">Built for Success.</span>
                </p>
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">// Engineering the digital heartbeat</span>
              </div>
            </div>
          </div>

          {/* ================= MAP TILE ================= */}
          <div className={`col-span-2 ${tileBase} p-5 flex flex-col min-h-[200px]`}>
            <div className="relative flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400 text-black font-black text-[9px] uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" /> Global Network
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">Online</span>
            </div>
            <div className="relative flex-1 min-h-[130px] rounded-2xl overflow-hidden bg-black/40 border border-white/5">
              <Image
                src={Img_Helper.world}
                alt="World map"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover opacity-40"
              />
              {[
                { left: "71%", top: "48%", c: "bg-orange-500" },
                { left: "24%", top: "36%", c: "bg-cyan-400" },
                { left: "50%", top: "28%", c: "bg-violet-400" },
                { left: "84%", top: "72%", c: "bg-emerald-400" },
              ].map((n, i) => (
                <span key={i} className="absolute flex h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2" style={{ left: n.left, top: n.top }}>
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${n.c}`} style={{ animationDelay: `${i * 0.5}s` }} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${n.c}`} />
                </span>
              ))}
            </div>
          </div>

          {/* ================= QUOTE TILE ================= */}
          <div className="col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 to-orange-600 text-black p-6 md:p-7 flex flex-col justify-between min-h-[200px]">
            <span className="absolute -right-2 -top-10 text-[10rem] font-black leading-none text-black/10 select-none">&rdquo;</span>
            <span className="relative font-mono text-[10px] font-bold uppercase tracking-[0.3em]">Our Mindset</span>
            <p className="relative mt-4 text-base md:text-lg font-bold leading-snug">
              &ldquo;We go beyond traditional IT services, integrating cutting-edge tech with a client-centric mindset to build future-ready solutions.&rdquo;
            </p>
          </div>

          {/* ================= STATS ================= */}
          {Our_Stats.map((stat, index) => {
            const a = accentAt(index);
            return (
              <div
                key={stat.label}
                className={`col-span-1 group ${tileBase} p-5 flex flex-col justify-between gap-4 min-h-[140px] ${a.hover} hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity ${a.glow}`} />
                {iconChip(<stat.icon />, a, "w-10 h-10")}
                <div className="relative">
                  <div className="text-2xl md:text-3xl font-black text-white">{stat.number}</div>
                  <div className={`mt-1 font-mono text-[9px] md:text-[10px] uppercase tracking-widest ${a.text}`}>{stat.label}</div>
                </div>
              </div>
            );
          })}

          {/* ================= WHO WE ARE ================= */}
          <div className="col-span-2 lg:col-span-6 flex items-center gap-4 pt-8 md:pt-12 pb-1">
            <span className="font-black uppercase tracking-tighter text-2xl md:text-3xl whitespace-nowrap">
              Who We Are<span className="text-orange-500">.</span>
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-orange-500/60 via-white/10 to-transparent" />
          </div>

          <div className={`col-span-2 lg:col-span-4 ${tileBase} p-6 sm:p-8 md:p-10`}>
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px]" />
            <p className="relative text-gray-300 text-base md:text-lg leading-relaxed">
              Established in <strong className="text-white">2026</strong>, Mecatronix is not just an IT company in Coimbatore; we are the digital catalyst behind business transformation.
              As the world moves at lightning speed, we design and deliver powerful digital solutions that shape the future and drive success in the new digital era.
            </p>
            <p className="relative mt-4 text-gray-400 leading-relaxed">
              We specialize in the full lifecycle of digital development—from the first line of code on your website to the final pixel on your marketing posters.
            </p>

            <div className="relative mt-8 flex flex-wrap gap-2">
              {Our_Values.map((val, idx) => {
                const a = accentAt(idx);
                return (
                  <span key={val.title} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${a.chip}`}>
                    {val.icon} <span className="text-gray-100">{val.title}</span>
                  </span>
                );
              })}
            </div>
          </div>

          <div className="col-span-2 lg:col-span-2 p-px rounded-[2rem] bg-gradient-to-br from-orange-500/60 via-violet-500/25 to-cyan-500/40">
            <div className="relative h-full overflow-hidden rounded-[2rem] bg-[#0c0906]/90 p-6 md:p-7 flex flex-col">
              <p className="font-mono text-[10px] uppercase tracking-[.3em] text-orange-400">// Advantage</p>
              <h3 className="mt-1 text-2xl font-black uppercase tracking-tighter">Why Mecatronix?</h3>
              <ul className="mt-5 space-y-2.5">
                {["Futuristic Design Approach", "Full-Cycle Maintenance", "Custom Digital Marketing", "2026 Ready Technology"].map((item, i) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-200">
                    <FaCheckCircle className={`shrink-0 ${accentAt(i).text}`} />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={HandleGo}
                className="group/btn mt-auto pt-6"
              >
                <span className="flex items-center justify-center gap-3 w-full py-4 rounded-full bg-orange-500 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(249,115,22,0.35)] group-hover/btn:bg-white transition-all">
                  Let&apos;s Talk <FaArrowRight className="-rotate-45 group-hover/btn:rotate-0 transition-transform" />
                </span>
              </button>
            </div>
          </div>

          {/* ================= EXPLORE (TABS) ================= */}
          <div className="col-span-2 lg:col-span-6 flex flex-col md:flex-row md:items-center gap-4 pt-8 md:pt-12 pb-1">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <span className="font-black uppercase tracking-tighter text-2xl md:text-3xl whitespace-nowrap">
                Explore<span className="text-orange-500">.</span>
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500/60 via-white/10 to-transparent" />
            </div>
            <div role="tablist" aria-label="About Mecatronix" className="grid grid-cols-2 sm:flex gap-2">
              {Our_tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 ${isActive
                      ? "bg-orange-500 text-black"
                      : "border border-white/10 bg-white/[0.03] text-gray-400 hover:text-white hover:border-white/25"
                      }`}
                  >
                    <tab.icon />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FEATURES TAB */}
          {activeTab === "features" && Our_Features.map((item, idx) => {
            const a = accentAt(idx);
            return (
              <div
                key={item.title}
                className={`col-span-2 sm:col-span-1 lg:col-span-2 group ${tileBase} p-6 flex flex-col ${a.hover} hover:-translate-y-1 transition-all duration-300 animate-fade-in-up`}
              >
                <div className={`absolute -bottom-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-40 group-hover:opacity-100 transition-opacity ${a.glow}`} />
                <div className="relative flex items-start justify-between gap-4 mb-5">
                  {iconChip(item.icon, a)}
                  <span className="text-4xl font-black leading-none text-white/10 group-hover:text-white/20 transition-colors">{pad(idx + 1)}</span>
                </div>
                <h3 className="relative text-lg font-black uppercase tracking-tight text-white">{item.title}</h3>
                <p className="relative mt-2 text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                <span className={`relative mt-auto pt-5 font-mono text-[10px] uppercase tracking-widest ${a.text}`}>{item.stats}</span>
              </div>
            );
          })}

          {/* PROCESS TAB */}
          {activeTab === "process" && Our_working_lines.map((step, idx) => {
            const a = accentAt(idx);
            return (
              <div
                key={step.title}
                className={`col-span-2 sm:col-span-1 lg:col-span-3 group ${tileBase} p-6 md:p-8 ${a.hover} transition-colors animate-fade-in-up`}
              >
                <div className="absolute right-4 -bottom-6 text-[7rem] md:text-[9rem] font-black leading-none text-white/[0.04] select-none pointer-events-none">{pad(idx + 1)}</div>
                <div className="relative flex items-center gap-4 mb-4">
                  {iconChip(step.icon, a, "w-14 h-14")}
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-black font-black text-[10px] uppercase tracking-widest ${a.solid}`}>Step {pad(idx + 1)}</span>
                    <h3 className="mt-1.5 text-lg md:text-xl font-black uppercase tracking-tight text-white">{step.title}</h3>
                  </div>
                </div>
                <p className="relative text-sm md:text-base text-gray-400 mb-5">{step.desc}</p>
                <div className="relative flex flex-wrap gap-2">
                  {step.details.map((detail) => (
                    <span key={detail} className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-gray-300">{detail}</span>
                  ))}
                </div>
              </div>
            );
          })}

          {/* TEAM TAB */}
          {activeTab === "team" && (
            <>
              <p className="col-span-2 lg:col-span-6 text-sm md:text-base text-gray-400 max-w-3xl animate-fade-in-up">
                Our success is powered by a skilled team of engineers, designers, and technology leaders. We are always looking for talented individuals to join our journey.
              </p>
              {Our_Team.map((member, idx) => {
                const a = accentAt(idx);
                return (
                  <div
                    key={member.title}
                    className={`col-span-2 ${idx === Our_Team.length - 1 ? "sm:col-span-2" : "sm:col-span-1"} lg:col-span-2 group ${tileBase} p-6 md:p-8 ${a.hover} hover:-translate-y-1 transition-all duration-300 animate-fade-in-up`}
                  >
                    <div className={`absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity ${a.glow}`} />
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl text-black ${a.solid}`}>
                        {member.icon}
                      </div>
                      <p className={`mt-6 font-mono text-[10px] uppercase tracking-[.3em] ${a.text}`}>{member.role}</p>
                      <h3 className="mt-1 text-xl md:text-2xl font-black uppercase tracking-tight text-white">{member.title}</h3>
                      <p className="mt-3 text-gray-400 text-sm leading-relaxed">{member.desc}</p>
                    </div>
                  </div>
                );
              })}
              <div className="col-span-2 lg:col-span-6 flex justify-center pt-2 animate-fade-in-up">
                <button
                  onClick={HandleGo}
                  className="group/btn inline-flex items-center gap-3 px-8 py-4 rounded-full bg-orange-500 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(249,115,22,0.35)] hover:bg-white active:scale-95 transition-all"
                >
                  Join Our Journey <FaArrowRight className="-rotate-45 group-hover/btn:rotate-0 transition-transform" />
                </button>
              </div>
            </>
          )}

          {/* VALUES TAB */}
          {activeTab === "values" && Our_Values.map((value, idx) => {
            const a = accentAt(idx);
            const isLast = idx === Our_Values.length - 1;
            return (
              <div
                key={value.title}
                className={`col-span-2 ${isLast ? "sm:col-span-2" : "sm:col-span-1"} ${idx < 3 ? "lg:col-span-2" : "lg:col-span-3"} group ${tileBase} p-6 md:p-7 flex items-start gap-5 ${a.hover} transition-colors animate-fade-in-up`}
              >
                <div className={`absolute -bottom-14 -right-14 w-40 h-40 rounded-full blur-3xl opacity-40 group-hover:opacity-100 transition-opacity ${a.glow}`} />
                {iconChip(value.icon, a)}
                <div className="relative flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-black uppercase tracking-tight text-white">{value.title}</h3>
                    <span className="font-mono text-[10px] text-gray-600">{pad(idx + 1)}</span>
                  </div>
                  <p className="mt-2 text-sm md:text-base text-gray-400 leading-relaxed">{value.desc}</p>
                </div>
              </div>
            );
          })}

          {/* ================= MISSION ================= */}
          <div className="col-span-2 lg:col-span-6 mt-6 md:mt-8 relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-[#0c0906]/90 border border-white/10 animate-zoom-in">
            <div className="absolute -right-24 top-0 bottom-0 w-2/3 md:w-1/2 bg-gradient-to-br from-orange-500/25 via-rose-500/10 to-violet-500/10 -skew-x-12 pointer-events-none" />

            <div className="relative grid md:grid-cols-[auto_1fr] items-center gap-8 p-6 sm:p-10 md:p-14">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-[1.75rem] bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.45)]">
                <FaRocket className="text-3xl md:text-5xl text-black animate-bounce-slow" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400 mb-3">// Mission_Statement</p>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                  &ldquo;Engineering the{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500">Digital Tomorrow</span>&rdquo;
                </h2>
                <p className="mt-5 text-sm md:text-lg text-gray-300 leading-relaxed max-w-3xl">
                  Our mission is to bridge the gap between human imagination and digital execution.
                  Whether it&apos;s a poster that stops traffic or an app that changes lives, we build it with precision.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-4 py-2 rounded-full bg-orange-500 text-black font-black text-[10px] uppercase tracking-widest">#Mecatronix2026</span>
                  <span className="px-4 py-2 rounded-full bg-cyan-400 text-black font-black text-[10px] uppercase tracking-widest">#FutureTech</span>
                  <span className="px-4 py-2 rounded-full bg-violet-400 text-black font-black text-[10px] uppercase tracking-widest">#DigitalGrowth</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ourworld;
