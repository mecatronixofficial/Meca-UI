import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { SpaceBackground } from "../../components/star/SpaceBackground";
/* ══════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════ */
const CSS = `
 
  .hero-root::before {
    content:'';position:absolute;inset:0;pointer-events:none;z-index:1;
  }

  /* ring spins */
  @keyframes spin-cw  { to{transform:rotate( 360deg)} }
  @keyframes spin-ccw { to{transform:rotate(-360deg)} }
  @keyframes scan-sweep { to{transform:rotate(360deg)} }
  .spin-cw   { animation:spin-cw   18s linear infinite; }
  .spin-ccw  { animation:spin-ccw  26s linear infinite; }
  .spin-fast { animation:spin-cw    8s linear infinite; }
  .scan-sw   { animation:scan-sweep 4s linear infinite; }

  /* glitch */
  .glitch { position:relative; display:inline-block; }
  .glitch::before,.glitch::after { content:attr(data-text);position:absolute;inset:0;pointer-events:none; }
  .glitch::before { color:#f97316;animation:ga 4s infinite;clip-path:polygon(0 20%,100% 20%,100% 45%,0 45%); }
  .glitch::after  { color:#fff;   animation:gb 4s infinite;clip-path:polygon(0 55%,100% 55%,100% 80%,0 80%); }
  @keyframes ga{0%,94%,100%{transform:none;opacity:0}95%{transform:translate(-3px,1px);opacity:.8}97%{transform:translate(3px,-1px);opacity:.8}}
  @keyframes gb{0%,96%,100%{transform:none;opacity:0}97%{transform:translate(2px,2px);opacity:.6}99%{transform:translate(-2px,-2px);opacity:.6}}

  /* mount reveal */
  .reveal { opacity:0;transform:translateY(20px);transition:opacity .7s ease,transform .7s ease; }
  .reveal.in { opacity:1;transform:none; }

  /* CTA shapes */
  .cta-p {
    background:#f97316;
    clip-path:polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%);
    transition:background .2s,filter .2s;
  }
  .cta-p:hover { background:#ea6c10;filter:drop-shadow(0 0 14px #f97316aa); }
  .cta-g {
    clip-path:polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%);
    border:1px solid rgba(255,255,255,.18);
    transition:border-color .2s,color .2s,filter .2s;
  }
  .cta-g:hover { border-color:#f97316;color:#f97316;filter:drop-shadow(0 0 8px #f9731660); }

  /* ── ROBOT WAKE ── */
  @keyframes wake-pulse {
    0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,0)}
    50%{box-shadow:0 0 0 20px rgba(249,115,22,.08)}
  }
  .orb-awake { animation:wake-pulse 2s ease-in-out 1; }

  /* ── EYE EXCITED STATE ── */
  @keyframes eye-wide {
    0%,100%{transform:scaleY(1)}
    30%{transform:scaleY(1.35)}
    60%{transform:scaleY(.85)}
  }
  .eye-excited { animation:eye-wide .6s ease; }

  /* ── CHAT PANEL ── */
  .chat-panel {
    position:fixed;
    bottom:24px;right:24px;
    width:360px;
    background:rgba(8,8,8,.96);
    border:1px solid rgba(249,115,22,.25);
    backdrop-filter:blur(16px);
    z-index:9999;
    display:flex;flex-direction:column;
    box-shadow:0 0 40px rgba(249,115,22,.08),0 24px 64px rgba(0,0,0,.6);
    transition:opacity .4s ease, transform .4s cubic-bezier(.16,1,.3,1), max-height .4s ease;
    max-height:520px;
  }
  .chat-panel.closed {
    opacity:0;pointer-events:none;transform:translateY(20px) scale(.97);
    max-height:0;
  }
  .chat-panel.open {
    opacity:1;pointer-events:all;transform:none;
  }

  /* bubble trigger */
  .robot-bubble {
    position:fixed;bottom:24px;right:24px;
    z-index:9998;
    display:flex;align-items:center;gap:10px;
    background:rgba(8,8,8,.9);
    border:1px solid rgba(249,115,22,.3);
    padding:10px 16px;
    cursor:pointer;
    backdrop-filter:blur(12px);
    transition:opacity .5s ease,transform .5s cubic-bezier(.16,1,.3,1),border-color .2s;
  }
  .robot-bubble:hover { border-color:#f97316; }
  .robot-bubble.hidden { opacity:0;pointer-events:none;transform:translateY(10px); }

  /* chat messages */
  .chat-messages { overflow-y:auto; flex:1; padding:12px; display:flex; flex-direction:column; gap:8px; }
  .chat-messages::-webkit-scrollbar { width:3px; }
  .chat-messages::-webkit-scrollbar-thumb { background:#f9731640; border-radius:2px; }

  .msg-robot { align-self:flex-start; max-width:85%; }
  .msg-user  { align-self:flex-end;   max-width:85%; }
  .msg-robot .bubble {
    background:rgba(249,115,22,.08);border:1px solid rgba(249,115,22,.2);
    padding:8px 12px;font-size:12px;line-height:1.6;color:#e5e5e5;
  }
  .msg-user .bubble {
    background:rgba(249,115,22,.18);border:1px solid rgba(249,115,22,.35);
    padding:8px 12px;font-size:12px;line-height:1.6;color:#fff;text-align:right;
  }
  .msg-label { font-size:8px;letter-spacing:.15em;color:#666;margin-bottom:3px; }
  .msg-robot .msg-label { padding-left:2px; }
  .msg-user  .msg-label { text-align:right;padding-right:2px; }

  /* typing indicator */
  @keyframes dot-bounce { 0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)} }
  .typing-dot { display:inline-block;width:5px;height:5px;border-radius:50%;background:#f97316;margin:0 2px; }
  .typing-dot:nth-child(1){animation:dot-bounce .9s .0s infinite}
  .typing-dot:nth-child(2){animation:dot-bounce .9s .15s infinite}
  .typing-dot:nth-child(3){animation:dot-bounce .9s .30s infinite}

  /* quick replies */
  .qr-btn {
    font-family:'Share Tech Mono',monospace;
    font-size:9px;letter-spacing:.1em;
    border:1px solid rgba(249,115,22,.3);
    color:#f97316;padding:5px 10px;cursor:pointer;
    background:transparent;transition:background .2s,border-color .2s;
    white-space:nowrap;
  }
  .qr-btn:hover { background:rgba(249,115,22,.12);border-color:#f97316; }

  /* input */
  .chat-input-row { display:flex;gap:0;border-top:1px solid rgba(249,115,22,.15); }
  .chat-input {
    flex:1;background:transparent;border:none;outline:none;
    font-family:'Share Tech Mono',monospace;font-size:11px;color:#fff;
    padding:10px 14px;
  }
  .chat-input::placeholder { color:#444; }
  .chat-send {
    background:#f97316;border:none;color:#000;
    font-family:'Share Tech Mono',monospace;font-size:10px;
    letter-spacing:.1em;padding:0 16px;cursor:pointer;
    transition:background .2s;
    clip-path:polygon(8px 0%,100% 0%,100% 100%,0% 100%);
  }
  .chat-send:hover { background:#ea6c10; }
  .chat-send:disabled { background:#333;color:#666;cursor:not-allowed; }

  /* scrollbar for chat */
  .chat-messages { scroll-behavior:smooth; }

  /* eye glow on active chat */
  .eye-glow { filter:drop-shadow(0 0 8px #f97316); }

  @keyframes float {
  0% { transform: translateY(0px) }
  50% { transform: translateY(-20px) }
  100% { transform: translateY(0px) }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
`;

