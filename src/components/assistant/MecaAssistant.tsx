"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { MessageSquare } from "lucide-react";

// The panel (and its logic) is only downloaded when someone opens it
const MecaPanel = dynamic(() => import("./MecaPanel"), { ssr: false });

/** Floating launcher for the MECA assistant (backed by /api/meca). */
export default function MecaAssistant() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {loaded && <MecaPanel open={open} onClose={() => setOpen(false)} />}
      <button
        type="button"
        onClick={() => {
          setLoaded(true);
          setOpen((v) => !v);
        }}
        onPointerEnter={() => setLoaded(true)}
        aria-expanded={open}
        aria-controls="meca-panel"
        className="fixed bottom-4 right-4 z-40 flex h-12 items-center gap-2.5 rounded-full border border-line bg-white/95 pl-3 pr-4 text-[14px] font-medium text-ink shadow-window backdrop-blur-lg transition-transform duration-300 hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
      >
        <span className="relative flex size-7 items-center justify-center rounded-full bg-accent-strong text-white">
          <MessageSquare aria-hidden className="size-3.5" />
          <span aria-hidden className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-white bg-emerald-500" />
        </span>
        {open ? "Close" : "Ask MECA"}
      </button>
    </>
  );
}
