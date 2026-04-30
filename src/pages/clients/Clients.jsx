import React, { useEffect, useMemo, useState } from "react";
import Icons from "../../helper/icon_help";
import { getAllClientsCompanyAPI } from "../../api/api";
import { glowColors, spaceThemes } from "../../helper/data_help";

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
            boxShadow: star.size > 1.2 ? '0 0 4px rgba(0, 191, 255, 0.8)' : 'none'
          }}
        />
      ))}

      {/* Nebula Blobs */}
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-orange-500/8 rounded-full blur-[130px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-yellow-500/8 rounded-full blur-[110px]" />
    </div>
  );
});

const Clients = () => {
  const { FaCrown, FaRocket, MdOutlineStarRate } = Icons;
  const [loading, setLoading] = useState(true);
  const [dbCompanies, setDbCompanies] = useState([]);

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

  const handleFetch = async () => {
    try {
      const result = await getAllClientsCompanyAPI();
      if (result.success && Array.isArray(result.data)) {
        setDbCompanies(result.data);
      }
    } catch (error) {
      console.error("Dashboard fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  // Duplicate data for infinite scroll effect
  const scrollingClients = useMemo(
    () => (dbCompanies.length ? [...dbCompanies, ...dbCompanies] : []),
    [dbCompanies]
  );

  const EmptyState = () => (
    <div className="relative h-full min-h-[400px] flex flex-col items-center justify-center bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden group">
      {/* Inner Glow Effects */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />

      {/* Main Visual: Scanning Radar Effect */}
      <div className="relative mb-8">
        {/* Pulsing Outer Rings */}
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -inset-4 border border-blue-500/10 rounded-full animate-[ping_3s_linear_infinite]" />
        <div className="absolute -inset-8 border border-purple-500/5 rounded-full animate-[ping_5s_linear_infinite]" />

        {/* Central Icon */}
        <div className="relative p-8 bg-zinc-950/50 border border-white/10 rounded-full shadow-2xl">
          <FaRocket className="text-5xl text-blue-400 opacity-40 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700" />
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center px-8 relative z-10">
        <h3 className="text-2xl font-bold tracking-tight text-white mb-3">
          The Sector is Quiet
        </h3>
        <p className="text-gray-400 max-w-[280px] mx-auto text-sm leading-relaxed mb-8">
          Our long-range sensors haven't detected any partner transmissions in this coordinate yet.
        </p>

        {/* Small Status Indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">
            Scanning Deep Space
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black overflow-hidden py-24">
      <SpaceBackground stars={stars} />
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <header className="relative text-center mb-24">
          {/* Decorative HUD Lines */}
          <div className="absolute top-1/2 left-0 w-1/4 h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent hidden lg:block" />
          <div className="absolute top-1/2 right-0 w-1/4 h-[1px] bg-gradient-to-l from-transparent via-orange-500/20 to-transparent hidden lg:block" />

          {/* Main Icon with Orbital Ring */}
          <div className="relative inline-flex items-center justify-center mb-8">
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl animate-pulse" />

            {/* Rotating Border */}
            <div className="absolute -inset-2 border border-orange-500/20 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />

            <div className="relative p-6 bg-zinc-950/50 backdrop-blur-xl rounded-full border border-orange-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <FaCrown className="text-4xl text-orange-500 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            </div>
          </div>

          {/* Typography */}
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-8 bg-orange-500/50" />
              <span className="text-[10px] uppercase tracking-[0.5em] text-orange-500 font-bold">
                Verified Galactic Network
              </span>
              <div className="h-[1px] w-8 bg-orange-500/50" />
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6">
              <span className="bg-white bg-clip-text text-transparent">
                COSMIC <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-text text-transparent animate-gradient" >PARTNERS</span>
              </span>
            </h1>

            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light px-4">
              Orchestrating digital excellence through <span className="text-orange-500/80 font-medium">strategic alliances</span>. We connect visionary brands with the next generation of interstellar technology.
            </p>
          </div>

          {/* Statistics / Extra Content */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-white tracking-tighter">500+</div>
              <div className="text-[10px] uppercase tracking-widest text-red-500">Systems Linked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white tracking-tighter">99.9%</div>
              <div className="text-[10px] uppercase tracking-widest text-red-500">Uptime Stability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white tracking-tighter">24/7</div>
              <div className="text-[10px] uppercase tracking-widest text-red-500">Signal Support</div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-zinc-900/20 backdrop-blur-sm border border-white/5 rounded-3xl relative overflow-hidden">
            {/* The "Orbit" Animation */}
            <div className="relative w-24 h-24 mb-8">
              {/* Outer Spinning Ring */}
              <div className="absolute inset-0 border-2 border-dashed border-blue-500/30 rounded-full animate-[spin_8s_linear_infinite]" />

              {/* Inner Spinning Ring (Reverse) */}
              <div className="absolute inset-2 border border-purple-500/20 rounded-full animate-[spin_4s_linear_infinite_reverse]" />

              {/* The Pulsing Core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/40 rounded-full blur-xl animate-pulse" />
                  <FaRocket className="text-3xl text-blue-400 animate-bounce relative z-10" />
                </div>
              </div>
            </div>

            {/* Loading Text with Shimmer effect */}
            <div className="text-center relative z-10">
              <h3 className="text-xl font-medium tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-400 animate-[shimmer_2s_infinite] bg-[length:200%_100%]">
                SYNCHRONIZING SIGNALS
              </h3>
              <p className="text-gray-500 text-xs mt-2 uppercase tracking-[0.3em] animate-pulse">
                Connecting to Mothership...
              </p>
            </div>

            {/* CSS for shimmer effect */}
            <style>{`
              @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
            `}</style>
          </div>
        ) : !loading && scrollingClients.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Forward Scroll Track */}
            <div className="relative mb-12 overflow-hidden group py-5">
              <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

              <div className="flex animate-scroll hover:pause">
                {scrollingClients.map((client, index) => (
                  <a
                    key={`fwd-${client._id}-${index}`}
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex-shrink-0 mx-4 group/card"
                  >
                    <div className="relative w-72 h-44 rounded-2xl overflow-hidden 
                      bg-white/[0.03] backdrop-blur-xl
                      border border-white/10
                      transition-all duration-500
                      hover:-translate-y-3 hover:scale-[1.02]
                      hover:border-white/30
                      hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]
                      group-hover/card:before:opacity-100
                      before:absolute before:inset-0 before:rounded-2xl
                      before:bg-gradient-to-br before:from-white/20 before:to-transparent
                      before:opacity-0 before:transition-opacity before:duration-500
                    ">
                      <div
                        className="absolute -inset-1 opacity-0 group-hover/card:opacity-40 transition-opacity duration-700 blur-xl"
                        style={{
                          background: `radial-gradient(circle at top left, ${glowColors[client.glow] ?? glowColors.black
                            } 0%, transparent 65%)`
                        }}
                      />

                      <div className="relative h-full p-6 flex flex-col justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-xl 
                            bg-white/10 backdrop-blur-md
                            flex items-center justify-center
                            border border-white/10
                            transition-all duration-500
                            group-hover/card:scale-125
                            group-hover/card:shadow-[0_0_25px_rgba(255,255,255,0.35)]
                          ">
                            <img
                              src={client.img}
                              alt={client.name || "Company logo"}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/placeholder-logo.png";
                              }}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-extrabold tracking-tight text-white 
                              group-hover/card:text-blue-400 transition-colors duration-300">
                              {client.name}
                            </h3>
                            <p className="text-xs text-gray-500 uppercase tracking-tighter">{client.industry}</p>
                          </div>
                        </div>
                        <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                          Orbital Partner since {client.year ?? "—"}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Reverse Scroll Track */}
            <div className="relative mb-24 overflow-hidden group py-10">
              <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

              <div className="flex animate-scroll-reverse hover:pause">
                {scrollingClients.map((client, index) => {
                  const theme = spaceThemes[index % spaceThemes.length];

                  return (
                    <React.Fragment key={`client-wrap-${client._id}-${index}`}>
                      {/* 🌌 Company Card */}
                      <a
                        href={client.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative flex-shrink-0 mx-4 group/card"
                      >
                        <div
                          className={`
                            relative w-56 h-20 rounded-xl
                            bg-zinc-950/70 backdrop-blur-xl
                            border border-white/5
                            flex flex-col justify-center px-6
                            transition-all duration-500
                            hover:-translate-y-1 hover:scale-[1.02]
                            hover:shadow-[0_0_40px_rgba(255,255,255,0.06)]
                            ${theme.border}
                          `}
                        >
                          {/* Subtle Orbit Glow */}
                          <div
                            className={`
                              absolute -inset-px opacity-0 group-hover/card:opacity-100
                              rounded-xl blur-xl transition-opacity duration-700
                              ${theme.glow}
                            `}
                          />

                          {/* Year */}
                          <span className="absolute top-2 right-4 text-[10px] font-mono text-zinc-600">
                            ORBIT {client.year || "2024"}
                          </span>

                          <h4
                            className={`
                              text-white font-black text-lg tracking-tight uppercase
                              transition-colors duration-300
                              ${theme.title}
                            `}
                          >
                            {client.name}
                          </h4>

                          {/* Starlight Divider */}
                          <div
                            className={`
                              w-6 h-[1px] bg-white/10
                              group-hover/card:w-full
                              transition-all duration-700
                              ${theme.line}
                            `}
                          />

                          <p className="text-[9px] text-zinc-500 font-semibold uppercase tracking-[0.35em] mt-1">
                            Cosmic Partner
                          </p>
                        </div>
                      </a>

                      {/* ✨ Stellar Icon */}
                      <div className="flex-shrink-0 mx-8 flex items-center justify-center">
                        <div className="relative">
                          {/* Halo */}
                          <div
                            className={`
                              absolute inset-0 rounded-full blur-xl animate-pulse
                              ${theme.glow}
                            `}
                          />

                          <MdOutlineStarRate
                            className={`
                              text-xl opacity-60
                              animate-[spin_18s_linear_infinite]
                              hover:opacity-100 hover:scale-125
                              transition-all duration-300
                              cursor-crosshair
                              ${theme.star}
                            `}
                          />
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Clients;