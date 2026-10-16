"use client";

import React, { useEffect, useMemo, useState } from "react";
import Icons from "../../helper/icon_help";
import { getAllClientsCompanyAPI } from "../../api/api";
import { glowColors } from "../../helper/data_help";
import { accentAt, TILE, TILE_HERO } from "../../helper/accent_help";

interface Company {
  _id: string;
  name: string;
  url: string;
  img: string;
  industry?: string;
  year?: string | number;
  glow?: keyof typeof glowColors;
}

// Soft fade at both ends of the scrolling tracks (works over any background)
const EDGE_FADE = "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]";

const Clients = () => {
  const { FaCrown, FaRocket, MdOutlineStarRate, FaArrowRight } = Icons;
  const [loading, setLoading] = useState(true);
  const [dbCompanies, setDbCompanies] = useState<Company[]>([]);

  const handleFetch = async () => {
    try {
      const result = await getAllClientsCompanyAPI();
      if (result.success && Array.isArray(result.data)) {
        setDbCompanies(result.data);
      }
    } catch {
      // Failure is already logged by the API layer when debug mode is enabled.
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

  const statusTile = (title: string, text: string, label: string, spinning = false) => (
    <div className={`col-span-2 lg:col-span-6 ${TILE} min-h-[360px] flex flex-col items-center justify-center text-center p-8 group`}>
      <div className="absolute -top-20 -left-20 w-56 h-56 bg-cyan-500/10 rounded-full blur-[90px]" />
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-orange-500/10 rounded-full blur-[90px]" />

      <div className="relative mb-8 w-28 h-28 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-orange-500/20" />
        <div className="absolute inset-3 rounded-full border border-cyan-400/20" />
        <div
          className="absolute inset-0 rounded-full border-t-2 border-orange-500"
          style={{ animation: `spin ${spinning ? 1.5 : 4}s linear infinite` }}
        />
        <FaRocket className={`relative text-4xl text-orange-400 ${spinning ? "animate-bounce" : "group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-500"}`} />
      </div>

      <h3 className="relative text-2xl md:text-3xl font-black uppercase tracking-tighter mb-3">{title}</h3>
      <p className="relative text-gray-400 max-w-sm text-sm leading-relaxed mb-6">{text}</p>
      <span className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400 text-black font-black text-[10px] uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" /> {label}
      </span>
    </div>
  );

  return (
    <section className="relative overflow-hidden py-16 md:py-24 text-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">

          {/* ================= TITLE TILE ================= */}
          <div className={`col-span-2 lg:col-span-4 lg:row-span-2 ${TILE_HERO} p-6 sm:p-8 md:p-12 flex flex-col justify-between min-h-[340px] md:min-h-[400px]`}>
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-500/20 blur-[110px]" />
            <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-[110px]" />
            <FaCrown className="absolute right-6 bottom-4 text-[8rem] md:text-[11rem] text-white/[0.03] pointer-events-none" />

            <div className="relative flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-black font-black text-[9px] sm:text-[10px] uppercase tracking-[0.25em]">
                <FaCrown /> Verified Galactic Network
              </span>
              <span className="hidden sm:block font-mono text-[10px] uppercase tracking-widest text-gray-500">
                {dbCompanies.length ? `${String(dbCompanies.length).padStart(2, "0")} Partners` : "Partners"}
              </span>
            </div>

            {/* @container: the title scales with this card's width, not the viewport */}
            <div className="@container relative mt-10">
              <h2 className="font-black uppercase tracking-tighter leading-[0.88] text-[clamp(2rem,10cqw,5.5rem)] break-words">
                <span className="block text-white">Cosmic</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-500 to-rose-500 bg-[length:200%_auto] animate-gradient">
                  Partners
                </span>
              </h2>
              <p className="mt-6 max-w-xl text-gray-400 text-base md:text-lg leading-relaxed">
                Orchestrating digital excellence through <span className="text-white font-medium">strategic alliances</span>. We connect visionary brands with the next generation of interstellar technology.
              </p>
            </div>
          </div>

          {/* ================= STATS ================= */}
          <div className="col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 to-orange-600 text-black p-6 md:p-7 flex flex-col justify-between min-h-[160px]">
            <div className="absolute -right-6 -bottom-10 text-[8rem] font-black leading-none text-black/10 select-none">+</div>
            <span className="relative font-mono text-[10px] font-bold uppercase tracking-[0.3em]">Systems Linked</span>
            <div className="relative text-6xl md:text-7xl font-black tracking-tighter">500+</div>
          </div>

          {[
            { value: "99.9%", label: "Uptime Stability", a: accentAt(1) },
            { value: "24/7", label: "Signal Support", a: accentAt(2) },
          ].map((s) => (
            <div key={s.label} className={`col-span-1 ${TILE} p-5 md:p-6 flex flex-col justify-between min-h-[160px] ${s.a.hover} transition-colors`}>
              <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl ${s.a.glow}`} />
              <span className={`relative font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] ${s.a.text}`}>{s.label}</span>
              <div className="relative text-3xl md:text-4xl font-black">{s.value}</div>
            </div>
          ))}

          {/* ================= TRACKS ================= */}
          {loading ? (
            statusTile("Synchronizing Signals", "Connecting to Mothership...", "Loading Partners", true)
          ) : scrollingClients.length === 0 ? (
            statusTile(
              "The Sector is Quiet",
              "Our long-range sensors haven't detected any partner transmissions in this coordinate yet.",
              "Scanning Deep Space"
            )
          ) : (
            <>
              <div className="col-span-2 lg:col-span-6 flex items-center gap-4 pt-6 md:pt-8 pb-1">
                <span className="font-black uppercase tracking-tighter text-2xl md:text-3xl whitespace-nowrap">
                  Alliance<span className="text-orange-500">.</span>
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-orange-500/60 via-white/10 to-transparent" />
                <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-gray-500">Hover to pause</span>
              </div>

              {/* Forward track: logo cards */}
              <div className={`col-span-2 lg:col-span-6 relative overflow-hidden py-4 ${EDGE_FADE}`}>
                <div className="flex animate-scroll">
                  {scrollingClients.map((client, index) => {
                    const a = accentAt(index);
                    return (
                      <a
                        key={`fwd-${client._id}-${index}`}
                        href={client.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative flex-shrink-0 mx-2 group/card"
                      >
                        <div className={`${TILE} w-72 h-44 p-6 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 ${a.hover}`}>
                          <div
                            className="absolute -inset-1 opacity-0 group-hover/card:opacity-50 transition-opacity duration-700 blur-xl"
                            style={{
                              background: `radial-gradient(circle at top left, ${(client.glow && glowColors[client.glow]) ?? a.hex + "66"} 0%, transparent 65%)`
                            }}
                          />
                          <div className="relative flex items-center gap-4">
                            <div className="shrink-0 w-14 h-14 rounded-2xl overflow-hidden bg-white/10 border border-white/10 group-hover/card:scale-110 transition-transform duration-500">
                              {/* Logos come from the API with arbitrary hosts, so next/image can't be used here */}
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                loading="lazy"
                                decoding="async"
                                src={client.img}
                                alt={client.name || "Company logo"}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "/placeholder-logo.png";
                                }}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-lg font-black uppercase tracking-tight text-white truncate">{client.name}</h3>
                              <p className={`font-mono text-[10px] uppercase tracking-widest truncate ${a.text}`}>{client.industry}</p>
                            </div>
                          </div>
                          <div className="relative flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-500">
                              Partner since {client.year ?? "—"}
                            </span>
                            <FaArrowRight className="text-gray-600 -rotate-45 group-hover/card:rotate-0 group-hover/card:text-white transition-all" />
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Reverse track: name pills */}
              <div className={`col-span-2 lg:col-span-6 relative overflow-hidden py-4 ${EDGE_FADE}`}>
                <div className="flex items-center animate-scroll-reverse">
                  {scrollingClients.map((client, index) => {
                    const a = accentAt(index + 2);
                    return (
                      <React.Fragment key={`rev-${client._id}-${index}`}>
                        <a
                          href={client.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-shrink-0 mx-2 inline-flex items-center gap-3 pl-2 pr-5 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md ${a.hover} hover:-translate-y-1 transition-all duration-300 group/pill`}
                        >
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-black text-xs font-black ${a.solid}`}>
                            {client.name?.charAt(0) ?? "•"}
                          </span>
                          <span className="font-black uppercase tracking-tight text-white whitespace-nowrap">{client.name}</span>
                          <span className="font-mono text-[10px] text-gray-500">{client.year || "2024"}</span>
                        </a>
                        <MdOutlineStarRate className={`flex-shrink-0 mx-4 text-xl animate-[spin_18s_linear_infinite] ${a.text}`} />
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Clients;
