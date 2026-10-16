"use client";

import React, { useState, useEffect, useMemo } from "react";
import { addEnquiryAPI } from "../../api/api";
import { useToast } from "../../hooks/useToast";
import Icons from "../../helper/icon_help";
import mecatronixConfig from "../../config/envConfig";
import type { Particle } from "../../types/space";

const Openline = () => {

  const { FaEnvelope,
    FaPhoneAlt,
    FaWhatsapp,
    FaMapMarkerAlt,
    FaClock,
    FaUserTie,
    FaRocket,
    FaShieldAlt,
    FaHeadset,
    FaPaperPlane,
    FaCheckCircle,
    FaGithub,
    FaYoutube,
    FaInstagram,
    FaFacebookF,
    FaGlobe,
    FaIndustry,
    FaArrowRight } = Icons;

  const { location,
    contact,
    business,
    social,
  } = mecatronixConfig;

  const locationlink = location?.googleMapsLink || "";
  const fulladdress = location?.fullAddress || "";
  const PRIMARY_PHONE = contact?.primaryPhone || '+910000000000';
  const WHATSAPP_NUMBER = contact?.whatsappNumber || '+910000000000';
  const COMPANY_EMAIL = contact?.companyEmail || 'connect@mecatronix.com';
  const days = business?.days || "";
  const starttime = business?.hoursStart || "";
  const endtime = business?.hoursEnd || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const { success, error, loading, dismissAll } = useToast();
  const [emailError, setEmailError] = useState("");


  // Generate particles on mount (client-only to avoid hydration mismatch)
  useEffect(() => {


    const newParticles = [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 15 + 5,
      delay: Math.random() * 5,
      duration: Math.random() * 6 + 4
    }));
    setParticles(newParticles);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // ✅ Clear email error when user edits email
    if (e.target.name === "email" && emailError) {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setEmailError(""); // ✅ reset previous email errors

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    ) {
      error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    loading("Sending your enquiry...");

    try {
      const result = await addEnquiryAPI(formData);
      dismissAll();

      if (result?.success) {
        success("🎉 Enquiry sent successfully! We'll contact you within 24 hours.");
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: ""
        });
      } else {
        // Backend handled error
        error(result?.message || "Failed to send enquiry");
      }
    } catch (err: any) {
      dismissAll();

      if (
        err?.response?.status === 409 ||
        err?.response?.data?.code === "EMAIL_EXISTS"
      ) {
        error("📧 This email has already submitted an enquiry.");
        setEmailError("This email is already registered");
        return;
      }

      error("❌ Something went wrong. Please try again later.");
    }
    finally {
      setIsSubmitting(false);
    }
  };

  // Accent palette (orange stays the primary brand colour).
  // Full class names are spelled out so Tailwind can generate them.
  const ACCENTS = {
    orange: { chip: "bg-orange-500/10 border-orange-500/30 text-orange-400", hoverChip: "group-hover:bg-orange-500 group-hover:text-black", text: "text-orange-300", hover: "hover:border-orange-500/50", glow: "bg-orange-500/15" },
    emerald: { chip: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", hoverChip: "group-hover:bg-emerald-400 group-hover:text-black", text: "text-emerald-300", hover: "hover:border-emerald-500/50", glow: "bg-emerald-500/15" },
    green: { chip: "bg-green-500/10 border-green-500/30 text-green-400", hoverChip: "group-hover:bg-green-400 group-hover:text-black", text: "text-green-300", hover: "hover:border-green-500/50", glow: "bg-green-500/15" },
    cyan: { chip: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400", hoverChip: "group-hover:bg-cyan-400 group-hover:text-black", text: "text-cyan-300", hover: "hover:border-cyan-500/50", glow: "bg-cyan-500/15" },
    violet: { chip: "bg-violet-500/10 border-violet-500/30 text-violet-400", hoverChip: "group-hover:bg-violet-400 group-hover:text-black", text: "text-violet-300", hover: "hover:border-violet-500/50", glow: "bg-violet-500/15" },
    amber: { chip: "bg-amber-500/10 border-amber-500/30 text-amber-400", hoverChip: "group-hover:bg-amber-400 group-hover:text-black", text: "text-amber-300", hover: "hover:border-amber-500/50", glow: "bg-amber-500/15" },
  };

  const contactInfo = [
    { icon: <FaEnvelope />, title: "Email Address", desc: COMPANY_EMAIL, link: `mailto:${COMPANY_EMAIL}`, accent: ACCENTS.orange },
    { icon: <FaPhoneAlt />, title: "Phone Number", desc: PRIMARY_PHONE, link: `tel:${PRIMARY_PHONE}`, accent: ACCENTS.emerald },
    { icon: <FaWhatsapp />, title: "WhatsApp", desc: WHATSAPP_NUMBER, link: `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`, accent: ACCENTS.green },
    { icon: <FaMapMarkerAlt />, title: "Location", desc: fulladdress, link: locationlink, accent: ACCENTS.cyan },
    { icon: <FaClock />, title: "Business Hours", desc: `${days} : ${starttime} AM - ${endtime} PM`, link: "", accent: ACCENTS.violet },
    { icon: <FaHeadset />, title: "Support", desc: "24/7 Customer Support", link: "", accent: ACCENTS.amber },
  ];

  const socialLinks = useMemo(() => [
    { icon: FaFacebookF, href: social?.facebook, label: "Facebook", color: "hover:bg-blue-600 hover:border-blue-500" },
    { icon: FaInstagram, href: social?.instagram, label: "Instagram", color: "hover:bg-pink-600 hover:border-pink-500" },
    { icon: FaYoutube, href: social?.youtube, label: "YouTube", color: "hover:bg-red-600 hover:border-red-500" },
    { icon: FaWhatsapp, href: `https://wa.me/${WHATSAPP_NUMBER?.replace('+', '')}`, label: "WhatsApp", color: "hover:bg-green-600 hover:border-green-500" },
    { icon: FaGithub, href: social?.github, label: "GitHub", color: "hover:bg-gray-700 hover:border-gray-500" },
  ].filter(link => link.href), [social, WHATSAPP_NUMBER, FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaGithub]);

  const inputClass =
    "w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white outline-none transition-all placeholder:text-gray-600 hover:border-white/20 focus:border-orange-500/60 focus:bg-orange-500/[0.04] focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)] disabled:opacity-60";
  const labelClass = "block text-[10px] font-mono uppercase tracking-[.25em] text-gray-500 mb-2";
  const tileBase = "relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/50 backdrop-blur-md";

  return (
    <section id="contact" className="min-h-screen text-white pt-24 md:pt-32 pb-16 md:pb-20 relative overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-gradient-to-r from-orange-500/20 to-orange-700/20 rounded-full animate-float"
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
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">

          {/* ================= TITLE TILE ================= */}
          <div className="col-span-2 lg:col-span-4 lg:row-span-2 relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0906]/80 backdrop-blur-xl p-6 sm:p-8 md:p-12 flex flex-col justify-between min-h-[360px] md:min-h-[440px] animate-fade-in-up">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-500/20 blur-[110px]" />
            <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-[110px]" />
            <div className="absolute right-4 bottom-2 text-[5rem] sm:text-[8rem] md:text-[10rem] font-black leading-none text-white/[0.03] uppercase tracking-tighter select-none pointer-events-none">
              Uplink
            </div>

            <div className="relative flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-black font-black text-[9px] sm:text-[10px] uppercase tracking-[0.25em]">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                Uplink: Available
              </span>
              <span className="hidden sm:block font-mono text-[10px] uppercase tracking-widest text-gray-500">Channel / Open</span>
            </div>

            {/* @container: the title scales with this card's width, not the viewport */}
            <div className="@container relative mt-10">
              <h1 className="font-black uppercase tracking-tighter leading-[0.85] text-[clamp(2rem,10cqw,5.5rem)] break-words">
                <span className="block text-white">Beyond the</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-500 to-rose-500 bg-[length:200%_auto] animate-gradient">
                  Horizon
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-gray-400 text-base md:text-lg leading-relaxed">
                Whether you&apos;re looking to <span className="text-white font-medium">Engineer the future</span> or optimize the present,
                our specialized crew is ready to navigate the complexities of your next digital venture.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-black font-black text-[9px] sm:text-[10px] uppercase tracking-widest">
                  <FaRocket /> Rapid Deployment
                </span>
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400 text-black font-black text-[9px] sm:text-[10px] uppercase tracking-widest">
                  <FaShieldAlt /> Secure Protocols
                </span>
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400 text-black font-black text-[9px] sm:text-[10px] uppercase tracking-widest">
                  <FaGlobe /> Global Scale
                </span>
              </div>
            </div>
          </div>

          {/* ================= STATS ================= */}
          {/* 24h — solid orange */}
          <div className="col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 to-orange-600 text-black p-6 md:p-7 flex flex-col justify-between min-h-[170px] group">
            <div className="absolute -right-4 -bottom-10 text-[8rem] font-black leading-none text-black/10 select-none">h</div>
            <div className="relative flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]">Response Time</span>
              <FaRocket className="text-lg group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="relative text-6xl md:text-7xl font-black tracking-tighter">24h</div>
          </div>

          {/* 5+ years — violet */}
          <div className={`col-span-2 ${tileBase} p-6 md:p-7 flex flex-col justify-between min-h-[170px] hover:border-violet-500/50 transition-colors`}>
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-violet-500/20 rounded-full blur-3xl" />
            <div className="relative flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-violet-300">Years Experience</span>
              <FaIndustry className="text-violet-400 text-lg" />
            </div>
            <div className="relative flex items-end justify-between">
              <span className="text-5xl md:text-6xl font-black tracking-tighter">5+</span>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="w-2 rounded-full bg-violet-400" style={{ height: `${10 + i * 6}px`, opacity: 0.4 + i * 0.15 }} />
                ))}
              </div>
            </div>
          </div>

          {/* 100+ — amber */}
          <div className="col-span-1 lg:col-span-3 relative overflow-hidden rounded-[2rem] border-2 border-amber-400/40 bg-amber-400/[0.06] p-5 md:p-6 flex flex-col justify-between min-h-[150px] hover:bg-amber-400/10 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">Projects Completed</span>
              <FaCheckCircle className="shrink-0 text-amber-400" />
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-black">100+</div>
              <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-amber-300 to-orange-500" />
              </div>
            </div>
          </div>

          {/* 98% — rose */}
          <div className={`col-span-1 lg:col-span-3 ${tileBase} p-5 md:p-6 flex flex-col justify-between min-h-[150px] hover:border-rose-500/50 transition-colors`}>
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-rose-500/20 rounded-full blur-2xl" />
            <div className="relative flex items-center justify-between gap-2">
              <span className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-rose-300">Client Satisfaction</span>
              <FaUserTie className="shrink-0 text-rose-400" />
            </div>
            <div className="relative">
              <div className="text-3xl md:text-5xl font-black">98%</div>
              <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-rose-400 to-orange-500" />
              </div>
            </div>
          </div>

          {/* ================= CHANNELS ================= */}
          <div className="col-span-2 lg:col-span-6 flex items-center gap-4 pt-6 md:pt-8 pb-1">
            <span className="font-black uppercase tracking-tighter text-2xl md:text-3xl">
              Get In Touch<span className="text-orange-500">.</span>
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-orange-500/60 via-white/10 to-transparent" />
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-gray-500">Comms_Directory</span>
          </div>

          {contactInfo.map((item) => {
            const external = !!item.link && item.link.startsWith("http");
            const tileClass = `col-span-2 sm:col-span-1 lg:col-span-2 group ${tileBase} p-5 md:p-6 flex items-start gap-4 ${item.accent.hover} transition-colors`;
            const content = (
              <>
                <div className={`absolute -bottom-14 -right-14 w-36 h-36 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity ${item.accent.glow}`} />
                <div className={`relative shrink-0 w-12 h-12 rounded-2xl border flex items-center justify-center text-lg transition-colors ${item.accent.chip} ${item.accent.hoverChip}`}>
                  {item.icon}
                </div>
                <div className="relative min-w-0 flex-1">
                  <p className={`font-mono text-[10px] uppercase tracking-[.25em] ${item.accent.text}`}>{item.title}</p>
                  <p className="mt-1 text-sm md:text-base font-semibold text-gray-200 break-words group-hover:text-white transition-colors">{item.desc}</p>
                </div>
                {item.link && (
                  <FaArrowRight className="relative shrink-0 mt-1 text-gray-600 -rotate-45 group-hover:rotate-0 group-hover:text-white transition-all duration-300" />
                )}
              </>
            );

            return item.link ? (
              <a
                key={item.title}
                href={item.link}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className={tileClass}
              >
                {content}
              </a>
            ) : (
              <div key={item.title} className={tileClass}>{content}</div>
            );
          })}

          {/* ================= FORM ================= */}
          <div className="col-span-2 lg:col-span-4 mt-3 md:mt-4">
            <div className="h-full p-px rounded-[2rem] bg-gradient-to-br from-orange-500/60 via-violet-500/25 to-cyan-500/40">
              <div className="relative h-full overflow-hidden rounded-[2rem] bg-[#0c0906]/90 backdrop-blur-2xl p-5 sm:p-8 md:p-10">
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-orange-500/15 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

                {isSubmitted ? (
                  <div className="relative h-full flex flex-col items-center justify-center text-center py-10 animate-zoom-in">
                    <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                      <div className="absolute inset-0 bg-green-500/30 rounded-full blur-xl animate-pulse" />
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                        <FaCheckCircle className="text-black text-3xl" />
                      </div>
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-[.4em] text-green-400 mb-2">Transmission_Received</p>
                    <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-3">Thank You!</h3>
                    <p className="text-gray-400 max-w-sm mb-8">Your enquiry has been received. We&apos;ll contact you within 24 hours.</p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-3 rounded-full bg-orange-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] font-mono text-[10px] uppercase tracking-[.25em] text-gray-400">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${isSubmitting ? "bg-orange-500" : "bg-green-500"}`} />
                        Channel_{isSubmitting ? "Busy" : "Open"}
                      </span>
                      <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-gray-500">Form / 01</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-3">
                      Start Your{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500">Project</span>
                    </h2>
                    <p className="text-sm md:text-base text-gray-400 mb-8">Fill out the form below and we&apos;ll get back to you shortly.</p>

                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="enquiry-name" className={labelClass}>Full Name *</label>
                          <input
                            id="enquiry-name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className={inputClass}
                            placeholder="Full Name"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="enquiry-email" className={labelClass}>Email Address *</label>
                          <input
                            id="enquiry-email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            aria-invalid={!!emailError}
                            className={`${inputClass} ${emailError ? "!border-red-500 focus:!shadow-[0_0_0_3px_rgba(239,68,68,0.15)]" : ""}`}
                            placeholder="Email Address"
                            required
                          />
                          {emailError && (
                            <p className="text-red-400 text-xs mt-1.5 font-medium">
                              {emailError}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="enquiry-phone" className={labelClass}>Phone Number *</label>
                          <input id="enquiry-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={isSubmitting} className={inputClass} placeholder="Phone Number" required />
                        </div>
                        <div>
                          <label htmlFor="enquiry-company" className={labelClass}>Company (Optional)</label>
                          <input id="enquiry-company" type="text" name="company" value={formData.company} onChange={handleChange} disabled={isSubmitting} className={inputClass} placeholder="Company Name" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="enquiry-message" className={labelClass}>Project Details *</label>
                        <textarea id="enquiry-message" name="message" value={formData.message} onChange={handleChange} disabled={isSubmitting} rows={5} className={`${inputClass} resize-none`} placeholder="Tell us about your project, goals and timeline..." required />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="relative overflow-hidden w-full py-4 rounded-full bg-orange-500 text-black font-black uppercase tracking-[.2em] text-xs shadow-[0_0_30px_rgba(249,115,22,0.35)] hover:bg-white hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isSubmitting ? (
                            <>
                              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                              Transmitting...
                            </>
                          ) : (
                            <>
                              <FaPaperPlane className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transition-transform" /> Send Enquiry
                            </>
                          )}
                        </span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= SIDE COLUMN ================= */}
          <div className="col-span-2 lg:col-span-2 mt-3 md:mt-4 grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4 content-start">
            {/* Response promise */}
            <div className="col-span-2 sm:col-span-1 lg:col-span-1 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 to-rose-500 text-black p-6 min-h-[180px] flex flex-col justify-between">
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border-[14px] border-black/10" />
              <span className="relative font-mono text-[10px] font-bold uppercase tracking-[0.3em]">Reply Window</span>
              <div className="relative">
                <p className="text-5xl font-black tracking-tighter leading-none">&lt;24h</p>
                <p className="mt-2 text-xs font-semibold text-black/70">We&apos;ll contact you within 24 hours.</p>
              </div>
            </div>

            {/* Social */}
            {socialLinks.length > 0 && (
              <div className={`col-span-2 sm:col-span-1 lg:col-span-1 ${tileBase} p-6`}>
                <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl" />
                <p className="relative font-mono text-[10px] uppercase tracking-[.3em] text-cyan-300 mb-4">Follow Us</p>
                <div className="relative grid grid-cols-4 lg:grid-cols-2 gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className={`aspect-square rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:-translate-y-1 active:scale-95 transition-all duration-300 ${link.color}`}
                    >
                      <link.icon className="text-lg" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ================= MAP ================= */}
          <div className="col-span-2 lg:col-span-6 mt-6 md:mt-8 relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-white/10 bg-[#0c0906]/90 animate-fade-in-up fill-mode-forwards opacity-0" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 md:px-8 py-5">
              <div className="flex items-center gap-4 min-w-0">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-cyan-400 text-black flex items-center justify-center">
                  <FaMapMarkerAlt className="text-lg" />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[.3em] text-cyan-300">HQ_Coordinates</p>
                  <h3 className="text-base sm:text-lg md:text-2xl font-black uppercase tracking-tighter text-white">
                    Visit Our Software Company in Coimbatore
                  </h3>
                </div>
              </div>
              {locationlink && (
                <a
                  href={locationlink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-orange-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all group/map"
                >
                  Open in Maps <FaArrowRight className="-rotate-45 group-hover/map:rotate-0 transition-transform" />
                </a>
              )}
            </div>
            <div className="relative mx-3 mb-3 md:mx-4 md:mb-4 overflow-hidden rounded-[1.5rem]">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.114189307222!2d76.9732984750099!3d11.030058689134563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859d8466e5bd9%3A0x8490ce731b0f659f!2sMecatronix%20Software%20Development!5e0!3m2!1sen!2sin!4v1768823607767!5m2!1sen!2sin" title="Mecatronix office location" allowFullScreen className="block w-full h-[280px] sm:h-[340px] md:h-[420px] filter grayscale contrast-125 hover:grayscale-0 hover:contrast-100 transition-all duration-700" loading="lazy" width="100%" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Openline;
