"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import Link from "next/link";
import type { Particle } from "../../types/space";

/* =========================================================
   CSS
========================================================= */

const CSS = `
  @keyframes spin-cw {
    to { transform: rotate(360deg); }
  }

  @keyframes spin-ccw {
    to { transform: rotate(-360deg); }
  }

  @keyframes scan {
    to { transform: rotate(360deg); }
  }

  @keyframes pulse-ring {
    0%, 100% {
      box-shadow:
        0 0 0 0 rgba(249,115,22,0),
        inset 0 0 25px rgba(249,115,22,.03);
    }

    50% {
      box-shadow:
        0 0 0 15px rgba(249,115,22,.035),
        inset 0 0 50px rgba(249,115,22,.07);
    }
  }

  @keyframes eye-wide {
    0%, 100% { transform: scaleY(1); }
    40% { transform: scaleY(1.25); }
    70% { transform: scaleY(.8); }
  }

  @keyframes dot {
    0%, 80%, 100% {
      transform: translateY(0);
    }

    40% {
      transform: translateY(-4px);
    }
  }

  @keyframes float-particle {
    0%, 100% {
      transform: translate3d(0,0,0);
    }

    50% {
      transform: translate3d(0,-14px,0);
    }
  }

  @keyframes glass-shine {
    from { left: -80%; }
    to { left: 160%; }
  }

  .spin-cw {
    animation: spin-cw 20s linear infinite;
  }

  .spin-ccw {
    animation: spin-ccw 28s linear infinite;
  }

  .spin-fast {
    animation: spin-cw 10s linear infinite;
  }

  .scan-animation {
    animation: scan 5s linear infinite;
  }

  .orb-awake {
    animation: pulse-ring 2.4s ease-in-out;
  }

  .eye-excited {
    animation: eye-wide .65s ease;
  }

  .typing-dot {
    width: 5px;
    height: 5px;
    border-radius: 999px;
    background: #f97316;
    display: inline-block;
  }

  .typing-dot:nth-child(1) {
    animation: dot .9s 0s infinite;
  }

  .typing-dot:nth-child(2) {
    animation: dot .9s .15s infinite;
  }

  .typing-dot:nth-child(3) {
    animation: dot .9s .30s infinite;
  }

  .hero-particle {
    animation: float-particle var(--duration) ease-in-out infinite;
    animation-delay: var(--delay);
  }

  .glass-shine:hover::after {
    content: "";
    position: absolute;
    top: 0;
    left: -80%;
    width: 45%;
    height: 100%;
    transform: skewX(-25deg);
    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(255,255,255,.10),
        transparent
      );
    animation: glass-shine .8s ease;
  }

  .meca-scrollbar::-webkit-scrollbar {
    width: 4px;
  }

  .meca-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .meca-scrollbar::-webkit-scrollbar-thumb {
    border-radius: 20px;
    background: rgba(249,115,22,.25);
  }
`;

/* =========================================================
   EYES
========================================================= */

