"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "mecatronix_visited";
const OPEN_DELAY_MS = 800;
const FADE_MS = 500;

// localStorage can throw (e.g. blocked storage / some private modes)
const hasVisited = () => {
    try {
        return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
        return true; // if we can't remember, don't nag
    }
};

const markVisited = () => {
    try {
        localStorage.setItem(STORAGE_KEY, "true");
    } catch {
        /* ignore */
    }
};

const BOOT_STEPS = [
    { label: "Secure link established", dot: "bg-cyan-400", text: "text-cyan-300" },
    { label: "Data integrity verified", dot: "bg-violet-400", text: "text-violet-300" },
    { label: "System ready for transition", dot: "bg-emerald-400", text: "text-emerald-300" },
];

export default function StartupPopup() {
    const [open, setOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const enterButtonRef = useRef<HTMLButtonElement | null>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Show once per browser, a moment after the first visit
    useEffect(() => {
        if (hasVisited()) return;

        let fadeTimer: ReturnType<typeof setTimeout> | undefined;
        const openTimer = setTimeout(() => {
            setOpen(true);
            markVisited(); // only remember once it has actually been shown
            fadeTimer = setTimeout(() => setIsVisible(true), 30);
        }, OPEN_DELAY_MS);

        return () => {
            clearTimeout(openTimer);
            if (fadeTimer) clearTimeout(fadeTimer);
        };
    }, []);

    const handleClose = useCallback(() => {
        setIsVisible(false);
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setOpen(false), FADE_MS);
    }, []);

    useEffect(() => () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    }, []);

    // While open: Escape closes, focus moves into the dialog, page behind doesn't scroll
    useEffect(() => {
        if (!open) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        enterButtonRef.current?.focus();

        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", onKey);

        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus?.();
        };
    }, [open, handleClose]);

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="startup-popup-title"
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleClose} />

            {/* Card */}
            <div
                className={`relative w-full max-w-3xl p-px rounded-[2rem] bg-gradient-to-br from-orange-500/70 via-violet-500/30 to-cyan-500/50 shadow-[0_40px_120px_rgba(0,0,0,.7)] transition-all duration-500 ${isVisible ? "translate-y-0 scale-100" : "translate-y-4 scale-95"}`}
            >
                <div className="relative overflow-hidden rounded-[2rem] bg-[#0c0906]">
                    {/* Glows + watermark */}
                    <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-500/20 blur-[110px]" />
                    <div className="pointer-events-none absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-cyan-500/10 blur-[110px]" />
                    <div className="pointer-events-none absolute right-6 -bottom-6 text-[7rem] md:text-[9rem] font-black leading-none text-white/[0.03] uppercase tracking-tighter select-none">
                        Init
                    </div>

                    {/* Close */}
                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close"
                        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-black hover:bg-white hover:border-white transition-all"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="relative grid md:grid-cols-[1.15fr_1fr] gap-6 p-6 sm:p-8 md:p-10">
                        {/* Left: message */}
                        <div className="flex flex-col">
                            <span className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-black font-black text-[10px] uppercase tracking-[0.25em]">
                                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" /> System.Init()
                            </span>

                            <h2
                                id="startup-popup-title"
                                className="mt-6 font-black uppercase tracking-tighter leading-[0.88] text-5xl sm:text-6xl"
                            >
                                <span className="block text-white">Meca</span>
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-500 to-rose-500 bg-[length:200%_auto] animate-gradient">
                                    tronix
                                </span>
                            </h2>

                            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.35em] text-gray-500">
                                Protocol v4.0
                            </p>

                            <p className="mt-5 text-sm md:text-base text-gray-400 leading-relaxed max-w-sm">
                                Establishing secure link to the <span className="text-white font-semibold">Infinite Grid</span>.
                                Data integrity verified. System ready for transition.
                            </p>

                            <button
                                ref={enterButtonRef}
                                type="button"
                                onClick={handleClose}
                                className="group/enter mt-8 inline-flex w-full sm:w-fit items-center justify-between gap-4 rounded-full bg-orange-500 py-2 pl-6 pr-2 text-black shadow-[0_0_30px_rgba(249,115,22,.4)] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 active:scale-[0.98] transition-all"
                            >
                                <span className="text-xs font-black uppercase tracking-[0.2em]">Enter Experience</span>
                                <span className="flex h-9 w-9 -rotate-45 items-center justify-center rounded-full bg-black text-orange-400 transition-transform group-hover/enter:rotate-0">
                                    →
                                </span>
                            </button>
                            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.25em] text-gray-600">
                                Press Esc to skip
                            </p>
                        </div>

                        {/* Right: boot sequence */}
                        <div className="relative rounded-[1.5rem] border border-white/10 bg-black/50 p-5 flex flex-col">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">Boot_Sequence</span>
                                <span className="flex gap-1">
                                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                                    <span className="w-2 h-2 rounded-full bg-white/15" />
                                    <span className="w-2 h-2 rounded-full bg-white/15" />
                                </span>
                            </div>

                            <ul className="mt-5 space-y-2.5">
                                {BOOT_STEPS.map((step, i) => (
                                    <li
                                        key={step.label}
                                        className="flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/5 px-4 py-3 opacity-0 animate-fade-in-up fill-mode-forwards"
                                        style={{ animationDelay: `${300 + i * 350}ms` }}
                                    >
                                        <span className={`shrink-0 w-2 h-2 rounded-full ${step.dot}`} />
                                        <span className="flex-1 text-sm text-gray-200">{step.label}</span>
                                        <span className={`font-mono text-[10px] font-bold uppercase ${step.text}`}>OK</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto pt-6">
                                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                                    <span>Loading grid</span>
                                    <span className="text-orange-300">100%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                    <div
                                        className="h-full w-full origin-left rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-rose-500"
                                        style={{ animation: "service-progress 1.4s cubic-bezier(.2,.8,.2,1) .3s both" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
