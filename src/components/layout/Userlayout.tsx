"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Nav from '../nav/Nav';
import Foot from '../foot/Foot';
import { subtitles } from '../../helper/data_help';
import Icons from '../../helper/icon_help';
import { mecatronixConfig } from '../../config/envConfig';
import ToastProvider from '../common/ToastProvider';
import ScrollToTop from "../top/ScrollToTop";
import StartupPopup from '../Popupbox/StartupPopup';
import SpaceBackground from '../star/SpaceBackground';

const LOADING_MS = 500;
const METEOR_COOLDOWN_MS = 800;
const METEOR_COUNT = 12;
const MAX_METEORS_ON_SCREEN = 50;

// Progress ring around the scroll-to-top button (r = 21 in a 48x48 box)
const RING_CIRCUMFERENCE = 2 * Math.PI * 21;

const UserLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const { FaRocket, FaMeteor } = Icons;

    const { app } = mecatronixConfig;
    const APP_NAME = app?.name || 'Mecatronix';
    const APP_VERSION = app?.version || '1.0.0';
    const ENVIRONMENT = app?.environment || 'production';

    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [animateRocket, setAnimateRocket] = useState(false);
    const [animateMeteorButton, setAnimateMeteorButton] = useState(false);

    // Refs survive re-renders (a plain `let` would reset every render)
    const lastMeteorAt = useRef(0);
    const progressRef = useRef<HTMLDivElement | null>(null);
    const ringRef = useRef<SVGCircleElement | null>(null);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    const later = useCallback((fn: () => void, ms: number) => {
        timers.current.push(setTimeout(fn, ms));
    }, []);

    // Clear any pending timers on unmount
    useEffect(() => {
        const pending = timers.current;
        return () => pending.forEach(clearTimeout);
    }, []);

    /* ---------------- Loading screen on route change ---------------- */
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), LOADING_MS);
        return () => clearTimeout(timer);
    }, [pathname]);

    // Rotate the loading subtitle only while the loading screen is visible
    useEffect(() => {
        if (!isLoading || !subtitles?.length) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % subtitles.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [isLoading]);

    /* ---------------- Scroll: progress bar + scroll-top button ---------------- */
    useEffect(() => {
        let ticking = false;

        const update = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;

            // Written straight to the DOM so scrolling doesn't re-render the layout
            if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${progress})`;
            }
            if (ringRef.current) {
                ringRef.current.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - progress));
            }

            setShowScrollTop(window.scrollY > 400);
            ticking = false;
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        // Page height changes after navigation, so recalculate once content settles
        const settle = setTimeout(update, LOADING_MS + 50);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            clearTimeout(settle);
        };
    }, [pathname]);

    /* ---------------- Floating buttons ---------------- */
    const scrollToTop = () => {
        setAnimateRocket(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        later(() => setAnimateRocket(false), 1000);
    };

    const triggerMeteorShower = () => {
        const now = Date.now();

        // Check the cooldown first, so an ignored click can't leave the button stuck mid-animation
        if (now - lastMeteorAt.current < METEOR_COOLDOWN_MS) return;
        lastMeteorAt.current = now;

        setAnimateMeteorButton(true);
        later(() => setAnimateMeteorButton(false), 1000);

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (document.querySelectorAll('.meteor').length > MAX_METEORS_ON_SCREEN) return;

        for (let i = 0; i < METEOR_COUNT; i++) {
            const meteor = document.createElement("div");
            meteor.className =
                "meteor fixed w-20 h-[2px] bg-gradient-to-r from-white to-transparent rounded-full z-40 pointer-events-none";

            meteor.style.top = `${Math.random() * 100}%`;
            meteor.style.left = `100%`;
            meteor.style.opacity = "0";
            meteor.style.transform = "rotate(-45deg)";

            const animation = meteor.animate(
                [
                    { transform: "translate(0, 0) rotate(-45deg)", opacity: 0 },
                    { transform: "translate(-300px, 300px) rotate(-45deg)", opacity: 1 },
                    { transform: "translate(-600px, 600px) rotate(-45deg)", opacity: 0 }
                ],
                {
                    duration: 1500,
                    delay: i * 120,
                    easing: "ease-out"
                }
            );

            animation.onfinish = () => meteor.remove();
            document.body.appendChild(meteor);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-black relative isolate overflow-hidden">
            <ScrollToTop />
            <SpaceBackground />

            {/* 🔸 Loading Screen (shown briefly on every route change) */}
            {isLoading && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center"
                >
                    <div className="absolute inset-0 opacity-[0.03] bg-[size:20px_20px] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)]"></div>

                    <div className="relative p-10 border border-white/5">
                        {/* Corner Accents */}
                        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-orange-600"></div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-orange-600"></div>

                        <div className="flex flex-col items-center gap-6">
                            <div className="h-1 w-32 bg-white/5 overflow-hidden">
                                <div className="h-full bg-orange-600 w-1/2 animate-[loading_1s_infinite_ease-in-out]"></div>
                            </div>
                            <div className="text-center">
                                <h2 className="text-white font-black tracking-[0.5em] uppercase text-xl">{APP_NAME}</h2>
                                <p className="text-[10px] font-mono text-orange-500 mt-2 uppercase tracking-widest animate-pulse">
                                    SYS_INIT::{subtitles[currentIndex]}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Environment marker (non-production only) */}
                    {ENVIRONMENT !== 'production' && (
                        <div className="absolute bottom-12 px-3 py-1 border border-white/10 rounded-full">
                            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                                {ENVIRONMENT} // v{APP_VERSION}
                            </span>
                        </div>
                    )}
                </div>
            )}

            <div className="relative z-60">
                <StartupPopup />
            </div>

            {/* 🔸 Navigation (includes the mobile menu) */}
            <div className="relative z-40">
                <ToastProvider />
                <Nav />
            </div>

            {/* 🔸 Main Content */}
            <main className="flex-1 relative z-10">
                <div key={pathname}>
                    {children}
                </div>
            </main>

            {/* 🔸 Footer */}
            <div className="relative z-10">
                <Foot />
            </div>

            {/* 🔸 Floating Dock (sits above the home page chat bubble) */}
            <div className="fixed right-3 bottom-24 z-30 sm:right-5">
                <div className="rounded-full bg-gradient-to-b from-orange-500/70 via-violet-500/30 to-cyan-500/50 p-px shadow-[0_20px_50px_rgba(0,0,0,.6)]">
                    <div className="flex flex-col items-center gap-1.5 rounded-full bg-[#0c0906]/85 p-1.5 backdrop-blur-xl">

                        {/* Scroll to top: expands in once the page is scrolled */}
                        <div
                            className={`transition-all duration-500 ease-out ${showScrollTop
                                ? 'max-h-14 opacity-100 scale-100'
                                : 'max-h-0 -mb-1.5 opacity-0 scale-75 pointer-events-none'
                                }`}
                        >
                            <button
                                type="button"
                                onClick={scrollToTop}
                                aria-label="Scroll to top"
                                aria-hidden={!showScrollTop}
                                tabIndex={showScrollTop ? 0 : -1}
                                className="group/dock relative flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                            >
                                {/* scroll progress ring */}
                                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden>
                                    <circle cx="24" cy="24" r="21" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="2.5" />
                                    <circle
                                        ref={ringRef}
                                        cx="24"
                                        cy="24"
                                        r="21"
                                        fill="none"
                                        stroke="#f97316"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeDasharray={RING_CIRCUMFERENCE}
                                        strokeDashoffset={RING_CIRCUMFERENCE}
                                        style={{ transition: 'stroke-dashoffset .15s ease-out' }}
                                    />
                                </svg>

                                <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-orange-500 text-black shadow-[0_0_18px_rgba(249,115,22,.45)] transition-colors group-hover/dock:bg-white">
                                    <FaRocket
                                        className={`-rotate-45 text-sm transition-all duration-700 ${animateRocket
                                            ? '-translate-y-8 opacity-0'
                                            : 'group-hover/dock:-translate-y-0.5'
                                            }`}
                                    />
                                </span>

                                <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full border border-white/10 bg-black/85 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-white opacity-0 translate-x-1 transition-all group-hover/dock:translate-x-0 group-hover/dock:opacity-100 group-focus-visible/dock:opacity-100">
                                    Back to top
                                </span>
                            </button>
                        </div>

                        {/* Meteor shower */}
                        <button
                            type="button"
                            onClick={triggerMeteorShower}
                            aria-label="Launch meteor shower"
                            className="group/dock relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-orange-300 transition-colors hover:border-transparent hover:bg-orange-500 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 active:scale-90"
                        >
                            <FaMeteor
                                className={`text-base transition-transform duration-700 ${animateMeteorButton ? 'rotate-[360deg] scale-125' : 'group-hover/dock:-rotate-12'}`}
                            />
                            {animateMeteorButton && (
                                <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-orange-400 animate-ping" />
                            )}

                            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full border border-white/10 bg-black/85 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-white opacity-0 translate-x-1 transition-all group-hover/dock:translate-x-0 group-hover/dock:opacity-100 group-focus-visible/dock:opacity-100">
                                Meteor shower
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 🔸 Scroll Progress Bar */}
            <div
                aria-hidden
                className="fixed top-0 left-0 w-full h-[2px] bg-gray-900/50 z-40"
            >
                <div
                    ref={progressRef}
                    className="h-full w-full origin-left bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 transition-transform duration-150 ease-out"
                    style={{
                        transform: 'scaleX(0)',
                        boxShadow: '0 0 10px rgba(249, 115, 22, 0.5)'
                    }}
                />
            </div>

            {/* 🔸 HUD Side Label (desktop only; it would overlap content on small screens) */}
            <div className="fixed inset-0 pointer-events-none z-50 hidden lg:block">
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 px-4 py-1 bg-black border-x border-b border-white/5 -rotate-90 origin-left">
                    <span className="block text-[8px] font-mono text-gray-600 tracking-[.5em] uppercase">
                        System_Secure_Monitor
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserLayout;