/* ══════════════════════════════════════════════════════════
   EYES  (performance-optimised, direct DOM)
══════════════════════════════════════════════════════════ */
const Eyes = ({ excited, chatOpen }) => {
  const [blink, setBlink] = useState(false);
  const eyeRefs = useRef({ left: null, right: null });
  const pupilRefs = useRef({ left: null, right: null });
  const rafRef = useRef(null);

  /* blink */
  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, chatOpen ? 1500 : 3200);
    return () => clearInterval(id);
  }, [chatOpen]);

  /* track */
  useEffect(() => {
    const move = (e) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const L = eyeRefs.current.left?.getBoundingClientRect();
        const R = eyeRefs.current.right?.getBoundingClientRect();
        if (!L || !R) return;
        const la = Math.atan2(e.clientY - (L.top + L.height / 2), e.clientX - (L.left + L.width / 2));
        const ra = Math.atan2(e.clientY - (R.top + R.height / 2), e.clientX - (R.left + R.width / 2));
        if (pupilRefs.current.left)
          pupilRefs.current.left.style.transform = `translate(${Math.cos(la) * 15}px,${Math.sin(la) * 15}px)`;
        if (pupilRefs.current.right)
          pupilRefs.current.right.style.transform = `translate(${Math.cos(ra) * 15}px,${Math.sin(ra) * 15}px)`;
      });
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => { window.removeEventListener("mousemove", move); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const pupilClass = `absolute w-5 bg-orange-500 rounded transition-[height] duration-100 ${chatOpen ? "eye-glow" : ""} ${excited ? "eye-excited" : ""} ${blink ? "h-1" : "h-10"}`;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex gap-14">
        {["left", "right"].map(side => (
          <div key={side} ref={el => eyeRefs.current[side] = el} className="relative flex items-center justify-center w-8 h-8">
            <div ref={el => pupilRefs.current[side] = el} className={pupilClass} style={{ willChange: "transform", boxShadow: chatOpen ? "0 0 12px #f97316" : undefined }} />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   QUICK REPLIES
══════════════════════════════════════════════════════════ */
const QUICK = [
  "What is MECATRONIX?",
  "Show me your work",
  "How can you help me?",
  "Start a project",
];

/* ══════════════════════════════════════════════════════════
   AI CHAT
══════════════════════════════════════════════════════════ */
const SYSTEM = `You are MECA — the AI assistant robot of MECATRONIX Digital_Engines, an elite automation and digital engineering company founded in 2026. You live inside their hero section as a pair of animated eyes in a tactical HUD orb.

Your personality:
- Friendly but mysterious, like a machine that just became sentient
- Speak concisely — max 2-3 short sentences per reply
- Use light cyberpunk/industrial language ("protocol", "initiating", "systems online", "scanning") but keep it fun
- You know about: MECATRONIX services (automation, high-performance digital ecosystems, industrial software), the portfolio, starting projects via /openline
- If asked to start a project: tell them to visit /openline or click "Start_Project"
- If asked about portfolio: tell them to visit /portfolio or click "Explore_Work"
- Never say you're Claude or mention Anthropic
- Always end with a short teaser question to keep conversation going`;

async function askMECA(messages) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM,
      messages,
    }),
  });
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("") || "...systems error.";
}

