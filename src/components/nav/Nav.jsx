import React, { useState, useEffect, useCallback } from "react";
import { NAV, subtitles } from "../../helper/data_help.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Img_Helper from "../../helper/img_help";
import mecatronixConfig from "../../config/envConfig";
import Icons from "../../helper/icon_help";

const {
  FaRocket,
  FaShieldAlt,
  FaHeadset,
  FaArrowRight,
} = Icons;

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { contact = {} } = mecatronixConfig || {};
  const PRIMARY_PHONE = contact.primaryPhone || "+91000000000";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);

  // 1. ADVANCED SUBTITLE ROTATION (Memoized)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % subtitles.length);
    }, 3000);
    return () => clearInterval(timer); // Prevent memory leak
  }, [subtitles.length]);

  // 2. OPTIMIZED SCROLL HANDLER (Throttled/Passive)
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY > 20;
      // Only update state if value actually changes to prevent unnecessary re-renders
      setIsScrolled((prev) => (prev !== offset ? offset : prev));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. HANDLERS
  const handleLogoClick = useCallback(() => navigate("/"), [navigate]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? "bg-black/80 backdrop-blur-xl border-b border-orange-600/40 py-0 shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
        : "bg-transparent border-b border-white/5"
        }`}
    >
      {/* Blueprint grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]" />

      <div className="max-w-[1400px] mx-auto flex items-center justify-between h-20 px-6 relative">

        {/* BRAND UNIT */}
        <div
          className="flex items-center h-full min-w-[260px] xl:border-r xl:border-white/10 pr-8 cursor-pointer group"
          onClick={handleLogoClick}
        >
          <div className="relative overflow-hidden">
            <img
              src={Img_Helper.mainlogo}
              alt="Mecatronix"
              className="h-10 grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            />
            {/* Logo Scanline Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/20 to-transparent h-full w-full -translate-y-full group-hover:animate-scan" />
          </div>

          <div className="ml-5 border-l border-white/10 pl-5">
            <h1 className="text-xl font-extrabold text-white uppercase ">
              Meca<span className="text-orange-600">tronix</span>
            </h1>
            <div className="flex items-center gap-2 pt-1">
              <span className="w-2 h-2 bg-orange-600 animate-pulse shadow-[0_0_8px_#ea580c]" />
              <span className="text-[10px] text-orange-500 uppercase tracking-[0.2em] font-semibold">
                {subtitles[currentIndex]}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden xl:flex flex-1 h-full px-8 items-center justify-center gap-8">
          {NAV.map((n) => (
            <div
              key={`${n.id}-${n.label}`}
              className="relative group h-full flex items-center"
              onMouseEnter={() => n.id === "/services" && setHoveredNav(n.id)}
              onMouseLeave={() => setHoveredNav(null)}
              onFocus={() => n.id === "/services" && setHoveredNav(n.id)}
              onBlur={() => setHoveredNav(null)}
            >
              <Link
                to={n.id}
                className={` relative text-[11px] font-semibold uppercase transition-colors ${location.pathname === n.id
                  ? "text-orange-500"
                  : "text-gray-400 group-hover:text-white"
                  }`}
              >
                <span className="absolute -left-3 opacity-0 group-hover:opacity-100 group-hover:-left-4 transition-all text-orange-600">
                  [
                </span>
                {n.label}
                <span className="absolute -right-3 opacity-0 group-hover:opacity-100 group-hover:-right-4 transition-all text-orange-600">
                  ]
                </span>
              </Link>

              {/* Advanced Mega-Dropdown */}
              {n.id === "/mk" && hoveredNav === n.id && (
                <div className="absolute top-[90%] -left-5 w-[350px] bg-[#080808] border border-white/10 p-1 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="p-2 border border-white/5 relative bg-black/40 backdrop-blur-3xl">
                    {/* Industrial Corner Brackets */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-orange-600" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-orange-600" />

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { title: "Automation", icon: FaRocket, code: "SYS_01", desc: "Industrial Logic Control" },
                        { title: "Robotics", icon: FaShieldAlt, code: "SYS_02", desc: "Autonomous Hardware" },
                        { title: "Smart IoT", icon: FaHeadset, code: "SYS_03", desc: "Network Intelligence" },
                      ].map((item) => (
                        <div
                          key={item.code}
                          className="group/card p-2 bg-white/[0.02] border border-white/5 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <item.icon className="text-xl text-gray-600 group-hover/card:text-orange-500 transition-colors" />
                            <span className="text-[8px] font-mono text-gray-700 group-hover/card:text-orange-500">
                              {item.code}
                            </span>
                          </div>
                          <h4 className="text-white text-[10px] font-semibold uppercase tracking-widest">{item.title}</h4>
                          <p className="text-[8px] text-gray-500 mt-1 uppercase tracking-tighter">{item.desc}</p>
                        </div>
                      ))}

                      <div className="flex flex-col justify-center items-center p-2 bg-orange-600 hover:bg-orange-500 transition-all group/btn cursor-pointer">
                        <span className="text-[10px] font-semibold uppercase tracking-widest">Access_Catalog</span>
                        <FaArrowRight className="mt-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA / STATUS SECTION */}
        <div className="hidden md:flex items-center gap-8 h-full pl-8 xl:border-l xl:border-white/10">
          <div className="hidden md:block text-right">
            <a href={`tel:${PRIMARY_PHONE}`} className="text-right">
              <span className="block text-[9px] font-mono text-gray-500">
                ESTABLISH_LINE
              </span>
              <span className="text-white text-xs font-bold">
                PH_{PRIMARY_PHONE}
              </span>
            </a>
          </div>

          <Link
            to="/openline"
            className="relative h-11 px-8 flex items-center justify-center bg-orange-600 text-white font-semibold text-[10px] tracking-[0.25em] uppercase transition-all skew-x-[-15deg] hover:bg-white hover:text-black overflow-hidden group"
          >
            <span className="relative z-10 skew-x-[15deg] flex items-center gap-3">
              Start_Project <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Shimmer effect */}
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-15 group-hover:left-[100%] transition-all duration-1000" />
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Nav;
