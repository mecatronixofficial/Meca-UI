import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { IoClose } from "react-icons/io5";
import { subscribeNewsletterAPI } from "../../api/api";
import { validateEmail } from "../../helper/res_help";
import { useToast } from "../../hooks/useToast";
import Icons from "../../helper/icon_help";

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

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const { success, error, loading, dismissAll } = useToast();
  const isMounted = useRef(true);
  const resetTimeoutRef = useRef(null);
  const controllerRef = useRef(null);
  const {
    FaEnvelopeOpenText, FaCheck, FaArrowRight, FaShieldAlt, FaRocket, FaPaperPlane, FaStar
  } = Icons;

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

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    if (!validateEmail(email)) {
      setStatus("error");
      error("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    // eslint-disable-next-line no-unused-vars
    const loadingToast = loading("Subscribing to newsletter...");

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
        error("❌ Subscription failed. Please try again later.");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      if (!isMounted.current) return;
      dismissAll();
      setStatus("error");
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

  return (
    <section id="newsletter" className="relative min-h-screen bg-black text-white overflow-hidden py-24">

      <SpaceBackground stars={stars} shootingStars={shootingStars} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-6 mb-8 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 transition-transform duration-500 hover:scale-110 hover:rotate-6">
            <FaPaperPlane className="text-4xl text-white" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Join Our Orbit
            </span>
          </h1>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6"></div>
          <p className="text-gray-300 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Subscribe to our cosmic newsletter and receive interstellar insights
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Features */}
          <div className="space-y-8">
            <div className="space-y-6">
              {[
                { icon: <FaRocket />, title: "Weekly Space Briefs", color: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-400" },
                { icon: <FaShieldAlt />, title: "Exclusive Cosmic Content", color: "from-purple-500/20 to-pink-500/20", iconColor: "text-purple-400" },
                { icon: <FaEnvelopeOpenText />, title: "Priority Launch Access", color: "from-pink-500/20 to-blue-500/20", iconColor: "text-pink-400" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:border-white/30 hover:translate-x-2">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} ${item.iconColor}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">Access premium insights and interstellar knowledge delivered straight to your inbox.</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-6 border-t border-white/10">
              {["🚀 No Spam", "⚡ Instant Unsubscribe", "🛡️ Privacy First"].map((badge, i) => (
                <span key={i} className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="relative">
            <form onSubmit={handleSubmit} className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden">

              {/* Card Glow */}
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">Launch Your Journey</h3>
                <p className="text-gray-400 mb-8">Enter your email to join our cosmic community</p>

                <div className="relative mb-6">

                  {/* Close button for success/error states */}
                  {(status === "success" || status === "error") && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="absolute -top-2 -right-2 bg-white/20 backdrop-blur-md rounded-full p-1 hover:bg-white/30 transition-colors z-20"
                    >
                      <IoClose className="text-white text-lg" />
                    </button>
                  )}

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@galaxy.com"
                    className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    disabled={status === "loading" || status === "success"}
                    required
                  />

                  {/* Loading indicator */}
                  {status === "loading" && (
                    <div
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                      <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className={`relative w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 active:scale-95 ${status === "loading" || status === "success"
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-[0_0_20px_rgba(147,51,234,0.4)]"
                    }`}
                >
                  <span className="flex items-center justify-center gap-3">
                    {status === "loading" ? "Launching..." : status === "success" ? (
                      <>
                        <FaCheck className="text-green-600" />
                        Subscribed!
                      </>
                    ) : "Join Mission"}
                    {status === "idle" && <FaArrowRight />}
                  </span>
                </button>

                {/* Status Messages */}
                {status === "error" && (
                  <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-center text-sm animate-shake">
                    Please enter a valid email address
                  </div>
                )}
                {status === "success" && (
                  <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-200 text-center text-sm">
                    <FaStar className="inline mr-2 animate-pulse" /> Welcome to the mission!
                  </div>
                )}

                {/* Loading State Indicator */}
                {status === "loading" && (
                  <div
                    className="mt-6 p-4 rounded-2xl backdrop-blur-md border bg-blue-500/20 border-blue-400/50 text-blue-100"
                  >
                    <div className="flex items-center justify-center gap-2 text-lg font-medium">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      Subscribing to newsletter...
                    </div>
                  </div>
                )}
              </div>
            </form>

            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[
                { v: "10K+", l: "Subscribers" },
                { v: "99%", l: "Orbit Rate" },
                { v: "24h", l: "Support" }
              ].map((s, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{s.v}</div>
                  <div className="text-gray-500 text-xs mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
