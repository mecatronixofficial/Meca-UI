"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Rate } from "antd";
import { addReviewAPI, getAllReviewsAPI } from "../../api/api";
import { useToast } from "../../hooks/useToast";
import Icons from "../../helper/icon_help";
import { accentAt, TILE_HERO, pad2 } from "../../helper/accent_help";

interface Testimonial {
  id: string | number;
  name: string;
  position: string;
  content: string;
  rating: number;
  color: string;
  glow: string;
  initials: string;
  project: string;
}

const Testimonials = () => {

  const { MdOutlineStarRate, FaChevronLeft, FaChevronRight, FaAward, FaRocket, FaCheckCircle, FaShieldAlt, FaPaperPlane } = Icons;

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [loadingTime, setLoadingTime] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { success, error, loading, dismissAll } = useToast();
  const [rating, setRating] = useState(5);

  // Use useMemo for the current testimonial so it stays in sync with state updates
  const currentTestimonial = useMemo(() => testimonials[activeTestimonial] || null, [testimonials, activeTestimonial]);

  const averageRating = useMemo(
    () => testimonials.length ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length : 0,
    [testimonials]
  );

  const controllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const isMounted = useRef(true);

  // MISTAKE FIX: Define handleFetch with useCallback so it can be used as a dependency
  const handleFetch = useCallback(async () => {
    try {
      setLoadingTime(true);
      const result = await getAllReviewsAPI();
      if (isMounted.current && result?.success && Array.isArray(result.data)) {
        const mappedData: Testimonial[] = result.data.map((rev: any, index: number) => {
          const parsedRating = parseFloat(rev.rating);
          return {
            id: rev._id ?? index,
            name: rev.user_name?.trim() || "Anonymous User",
            position: rev.company_name?.trim() || "Interstellar Partner",
            content: rev.comment || "",
            rating: Number.isFinite(parsedRating) ? Math.min(5, Math.max(0, parsedRating)) : 0,
            color: index % 2 === 0 ? "from-orange-500 to-orange-700" : "from-orange-500 to-orange-600",
            glow: index % 2 === 0 ? "rgba(249, 115, 22, 0.35)" : "rgba(249, 115, 22, 0.3)",
            initials: rev.user_name ? rev.user_name.split(" ").filter(Boolean).map((n: string) => n[0]).join("").toUpperCase() : "?",
            project: rev.is_verified ? "Verified Client" : "Galaxy Explorer",
          };
        });
        setTestimonials(mappedData);
      }
    } catch {
      // Failure is already logged by the API layer when debug mode is enabled.
    } finally {
      if (isMounted.current) setLoadingTime(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    handleFetch();
    return () => { isMounted.current = false; };
  }, [handleFetch]);

  const handleRating = (rate: number) => setRating(rate);

  // MISTAKE FIX: Added handleFetch to dependency array to avoid stale closures
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      user_name: formData.get("user_name"),
      user_email: formData.get("user_email"),
      company_name: formData.get("company_name"),
      rating: Number(rating),
      comment: formData.get("comment"),
    };

    if (!rating || rating < 0.5) {
      error("Please provide a rating");
      return;
    }

    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    setStatus("loading");
    loading("Transmitting your feedback...");

    try {

      dismissAll();
      const result = await addReviewAPI(payload, { signal: controllerRef.current.signal });

      if (isMounted.current && result.success) {
        setStatus("success");
        // 1. Success message appears
        success("🎉 Review launched successfully!");

        // 2. We do NOT call dismissAll() here immediately, 
        // so the user can actually see the success toast.

        timeoutRef.current = setTimeout(async () => {
          if (isMounted.current) {
            setStatus("idle");
            setRating(5);
            formRef.current?.reset();
            await handleFetch();
            // 3. Clear the toast ONLY after the delay is over
            dismissAll();
          }
        }, 5000); // Changed to 5 seconds (5000ms) for better UX

      } else {
        // If API fails, show error and clear the "loading" toast
        dismissAll();
        setStatus("error");
        error(result.message || "Failed to establish connection.");
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        dismissAll();
        setStatus("error");
        error("❌ Transmission failed. Try again.");
      }
    }
    // REMOVED: finally { dismissAll(); } 
    // If you leave it here, it kills the success toast instantly.
  }, [rating, error, success, loading, dismissAll, handleFetch]);

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const ratingLabel = (value: number) =>
    value >= 4.5 ? "Best" : value >= 4 ? "Great" : value >= 3 ? "Good" : value >= 2 ? "Ok" : "Bad";

  const inputClass =
    "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 hover:border-white/20 focus:border-orange-500/60 focus:bg-orange-500/[0.04] focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]";
  const labelClass = "block text-[10px] font-mono uppercase tracking-[.25em] text-gray-500 mb-2";

  const a = accentAt(activeTestimonial);

  return (
    <section id="testimonials" className="relative text-white overflow-hidden py-16 md:py-24 font-sans">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">

          {/* ================= HEADER ================= */}
          <div className="col-span-2 lg:col-span-6 flex flex-col md:flex-row md:items-end gap-4 md:gap-8 pb-2">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-400 text-black font-black text-[9px] sm:text-[10px] uppercase tracking-[0.25em] mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" /> Transmission_Log
              </span>
              <h2 className="font-black uppercase tracking-tighter leading-[0.88] text-4xl sm:text-5xl md:text-6xl">
                Cosmic{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-500 to-rose-500 bg-[length:200%_auto] animate-gradient">
                  Reviews
                </span>
                <span className="text-orange-500">.</span>
              </h2>
            </div>
            <p className="md:max-w-sm text-gray-400 text-sm md:text-base leading-relaxed">
              Real stories from our partners across the digital universe.
            </p>
          </div>

          {/* ================= REVIEW TILE ================= */}
          <div className="col-span-2 lg:col-span-4 lg:row-span-2">
            {loadingTime ? (
              <div className={`h-full min-h-[440px] ${TILE_HERO} p-8 md:p-12 animate-pulse`}>
                <div className="flex gap-2 mb-8">
                  {[...Array(5)].map((_, i) => <div key={i} className="w-5 h-5 rounded bg-white/10" />)}
                </div>
                <div className="space-y-3">
                  <div className="h-6 w-full rounded bg-white/10" />
                  <div className="h-6 w-11/12 rounded bg-white/10" />
                  <div className="h-6 w-2/3 rounded bg-white/5" />
                </div>
                <div className="flex items-center gap-4 mt-12">
                  <div className="w-16 h-16 rounded-2xl bg-white/10" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-1/3 rounded bg-white/10" />
                    <div className="h-3 w-1/4 rounded bg-white/5" />
                  </div>
                </div>
                <p className="mt-10 font-mono text-[10px] uppercase tracking-[.3em] text-orange-400/70 flex items-center gap-3">
                  <FaRocket className="animate-bounce" /> Scanning sector for reviews...
                </p>
              </div>
            ) : currentTestimonial ? (
              <article className={`h-full min-h-[440px] ${TILE_HERO} p-6 sm:p-8 md:p-12 flex flex-col justify-between group`}>
                <div className={`absolute -top-24 -left-24 w-80 h-80 rounded-full blur-[110px] transition-colors duration-700 ${a.glow}`} />
                <span className="absolute -top-12 right-6 text-[16rem] leading-none font-black text-white/[0.04] select-none pointer-events-none">
                  &ldquo;
                </span>

                <div key={currentTestimonial.id} className="relative animate-fade-in-up">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                    <span className={`px-3 py-1.5 rounded-full text-black font-black text-[10px] uppercase tracking-widest ${a.solid}`}>
                      Review {pad2(activeTestimonial + 1)} / {pad2(testimonials.length)}
                    </span>
                    <div className="flex items-center gap-3">
                      <Rate
                        disabled
                        allowHalf
                        value={currentTestimonial.rating}
                        character={<MdOutlineStarRate />}
                        style={{ fontSize: 20 }}
                      />
                      <span className={`font-mono text-[10px] uppercase tracking-widest ${a.text}`}>{ratingLabel(currentTestimonial.rating)}</span>
                    </div>
                  </div>

                  <blockquote className="text-2xl md:text-4xl text-white leading-snug font-bold tracking-tight">
                    &ldquo;{currentTestimonial.content}&rdquo;
                  </blockquote>

                  <div className="flex items-center gap-4 mt-10">
                    <div
                      className={`shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black text-black ${a.solid}`}
                      style={{ boxShadow: `0 0 40px ${a.hex}55` }}
                    >
                      {currentTestimonial.initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white truncate">{currentTestimonial.name}</h3>
                      <p className="text-sm text-gray-400 truncate">{currentTestimonial.position}</p>
                      <p className={`mt-1 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest ${a.text}`}>
                        <FaShieldAlt /> {currentTestimonial.project}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative flex justify-between items-center gap-4 mt-10 pt-6 border-t border-white/10">
                  <div className="flex gap-2 flex-wrap">
                    {testimonials.map((t, i) => (
                      <button
                        key={t.id}
                        onClick={() => setActiveTestimonial(i)}
                        aria-label={`Show review ${i + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${activeTestimonial === i ? `w-10 ${accentAt(i).solid}` : "w-2 bg-white/20 hover:bg-white/40"}`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={prevTestimonial}
                      aria-label="Previous review"
                      className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center hover:border-white/40 active:scale-95 transition-all"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      aria-label="Next review"
                      className="w-12 h-12 rounded-full bg-orange-500 text-black flex items-center justify-center hover:bg-white active:scale-95 transition-all"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </article>
            ) : (
              <div className={`h-full min-h-[440px] ${TILE_HERO} flex flex-col items-center justify-center text-center p-8 group`}>
                <div className="absolute -top-20 -left-20 w-56 h-56 bg-violet-500/10 rounded-full blur-[90px]" />
                <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-orange-500/10 rounded-full blur-[90px]" />
                <div className="relative mb-8 w-28 h-28 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-orange-500/20" />
                  <div className="absolute inset-3 rounded-full border border-violet-400/20" />
                  <div className="absolute inset-0 rounded-full border-t-2 border-orange-500 animate-spin" style={{ animationDuration: "3s" }} />
                  <FaRocket className="relative text-4xl text-orange-400 group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="relative text-2xl md:text-3xl font-black uppercase tracking-tighter mb-3">The Sector is Quiet</h3>
                <p className="relative text-gray-400 max-w-sm text-sm leading-relaxed mb-6">
                  No cosmic transmissions have been detected in this coordinate yet. Be the first to signal your journey!
                </p>
                <span className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-400 text-black font-black text-[10px] uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" /> Scanning for Signals
                </span>
              </div>
            )}
          </div>

          {/* ================= AGGREGATE TILE ================= */}
          <div className="col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 to-orange-600 text-black p-6 md:p-7 flex flex-col justify-between min-h-[170px]">
            <FaAward className="absolute -right-4 -bottom-6 text-[8rem] text-black/10" />
            <span className="relative font-mono text-[10px] font-bold uppercase tracking-[0.3em]">Average Rating</span>
            <div className="relative">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl md:text-7xl font-black tracking-tighter leading-none">
                  {testimonials.length ? averageRating.toFixed(1) : "—"}
                </span>
                <span className="font-mono text-xs font-bold">/ 5.0</span>
              </div>
              <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-black/70">
                {pad2(testimonials.length)} Transmissions
              </p>
            </div>
          </div>

          {/* ================= FORM TILE ================= */}
          <aside className="col-span-2">
            <div className="h-full p-px rounded-[2rem] bg-gradient-to-br from-orange-500/60 via-violet-500/25 to-cyan-500/40">
              <div className="relative h-full overflow-hidden rounded-[2rem] bg-[#0c0906]/90 backdrop-blur-2xl p-6 md:p-7">
                {status === "success" ? (
                  <div className="relative h-full flex flex-col items-center justify-center text-center py-10 animate-zoom-in">
                    <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                      <div className="absolute inset-0 bg-green-500/30 rounded-full blur-xl animate-pulse" />
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                        <FaCheckCircle className="text-black text-3xl" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Signal Received!</h3>
                    <p className="text-gray-400 text-sm">Your feedback is now orbiting our database. Thank you for your contribution.</p>
                    <button
                      onClick={() => {
                        setStatus("idle");
                        setRating(5);
                        formRef.current?.reset();
                      }}
                      className="mt-8 px-6 py-3 rounded-full bg-orange-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all"
                    >
                      Submit Another Review
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <p className="font-mono text-[10px] uppercase tracking-[.3em] text-cyan-300 mb-1">// Open_Channel</p>
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                      Share Your Journey <FaPaperPlane className="text-orange-500 text-lg" />
                    </h3>

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="review-name" className={labelClass}>Full Name *</label>
                        <input id="review-name" required name="user_name" placeholder="Name" className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="review-email" className={labelClass}>Work Email *</label>
                        <input id="review-email" required type="email" name="user_email" placeholder="Email" className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="review-company" className={labelClass}>Company (Optional)</label>
                        <input id="review-company" name="company_name" placeholder="Company" className={inputClass} />
                      </div>
                      <div>
                        <span className={labelClass}>Star Rating *</span>
                        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10">
                          <Rate allowHalf value={rating} onChange={handleRating} character={<MdOutlineStarRate />} style={{ fontSize: 20 }} />
                          <span className="font-mono text-xs text-orange-300 whitespace-nowrap">
                            {rating.toFixed(1)} · {ratingLabel(rating)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="review-comment" className={labelClass}>Experience *</label>
                        <textarea
                          id="review-comment"
                          required
                          name="comment"
                          rows={4}
                          placeholder="Describe your cosmic experience..."
                          className={`${inputClass} resize-none`}
                        />
                      </div>
                      <button
                        disabled={status === "loading"}
                        type="submit"
                        className="w-full py-4 rounded-full bg-orange-500 text-black font-black uppercase tracking-[.2em] text-xs shadow-[0_0_30px_rgba(249,115,22,0.35)] hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
                      >
                        {status === "loading" ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            Transmitting...
                          </>
                        ) : (
                          <>
                            <FaRocket className="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" /> Launch Review
                          </>
                        )}
                      </button>
                      <p className="text-[11px] text-gray-600 text-center">
                        Your review will be visible after approval by our cosmic moderators
                      </p>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
