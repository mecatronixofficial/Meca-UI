import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getAllWorksAPI } from "../../api/api";
import Icons from "../../helper/icon_help";
import Thirukural from "../thirukural/Thirukural";
import { useNavigate } from "react-router-dom";
import { Top_Servicess } from "../../helper/data_help.jsx";

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

const Services = () => {

  // Accessing icons from your existing helper
  const {
    FaChevronRight, FaArrowRight, FaRocket, FaCogs, CiSettings
  } = Icons;

  const [activeService, setActiveService] = useState(0);
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

  const HandleFetch = useCallback(async () => {
    try {
      const result = await getAllWorksAPI();
      console.log(result);
    } catch (error) {
      console.error("Dashboard fetch failed:", error);
    }
  }, []);

  useEffect(() => {
    HandleFetch();
  }, [HandleFetch]);

  const HandleGo = () => { navigate("/openline") }

  return (
    <section className="relative min-h-screen bg-[radial-gradient(circle_at_30%_30%,#1e40af10_0%,transparent_50%),radial-gradient(circle_at_70%_70%,#7c3aed10_0%,transparent_50%)] text-white overflow-hidden py-20">

      <SpaceBackground stars={stars} />
      <Thirukural />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-white/5 rounded-full border border-white/10 mb-6 animate-spin-slow">
            <CiSettings className="text-3xl text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">Services</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Comprehensive digital solutions designed to accelerate your business growth and drive innovation through tactical excellence.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sticky top-8">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <FaCogs className="text-blue-500" /> All Services
              </h3>

              <div className="space-y-2">
                {Top_Servicess.map((service, index) => (
                  <button
                    key={service.id}
                    onClick={() => setActiveService(index)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 group flex items-center gap-4 ${activeService === index
                      ? "bg-blue-600/10 border border-blue-500/30 text-white"
                      : "text-gray-400 hover:bg-white/5 border border-transparent"
                      }`}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${service.color} text-white shadow-lg shadow-black/20`}>
                      {service.icon}
                    </div>
                    <span className="font-semibold flex-1 text-sm">{service.title}</span>
                    <FaChevronRight className={`text-xs transition-all duration-300 ${activeService === index ? "translate-x-1 opacity-100" : "opacity-0 -translate-x-2"}`} />
                  </button>
                ))}
              </div>

              {/* Sidebar Stats */}
              <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-white">1k+</p>
                  <p className="text-[10px] text-gray-500 uppercase">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-white">50+</p>
                  <p className="text-[10px] text-gray-500 uppercase">Clients</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3">
            <div className="relative min-h-[500px] overflow-hidden rounded-[2.5rem] border border-white/10 group bg-slate-900/20 shadow-2xl transition-all duration-500">
              {/* Background Image Layer */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-80"
                  style={{ backgroundImage: `url(${Top_Servicess[activeService].bgImage})` }}
                />
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
                <div className={`absolute inset-0 bg-gradient-to-r ${Top_Servicess[activeService].color} opacity-5`} />
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 p-8 md:p-12">
                <div className="flex flex-col lg:flex-row gap-10">
                  <div className="lg:w-1/3">
                    <div className={`inline-block p-6 rounded-3xl bg-gradient-to-br ${Top_Servicess[activeService].color} shadow-2xl mb-6 ring-4 ring-white/10`}>
                      {Top_Servicess[activeService].icon}
                    </div>
                    <h2 className="text-4xl font-black text-white mb-2 leading-tight uppercase italic">{Top_Servicess[activeService].title}</h2>
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-10 bg-blue-500 rounded-full"></div>
                      <p className="text-blue-400 font-mono text-xs uppercase tracking-widest">{Top_Servicess[activeService].stats}</p>
                    </div>
                  </div>

                  <div className="lg:w-2/3">
                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 font-light">
                      {Top_Servicess[activeService].description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
                      {Top_Servicess[activeService].features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group/feat">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${Top_Servicess[activeService].color} group-hover/feat:scale-150 transition-transform`} />
                          <span className="text-gray-300 text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button onClick={() => HandleGo()} className="flex items-center gap-4 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-blue-400 hover:text-white transition-all duration-300 active:scale-95 group/btn">
                      Deploy Service <FaArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { label: "Uptime", val: "99.9%", icon: "🚀" },
                { label: "Delivery", val: "Tactical", icon: "📦" },
                { label: "Success", val: "100%", icon: "✅" },
                { label: "Support", val: "24/7 Global", icon: "🌍" }
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-5 rounded-3xl text-center hover:bg-white/10 transition-colors">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="text-xl font-black text-white">{s.val}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1 font-bold">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tactical Footer CTA */}
        <div className="mt-20 p-px bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-[3rem]">
          <div className="bg-black/80 backdrop-blur-3xl rounded-[3rem] p-12 text-center border border-white/5 relative overflow-hidden">
            {/* Internal Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-blue-500/10 blur-[100px]" />

            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">Ready to Launch Your Next Mission?</h3>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto relative z-10">Join mecatronix to build cutting-edge digital infrastructure that propels your business forward.</p>
            <button onClick={() => HandleGo()} className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto relative z-10 shadow-xl shadow-blue-500/20 active:scale-95">
              <FaRocket /> Launch Project
            </button>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Services;