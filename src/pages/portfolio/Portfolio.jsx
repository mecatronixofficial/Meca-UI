import React, { useState, useEffect, useMemo } from "react";
import Icons from "../../helper/icon_help";
import { useNavigate } from "react-router-dom";

const SpaceBackground = React.memo(({ stars, shootingStars }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {shootingStars.map((s, i) => (
        <div
          key={i}
          className="shooting-star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
    </div>
  );
});

const Portfolio = () => {
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();

  const { FaTools, FaRocket, FaMicrochip, FaShieldAlt } = Icons;
  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }));
  }, []);

  const [shootingStars] = useState(() =>
    Array.from({ length: 4 }).map(() => ({
      id: crypto?.randomUUID?.() ?? Math.random().toString(36),
      left: Math.random() * 100,
      top: Math.random() * 40,
      delay: Math.random() * 10
    }))
  );

  // Generate particles once on mount
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

  const HandleGo = () => { navigate("/openline") }

  return (
    <section id="portfolio" className="pb-24 pt-32 bg-black text-white relative overflow-hidden">
      <SpaceBackground stars={stars} shootingStars={shootingStars} />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full animate-float"
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

      <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="relative pt-16 pb-16 overflow-hidden">

          {/* --- BACKGROUND ARCHITECTURE --- */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Large Decorative Text Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.02] uppercase tracking-tighter select-none">
              Archive
            </div>
            {/* Radial Lens Flare */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/10 blur-[150px] rounded-full" />
          </div>

          <div className="relative z-10 container mx-auto px-6">

            {/* 🛰️ Floating Status Indicator */}
            <div className="w-full h-auto flex items-center justify-center">
              <div className=" flex items-center justify-center gap-3 bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full mb-10 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500/80">
                  Deployment Registry
                </span>
              </div>
            </div>

            {/* --- MAIN TITLE AREA --- */}
            <div className="text-center space-y-4">
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-white">
                PORTFOLIO <br />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                    SHOWCASE
                  </span>
                  {/* Underline Decoration */}
                  <div className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent blur-sm" />
                </span>
              </h2>
            </div>

            {/* --- DESCRIPTION & METADATA --- */}
            <div className="mt-16 max-w-4xl mx-auto grid md:grid-cols-[1fr_auto_1fr] items-center gap-8">
              <div className="hidden md:block h-px bg-gradient-to-r from-transparent to-white/20" />

              <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed text-center px-4">
                A curated selection of <span className="text-white font-medium italic">digital benchmarks</span>.
                Engineered for performance, designed for the future.
              </p>

              <div className="hidden md:block h-px bg-gradient-to-l from-transparent to-white/20" />
            </div>

            {/* --- FILTER INDICATOR / TAB HUD --- */}
            <div className="mt-16 flex justify-center gap-12">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Total Ops</span>
                <span className="text-2xl font-black text-white">42+</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Success Rate</span>
                <span className="text-2xl font-black text-white">100%</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Client Satisfaction</span>
                <span className="text-2xl font-black text-white">5.0</span>
              </div>
            </div>

          </div>

        </div>

        {/* CTA Section */}
        <div className="relative text-center mt-20 max-w-7xl mx-auto animate-fade-in-up opacity-0 fill-mode-forwards" style={{ animationDelay: '0.5s' }}>

          {/* Decorative Background Glows */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/20 blur-[100px] rounded-full"></div>

          <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl py-24 px-14 mx-auto overflow-hidden group">

            {/* Animated Accent Border (Top) */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>

            {/* Header Icon with Ping Effect */}
            <div className="relative w-fit mx-auto mb-6">
              <div className="absolute inset-0 bg-orange-500/30 rounded-2xl animate-ping"></div>
              <div className="relative bg-gradient-to-br from-orange-400 to-red-600 p-4 rounded-2xl shadow-lg">
                <FaTools className="text-3xl text-white" />
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-4">
              <h3 className="text-4xl font-extrabold tracking-tight text-white mb-2 uppercase">
                System <span className="text-orange-500">Expansion</span> In Progress
              </h3>

              <p className="text-gray-400 max-w-md mx-auto leading-relaxed font-light">
                Mecatronix is currently deploying <span className="text-white font-medium underline decoration-orange-500/50">Next-Gen modules</span>.
                Our digital forge is working at 100% capacity to bring you revolutionary solutions.
              </p>

              {/* New Stylish Feature Tags */}
              <div className="flex flex-wrap justify-center gap-4 py-6">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 text-[10px] uppercase tracking-widest text-orange-300">
                  <FaMicrochip className="text-xs" /> Hardware
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 text-[10px] uppercase tracking-widest text-orange-300">
                  <FaRocket className="text-xs" /> Velocity
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 text-[10px] uppercase tracking-widest text-orange-300">
                  <FaShieldAlt className="text-xs" /> Secure
                </div>
              </div>
            </div>

            {/* Button with Neon Shadow */}
            <button onClick={() => HandleGo()} className="relative group/btn mt-4 overflow-hidden bg-white text-black font-black py-4 px-10 rounded-xl hover:bg-orange-500 hover:text-white active:scale-95 transition-all duration-300">
              <span className="relative z-10 flex items-center gap-2">
                INITIATE PROJECT <span className="text-xs opacity-50">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
            </button>
            {/* Animated Accent Border (Top) */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>

          </div>

          {/* Sub-label */}
          <p className="mt-6 text-[10px] text-gray-600 uppercase tracking-[0.3em] font-mono">
            EST. 2026 // LOGISTICS & DESIGN DIVISION
          </p>
        </div>

      </div>
    </section>
  );
};

export default Portfolio;