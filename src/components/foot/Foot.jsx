import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Img_Helper from "../../helper/img_help";
import Icons from "../../helper/icon_help";
import { mecatronixConfig } from "../../config/envConfig";
import { NAV, subtitles } from "../../helper/data_help.jsx";
import { subscribeNewsletterAPI } from "../../api/api";
import { validateEmail } from "../../helper/res_help";

const Foot = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    FaFacebookF,
    FaInstagram,
    FaWhatsapp,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaGithub,
    FaCode,
    FaPaintBrush,
  } = Icons;

  const {
    app = {},
    contact = {},
    social = {},
    location: companyLocation = {},
  } = mecatronixConfig || {};

  const APP_SLOGAN = app?.slogan || "Engineering the Future of Automation";
  const PRIMARY_PHONE = contact?.primaryPhone || "+910000000000";
  const WHATSAPP_NUMBER = contact?.whatsappNumber || "+910000000000";
  const COMPANY_EMAIL = contact?.companyEmail || "connect@mecatronix.com";
  const locationlink = companyLocation?.googleMapsLink || "";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const abortRef = useRef(null);
  const successTimeoutRef = useRef(null);
  const mountedRef = useRef(true);

  /* -------------------- Subtitle rotation -------------------- */
  useEffect(() => {
    if (!subtitles?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % subtitles.length);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /* -------------------- Subscribe Handler -------------------- */
  const handleFooterSubscribe = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      const trimmedEmail = email.trim();

      if (!validateEmail(trimmedEmail)) {
        setError("Invalid email address");
        return;
      }

      setLoading(true);
      setError("");

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const result = await subscribeNewsletterAPI(
          { email: trimmedEmail },
          { signal: controller.signal }
        );

        if (!mountedRef.current) return;

        if (result?.success) {
          setIsSubscribed(true);
          setEmail("");

          successTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              setIsSubscribed(false);
            }
          }, 4000);
        } else {
          setError("Subscription failed. Try again.");
        }
      } catch (err) {
        if (err?.name !== "AbortError" && err?.code !== "ERR_CANCELED") {
          if (mountedRef.current) {
            setError("Something went wrong. Try again.");
          }
        }
      } finally {
        if (mountedRef.current) setLoading(false);
        abortRef.current = null;
      }
    },
    [email, loading]
  );

  /* -------------------- Cleanup -------------------- */
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, []);

  const socialLinks = useMemo(
    () =>
      [
        { icon: FaFacebookF, href: social?.facebook, label: "FB" },
        { icon: FaInstagram, href: social?.instagram, label: "IG" },
        {
          icon: FaWhatsapp,
          href: `https://wa.me/${WHATSAPP_NUMBER?.replace("+", "")}`,
          label: "WA",
        },
        { icon: FaGithub, href: social?.github, label: "GIT" },
      ].filter((link) => link.href),
    [social, WHATSAPP_NUMBER]
  );

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0B0B0B] text-gray-400 pt-12 pb-8">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-orange-500/50 to-transparent pointer-events-none" />

      {/* Premium Gradient Glow Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-orange-600/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[160px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-white/[0.03] blur-[120px]" />
      </div>

      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:30px_30px]" />

      {/* Soft Radial Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_45%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-16">
          {/* SECTION 1: SYSTEM IDENTIFIER */}
          <div className="space-y-6">
            <div
              className="cursor-pointer group inline-block"
              onClick={() => navigate("/")}
            >
              <div className="flex items-center gap-3">
                <img
                  src={Img_Helper.mainlogo}
                  alt="Logo"
                  className="h-10 grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <h2 className="text-[20px] font-black tracking-widest text-white uppercase italic">
                  MECA<span className="text-orange-600">TRONIX</span>
                </h2>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-600 animate-pulse rounded-full" />
                <span className="text-[10px] font-mono text-orange-500 uppercase tracking-[0.3em] font-bold">
                  {subtitles[currentIndex]}
                </span>
              </div>
            </div>

            <p className="text-[15px] font-mono leading-relaxed uppercase tracking-tighter opacity-60 hover:text-white">
              {APP_SLOGAN}. Initializing core protocols for global industrial
              transformation.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 w-10 border border-white/10 bg-white/[0.02] flex items-center justify-center hover:border-orange-600 hover:text-orange-500 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <link.icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* SECTION 2: NAVIGATION DIRECTORY */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="h-[1px] w-4 bg-orange-600" />
              <h3 className="text-[15px] font-black uppercase tracking-[.4em] text-white hover:bg-orange-700">
                Directory_01
              </h3>
            </div>

            <ul className="space-y-4">
              {NAV.map((link) => (
                <li key={link.id}>
                  <Link
                    to={link.id}
                    className={`group flex items-center gap-3 text-[14px] font-mono uppercase tracking-widest hover:text-white transition-colors ${
                      location.pathname === link.id ? "text-white" : "text-gray-400"
                    }`}
                  >
                    <span
                      className={`text-orange-600 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0 ${
                        location.pathname === link.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      &gt;
                    </span>
                    {link.id === "/" ? "Index" : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SECTION 3: CONTACT COORDINATES */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="h-[1px] w-4 bg-orange-600" />
              <h3 className="text-[15px] font-black uppercase tracking-[.4em] text-white hover:bg-orange-700">
                Contact_Coord
              </h3>
            </div>

            <ul className="space-y-6">
              <li className="flex gap-4 group">
                <FaMapMarkerAlt className="text-orange-600 mt-1 shrink-0" />
                <a
                  href={locationlink}
                  className="text-[14px] font-mono uppercase leading-relaxed group-hover:text-white transition-colors"
                >
                  {companyLocation?.fullAddress || "India"}
                </a>
              </li>

              <li className="flex gap-4 group">
                <FaPhoneAlt className="text-orange-600 mt-1 shrink-0" />
                <a
                  href={`tel:${PRIMARY_PHONE}`}
                  className="text-[14px] font-mono group-hover:text-white transition-colors"
                >
                  PH_{PRIMARY_PHONE}
                </a>
              </li>

              <li className="flex gap-4 group">
                <FaEnvelope className="text-orange-600 mt-1 shrink-0" />
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="text-[14px] font-mono group-hover:text-white transition-colors"
                >
                  {COMPANY_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {/* SECTION 4: DATA UPLINK (SUBSCRIBE) */}
          <div className="relative">
            <div className="absolute -top-4 -right-4 h-12 w-12 border-t-2 border-r-2 border-orange-600/20" />

            <div className="flex items-center gap-2 mb-8">
              <div className="h-[1px] w-4 bg-orange-600" />
              <h3 className="text-[15px] font-black uppercase tracking-[.4em] text-white hover:bg-orange-700">
                Data_Uplink
              </h3>
            </div>

            {isSubscribed ? (
              <div className="border border-green-500/50 p-4 bg-green-500/5">
                <p className="text-[13px] font-mono text-green-500 animate-pulse">
                  CONNECTION_STABLISHED. WELCOME.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFooterSubscribe} className="space-y-3">
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER_EMAIL_ADDR"
                    required
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-[10px] font-mono text-white uppercase outline-none focus:border-orange-600"
                  />
                  <div className="absolute top-0 left-0 w-[1px] h-full bg-orange-600 scale-y-0 group-focus-within:scale-y-100 transition-transform origin-top" />
                </div>

                {error && (
                  <p className="text-orange-500 text-[9px] font-mono">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-black py-3 uppercase tracking-widest disabled:opacity-50 transition-colors"
                >
                  {loading ? "PROCESSING..." : "Execute_Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FOOTER TERMINAL BAR */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[13px] font-mono tracking-widest uppercase flex items-center gap-4">
            <span className="text-gray-600">©{new Date().getFullYear()}</span>
            <span className="text-white transition-all duration-300 hover:text-amber-600 hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
  Mecatronix Software Development-Coimbatore
</span>
            <span className="text-gray-700 hidden md:inline">//</span>
            <span className="text-gray-600 hidden md:inline">
              Root_Access_Granted
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[13px] font-mono uppercase">
              <FaCode className="text-orange-600" />
              <span className="text-white">Dev_Mode</span>
              <span className="text-gray-700">/</span>
              <FaPaintBrush className="text-purple-600" />
              <span className="text-white">Design_Core</span>
            </div>
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Foot;