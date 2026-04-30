import React, { useState, useEffect, useMemo } from "react";
import Icons from "../../helper/icon_help";
import { useNavigate } from "react-router-dom";
import { Our_Features, Our_working_lines, Our_Team, Our_Values, Our_Stats, Our_tabs } from "../../helper/data_help.jsx";
import Img_Helper from "../../helper/img_help.js";

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

      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
    </div>
  );
});

const Ourworld = () => {
  const [activeTab, setActiveTab] = useState("features");
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();
  const { FaRocket,
    FaArrowRight,
    FaCheckCircle } = Icons;

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

  // Generate particles on mount
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

  const HandleGo = () => { navigate("/openline") }

  return (
    <section id="ourworld" className="relative w-full overflow-hidden bg-black text-white font-sans selection:bg-orange-500/30">
      <SpaceBackground stars={stars} shootingStars={shootingStars} />
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative py-16 px-6 overflow-hidden" >
          <div className="absolute inset-0 z-0">
            <img
              src={Img_Helper.world}
              alt="background"
              className="w-full h-full object-contain opacity-30"
            />
            {/* Gradient Overlay to ensure text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
          {/* Optional: Subtle Background Glow for that "Future" vibe */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.05)_0%,transparent_70%)] pointer-events-none" />

          {/* Status Badge */}
          <div className="flex justify-center lg:justify-start">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full mb-12 backdrop-blur-xl hover:border-orange-500/30 transition-all duration-500 group cursor-default">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
              <span className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase group-hover:text-orange-400 transition-colors">
                Discover Mecatronix
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

            {/* Text Content Area */}
            <div className="order-2 lg:order-1 flex-1">
              <div className="relative space-y-8">
                {/* Decorative Vertical Line */}
                <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-orange-500/40 to-transparent hidden lg:block" />

                <div className="space-y-6">
                  <p className="text-2xl md:text-3xl text-gray-200 leading-snug font-medium">
                    <span className="text-orange-500">Mecatronix</span> is a dynamic IT solutions startup.
                    <span className="text-gray-500 font-light"> We act as true technology partners, blending innovation with flawless execution.</span>
                  </p>

                  <p className="text-gray-400 text-lg leading-relaxed max-w-2xl border-l-2 border-white/5 pl-6 italic">
                    "We go beyond traditional IT services, integrating cutting-edge tech with a client-centric mindset to build future-ready solutions."
                  </p>
                </div>

                <div className="pt-4">
                  <p className="text-xl md:text-2xl font-light tracking-wide text-white">
                    Born in the Future. <span className="text-orange-500/80">Built for Success.</span>
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="h-px w-12 bg-orange-500/50" />
                    <span className="text-gray-500 uppercase tracking-widest text-xs font-bold">
                      Engineering the digital heartbeat
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Heading Area */}
            <div className="order-1 lg:order-2 flex-1 text-center lg:text-right">
              <h2 className="text-6xl md:text-8xl font-black leading-none tracking-tighter">
                <span className="text-white block mb-2">Welcome to</span>
                <span className="relative">
                  <span className="bg-gradient-to-br from-orange-400 via-red-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                    Our World
                  </span>
                  {/* Subtle glow behind the text */}
                  <span className="absolute -inset-x-4 -inset-y-2 bg-orange-500/10 blur-3xl -z-10" />
                </span>
              </h2>
            </div>

          </div>
        </div>
        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {Our_Stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`mx-auto w-10 h-10 mb-3 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                <stat.icon />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center animate-slide-in py-24">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white">Who We Are</h2>
            <div className="h-1 w-20 bg-cyan-500 rounded-full"></div>
            <p className="text-gray-300 text-lg leading-relaxed">
              Established in <strong className="text-white">2026</strong>, Mecatronix is more than just an IT company; we are a digital catalyst.
              In a world moving at light speed, we are the engineers of the new digital age.
            </p>
            <p className="text-gray-400 leading-relaxed">
              We specialize in the full lifecycle of digital development—from the first line of code on your website to the final pixel on your marketing posters.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4">
              {Our_Values.map((val, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="text-cyan-400">{val.icon}</div>
                  <span className="font-semibold text-gray-200">{val.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-black/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-6">Why Mecatronix?</h3>
              <ul className="space-y-4">
                {["Futuristic Design Approach", "Full-Cycle Maintenance", "Custom Digital Marketing", "2026 Ready Technology"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => HandleGo()} className="mt-8 w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                Let's Talk <FaArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Our_tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeTab === tab.id
                ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-red-900/50 scale-105 ring-1 ring-white/20"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT AREA */}
        <div className="min-h-[500px] transition-all duration-500 ease-in-out">

          {/* FEATURES TAB */}
          {activeTab === "features" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
              {Our_Features.map((item, idx) => (
                <div key={idx} className="group relative p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{item.desc}</p>
                  <div className="inline-block px-3 py-1 bg-white/5 rounded-full text-xs font-semibold text-orange-300 border border-orange-500/20">
                    {item.stats}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROCESS TAB */}
          {activeTab === "process" && (
            <div className="space-y-6 max-w-4xl mx-auto animate-fade-in-up">
              {Our_working_lines.map((step, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-6 bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-orange-500/30 transition-all duration-300">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl text-white shadow-lg`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-gray-300">STEP 0{idx + 1}</span>
                      <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-gray-400 mb-4">{step.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {step.details.map((detail, dIdx) => (
                        <span key={dIdx} className="text-xs bg-black/30 px-3 py-1 rounded-full text-gray-400 border border-white/5">{detail}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TEAM TAB */}
          {activeTab === "team" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up">
              <div className="md:col-span-3 text-center mb-4">
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Our success is powered by a skilled team of engineers, designers, and technology leaders. We are always looking for talented individuals to join our journey.
                </p>
              </div>
              {Our_Team.map((member, idx) => (
                <div key={idx} className="relative overflow-hidden group bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
                  <div className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-3xl text-white mb-6 shadow-xl`}>
                    {member.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{member.title}</h3>
                  <p className="text-orange-400 text-sm font-semibold uppercase tracking-wider mb-4">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.desc}</p>
                </div>
              ))}
              <div className="md:col-span-3 text-center mt-8">
                <button onClick={() => HandleGo()} className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-orange-600 to-red-600 px-8 py-3 rounded-full hover:shadow-lg hover:shadow-orange-500/20 transition-all transform hover:-translate-y-1">
                  Join Our Journey <FaArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* VALUES TAB */}
          {activeTab === "values" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
              {Our_Values.map((value, idx) => (
                <div key={idx} className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${value.color} flex items-center justify-center text-xl text-white`}>
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center mx-auto animate-zoom-in pt-24">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]"></div>

            <FaRocket className="text-5xl text-purple-500 mx-auto mb-6 animate-bounce" />

            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-6">
              "Engineering the Digital Tomorrow"
            </h2>

            <p className="text-xl text-gray-400 leading-relaxed mb-8">
              Our mission is to bridge the gap between human imagination and digital execution.
              Whether it's a poster that stops traffic or an app that changes lives, we build it with precision.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold tracking-wider text-gray-500 uppercase">
              <span>#Mecatronix2026</span> • <span>#FutureTech</span> • <span>#DigitalGrowth</span>
            </div>
          </div>
        </div>

      </div>

      {/* --- BACKGROUND EFFECTS --- */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div> */}

      {/* --- PARTICLES --- */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white opacity-30"
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
      </div> */}

    </section>
  );
};

export default Ourworld;