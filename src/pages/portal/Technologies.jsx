import React, { useMemo } from "react";
import Icons from "../../helper/icon_help";
import { useNavigate } from "react-router-dom";
import { techCategories } from "../../helper/data_help";

const SpaceBackground = React.memo(({ stars }) => {
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

      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
    </div>
  );
});

const Technologies = () => {
  // Accessing icons from your existing helper
  const {
    FaRocket, FaBolt, FaServer, FaDatabase,
  } = Icons;
  const navigate = useNavigate();
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

  const HandleGo = () => { navigate("/openline") }

  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden py-24">

      <SpaceBackground stars={stars} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* SECTION HEADER */}
        <div className="mb-20">
          <div className="flex items-center gap-3 Smb-4">
            <div className="h-[1px] w-12 bg-orange-600"></div>
            <span className="text-[10px] font-mono font-black text-orange-500 uppercase tracking-[.4em]">
              Resource_Directory
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            TECH<span className="text-orange-600">_STACK</span>
          </h1>
          <p className="mt-4 text-[11px] font-mono text-gray-500 uppercase tracking-widest max-w-xl border-l border-white/10 pl-6">
            // Initializing core dependency modules for industrial-grade digital architectures.
          </p>
        </div>

        {/* CATEGORIES GRID */}
        <div className="space-y-16">
          {techCategories.map((cat) => (
            <div key={cat.id} className="relative">
              {/* Category Sub-Header */}
              <div className="flex items-center gap-6 mb-8">
                <div className={`p-4 border ${cat.color} bg-black skew-x-[-15deg]`}>
                  <div className="skew-x-[15deg] text-xl">{cat.icon}</div>
                </div>
                <div>
                  <h2 className="text-[14px] font-black uppercase tracking-[.3em] text-white">
                    {cat.category}
                  </h2>
                  <p className="text-[9px] font-mono text-gray-600 uppercase">SYS_REF::{cat.id}</p>
                </div>
                <div className="flex-1 h-[1px] bg-white/5"></div>
              </div>

              {/* TACTICAL TECH CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {cat.technologies.map((tech) => (
                  <div key={tech} className="group relative">
                    <div className="p-5 bg-white/[0.02] border border-white/5 hover:border-orange-600/50 hover:bg-orange-600/5 transition-all skew-x-[-10deg]">
                      <div className="skew-x-[10deg] flex flex-col items-center gap-4">
                        {/* Status Light */}
                        <div className="w-full flex justify-between items-center mb-1">
                          <div className="w-1 h-1 bg-orange-600"></div>
                          <div className="text-[8px] font-mono text-gray-700 uppercase">Active</div>
                        </div>

                        <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                          {tech}
                        </span>

                        <div className="w-full h-[1px] bg-white/5 mt-2 overflow-hidden">
                          <div className="w-1/3 h-full bg-orange-600 transform -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* HUD STATS BAR */}
        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-0 border border-white/5 divide-x divide-white/5 bg-white/[0.01]">
          {[
            { value: "50+", label: "TECH_MOD" },
            { value: "100+", label: "DEPLOY_EXE" },
            { value: "4.9", label: "STABLE_RAT" },
            { value: "24/7", label: "SYS_UPTIME" }
          ].map((stat, i) => (
            <div key={i} className="p-8 text-center group hover:bg-orange-600/5 transition-colors">
              <div className="text-3xl font-black text-white group-hover:text-orange-500 transition-colors">
                {stat.value}
              </div>
              <div className="text-[9px] font-mono uppercase tracking-[.3em] text-gray-600 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CALL TO ACTION MODULE */}
        <div className="mt-20 flex justify-center">
          <div className="relative p-12 border border-white/10 bg-black max-w-3xl w-full text-center overflow-hidden">
            {/* Corner Decorative Brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-orange-600"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-orange-600"></div>

            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white mb-8">
                Initialize_Project_Sequence?
              </h3>
              <button onClick={() => HandleGo()} className="px-12 py-4 bg-orange-600 text-white font-black uppercase tracking-widest text-[11px] skew-x-[-15deg] hover:bg-orange-700 active:scale-95 transition-all">
                <span className="skew-x-[15deg] block">Execute_Command</span>
              </button>
            </div>

            {/* Background Text Overlay */}
            <div className="absolute -bottom-4 -right-4 text-[60px] font-black text-white/10 pointer-events-none uppercase italic">
              COMMAND
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technologies;