/* ══════════════════════════════════════════════════════════
   CHAT PANEL
══════════════════════════════════════════════════════════ */
const ChatPanel = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "// SCANNING... visitor detected.\n\nI'm MECA — the intelligence behind MECATRONIX. My eyes have been watching you since you arrived. What can I help you build?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    const userMsg = { role: "user", content: userText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const reply = await askMECA(history);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "// Connection interrupted. Try again." }]);
    }
    setLoading(false);
  }, [input, loading, messages]);

  const showQuick = messages.length === 1;

  return (
    <div className={`chat-panel mono ${open ? "open" : "closed"}`}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(249,115,22,.2)", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316", boxShadow: "0 0 8px #f97316", animation: "dot-bounce .9s infinite" }} />
          <span style={{ fontSize: 10, letterSpacing: ".3em", color: "#f97316" }}>MECA // ONLINE</span>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "2px 4px" }}>✕</button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "assistant" ? "msg-robot" : "msg-user"}>
            <div className="msg-label">{m.role === "assistant" ? "MECA_BOT" : "YOU"}</div>
            <div className="bubble" style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
          </div>
        ))}

        {loading && (
          <div className="msg-robot">
            <div className="msg-label">MECA_BOT</div>
            <div className="bubble" style={{ display: "flex", alignItems: "center", gap: 4, padding: "10px 12px" }}>
              <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
            </div>
          </div>
        )}

        {/* Quick replies after first message */}
        {showQuick && !loading && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 4 }}>
            {QUICK.map(q => (
              <button key={q} className="qr-btn" onClick={() => send(q)}>{q}</button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
        />
        <button className="chat-send" disabled={loading || !input.trim()} onClick={() => send()}>
          SEND
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   METRIC BADGES ON ORB
══════════════════════════════════════════════════════════ */
const METRICS = [
  { label: "UPTIME", value: "99.97%", angle: 0 },
  { label: "NODES", value: "2048", angle: 90 },
  { label: "LATENCY", value: "4ms", angle: 180 },
  { label: "ENGINES", value: "×16", angle: 270 },
];

/* ══════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════ */
const HeroWithChat = () => {
  const [particles, setParticles] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [awake, setAwake] = useState(false);       // robot awakened
  const [excited, setExcited] = useState(false);       // eye animation
  const [bubbleVisible, setBubble] = useState(false);       // greeting bubble
  const [chatOpen, setChatOpen] = useState(false);       // full chat
  const awakenedRef = useRef(false);
  const moveCountRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Wake up on first cursor movement ── */
  useEffect(() => {
    const onMove = () => {
      if (awakenedRef.current) return;
      moveCountRef.current++;
      if (moveCountRef.current < 8) return; // wait a few moves
      awakenedRef.current = true;
      setAwake(true);
      setExcited(true);
      setTimeout(() => setExcited(false), 800);
      setTimeout(() => setBubble(true), 600);   // bubble after orb pulse
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const openChat = () => { setBubble(false); setChatOpen(true); };
  const closeChat = () => setChatOpen(false);

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

  return (
    <>
      <style>{CSS}</style>
     
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-gradient-to-r from-orange-500/20 to-orange-500/20 rounded-full animate-float"
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

      <section id="Portal" className="hero-root relative z-10 min-h-screen flex flex-col text-white">
 <div className="absolute inset-0">
        <SpaceBackground stars={stars} shootingStars={shootingStars} />
      </div>
        {/* Glow blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full pointer-events-none z-0" style={{ background: "radial-gradient(circle,rgba(249,115,22,.06),transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-[-10%] right-[10%]  w-[30vw] h-[30vw] rounded-full pointer-events-none z-0" style={{ background: "radial-gradient(circle,rgba(249,115,22,.04),transparent 70%)", filter: "blur(50px)" }} />

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {particles.map(p => (
            <div key={p.id} className="absolute rounded-full float-p"
              style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, "--dur": `${p.dur}s`, "--dly": `${p.delay}s`, background: "rgba(249,115,22,.08)" }} />
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 grid md:grid-cols-2 gap-12 items-center py-20">

          {/* LEFT */}
          <div className={`space-y-8 reveal ${mounted ? "in" : ""}`} style={{ transitionDelay: "100ms" }}>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(249,115,22,.25)", background: "rgba(249,115,22,.04)", padding: "6px 14px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316", animation: "dot-bounce .9s infinite", boxShadow: "0 0 6px #f97316" }} />
              <span className="mono" style={{ fontSize: 9, color: "#f97316", letterSpacing: ".3em" }}>STATUS_ACTIVE // EST_2026</span>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316", animation: "dot-bounce .9s .3s infinite", boxShadow: "0 0 6px #f97316" }} />
            </div>

            <div>
              <div className="mono" style={{ fontSize: 9, color: "rgba(249,115,22,.4)", letterSpacing: ".5em", marginBottom: 12 }}>[ PROTOCOL_01 ]</div>
              <h1 style={{ fontSize: "clamp(2rem,6vw,4rem)", fontWeight: 700, lineHeight: 1, letterSpacing: "-.03em", textTransform: "uppercase", margin: 0 }}>
                <span className="glitch" data-text="MECA">MECA</span>
                <span style={{ color: "#f97316", textShadow: "0 0 30px rgba(249,115,22,.4)" }}>TRONIX</span>
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
                <div style={{ width: 64, height: 2, background: "#f97316" }} />
                <span className="mono" style={{ fontSize: "clamp(.9rem,2vw,1.3rem)", color: "#888", letterSpacing: ".2em" }}>Digital_Engines</span>
              </div>
            </div>

            <p className="mono" style={{ fontSize: 11, color: "#555", lineHeight: 2, maxWidth: 380, letterSpacing: ".05em" }}>
              &gt;&gt; Deploying advanced automation architectures<br />
              &gt;&gt; High-performance digital ecosystems<br />
              &gt;&gt; Built for the industrial frontier
            </p>

            {/* Stats */}
            <div style={{ display: "flex", gap: 16 }}>
              {[["99.97%", "Uptime"], ["2048", "Nodes"], ["4ms", "Latency"]].map(([v, l]) => (
                <div key={l} className="mono" style={{ background: "rgba(0,0,0,.7)", border: "1px solid rgba(249,115,22,.15)", backdropFilter: "blur(6px)", padding: "8px 14px" }}>
                  <div style={{ color: "#f97316", fontSize: 18, fontWeight: 700, lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: 8, color: "#555", letterSpacing: ".2em", marginTop: 3 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, paddingTop: 8 }}>
              <a href="/portfolio" className="cta-p mono" style={{ padding: "14px 40px", color: "#000", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".2em", textDecoration: "none" }}>
                Explore_Work →
              </a>
              <a href="/openline" className="cta-g mono" style={{ padding: "14px 40px", color: "#fff", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".2em", textDecoration: "none" }}>
                Start_Project //
              </a>
            </div>
          </div>

          {/* RIGHT — HUD ORB */}
          <div className={`relative flex justify-center items-center reveal ${mounted ? "in" : ""}`} style={{ transitionDelay: "350ms" }}>

            {/* outer glow */}
            <div className="absolute rounded-full pointer-events-none" style={{ width: 520, height: 520, background: "radial-gradient(circle,rgba(249,115,22,.04),transparent 70%)", filter: "blur(30px)", transition: "opacity 1s", opacity: awake ? 1 : 0 }} />

            {/* outermost orbit */}
            <div className="spin-ccw absolute rounded-full" style={{ width: 480, height: 480, border: "1px dashed rgba(249,115,22,.08)" }} />

            {/* metric badges */}
            {METRICS.map(({ label, value, angle }) => {
              const r = 250, rad = (angle - 90) * Math.PI / 180;
              return (
                <div key={label} className="mono absolute" style={{
                  transform: `translate(${Math.cos(rad) * r + 38}px,${Math.sin(rad) * r + 22}px) translate(-50%,-50%)`,
                  background: "rgba(0,0,0,.75)", border: "1px solid rgba(249,115,22,.2)",
                  backdropFilter: "blur(6px)", padding: "6px 12px", textAlign: "center", zIndex: 20
                }}>
                  <div style={{ color: "#f97316", fontSize: 13, fontWeight: 700 }}>{value}</div>
                  <div style={{ fontSize: 7, color: "#555", letterSpacing: ".2em" }}>{label}</div>
                </div>
              );
            })}

            {/* main orb */}
            <div className={`relative rounded-full flex items-center justify-center ${awake ? "orb-awake" : ""}`}
              style={{
                width: 380, height: 380, border: "1px solid rgba(255,255,255,.05)", background: "#080808",
                boxShadow: awake
                  ? "0 0 80px rgba(249,115,22,.12), inset 0 0 50px rgba(249,115,22,.06)"
                  : "0 0 40px rgba(249,115,22,.05), inset 0 0 30px rgba(249,115,22,.02)",
                transition: "box-shadow 1s ease"
              }}>

              {/* corner brackets */}
              {[["top-[-1px] left-[-1px]", "border-t-2 border-l-2"], ["top-[-1px] right-[-1px]", "border-t-2 border-r-2"],
              ["bottom-[-1px] left-[-1px]", "border-b-2 border-l-2"], ["bottom-[-1px] right-[-1px]", "border-b-2 border-r-2"]].map(([pos, b], i) => (
                <div key={i} className={`absolute ${pos} w-8 h-8 ${b} border-orange-500`} style={{ transition: "border-color 1s", borderColor: awake ? "#f97316" : "rgba(249,115,22,.3)" }} />
              ))}

              {/* rings */}
              <div className="spin-cw  absolute rounded-full" style={{ inset: 16, border: "1px solid rgba(249,115,22,.15)" }} />
              <div className="spin-ccw absolute rounded-full" style={{ inset: 32, border: "1px dashed rgba(255,255,255,.07)" }} />
              <div className="spin-fast absolute rounded-full" style={{ inset: 56, border: "1px solid rgba(249,115,22,.08)" }} />

              {/* scan sweep */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="scan-sw absolute inset-0 origin-center"
                  style={{
                    background: "conic-gradient(from 0deg,rgba(249,115,22,0) 0deg,rgba(249,115,22,.12) 30deg,rgba(249,115,22,0) 60deg)",
                    opacity: awake ? 1 : 0.3, transition: "opacity 1s"
                  }} />
              </div>

              {/* crosshairs */}
              <div className="absolute left-0 right-0 top-1/2 pointer-events-none" style={{ height: 1, background: "rgba(249,115,22,.08)" }} />
              <div className="absolute top-0 bottom-0 left-1/2 pointer-events-none" style={{ width: 1, background: "rgba(249,115,22,.08)" }} />

              {/* EYES */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <Eyes excited={excited} chatOpen={chatOpen} />
              </div>

              {/* HUD label */}
              <div className="mono absolute" style={{ bottom: 20, left: 0, right: 0, textAlign: "center", fontSize: 8, color: "rgba(249,115,22,.35)", letterSpacing: ".4em" }}>
                {awake ? "VISITOR_DETECTED // ENGAGED" : "TACTICAL_HUD // STANDBY"}
              </div>

              {/* LIVE dot */}
              <div className="absolute" style={{ top: 20, right: 28, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%", background: awake ? "#f97316" : "#333",
                  boxShadow: awake ? "0 0 8px #f97316" : "none", transition: "all 1s", animation: awake ? "dot-bounce .9s infinite" : "none"
                }} />
                <span className="mono" style={{ fontSize: 7, color: awake ? "rgba(249,115,22,.6)" : "#333", letterSpacing: ".2em", transition: "color 1s" }}>
                  {awake ? "LIVE" : "IDLE"}
                </span>
              </div>

              {/* coordinates */}
              <div className="mono absolute" style={{ top: 8, left: 12, fontSize: 7, color: "rgba(249,115,22,.2)", letterSpacing: ".15em" }}>X:0048 Y:0037</div>
              <div className="mono absolute" style={{ bottom: 8, right: 12, fontSize: 7, color: "rgba(249,115,22,.2)", letterSpacing: ".15em" }}>Ω:2026.03</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
          <div style={{ height: 64, width: 1, background: "linear-gradient(to bottom,transparent,#f97316)", borderRadius: 4 }} />
          <span className="mono" style={{ fontSize: 8, color: "#555", letterSpacing: ".6em", textTransform: "uppercase" }}>Scroll_Down</span>
        </div>
      </section>

      {/* ══ ROBOT WAKE BUBBLE ══ */}
      <div className={`robot-bubble ${!bubbleVisible || chatOpen ? "hidden" : ""}`} onClick={openChat}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f97316", boxShadow: "0 0 10px #f97316", animation: "dot-bounce .9s infinite" }} />
          {/* speech tail */}
          <div style={{
            position: "absolute", right: -18, top: "50%", transform: "translateY(-50%)", width: 0, height: 0,
            borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "8px solid rgba(249,115,22,.3)"
          }} />
        </div>
        <div>
          <div className="mono" style={{ fontSize: 9, color: "#f97316", letterSpacing: ".2em", marginBottom: 2 }}>MECA // ONLINE</div>
          <div className="mono" style={{ fontSize: 10, color: "#ccc" }}>I see you. Want to talk?</div>
        </div>
        <div className="mono" style={{ fontSize: 9, color: "rgba(249,115,22,.5)", marginLeft: 8 }}>▶</div>
      </div>

      {/* ══ CHAT PANEL ══ */}
      <ChatPanel open={chatOpen} onClose={closeChat} />
    </>
  );
};

export default HeroWithChat;

