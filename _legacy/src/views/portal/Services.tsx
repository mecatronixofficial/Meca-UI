"use client";

import { useCallback, useEffect, useState } from "react";
import { getAllWorksAPI } from "../../api/api";
import Icons from "../../helper/icon_help";
import Thirukural from "../thirukural/Thirukural";
import { useRouter } from "next/navigation";
import { Top_Servicess } from "../../helper/data_help";
import { accentAt, TILE, TILE_HERO, pad2 } from "../../helper/accent_help";

const AUTOPLAY_MS = 6000;

const Services = () => {
  const {
    FaArrowRight, FaRocket, FaCheckCircle, FaBolt, FaGlobeAmericas
  } = Icons;

  const [activeService, setActiveService] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const router = useRouter();

  const service = Top_Servicess[activeService];
  const total = Top_Servicess.length;
  const a = accentAt(activeService);

  // Respect users who prefer reduced motion
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAutoplay(false);
    }
  }, []);

  const HandleFetch = useCallback(async () => {
    try {
      await getAllWorksAPI();
    } catch {
      // Failure is already logged by the API layer when debug mode is enabled.
    }
  }, []);

  useEffect(() => {
    HandleFetch();
  }, [HandleFetch]);

  const goNext = () => setActiveService((prev) => (prev + 1) % total);

  const selectService = (index: number) => {
    setActiveService(index);
    // Manual choice wins over autoplay
    setAutoplay(false);
  };

  const HandleGo = () => { router.push("/openline") }

  const microStats = [
    { label: "Uptime", val: "99.9%", icon: <FaBolt /> },
    { label: "Delivery", val: "Tactical", icon: <FaRocket /> },
    { label: "Success", val: "100%", icon: <FaCheckCircle /> },
    { label: "Support", val: "24/7 Global", icon: <FaGlobeAmericas /> },
  ];

  return (
    <section id="services" className="relative text-white overflow-hidden py-16 md:py-24">
      <Thirukural />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">

          {/* ================= HEADER ================= */}
          <div className="col-span-2 lg:col-span-6 flex flex-col md:flex-row md:items-end gap-4 md:gap-8 pb-2">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-black font-black text-[9px] sm:text-[10px] uppercase tracking-[0.25em] mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" /> Service_Matrix
              </span>
              <h2 className="font-black uppercase tracking-tighter leading-[0.88] text-4xl sm:text-5xl md:text-6xl">
                Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-500 to-rose-500 bg-[length:200%_auto] animate-gradient">
                  Services
                </span>
                <span className="text-orange-500">.</span>
              </h2>
            </div>
            <p className="md:max-w-sm text-gray-400 text-sm md:text-base leading-relaxed">
              Comprehensive digital solutions designed to accelerate your business growth and drive innovation through tactical excellence.
            </p>
          </div>

          {/* ================= SELECTOR + DETAIL ================= */}
          <div
            className="col-span-2 lg:col-span-6 grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Selector */}
            <nav aria-label="Services" className={`col-span-2 ${TILE} p-2 md:p-3`}>
              <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible snap-x [scrollbar-width:none]">
                {Top_Servicess.map((item, index) => {
                  const isActive = activeService === index;
                  const ia = accentAt(index);
                  return (
                    <button
                      key={item.id}
                      onClick={() => selectService(index)}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative shrink-0 snap-start min-w-[210px] lg:min-w-0 w-full text-left flex items-center gap-3 p-3 rounded-2xl overflow-hidden transition-all duration-300 ${isActive ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"}`}
                    >
                      <span className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-colors ${isActive ? `${ia.solid} text-black` : "bg-white/5 text-gray-500"}`}>
                        {pad2(index + 1)}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className={`block text-sm font-black uppercase tracking-tight truncate ${isActive ? "text-white" : "text-gray-400"}`}>{item.title}</span>
                        <span className={`block font-mono text-[10px] uppercase tracking-wider truncate ${isActive ? ia.text : "text-gray-600"}`}>{item.stats}</span>
                      </span>
                      <FaArrowRight className={`shrink-0 text-xs transition-all duration-300 ${isActive ? "text-white opacity-100" : "opacity-0 -translate-x-2"}`} />

                      {/* Autoplay progress */}
                      {isActive && autoplay && (
                        <span
                          key={activeService}
                          className={`absolute left-3 right-3 bottom-1 h-[2px] rounded-full origin-left ${ia.solid}`}
                          style={{
                            animation: `service-progress ${AUTOPLAY_MS}ms linear forwards`,
                            animationPlayState: paused ? "paused" : "running",
                          }}
                          onAnimationEnd={goNext}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Detail */}
            <article className={`col-span-2 lg:col-span-4 ${TILE_HERO} min-h-[460px] group`}>
              <div
                key={`bg-${service.id}`}
                className="absolute inset-0 bg-cover bg-center opacity-25 transition-transform duration-[2000ms] group-hover:scale-110 animate-fade-in"
                style={{ backgroundImage: `url(${service.bgImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0906] via-[#0c0906]/90 to-[#0c0906]/60" />
              <div className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[110px] ${a.glow}`} />
              <div className="absolute right-6 -bottom-8 text-[9rem] md:text-[13rem] font-black leading-none text-white/[0.04] select-none pointer-events-none">
                {pad2(activeService + 1)}
              </div>

              <div key={service.id} className="relative h-full p-6 sm:p-8 md:p-10 flex flex-col animate-fade-in-up">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-black font-black text-[10px] uppercase tracking-widest ${a.solid}`}>
                    Module {pad2(activeService + 1)} / {pad2(total)}
                  </span>
                  <span className="px-3 py-1.5 rounded-full border border-white/15 font-mono text-[10px] uppercase tracking-widest text-gray-300">
                    {service.stats}
                  </span>
                </div>

                <div className="mt-8 flex items-center gap-4 md:gap-5">
                  <div className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] flex items-center justify-center text-black [&_svg]:!text-2xl md:[&_svg]:!text-3xl ${a.solid}`}>
                    {service.icon}
                  </div>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9]">{service.title}</h3>
                </div>

                <p className="mt-6 text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl">{service.description}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span key={feature} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.05] border border-white/10 text-sm text-gray-200">
                      <span className={`w-1.5 h-1.5 rounded-full ${a.solid}`} /> {feature}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-8 flex flex-wrap gap-3">
                  <button
                    onClick={HandleGo}
                    className="group/btn inline-flex items-center gap-3 px-7 py-4 rounded-full bg-orange-500 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(249,115,22,0.35)] hover:bg-white active:scale-95 transition-all"
                  >
                    Deploy Service <FaArrowRight className="-rotate-45 group-hover/btn:rotate-0 transition-transform" />
                  </button>
                  <button
                    onClick={() => selectService((activeService + 1) % total)}
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/15 text-gray-300 font-black text-xs uppercase tracking-widest hover:border-white/40 hover:text-white transition-all"
                  >
                    Next: {Top_Servicess[(activeService + 1) % total].title}
                  </button>
                </div>
              </div>
            </article>
          </div>

          {/* ================= MICRO STATS ================= */}
          {microStats.map((s, i) =>
            i === 0 ? (
              <div key={s.label} className="col-span-1 lg:col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 to-orange-600 text-black p-5 md:p-6 flex flex-col justify-between min-h-[140px]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em]">{s.label}</span>
                  <span className="text-lg">{s.icon}</span>
                </div>
                <div className="text-4xl md:text-5xl font-black tracking-tighter">{s.val}</div>
              </div>
            ) : (
              <div key={s.label} className={`col-span-1 ${i === 3 ? "lg:col-span-2" : "lg:col-span-1"} group ${TILE} p-5 md:p-6 flex flex-col justify-between min-h-[140px] ${accentAt(i).hover} transition-colors`}>
                <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl ${accentAt(i).glow}`} />
                <div className="relative flex items-center justify-between gap-2">
                  <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${accentAt(i).text}`}>{s.label}</span>
                  <span className={accentAt(i).text}>{s.icon}</span>
                </div>
                <div className="relative text-2xl md:text-3xl font-black">{s.val}</div>
              </div>
            )
          )}

          {/* ================= CTA ================= */}
          <div className="col-span-2 lg:col-span-6 mt-4 md:mt-6 relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-[#0c0906]/90 border border-white/10">
            <div className="absolute -right-24 top-0 bottom-0 w-2/3 md:w-1/2 bg-gradient-to-br from-orange-500/25 via-rose-500/10 to-violet-500/10 -skew-x-12 pointer-events-none" />
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-10 md:p-12">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400 mb-3">// Mission_Control</p>
                <h3 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9]">
                  Ready to Launch Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500">Next Mission?</span>
                </h3>
                <p className="mt-4 text-sm md:text-base text-gray-400 max-w-lg">
                  Join mecatronix to build cutting-edge digital infrastructure that propels your business forward.
                </p>
              </div>
              <button
                onClick={HandleGo}
                className="group/btn shrink-0 inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-orange-500 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:bg-white active:scale-95 transition-all"
              >
                <FaRocket /> Launch Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
