import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Icons from "../../helper/icon_help";
import { Project_Process, Short_Services, Services_List, Most_Used_Tech_Stack, ServiceCategories } from "../../helper/data_help.jsx";

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

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeProcess, setActiveProcess] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();
  const {
    FaArrowRight,
    FaPlay,
    FaPause,
    FaChevronRight,
    FaArrowLeft } = Icons;

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
    Array.from({ length: 4 }).map((_, i) => ({
      id: i,
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

  const Card = ({ tech }) => (
    <div className="flex-shrink-0 w-48 mx-3">
      <div className="group relative p-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-orange-500/50 hover:bg-white/[0.08] transition-all duration-500 overflow-hidden">
        {/* Hover Gradient Glow */}
        <div className={`absolute -inset-1 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 blur-lg transition-opacity`} />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="text-3xl mb-4 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform">
            {tech.icon}
          </div>
          <h4 className="text-sm font-black text-white tracking-tight">{tech.name}</h4>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">{tech.category}</p>
        </div>
      </div>
    </div>
  );

  const handleGo = (path = "/openline") => {
    navigate(path);
  };

  return (
    <section className="pb-24 pt-32 bg-black text-white relative overflow-hidden">

      <SpaceBackground stars={stars} shootingStars={shootingStars} />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-gradient-to-r from-orange-500/20 to-orange-500/20 rounded-full animate-float"
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

        {/* Header */}
        <div className="max-w-6xl mx-auto mb-10 px-4">

          {/* Dynamic Background Glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

          {/* Top Label - Futuristic Style */}
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-4 group cursor-default">
              <span className="w-12 h-px bg-gradient-to-r from-transparent to-orange-500 group-hover:w-20 transition-all duration-700" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-500">
                Precision Web Solutions
              </span>
              <span className="w-12 h-px bg-gradient-to-l from-transparent to-orange-500 group-hover:w-20 transition-all duration-700" />
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center relative z-10">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-10">
              CRAFTING <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  SCALABLE
                </span>
              </span> EXPERIENCES
            </h2>

            <p className="text-gray-500 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed mb-16">
              Mecatronix engineers <span className="text-white font-medium">high-velocity web ecosystems</span>.
              We prioritize sub-second performance, zero-trust security, and architectural growth.
            </p>

            {/* Services Bento Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl mx-auto mb-10">
              {Short_Services.map((service, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-orange-500/40 transition-all duration-500 cursor-default overflow-hidden"
                >
                  {/* Subtle Numbering */}
                  <span className="absolute top-2 left-3 text-[8px] font-bold text-gray-700 group-hover:text-orange-900 transition-colors">
                    0{i + 1}
                  </span>

                  <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors text-center">
                    {service.title}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-gray-600 mt-2">
                    {service.code}
                  </span>

                  {/* Hover Glow Effect */}
                  <div className="absolute -bottom-2 w-full h-1 bg-orange-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity" />
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="flex justify-center">
              <span className="w-40 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"></span>
            </div>


            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <button onClick={() => handleGo("/openline")} className="group relative px-10 py-4 bg-white text-black text-xs font-black uppercase tracking-widest overflow-hidden rounded-sm transition-all hover:pr-12">
                <span className="relative z-10">Start Project</span>
                <FaChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" />
              </button>

              <a href="#Eco" className="px-10 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white border border-white/10 hover:border-white transition-all rounded-sm">
                View Ecosystem
              </a>
            </div>
          </div>

          {/* Bottom Divider Accent */}
          <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {ServiceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95 ${activeCategory === category.id
                ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/20"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
            >
              {category.label}
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">{category.count}</span>
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredServices.map((service, index) => (
            <div
              key={index}
              className="group relative transform transition-all duration-500 hover:-translate-y-2 animate-zoom-in opacity-0 fill-mode-forwards"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full hover:bg-white/10 transition-all duration-500">
                <div className={`bg-gradient-to-r ${service.color} p-4 rounded-2xl inline-block mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-4 text-sm">{service.desc}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.features.map((f, i) => (
                    <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-400">{f}</span>
                  ))}
                </div>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-r ${service.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}></div>
            </div>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="relative text-center mb-24 animate-fade-in-up">
          {/* Geometric Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-1/4 w-64 h-64 border border-white/5 rounded-full"></div>
            <div className="absolute bottom-20 right-1/4 w-96 h-96 border border-white/5 rounded-full"></div>
            <div className="absolute top-1/2 left-1/3 w-48 h-48 rotate-45 border border-white/5"></div>
          </div>

          <div className="relative">
            {/* Tech Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-black/30 to-black/10 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-lg mb-10 shadow-2xl shadow-orange-500/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
                  TECHNOLOGY STACK
                </span>
              </div>
              <div className="h-4 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
              <div className="flex gap-1">
                {Most_Used_Tech_Stack.slice(0, 3).map((tech, index) => (
                  <div key={index} className="text-xs font-medium text-gray-400">
                    {tech.name}{index < 2 && <span className="mx-1">•</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Heading with Tech Integration */}
            <h2 className="relative text-5xl md:text-7xl font-black mb-8">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">
                WEB
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 animate-gradient mt-2">
                DEVELOPMENT
              </span>
              <div className="inline-flex items-center gap-3 mt-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <span className="text-lg font-medium text-gray-400 tracking-widest">SERVICES</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </div>
            </h2>

            {/* Description with Tech Highlight */}
            <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed mb-12 px-6">
              Crafting digital experiences with{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-red-300 font-bold">
                  modern technologies
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-red-500"></span>
              </span>{" "}
              that drive results and exceed expectations.
            </p>

            {/* Tech Grid Preview */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3 max-w-2xl mx-auto mb-12">
              {Most_Used_Tech_Stack.slice(0, 12).map((tech, index) => (
                <div
                  key={index}
                  className={`group relative p-3 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-xl hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{tech.icon}</div>
                    <div className="text-[10px] font-semibold text-gray-400 truncate">
                      {tech.name}
                    </div>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="Eco" className="mb-12 animate-fade-in-up opacity-0 fill-mode-forwards" style={{ animationDelay: '0.4s' }}>
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-8 mb-10">
              <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-white/15 px-8 py-4 rounded-2xl mb-6">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">
                    Development Process
                  </h3>
                </div>

                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Click through each phase to understand our comprehensive workflow
                </p>
              </div>

              <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-lg border border-white/10 rounded-xl hover:border-orange-500/30 transition-all duration-300 hover:scale-105 mb-12"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPlaying ? 'bg-red-500/20' : 'bg-orange-500/20'}`}>
                {isPlaying ?
                  <FaPause className="w-4 h-4 text-red-400" /> :
                  <FaPlay className="w-4 h-4 text-orange-400" />
                }
              </div>
              <span className="text-sm font-medium text-gray-300">
                {isPlaying ? 'Pause Auto-Play' : 'Auto-Play Process'}
              </span>
            </button>
          </div>

          {/* Interactive Process Cards */}
          <div className="relative max-w-6xl mx-auto">
            {/* Main Active Card */}
            <div className="relative z-30 mb-12">
              <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl p-10 shadow-2xl shadow-orange-500/10 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 animate-pulse"></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-10">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-r from-orange-500 to-red-600 shadow-lg shadow-orange-500/50`}>
                          {Project_Process[activeProcess]?.icon}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-orange-400 tracking-wider uppercase">Phase {activeProcess + 1}</div>
                          <h4 className="text-3xl font-bold text-white mt-2">{Project_Process[activeProcess]?.step}</h4>
                        </div>
                      </div>

                      <p className="text-gray-300 text-lg max-w-3xl leading-relaxed">
                        {Project_Process[activeProcess]?.detail}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500/30 to-red-500/30">
                        {activeProcess + 1}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">of {Project_Process.length}</div>
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="text-lg font-bold text-white mb-6">Key Deliverables</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Project_Process[activeProcess]?.deliverables.map((d, i) => (
                        <div key={i} className="group">
                          <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 flex items-center justify-center">
                                <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                              </div>
                              <span className="text-gray-300 font-medium">{d}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Navigation Cards */}
            <div className="relative z-20">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Project_Process.map((step, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveProcess(index)}
                    className={`group relative cursor-pointer transition-all duration-500 ${activeProcess === index ? 'transform -translate-y-4' : 'hover:-translate-y-2'}`}
                  >
                    {/* Card */}
                    <div className={`relative rounded-2xl p-6 border-2 backdrop-blur-lg transition-all duration-500 ${activeProcess === index ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/40' : 'bg-white/5 border-white/10 hover:border-orange-500/20'}`}>
                      {/* Step Indicator */}
                      <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${activeProcess === index ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white' : 'bg-white/10 text-gray-400'}`}>
                        {index + 1}
                      </div>

                      <div className="text-center">
                        <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center text-xl transition-all duration-300 ${activeProcess === index ? 'bg-white text-orange-600 shadow-lg' : 'bg-white/10 group-hover:bg-white/15'}`}>
                          {step.icon}
                        </div>

                        <h4 className={`font-bold text-sm mb-2 transition-colors duration-300 ${activeProcess === index ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                          {step.step}
                        </h4>

                        <div className="h-1 w-6 mx-auto mb-3">
                          <div className={`h-full rounded-full transition-all duration-300 ${activeProcess === index ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gray-700 group-hover:bg-gray-600'}`}></div>
                        </div>

                        <div className="flex justify-center">
                          {step.deliverables.slice(0, 1).map((d, i) => (
                            <span
                              key={i}
                              className="text-xs text-gray-500 truncate"
                              title={d}
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Active Indicator */}
                    {activeProcess === index && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-gradient-to-r from-orange-500 to-red-600 border-t border-l border-black/40"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-16">
                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${((activeProcess + 1) / Project_Process.length) * 100}%` }}
                  >
                    <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setActiveProcess(prev => Math.max(0, prev - 1))}
                    disabled={activeProcess === 0}
                    className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${activeProcess === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 hover:bg-white/5'}`}
                  >
                    <FaArrowLeft className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-400">Previous</span>
                  </button>

                  <button
                    onClick={() => setActiveProcess(prev => Math.min(Project_Process.length - 1, prev + 1))}
                    disabled={activeProcess === Project_Process.length - 1}
                    className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${activeProcess === Project_Process.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 hover:bg-white/5'}`}
                  >
                    <span className="text-sm font-medium text-gray-400">Next</span>
                    <FaArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center animate-zoom-in opacity-0 fill-mode-forwards" style={{ animationDelay: '0.6s' }}>
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">Start Your Project Today</h3>
            <p className="text-gray-400 mb-6 text-sm">Let's build a stunning, fast, and future-ready website together.</p>
            <a href="/openline" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-xl active:scale-95 transition-all">
              Consult Now <FaArrowRight />
            </a>
          </div>
        </div>

      </div>

    </section>
  );
};

export default Services;