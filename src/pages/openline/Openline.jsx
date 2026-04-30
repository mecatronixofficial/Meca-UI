import React, { useState, useEffect, useMemo } from "react";
import { addEnquiryAPI } from "../../api/api";
import { useToast } from "../../hooks/useToast";
import Icons from "../../helper/icon_help";
import { SpaceBackground } from "../../components/star/SpaceBackground";
import mecatronixConfig from "../../config/envConfig";

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
    FaInstagram,
    FaFacebookF,
    FaGlobe,
    FaIndustry } = Icons;

  const { location = {},
    contact = {},
    business = {},
    social = {},
  } = mecatronixConfig || {};

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
  const [particles, setParticles] = useState([]);
  const { success, error, loading, dismissAll } = useToast();
  const [emailError, setEmailError] = useState("");

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

  // Generate particles once on mount
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // ✅ Clear email error when user edits email
    if (e.target.name === "email" && emailError) {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
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
    } catch (err) {
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

  const contactInfo = [
    { icon: <FaEnvelope className="text-2xl" />, title: "Email Address", desc: COMPANY_EMAIL, link: `mailto:${COMPANY_EMAIL}`, color: "from-orange-500 to-red-500" },
    { icon: <FaPhoneAlt className="text-2xl" />, title: "Phone Number", desc: PRIMARY_PHONE, link: `tel:${PRIMARY_PHONE}`, color: "from-green-500 to-emerald-600" },
    { icon: <FaWhatsapp className="text-2xl" />, title: "WhatsApp", desc: WHATSAPP_NUMBER, link: "", color: "from-green-400 to-green-600" },
    { icon: <FaMapMarkerAlt className="text-2xl" />, title: "Location", desc: fulladdress, link: locationlink, color: "from-blue-500 to-purple-600" },
    { icon: <FaClock className="text-2xl" />, title: "Business Hours", desc: `${days} : ${starttime} AM - ${endtime} PM`, color: "from-purple-500 to-pink-600" },
    { icon: <FaHeadset className="text-2xl" />, title: "Support", desc: "24/7 Customer Support", color: "from-cyan-500 to-blue-600" }
  ];

  const socialLinks = useMemo(() => [
    { icon: FaFacebookF, href: social?.facebook, label: "FB", color: "hover:bg-blue-600" },
    { icon: FaInstagram, href: social?.instagram, label: "IG", color: "hover:bg-pink-600" },
    { icon: FaWhatsapp, href: `https://wa.me/${WHATSAPP_NUMBER?.replace('+', '')}`, label: "WA", color: "hover:bg-green-600" },
      { icon: FaGithub, href: social?.github, label: "GIT", color: "hover:bg-gray-800" },
  ].filter(link => link.href), [social, WHATSAPP_NUMBER]);


  const stats = [
    { number: "24h", label: "Response Time", icon: FaRocket },
    { number: "100+", label: "Projects Completed", icon: FaCheckCircle },
    { number: "98%", label: "Client Satisfaction", icon: FaUserTie },
    { number: "5+", label: "Years Experience", icon: FaIndustry }
  ];

  return (
    <section id="contact" className="min-h-screen bg-black text-white pt-32 pb-20 relative overflow-hidden">

      <SpaceBackground stars={stars} shootingStars={shootingStars} />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full animate-float"
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
        {/* Header Section: Mission Briefing */}
        <div className="relative text-center mb-24 animate-fade-in-up">

          {/* 🛰️ Floating Status Indicator */}
          <div className="w-full h-auto flex items-center justify-center">
            <div className=" flex items-center justify-center gap-3 bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full mb-10 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500/80">
                Uplink: Available
              </span>
            </div>
          </div>

          {/* 🌌 Cinematic Title */}
          <div className="relative inline-block">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">
              <span className="block text-white opacity-90 drop-shadow-2xl">
                BEYOND THE
              </span>
              <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-text text-transparent animate-gradient">
                HORIZON
              </span>
            </h2>

            {/* Decorative Technical Lines */}
            <div className="hidden md:block absolute -left-16 top-1/2 w-12 h-[1px] bg-gradient-to-r from-transparent to-orange-500/50"></div>
            <div className="hidden md:block absolute -right-16 top-1/2 w-12 h-[1px] bg-gradient-to-l from-transparent to-orange-500/50"></div>
          </div>

          {/* 📝 Mission Description */}
          <div className="max-w-2xl mx-auto relative">
            <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-8">
              Whether you're looking to <span className="text-white">engineer the future</span> or optimize the present,
              our specialized crew is ready to navigate the complexities of your next digital venture.
            </p>

            {/* Sub-content badges */}
            <div className="flex flex-wrap justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <span className="flex items-center gap-2 border-r border-white/10 pr-4">
                <FaRocket className="text-orange-500" /> Rapid Deployment
              </span>
              <span className="flex items-center gap-2 border-r border-white/10 pr-4">
                <FaShieldAlt className="text-orange-500" /> Secure Protocols
              </span>
              <span className="flex items-center gap-2">
                <FaGlobe className="text-orange-500" /> Global Scale
              </span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              style={{ animationDelay: `${index * 100}ms` }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 transition-all duration-500 animate-zoom-in opacity-0 fill-mode-forwards"
            >
              <div className="flex justify-center mb-3">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="text-white text-lg" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Contact Info & Form */}
        <div className="grid lg:grid-cols-3 gap-12 mb-20">

          {/* Info Side */}
          <div className="lg:col-span-1 animate-slide-in-left">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-8">Get In Touch</h3>
            <div className="space-y-6">
              {contactInfo.map((item, idx) => (
                <a key={idx} href={item.link} className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl hover:bg-white/10 hover:border-orange-400/30 transition-all duration-300 group">
                  <div className={`bg-gradient-to-r ${item.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>{item.icon}</div>
                  <div>
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            {isSubmitted ? (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-8 text-center animate-zoom-in">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <FaCheckCircle className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">Thank You!</h3>
                <p className="text-green-300 mb-4">Your enquiry has been received. We'll contact you within 24 hours.</p>
                <button onClick={() => setIsSubmitted(false)} className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 active:scale-95 transition-all duration-300">
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">Start Your Project</h3>
                <p className="text-gray-400 mb-8">Fill out the form below and we'll get back to you shortly.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        placeholder="Full Name"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white outline-none transition-all
        ${emailError
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-700 focus:ring-orange-500"
                          }`}
                        placeholder="Email Address"
                        required
                      />

                      {emailError && (
                        <p className="text-red-400 text-xs mt-1 font-medium">
                          {emailError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="Phone Number" required />
                    <input type="text" name="company" value={formData.company} onChange={handleChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="Company Name" />
                  </div>
                  <textarea name="message" value={formData.message} onChange={handleChange} disabled={isSubmitting} rows={5} className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none" placeholder="Project Details" required />

                  <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 group relative overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><FaPaperPlane /> Send Enquiry</>}
                    </span>
                  </button>
                </form>
              </div>
            )}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-300 mb-4">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, idx) => (
                  <a key={idx} href={social.href} className={`bg-white/5 backdrop-blur-lg border border-white/10 p-3 rounded-lg ${social.color} hover:-translate-y-1 active:scale-95 transition-all duration-300 group relative overflow-hidden`}>
                    <social.icon className="text-white text-lg group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden border border-white/10 animate-fade-in-up fill-mode-forwards opacity-0" style={{ animationDelay: '0.4s' }}>
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 text-center">
            <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2"><FaMapMarkerAlt /> Our Location</h3>
          </div>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.114189307222!2d76.9732984750099!3d11.030058689134563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859d8466e5bd9%3A0x8490ce731b0f659f!2sMecatronix%20Software%20Development!5e0!3m2!1sen!2sin!4v1768823607767!5m2!1sen!2sin" allowfullscreen="" className="filter grayscale hover:grayscale-0 transition-all duration-500" loading="lazy" width="100%" height="400" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>

    </section>
  );
};

export default Openline;