const Eyes = ({
  excited,
  chatOpen,
}: {
  excited: boolean;
  chatOpen: boolean;
}) => {
  const [blink, setBlink] = useState(false);

  const eyeRefs = useRef<{
    left: HTMLDivElement | null;
    right: HTMLDivElement | null;
  }>({
    left: null,
    right: null,
  });

  const pupilRefs = useRef<{
    left: HTMLDivElement | null;
    right: HTMLDivElement | null;
  }>({
    left: null,
    right: null,
  });

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(
      () => {
        setBlink(true);

        setTimeout(() => {
          setBlink(false);
        }, 170);
      },
      chatOpen ? 1800 : 3400,
    );

    return () => clearInterval(timer);
  }, [chatOpen]);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;

        const left = eyeRefs.current.left?.getBoundingClientRect();

        const right = eyeRefs.current.right?.getBoundingClientRect();

        if (!left || !right) return;

        const leftAngle = Math.atan2(
          event.clientY - (left.top + left.height / 2),
          event.clientX - (left.left + left.width / 2),
        );

        const rightAngle = Math.atan2(
          event.clientY - (right.top + right.height / 2),
          event.clientX - (right.left + right.width / 2),
        );

        const movement = 10;

        if (pupilRefs.current.left) {
          pupilRefs.current.left.style.transform = `
            translate(
              ${Math.cos(leftAngle) * movement}px,
              ${Math.sin(leftAngle) * movement}px
            )
          `;
        }

        if (pupilRefs.current.right) {
          pupilRefs.current.right.style.transform = `
            translate(
              ${Math.cos(rightAngle) * movement}px,
              ${Math.sin(rightAngle) * movement}px
            )
          `;
        }
      });
    };

    window.addEventListener("mousemove", handleMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("mousemove", handleMove);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex gap-10 sm:gap-12">
        {(["left", "right"] as const).map((side) => (
          <div
            key={side}
            ref={(el) => {
              eyeRefs.current[side] = el;
            }}
            className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
              "
          >
            <div
              ref={(el) => {
                pupilRefs.current[side] = el;
              }}
              className={`
                  w-[14px]
                  rounded-full
                  bg-orange-500
                  transition-[height]
                  duration-100

                  ${blink ? "h-[3px]" : "h-[34px]"}

                  ${excited ? "eye-excited" : ""}
                `}
              style={{
                willChange: "transform",
                boxShadow: chatOpen
                  ? "0 0 16px rgba(249,115,22,1)"
                  : "0 0 9px rgba(249,115,22,.65)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================
   ROBOT HEAD (3D, follows cursor, drag to spin)
========================================================= */

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const FOLLOW_TRANSITION = "transform .35s cubic-bezier(.2,.8,.2,1)";
const RELEASE_TRANSITION = "transform .9s cubic-bezier(.16,1,.3,1)";

const RobotHead = ({
  awake,
  excited,
  chatOpen,
}: {
  awake: boolean;
  excited: boolean;
  chatOpen: boolean;
}) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const headRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // x/y = tilt from cursor, spin = extra Y rotation from dragging
  const rot = useRef({ x: 0, y: 0, spin: 0 });
  const drag = useRef({ active: false, startX: 0, baseSpin: 0 });

  const apply = () => {
    const head = headRef.current;
    if (!head) return;
    const { x, y, spin } = rot.current;
    head.style.transform = `rotateX(${x}deg) rotateY(${y + spin}deg)`;
  };

  // Tilt towards the cursor
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleMove = (event: MouseEvent) => {
      if (drag.current.active || rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const stage = stageRef.current;
        if (!stage) return;

        const rect = stage.getBoundingClientRect();
        const dx =
          (event.clientX - (rect.left + rect.width / 2)) /
          (window.innerWidth / 2);
        const dy =
          (event.clientY - (rect.top + rect.height / 2)) /
          (window.innerHeight / 2);

        rot.current.y = clamp(dx * 30, -30, 30);
        rot.current.x = clamp(-dy * 18, -18, 18);
        apply();
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resetRef.current) clearTimeout(resetRef.current);
    };
  }, []);

  // Drag to spin
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (resetRef.current) clearTimeout(resetRef.current);
    drag.current = {
      active: true,
      startX: event.clientX,
      baseSpin: rot.current.spin,
    };
    if (headRef.current) headRef.current.style.transition = "none";
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    rot.current.spin =
      drag.current.baseSpin + (event.clientX - drag.current.startX) * 0.9;
    apply();
  };

  const onPointerUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;

    const head = headRef.current;
    if (!head) return;

    // Settle on the nearest full turn so the face ends up facing forward
    head.style.transition = RELEASE_TRANSITION;
    rot.current.spin = Math.round(rot.current.spin / 360) * 360;
    apply();

    // Then silently normalise back to 0 and restore the follow easing
    resetRef.current = setTimeout(() => {
      head.style.transition = "none";
      rot.current.spin = 0;
      apply();
      requestAnimationFrame(() => {
        head.style.transition = FOLLOW_TRANSITION;
      });
    }, 950);
  };

  // Layers stacked behind the face to give the shell visible thickness
  const DEPTH = [6, 12, 18, 24];

  return (
    <div ref={stageRef} className="relative [perspective:900px]">
      <div
        ref={headRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="img"
        aria-label="MECA robot head. Drag to rotate."
        className="relative cursor-grab touch-none select-none active:cursor-grabbing [transform-style:preserve-3d]"
        style={{ transition: FOLLOW_TRANSITION, willChange: "transform" }}
      >
        {/* antenna */}
        <div className="absolute -top-9 left-1/2 flex -translate-x-1/2 flex-col items-center [transform:translateZ(-12px)]">
          <span
            className={`h-4 w-4 rounded-full bg-orange-500 ${awake ? "animate-pulse shadow-[0_0_18px_#f97316]" : "opacity-60"}`}
          />
          <span className="h-6 w-[3px] rounded-full bg-gradient-to-b from-orange-500/80 to-white/20" />
        </div>

        {/* ears */}
        <span className="absolute -left-4 top-1/2 h-12 w-4 -translate-y-1/2 rounded-l-2xl bg-gradient-to-b from-orange-400 to-orange-600 [transform:translateZ(-12px)]" />
        <span className="absolute -right-4 top-1/2 h-12 w-4 -translate-y-1/2 rounded-r-2xl bg-gradient-to-b from-cyan-300 to-cyan-500 [transform:translateZ(-12px)]" />

        {/* shell depth */}
        {DEPTH.map((z) => (
          <span
            key={z}
            className="absolute inset-0 rounded-[2.6rem] border border-orange-500/10 bg-[#1a0d05]"
            style={{ transform: `translateZ(-${z}px)` }}
          />
        ))}

        {/* face */}
        <div
          className={`relative h-[160px] w-[215px] rounded-[2.6rem] border border-white/20 bg-gradient-to-b from-[#2b1a10] to-[#120a05] shadow-[0_25px_60px_rgba(0,0,0,.55)] [transform-style:preserve-3d] sm:h-[175px] sm:w-[235px] ${awake ? "orb-awake" : ""}`}
        >
          {/* rim light */}
          <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

          {/* visor */}
          <div className="absolute inset-3.5 overflow-hidden rounded-[2rem] border border-orange-500/30 bg-black shadow-[inset_0_0_30px_rgba(249,115,22,.18)] [transform:translateZ(10px)]">
            <div
              className="scan-animation absolute inset-[-50%]"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(249,115,22,.16) 30deg, transparent 60deg)",
              }}
            />
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent" />
            <div className="relative z-10 h-full">
              <Eyes excited={excited} chatOpen={chatOpen} />
            </div>
          </div>

          {/* chin light */}
          <span className="absolute bottom-1.5 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-orange-500/70 [transform:translateZ(6px)]" />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   CHAT
========================================================= */

const QUICK = [
  "What is MECATRONIX?",
  "Show me your work",
  "How can you help me?",
  "Start a project",
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM = `
You are MECA, the AI assistant of MECATRONIX.

Keep replies concise and friendly.
MECATRONIX provides software development,
automation, digital systems and industrial software.

Portfolio: /portfolio
Start Project: /openline

Use light futuristic language without making
responses difficult to understand.
`;

/*
 IMPORTANT:
 Keep your existing AI implementation here if
 your backend already handles this request.

 Prefer calling your own /api route instead of
 exposing provider credentials in client code.
*/

async function askMECA(messages: ChatMessage[]) {
  const response = await fetch("/api/meca", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      system: SYSTEM,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error("AI request failed");
  }

  const data = await response.json();

  return data.reply || data.content || "Systems temporarily unavailable.";
}

/* =========================================================
   CHAT PANEL
========================================================= */

const ChatPanel = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Visitor detected. I'm MECA — the intelligence layer behind MECATRONIX. What can we build?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const send = useCallback(
    async (text?: string) => {
      const userText = text || input.trim();

      if (!userText || loading) return;

      const userMessage: ChatMessage = {
        role: "user",
        content: userText,
      };

      setInput("");

      setMessages((prev) => [...prev, userMessage]);

      setLoading(true);

      try {
        const history = [...messages, userMessage];

        const reply = await askMECA(history);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: reply,
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Connection interrupted. Please try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages],
  );

  const showQuick = messages.length === 1;

  return (
    <div
      className={`
        fixed
        bottom-4
        right-4
        z-[9999]
        flex
        w-[calc(100%-32px)]
        max-w-[360px]
        flex-col
        overflow-hidden
        rounded-[24px]
        border
        border-white/[0.10]
        bg-[#090909]/80
        shadow-[0_30px_90px_rgba(0,0,0,.65)]
        backdrop-blur-[28px]
        transition-all
        duration-500

        sm:bottom-6
        sm:right-6

        ${
          open
            ? `
              pointer-events-auto
              translate-y-0
              scale-100
              opacity-100
            `
            : `
              pointer-events-none
              translate-y-5
              scale-[.97]
              opacity-0
            `
        }
      `}
    >
      {/* glass highlight */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-8
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/40
          to-transparent
        "
      />

      {/* CHAT HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-white/[0.07]
          px-4
          py-3
        "
      >
        <div
          className="
            flex
            items-center
            gap-2.5
          "
        >
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-[10px]
              border
              border-orange-500/20
              bg-orange-500/[0.07]
            "
          >
            <span
              className="
                h-[6px]
                w-[6px]
                animate-pulse
                rounded-full
                bg-orange-500
                shadow-[0_0_8px_#f97316]
              "
            />
          </div>

          <div>
            <div
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-white
              "
            >
              MECA
            </div>

            <div
              className="
                mt-[2px]
                text-[6px]
                uppercase
                tracking-[0.18em]
                text-orange-400
              "
            >
              AI SYSTEM ONLINE
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-[9px]
            border
            border-white/[0.06]
            bg-white/[0.035]
            text-[12px]
            text-white/40
            transition-all

            hover:bg-white/[0.07]
            hover:text-white
          "
        >
          ✕
        </button>
      </div>

      {/* MESSAGES */}

      <div
        className="
          meca-scrollbar
          flex
          max-h-[330px]
          min-h-[260px]
          flex-col
          gap-3
          overflow-y-auto
          p-3
        "
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`
              max-w-[85%]

              ${message.role === "assistant" ? "self-start" : "self-end"}
            `}
          >
            <div
              className={`
                mb-1
                text-[6px]
                uppercase
                tracking-[0.14em]
                text-white/20

                ${message.role === "user" ? "text-right" : ""}
              `}
            >
              {message.role === "assistant" ? "MECA" : "YOU"}
            </div>

            <div
              className={`
                rounded-[14px]
                border
                px-3
                py-2.5
                text-[10px]
                leading-[1.6]

                ${
                  message.role === "assistant"
                    ? `
                      rounded-tl-[4px]
                      border-white/[0.07]
                      bg-white/[0.035]
                      text-white/65
                    `
                    : `
                      rounded-tr-[4px]
                      border-orange-500/20
                      bg-orange-500/[0.09]
                      text-white
                    `
                }
              `}
            >
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="self-start">
            <div
              className="
                rounded-[13px]
                border
                border-orange-500/15
                bg-orange-500/[0.05]
                px-3
                py-3
              "
            >
              <div className="flex gap-1">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        {showQuick && !loading && (
          <div
            className="
              flex
              flex-wrap
              gap-1.5
            "
          >
            {QUICK.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => send(item)}
                className="
                  rounded-full
                  border
                  border-orange-500/15
                  bg-orange-500/[0.04]
                  px-2.5
                  py-1.5
                  text-[7px]
                  font-semibold
                  text-orange-400
                  transition-all

                  hover:border-orange-500/30
                  hover:bg-orange-500/[0.08]
                "
              >
                {item}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}

      <div
        className="
          border-t
          border-white/[0.07]
          p-2
        "
      >
        <div
          className="
            flex
            items-center
            rounded-[13px]
            border
            border-white/[0.07]
            bg-black/20
            p-1.5

            focus-within:border-orange-500/25
          "
        >
          <input
            value={input}
            placeholder="Ask MECA..."
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                send();
              }
            }}
            className="
              min-w-0
              flex-1
              bg-transparent
              px-2
              text-[10px]
              text-white
              outline-none
              placeholder:text-white/20
            "
          />

          <button
            type="button"
            disabled={loading || !input.trim()}
            onClick={() => send()}
            className="
              h-8
              rounded-[9px]
              bg-orange-500
              px-3
              text-[7px]
              font-black
              uppercase
              tracking-wider
              text-black

              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   METRICS
========================================================= */

const METRICS = [
  {
    label: "UPTIME",
    value: "99.97%",
  },
  {
    label: "SYSTEMS",
    value: "24/7",
  },
  {
    label: "RESPONSE",
    value: "<1s",
  },
];

/* =========================================================
   HERO
========================================================= */

const HeroWithChat = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const [awake, setAwake] = useState(false);

  const [excited, setExcited] = useState(false);

  const [bubbleVisible, setBubbleVisible] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);

  const awakenedRef = useRef(false);

  const moveCountRef = useRef(0);

  /* PARTICLES */

  useEffect(() => {
    setParticles(
      Array.from({
        length: 12,
      }).map((_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 8 + 3,
        delay: Math.random() * 4,
        duration: Math.random() * 5 + 5,
      })),
    );
  }, []);

  /* ROBOT WAKE */

  useEffect(() => {
    const handleMove = () => {
      if (awakenedRef.current) {
        return;
      }

      moveCountRef.current += 1;

      if (moveCountRef.current < 6) {
        return;
      }

      awakenedRef.current = true;

      setAwake(true);
      setExcited(true);

      setTimeout(() => {
        setExcited(false);
      }, 700);

      setTimeout(() => {
        setBubbleVisible(true);
      }, 900);
    };

    window.addEventListener("mousemove", handleMove, {
      passive: true,
    });

    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const openChat = () => {
    setBubbleVisible(false);
    setChatOpen(true);
  };

  return (
    <>
      <style>{CSS}</style>

      <section
        id="Portal"
        className="
          relative
          min-h-[100svh]
          overflow-hidden
          px-3
          pb-8
          pt-[92px]
          text-white

          sm:px-4
          lg:px-6
          lg:pt-[105px]
        "
      >
        {/* BACKGROUND RADIALS */}

        <div
          className="
            pointer-events-none
            absolute
            left-[-10%]
            top-[5%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-orange-500/[0.06]
            blur-[130px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            bottom-[-20%]
            right-[5%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-orange-600/[0.04]
            blur-[150px]
          "
        />

        {/* GLASS GRID */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.018]
            bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
            bg-[size:28px_28px]
          "
        />

        {/* PARTICLES */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            overflow-hidden
          "
        >
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="
                  hero-particle
                  absolute
                  rounded-full
                  bg-orange-500/20
                  blur-[1px]
                "
              style={
                {
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  width: particle.size,
                  height: particle.size,
                  "--duration": `${particle.duration}s`,
                  "--delay": `${particle.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* =================================
            MAIN FLOATING GLASS PANEL
        ================================= */}

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-[1420px]
            overflow-hidden
            rounded-[28px]
            border
            border-white/[0.08]
            bg-white/[0.025]
            shadow-[0_30px_100px_rgba(0,0,0,.45)]
            backdrop-blur-[18px]
          "
        >
          {/* top reflection */}

          <div
            className="
              pointer-events-none
              absolute
              left-[10%]
              right-[10%]
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-white/40
              to-transparent
            "
          />

          <div
            className="
              grid
              min-h-[610px]
              items-center
              gap-10
              px-5
              py-10

              sm:px-8

              lg:grid-cols-[1.05fr_.95fr]
              lg:gap-8
              lg:px-12
              lg:py-8

              xl:min-h-[650px]
              xl:px-16
            "
          >
            {/* ===========================
                LEFT
            =========================== */}

            <div
              className="
                relative
                z-20
                max-w-[640px]
              "
            >
              {/* STATUS */}

              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-orange-500/20
                  bg-orange-500/[0.055]
                  px-3
                  py-2
                  backdrop-blur-xl
                "
              >
                <span className="relative flex h-[6px] w-[6px]">
                  <span
                    className="
                      absolute
                      inline-flex
                      h-full
                      w-full
                      animate-ping
                      rounded-full
                      bg-orange-500
                      opacity-50
                    "
                  />

                  <span
                    className="
                      relative
                      h-[6px]
                      w-[6px]
                      rounded-full
                      bg-orange-500
                    "
                  />
                </span>

                <span
                  className="
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-[0.22em]
                    text-orange-400
                  "
                >
                  Digital Systems Online
                </span>

                <span
                  className="
                    text-[7px]
                    text-white/20
                  "
                >
                  /
                </span>

                <span
                  className="
                    text-[7px]
                    uppercase
                    tracking-[0.16em]
                    text-white/30
                  "
                >
                  EST 2026
                </span>
              </div>

              {/* HEADING */}

              <div>
                <p
                  className="
                    mb-3
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.28em]
                    text-white/25
                  "
                >
                  Software • Automation • Digital Engineering
                </p>

                <h1
                  className="
                    max-w-[620px]
                    text-[clamp(2.8rem,6vw,5.7rem)]
                    font-black
                    uppercase
                    leading-[0.86]
                    tracking-[-0.055em]
                  "
                >
                  <span className="text-white">MECA</span>

                  <span
                    className="
                      bg-gradient-to-br
                      from-orange-400
                      via-orange-500
                      to-orange-700
                      bg-clip-text
                      text-transparent
                      drop-shadow-[0_0_30px_rgba(249,115,22,.16)]
                    "
                  >
                    TRONIX
                  </span>
                </h1>

                <div
                  className="
                    mt-4
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      h-px
                      w-10
                      bg-gradient-to-r
                      from-orange-500
                      to-orange-500/10
                    "
                  />

                  <p
                    className="
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.23em]
                      text-white/40

                      sm:text-[11px]
                    "
                  >
                    Software Development
                    <span
                      className="
                        mx-2
                        text-orange-500
                      "
                    >
                      /
                    </span>
                    Digital Engines
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-6
                  max-w-[540px]
                  text-[12px]
                  leading-[1.8]
                  text-white/38

                  sm:text-[13px]
                "
              >
                We design high-performance software, automation systems and
                scalable digital products for businesses ready to move faster.
              </p>

              {/* MINI FEATURES */}

              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  gap-2
                "
              >
                {[
                  "Custom Software",
                  "Web Systems",
                  "Automation",
                  "AI Integration",
                ].map((item) => (
                  <div
                    key={item}
                    className="
                      rounded-full
                      border
                      border-white/[0.07]
                      bg-white/[0.035]
                      px-3
                      py-1.5
                      text-[7px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-white/38
                      backdrop-blur-xl
                    "
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* STATS */}

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  gap-2
                "
              >
                {METRICS.map((metric) => (
                  <div
                    key={metric.label}
                    className="
                        min-w-[90px]
                        rounded-[14px]
                        border
                        border-white/[0.07]
                        bg-white/[0.035]
                        px-3.5
                        py-2.5
                        shadow-[inset_0_1px_0_rgba(255,255,255,.04)]
                        backdrop-blur-xl
                      "
                  >
                    <div
                      className="
                          text-[13px]
                          font-black
                          text-orange-400
                        "
                    >
                      {metric.value}
                    </div>

                    <div
                      className="
                          mt-1
                          text-[6px]
                          font-semibold
                          uppercase
                          tracking-[0.16em]
                          text-white/22
                        "
                    >
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  gap-3
                "
              >
                <Link
                  href="/portfolio"
                  className="
                    glass-shine
                    relative
                    flex
                    h-[44px]
                    items-center
                    gap-3
                    overflow-hidden
                    rounded-[13px]
                    bg-orange-500
                    px-5
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-black
                    shadow-[0_10px_35px_rgba(249,115,22,.18)]
                    transition-all

                    hover:-translate-y-[2px]
                    hover:bg-white
                  "
                >
                  Explore Work
                  <span className="text-[11px]">→</span>
                </Link>

                <Link
                  href="/openline"
                  className="
                    flex
                    h-[44px]
                    items-center
                    gap-3
                    rounded-[13px]
                    border
                    border-white/[0.09]
                    bg-white/[0.04]
                    px-5
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-white/65
                    backdrop-blur-xl
                    transition-all

                    hover:border-orange-500/25
                    hover:bg-orange-500/[0.06]
                    hover:text-orange-400
                  "
                >
                  Start Project
                  <span>↗</span>
                </Link>
              </div>
            </div>

            {/* ===========================
                RIGHT — MECA AI (holographic stage)
            =========================== */}

            <div className="relative mx-auto flex min-h-[500px] w-full max-w-[520px] flex-col items-center justify-center lg:min-h-[560px] lg:max-w-none">
              {/* spotlight + glow */}
              <div
                className={`pointer-events-none absolute left-1/2 top-0 h-[70%] w-[70%] -translate-x-1/2 bg-gradient-to-b from-orange-500/20 via-orange-500/5 to-transparent blur-2xl transition-opacity duration-1000 [clip-path:polygon(38%_0,62%_0,100%_100%,0_100%)] ${awake ? "opacity-100" : "opacity-50"}`}
              />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[110px]" />
              <div className="pointer-events-none absolute bottom-10 left-1/4 h-48 w-48 rounded-full bg-cyan-500/10 blur-[90px]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,.18)_1px,transparent_1px)] bg-[size:22px_22px] opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_65%)]" />

              {/* floating chips (desktop / tablet) */}
              <span
                className="hero-particle absolute left-2 top-6 hidden items-center gap-2 rounded-full bg-orange-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-black sm:inline-flex"
                style={
                  { "--duration": "6s", "--delay": "0s" } as React.CSSProperties
                }
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-black" />
                MECA Intelligence
              </span>

              <span
                className={`hero-particle absolute right-2 top-10 hidden items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur-md sm:inline-flex ${awake ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-black/40 text-gray-400"}`}
                style={
                  { "--duration": "7s", "--delay": "1s" } as React.CSSProperties
                }
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${awake ? "animate-pulse bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-white/30"}`}
                />
                {awake ? "Active" : "Standby"}
              </span>

              {[
                {
                  label: "Vision",
                  value: "Tracking",
                  pos: "left-0 top-[42%]",
                  tone: "border-cyan-400/40 text-cyan-300",
                  dot: "bg-cyan-400",
                  d: "5.5s",
                  delay: ".5s",
                },
                {
                  label: "AI Core",
                  value: "Ready",
                  pos: "right-0 top-[48%]",
                  tone: "border-violet-400/40 text-violet-300",
                  dot: "bg-violet-400",
                  d: "6.5s",
                  delay: "1.5s",
                },
              ].map((chip) => (
                <div
                  key={chip.label}
                  className={`hero-particle absolute hidden rounded-2xl border bg-black/50 px-3.5 py-2.5 backdrop-blur-md sm:block ${chip.pos} ${chip.tone}`}
                  style={
                    {
                      "--duration": chip.d,
                      "--delay": chip.delay,
                    } as React.CSSProperties
                  }
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 animate-pulse rounded-full ${chip.dot}`}
                    />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-80">
                      {chip.label}
                    </span>
                  </div>
                  <div className="mt-0.5 text-sm font-black uppercase tracking-tight text-white">
                    {chip.value}
                  </div>
                </div>
              ))}

              {/* ROBOT */}
              <div className="relative z-10 mt-8">
                <RobotHead
                  awake={awake}
                  excited={excited}
                  chatOpen={chatOpen}
                />
              </div>

              {/* caption */}
              <span className="relative z-10 mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-orange-300/80">
                {awake ? "Visitor Detected" : "AI Standby"}
              </span>

              {/* PEDESTAL */}
              <div className="relative z-0 -mt-1 h-24 w-[300px] sm:w-[340px]">
                {/* rotating rings squashed into ellipses */}
                <div className="absolute inset-0 flex items-center justify-center [transform:scaleY(.28)]">
                  <div className="spin-ccw absolute h-[300px] w-[300px] rounded-full border-2 border-dashed border-orange-500/40 sm:h-[340px] sm:w-[340px]">
                    <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500 shadow-[0_0_14px_#f97316]" />
                    <span className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_14px_#22d3ee]" />
                  </div>
                  <div className="spin-cw absolute h-[230px] w-[230px] rounded-full border border-cyan-400/30 sm:h-[260px] sm:w-[260px]">
                    <span className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-violet-400 shadow-[0_0_14px_#a78bfa]" />
                  </div>
                  <div className="absolute h-[150px] w-[150px] rounded-full bg-gradient-to-b from-orange-500/40 to-orange-700/10 shadow-[0_0_60px_rgba(249,115,22,.45)]" />
                </div>
                {/* light beam from pedestal */}
                <div className="pointer-events-none absolute bottom-1/2 left-1/2 h-40 w-32 -translate-x-1/2 bg-gradient-to-t from-orange-500/25 to-transparent blur-md [clip-path:polygon(20%_100%,80%_100%,100%_0,0_0)]" />
              </div>

              {/* mobile status row */}
              <div className="relative z-10 mt-2 flex flex-wrap justify-center gap-2 sm:hidden">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-widest ${awake ? "border-emerald-400/40 text-emerald-300" : "border-white/10 text-gray-400"}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${awake ? "bg-emerald-400" : "bg-white/30"}`}
                  />{" "}
                  {awake ? "Active" : "Standby"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-cyan-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />{" "}
                  Vision · Tracking
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/40 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-violet-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" /> AI
                  · Ready
                </span>
              </div>

              {/* CTA */}
              <div className="relative z-10 mt-5 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={openChat}
                  className="group/meca inline-flex items-center gap-3 rounded-full bg-orange-500 py-2 pl-5 pr-2 text-black shadow-[0_0_30px_rgba(249,115,22,.4)] transition-all hover:bg-white active:scale-[0.98]"
                >
                  <span className="flex items-center gap-1">
                    <span className="typing-dot !bg-black" />
                    <span className="typing-dot !bg-black" />
                    <span className="typing-dot !bg-black" />
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest">
                    Talk to MECA
                  </span>
                  <span className="flex h-9 w-9 -rotate-45 items-center justify-center rounded-full bg-black text-sm text-orange-400 transition-transform group-hover/meca:rotate-0">
                    →
                  </span>
                </button>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-gray-500">
                  ↔ Drag the head to rotate · Mode:{" "}
                  <span
                    className={awake ? "text-emerald-300" : "text-amber-300"}
                  >
                    {awake ? "Live" : "Idle"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SCROLL */}

        <div
          className="
            relative
            z-20
            mx-auto
            mt-5
            flex
            w-fit
            items-center
            gap-2
            text-[6px]
            font-semibold
            uppercase
            tracking-[0.24em]
            text-white/20
          "
        >
          <span
            className="
              h-[4px]
              w-[4px]
              animate-pulse
              rounded-full
              bg-orange-500
            "
          />
          Scroll to explore
        </div>
      </section>

      {/* =================================
          MECA CHAT BUBBLE
      ================================= */}

      <button
        type="button"
        onClick={openChat}
        className={`
          fixed
          bottom-5
          right-5
          z-[9998]
          flex
          items-center
          gap-3
          rounded-[18px]
          border
          border-white/[0.09]
          bg-[#0b0b0b]/75
          px-3
          py-2.5
          shadow-[0_20px_60px_rgba(0,0,0,.5)]
          backdrop-blur-[24px]
          transition-all
          duration-500

          hover:-translate-y-1
          hover:border-orange-500/25

          ${
            !bubbleVisible || chatOpen
              ? `
                pointer-events-none
                translate-y-3
                opacity-0
              `
              : `
                translate-y-0
                opacity-100
              `
          }
        `}
      >
        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-[10px]
            border
            border-orange-500/20
            bg-orange-500/[0.08]
          "
        >
          <span
            className="
              h-[7px]
              w-[7px]
              animate-pulse
              rounded-full
              bg-orange-500
              shadow-[0_0_9px_#f97316]
            "
          />
        </div>

        <div className="text-left">
          <div
            className="
              text-[7px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-orange-400
            "
          >
            MECA ONLINE
          </div>

          <div
            className="
              mt-[2px]
              text-[9px]
              text-white/55
            "
          >
            Want to talk?
          </div>
        </div>

        <span
          className="
            ml-1
            text-[9px]
            text-orange-400
          "
        >
          →
        </span>
      </button>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};

export default HeroWithChat;
