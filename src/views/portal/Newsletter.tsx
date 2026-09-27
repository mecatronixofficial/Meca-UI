"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { IoClose } from "react-icons/io5";
import { subscribeNewsletterAPI } from "../../api/api";
import { validateEmail } from "../../helper/res_help";
import { useToast } from "../../hooks/useToast";
import Icons from "../../helper/icon_help";
import { accentAt, TILE, TILE_HERO, pad2 } from "../../helper/accent_help";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { success, error, loading, dismissAll } = useToast();
  const isMounted = useRef(true);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const {
    FaEnvelopeOpenText, FaCheck, FaArrowRight, FaShieldAlt, FaRocket, FaPaperPlane, FaStar
  } = Icons;

  const scheduleReset = () => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    resetTimeoutRef.current = setTimeout(() => {
      if (isMounted.current) {
        setStatus("idle");
      }
    }, 5000);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    if (!validateEmail(email)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      error("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    loading("Subscribing to newsletter...");

    try {
      const result = await subscribeNewsletterAPI({ email },
        { signal: controllerRef.current.signal });

      // Dismiss loading toast
      dismissAll();

      if (!isMounted.current) return;

      if (result.success) {
        setStatus("success");
        success("🎉 Welcome to our newsletter! Check your email for confirmation.", {
          duration: 5000,
        });
        setEmail("");

        scheduleReset();
      } else {
        setStatus("error");
        setErrorMsg("Subscription failed. Please try again later.");
        error("❌ Subscription failed. Please try again later.");
      }
    } catch {
      if (!isMounted.current) return;
      dismissAll();
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again later.");
      error("❌ Something went wrong. Please try again later.");
    }
    finally {
      controllerRef.current = null;
    }

  }, [email, error, success, loading, dismissAll]);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
      controllerRef.current?.abort();

      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const resetForm = () => {
    setStatus("idle");
    setEmail("");
  };

  const isLocked = status === "loading" || status === "success";

  const perks = [
    { icon: <FaRocket />, title: "Weekly Space Briefs", text: "Curated build notes, launches and engineering insights every week." },
    { icon: <FaShieldAlt />, title: "Exclusive Cosmic Content", text: "Deep dives and case studies we don't publish anywhere else." },
    { icon: <FaEnvelopeOpenText />, title: "Priority Launch Access", text: "Be first in line for new services, betas and partner offers." },
  ];

  const stats = [
    { v: "10K+", l: "Subscribers" },
    { v: "99%", l: "Orbit Rate" },
    { v: "24h", l: "Support" },
  ];

  return (
    <section id="newsletter" className="relative text-white overflow-hidden py-16 md:py-24">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">

          {/* ================= SIGNUP TILE ================= */}
          <div className={`col-span-2 lg:col-span-4 lg:row-span-3 ${TILE_HERO} p-6 sm:p-8 md:p-12 flex flex-col justify-between min-h-[460px]`}>
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-500/20 blur-[110px]" />
            <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-[110px]" />
            <FaPaperPlane className="absolute -bottom-8 -right-4 text-[11rem] md:text-[14rem] text-white/[0.03] -rotate-12 pointer-events-none" />

            <div className="relative flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-black font-black text-[9px] sm:text-[10px] uppercase tracking-[0.25em]">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" /> Signal_Uplink
              </span>
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-400">
                <span className={`w-2 h-2 rounded-full animate-pulse ${status === "error" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"}`} />
                Channel_{status === "success" ? "Linked" : status === "error" ? "Fault" : status === "loading" ? "Busy" : "Open"}
              </span>
            </div>

            {/* @container: the title scales with this card's width, not the viewport */}
            <div className="@container relative mt-10">
              <h2 className="font-black uppercase tracking-tighter leading-[0.88] text-[clamp(2rem,10cqw,5.5rem)] break-words">
                <span className="block text-white">Join Our</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-500 to-rose-500 bg-[length:200%_auto] animate-gradient">
                  Orbit
                </span>
              </h2>
              <p className="mt-5 max-w-lg text-gray-400 text-base md:text-lg leading-relaxed">
                Subscribe to our cosmic newsletter and receive interstellar insights.
              </p>

              <form onSubmit={handleSubmit} className="mt-8">
                <label htmlFor="newsletter-email" className="block text-[10px] font-mono uppercase tracking-[.25em] text-gray-500 mb-2">
                  Email_Address
                </label>
                <div className="flex flex-col sm:flex-row gap-2 p-1.5 rounded-[1.25rem] sm:rounded-full bg-white/[0.04] border border-white/10 focus-within:border-orange-500/60 focus-within:shadow-[0_0_0_3px_rgba(249,115,22,0.12)] transition-all">
                  <div className="relative flex-1">
                    <FaEnvelopeOpenText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@galaxy.com"
                      aria-invalid={status === "error"}
                      className="w-full pl-11 pr-10 py-3.5 bg-transparent text-white outline-none placeholder:text-gray-600 disabled:opacity-60"
                      disabled={isLocked}
                      required
                    />
                    {status === "loading" && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLocked}
                    className={`shrink-0 inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full font-black uppercase tracking-widest text-xs transition-all duration-300 active:scale-95 group/btn ${isLocked
                      ? "bg-white/10 text-gray-400 cursor-not-allowed"
                      : "bg-orange-500 text-black hover:bg-white shadow-[0_0_30px_rgba(249,115,22,0.35)]"
                      }`}
                  >
                    {status === "loading" ? "Launching..." : status === "success" ? (
                      <>
                        <FaCheck className="text-green-400" /> Subscribed
                      </>
                    ) : (
                      <>
                        Join Mission <FaArrowRight className="-rotate-45 group-hover/btn:rotate-0 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                {/* Status messages */}
                {status === "error" && (
                  <div className="mt-4 flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm animate-shake">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-red-400">Err</span>
                    <span className="flex-1">{errorMsg}</span>
                    <button type="button" onClick={resetForm} aria-label="Dismiss" className="p-1 rounded-full hover:bg-white/10">
                      <IoClose />
                    </button>
                  </div>
                )}
                {status === "success" && (
                  <div className="mt-4 flex items-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-200 text-sm animate-fade-in">
                    <FaStar className="text-green-400 animate-pulse" />
                    <span className="flex-1">Welcome to the mission! Check your inbox for confirmation.</span>
                    <button type="button" onClick={resetForm} aria-label="Dismiss" className="p-1 rounded-full hover:bg-white/10">
                      <IoClose />
                    </button>
                  </div>
                )}
                {status === "loading" && (
                  <div className="mt-4 flex items-center gap-3 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-100 text-sm">
                    <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                    Subscribing to newsletter...
                  </div>
                )}
              </form>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  { label: "No Spam", c: "bg-orange-500" },
                  { label: "Instant Unsubscribe", c: "bg-cyan-400" },
                  { label: "Privacy First", c: "bg-emerald-400" },
                ].map((b) => (
                  <span key={b.label} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-black font-black text-[9px] sm:text-[10px] uppercase tracking-widest ${b.c}`}>
                    <FaCheck /> {b.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ================= PERKS ================= */}
          {perks.map((item, idx) => {
            const a = accentAt(idx + 1);
            return (
              <div
                key={item.title}
                className={`col-span-2 group ${TILE} p-6 flex items-start gap-4 ${a.hover} transition-colors`}
              >
                <div className={`absolute -bottom-14 -right-14 w-36 h-36 rounded-full blur-3xl opacity-40 group-hover:opacity-100 transition-opacity ${a.glow}`} />
                <div className={`relative overflow-hidden shrink-0 w-12 h-12 rounded-2xl border flex items-center justify-center text-lg transition-colors ${a.chip} group-hover:text-black group-hover:border-transparent`}>
                  <span className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${a.solid}`} />
                  <span className="relative">{item.icon}</span>
                </div>
                <div className="relative flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-black uppercase tracking-tight">{item.title}</h3>
                    <span className="font-mono text-[10px] text-gray-600">{pad2(idx + 1)}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-gray-400 leading-relaxed">{item.text}</p>
                </div>
              </div>
            );
          })}

          {/* ================= STATS ================= */}
          {stats.map((s, i) =>
            i === 0 ? (
              <div key={s.l} className="col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 to-orange-600 text-black p-6 md:p-7 flex items-end justify-between min-h-[140px]">
                <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full border-[14px] border-black/10" />
                <span className="relative font-mono text-[10px] font-bold uppercase tracking-[0.3em]">{s.l}</span>
                <span className="relative text-5xl md:text-6xl font-black tracking-tighter">{s.v}</span>
              </div>
            ) : (
              <div key={s.l} className={`col-span-1 lg:col-span-2 ${TILE} p-5 md:p-6 flex flex-col justify-between min-h-[140px] ${accentAt(i + 1).hover} transition-colors`}>
                <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl ${accentAt(i + 1).glow}`} />
                <span className={`relative font-mono text-[10px] font-bold uppercase tracking-[0.25em] ${accentAt(i + 1).text}`}>{s.l}</span>
                <span className="relative text-3xl md:text-4xl font-black">{s.v}</span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
