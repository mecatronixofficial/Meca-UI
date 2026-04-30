import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Rate } from "antd";
import { addReviewAPI, getAllReviewsAPI } from "../../api/api";
import { useToast } from "../../hooks/useToast";
import Icons from "../../helper/icon_help";

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

const Testimonials = () => {

  const { MdOutlineStarRate, FaStar, FaChevronLeft, FaChevronRight, FaAward, FaRocket, FaCheckCircle } = Icons;

  const [testimonials, setTestimonials] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [loadingTime, setLoadingTime] = useState(false);
  const [status, setStatus] = useState("idle");
  const { success, error, loading, dismissAll } = useToast();
  const [rating, setRating] = useState(5);

  // Use useMemo for the current testimonial so it stays in sync with state updates
  const currentTestimonial = useMemo(() => testimonials[activeTestimonial] || null, [testimonials, activeTestimonial]);

  const controllerRef = useRef(null);
  const timeoutRef = useRef(null);
  const formRef = useRef(null);
  const isMounted = useRef(true);

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

  // MISTAKE FIX: Define handleFetch with useCallback so it can be used as a dependency
  const handleFetch = useCallback(async () => {
    try {
      setLoadingTime(true);
      const result = await getAllReviewsAPI();
      if (isMounted.current && result?.success && Array.isArray(result.data)) {
        const mappedData = result.data.map((rev, index) => {
          const parsedRating = parseFloat(rev.rating);
          return {
            id: rev._id ?? index,
            name: rev.user_name?.trim() || "Anonymous User",
            position: rev.company_name?.trim() || "Interstellar Partner",
            content: rev.comment || "",
            rating: Number.isFinite(parsedRating) ? Math.min(5, Math.max(0, parsedRating)) : 0,
            color: index % 2 === 0 ? "from-blue-500 to-cyan-500" : "from-purple-500 to-pink-500",
            glow: index % 2 === 0 ? "rgba(59, 130, 246, 0.3)" : "rgba(168, 85, 247, 0.3)",
            initials: rev.user_name ? rev.user_name.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase() : "?",
            project: rev.is_verified ? "Verified Client" : "Galaxy Explorer",
          };
        });
        setTestimonials(mappedData);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      if (isMounted.current) setLoadingTime(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    handleFetch();
    return () => { isMounted.current = false; };
  }, [handleFetch]);

  const handleRating = (rate) => setRating(rate);

  // MISTAKE FIX: Added handleFetch to dependency array to avoid stale closures
  const handleSubmit = useCallback(async (e) => {
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
    } catch (err) {
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

  const ratingLabel = (value) =>
    value >= 4.5 ? "Best" : value >= 4 ? "Great" : value >= 3 ? "Good" : value >= 2 ? "Ok" : "Bad";

  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden py-24 font-sans">
      <SpaceBackground stars={stars} />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-6 bg-white/5 rounded-full border border-white/10 mb-6">
            <FaAward className="text-4xl text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Cosmic Reviews
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Real stories from our partners across the digital universe.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Testimonial Card */}
          <div className="lg:col-span-2">
            {loadingTime ? (
              <div className="h-full min-h-[400px] flex items-center justify-center bg-white/5 border border-white/10 rounded-3xl animate-pulse">
                <div className="text-center">
                  <FaRocket className="text-4xl text-blue-500 animate-bounce mx-auto mb-4" />
                  <p className="text-gray-500">Scanning sector for reviews...</p>
                </div>
              </div>
            ) : currentTestimonial ? (
              <div className="relative h-full bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col justify-between group transition-all duration-500 hover:border-blue-500/50 shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 group-hover:rotate-6 group-hover:animate-pulse transition-all duration-500">
                  <FaRocket size={120} />
                </div>

                <div className="relative">
                  <div className="flex items-center gap-6 mb-8">
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentTestimonial.color}
  flex items-center justify-center text-3xl font-bold
  ring-2 ring-white/20`}
                      style={{ boxShadow: `0 0 30px ${currentTestimonial.glow}` }}
                    >

                      {currentTestimonial.initials}

                    </div>
                    <div>
                      <h3 className="text-3xl font-bold">
                        {currentTestimonial.name}
                      </h3>

                      <p className="text-blue-400 font-medium uppercase tracking-widest text-xs pt-2">
                        {currentTestimonial.project}
                      </p>

                      <span className="text-xs text-blue-400 tracking-wide">
                        {ratingLabel(testimonials[activeTestimonial]?.rating ?? 0)}
                      </span>
                    </div>
                  </div>

                  {/* Antd Rate Component for displayed rating */}
                  <div className="mb-6 flex items-center gap-3">
                    <Rate
                      disabled
                      allowHalf
                      value={currentTestimonial.rating}
                      character={<MdOutlineStarRate />}
                      style={{ fontSize: 22 }}
                    />
                  </div>

                  <blockquote className="text-2xl text-gray-200 leading-relaxed italic font-light">
                    "{currentTestimonial.content}"
                  </blockquote>

                </div>

                <div className="flex justify-between items-center mt-12">
                  <div className="flex gap-2">
                    {testimonials.map((_, i) => (
                      <div key={i} className={`h-1 rounded-full transition-all duration-300 ${activeTestimonial === i ? "w-8 bg-blue-500" : "w-2 bg-white/20"}`} />
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button onClick={prevTestimonial} className="p-4 bg-white/5 rounded-2xl border border-white/10
hover:bg-white/10 hover:scale-110 active:scale-95
transition-all duration-300 hover:border-blue-500/50"
                    >
                      <FaChevronLeft />
                    </button>
                    <button onClick={nextTestimonial} className="p-4 bg-white/5 rounded-2xl border border-white/10
hover:bg-white/10 hover:scale-110 active:scale-95
transition-all duration-300 hover:border-blue-500/50"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-3xl relative overflow-hidden group">
                {/* Background Decorative Glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />

                {/* Icon with Pulsing Effect */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                  <div className="relative p-6 bg-white/5 border border-white/10 rounded-full">
                    <FaRocket className="text-5xl text-blue-400 opacity-50 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="text-center relative z-10 px-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent mb-2">
                    The Sector is Quiet
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                    No cosmic transmissions have been detected in this coordinate yet.
                    Be the first to signal your journey!
                  </p>
                </div>

                {/* Subtle "Radar" Animation */}
                <div className="mt-8 flex gap-3 items-center">
                  <span className="w-1 h-1 bg-blue-500 rounded-full animate-ping" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-blue-500/50 font-bold">
                    Scanning for Signals
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Review Submission Form */}
          <aside className="lg:col-span-1">
            <div className="bg-zinc-900/80 border border-white/10 p-8 rounded-3xl shadow-2xl sticky top-24 backdrop-blur-sm">
              {status === "success" ? (
                <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                  <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-2">Signal Received!</h3>
                  <p className="text-gray-400">Your feedback is now orbiting our database. Thank you for your contribution.</p>
                  <button
                    onClick={() => {
                      setStatus("idle");
                      setRating(5);
                      formRef.current?.reset();
                    }}
                    className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-all"
                  >
                    Submit Another Review
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <FaRocket className="text-blue-500" /> Share Your Journey
                  </h3>
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 ml-1">Full Name *</label>
                      <input
                        required
                        name="user_name"
                        placeholder="Name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 hover:border-white/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 ml-1">Work Email *</label>
                      <input
                        required
                        type="email"
                        name="user_email"
                        placeholder="Email"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 hover:border-white/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 ml-1">Company (Optional)</label>
                      <input
                        name="company_name"
                        placeholder="Company"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 hover:border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 ml-1">Star Rating *</label>
                      <div className="flex items-center gap-4">
                        <Rate allowHalf value={rating} onChange={handleRating} character={<MdOutlineStarRate />} style={{ fontSize: 18 }} className="text-yellow-400" />
                        <span className="text-sm text-gray-400">{rating.toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Click on stars to rate your experience</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 ml-1">Experience *</label>
                      <textarea
                        required
                        name="comment"
                        rows="3"
                        placeholder="Describe your cosmic experience..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 hover:border-white/20 resize-none"
                      />
                    </div>
                    <button
                      disabled={status === "loading"}
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                    >
                      {status === "loading" ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Transmitting...
                        </>
                      ) : (
                        "Launch Review"
                      )}
                    </button>
                    <p className="text-xs text-gray-600 text-center mt-2">
                      Your review will be visible after approval by our cosmic moderators
                    </p>
                  </form>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Additional stars animation */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-0"></div>

    </section>
  );
};

export default Testimonials;