import React, { useState, useEffect, useMemo } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Nav from '../nav/Nav';
import Foot from '../foot/Foot';
import { NAV, subtitles } from '../../helper/data_help.jsx';
import Img_Helper from '../../helper/img_help';
import Icons from '../../helper/icon_help';
import { mecatronixConfig } from '../../config/envConfig';
import ToastProvider from '../common/ToastProvider';
import ScrollToTop from "../top/ScrollToTop";
import StartupPopup from '../Popupbox/StartupPopup.jsx';

const UserLayout = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [animateRocket, setAnimateRocket] = useState(false);
    const [animateRock, setAnimateRock] = useState(false);

    const scrollToTopx = () => {
        setAnimateRocket(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setAnimateRocket(false), 1000);
    };

    const scrollToBottom = () => {
        setAnimateRock(true);
        const now = Date.now();
        if (now - lastMeteor < 800) return;
        lastMeteor = now;
        if (document.querySelectorAll('.meteor').length > 50) return;

        for (let i = 0; i < 12; i++) {
            const meteor = document.createElement("div");
            meteor.className =
                "fixed w-20 h-[2px] bg-gradient-to-r from-white to-transparent rounded-full z-40 pointer-events-none";

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
        setTimeout(() => setAnimateRock(false), 1000);
    }

    const {
        app = {},
        contact = {},
        features = {},
        debug = {},
        industrial = {}
    } = mecatronixConfig || {};

    const {
        FaWhatsapp,
        FaPhone,
        FaBars,
        FaTimes,
        FaCog,
        FaChartLine,
        FaIndustry,
        FaStar,
        FaGlobe,
        FaRocket,
        FaSatellite,
        FaMeteor,
        FaFire,
        FaArrowRight
    } = Icons;

    let lastMeteor = 0;
    const APP_NAME = app?.name || 'Mecatronix';
    const APP_VERSION = app?.version || '1.0.0';
    const ENVIRONMENT = app?.environment || 'production';
    const PRIMARY_PHONE = contact?.primaryPhone || '+919843274321';
    const WHATSAPP_NUMBER = contact?.whatsappNumber || '+919843274321';

    const [currentIndex, setCurrentIndex] = useState(0);

    // System status from config with safe fallbacks
    const systemStatus = useMemo(() => ({
        realTimeMonitoring: features?.realTimeMonitoring || false,
        machineControls: features?.machineControls || false,
        analytics: features?.analytics || false,
        debugMode: debug?.enabled || false,
        mockData: debug?.mockData || false,
        refreshRate: industrial?.refreshRate || 1000,
        maxMachines: industrial?.maxMachines || 50
    }), [features, debug, industrial]);

    // Space particles state
    const spaceParticles = useMemo(() => {
        return Array.from({ length: 100 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.1
        }));
    }, []);

    useEffect(() => {
        if (!subtitles?.length) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % subtitles.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Scroll to top button visibility
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setShowScrollTop(window.scrollY > 400);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    // Loading transition when route changes
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [location]);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    // Industrial Features Status with safe fallbacks
    const featureStatus = useMemo(() => [
        {
            enabled: systemStatus.realTimeMonitoring,
            icon: FaChartLine,
            label: 'Real-time Monitoring',
            color: 'text-green-400',
            description: `Refresh: ${systemStatus.refreshRate}ms`
        },
        {
            enabled: systemStatus.machineControls,
            icon: FaIndustry,
            label: 'Machine Controls',
            color: 'text-blue-400',
            description: `Max: ${systemStatus.maxMachines} machines`
        },
        {
            enabled: systemStatus.analytics,
            icon: FaCog,
            label: 'Data Analytics',
            color: 'text-purple-400',
            description: 'Advanced analytics'
        }
    ], [systemStatus]);

    return (
        <div className="flex flex-col min-h-screen bg-black relative overflow-hidden">
            <ScrollToTop />
            <div className="fixed inset-0 -z-50 pointer-events-none">
                {/* Deep Space Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-orange-950"></div>

                {/* Nebula Effect */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600 rounded-full blur-3xl opacity-10"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-10"></div>
                    <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-amber-500 rounded-full blur-3xl opacity-10"></div>
                </div>

                {/* Stars (Static) */}
                <div className="absolute inset-0">
                    {spaceParticles.map((particle) => (
                        <div
                            key={particle.id}
                            className="absolute bg-orange-200 rounded-full"
                            style={{
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                                width: `${particle.size}px`,
                                height: `${particle.size}px`,
                                opacity: particle.opacity
                            }}
                        />
                    ))}
                </div>

                {/* Comets (Static) */}
                <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute comet"
                            style={{
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${i * 2}s`
                            }}
                        />
                    ))}
                </div>

                {/* Orbiting Planets & Satellite (Static) */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4">
                        <div className="w-12 h-12 bg-gradient-to-b from-orange-500 to-orange-700 rounded-full shadow-2xl shadow-orange-500/40">
                            <div className="absolute inset-2 bg-orange-400/30 rounded-full blur-sm"></div>
                        </div>
                    </div>

                    <div className="absolute bottom-1/3 right-1/3">
                        <div className="w-8 h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-2xl shadow-orange-500/40">
                            <div className="absolute inset-1 bg-orange-300/30 rounded-full blur-sm"></div>
                        </div>
                    </div>

                    <div className="absolute top-1/2 left-1/2">
                        <FaSatellite className="text-orange-400 text-xl opacity-70" />
                        <div className="absolute -inset-1 bg-orange-400/20 rounded-full blur-sm"></div>
                    </div>
                </div>

                {/* Grid Lines */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(239, 68, 68, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>
            </div>

            {/* 02. INDUSTRIAL LOADING SCREEN */}
            {isLoading && (
                <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
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

                    {/* 4. Minimal Environment Marker */}
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

            {/* 🔸 Navigation (Static Container) */}
            <div className="relative z-40">
                <ToastProvider />
                <Nav />
            </div>

            {/* 🔸 Main Content (No Transition) */}
            <main className="flex-1 relative z-10">
                <div key={location.pathname}>
                    <Outlet />
                </div>
            </main>

            {/* 🔸 Footer (Static Container) */}
            <div className="relative z-10">
                <Foot />
            </div>

            {/* 🔸 Mobile Menu Button (Static) */}
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="xl:hidden fixed top-3 right-3 z-50 
               flex items-center justify-center gap-2
               bg-transparent backdrop-blur-sm border border-white/20
               text-white px-4 py-4  
               shadow-[0_8px_32px_0_rgba(255,69,0,0.3)]
               hover:bg-white/20 active:scale-95 transition-all duration-300"
            >
                <div className="relative">
                    <FaBars className="text-xl" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 bg-orange-500"></span>
                    </span>
                </div>
            </button>

            {/* 🔸 Mobile Menu Overlay (No AnimatePresence) */}
            {mobileMenuOpen && (
                <>
                    {/* 🔹 Backdrop: Ultra-dark with a localized radial glow */}
                    <div
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 xl:hidden transition-opacity duration-500"
                    >

                    </div>

                    {/* 🔹 Sidebar Panel: Tactical Glass Design */}
                    <div
                        className="fixed top-0 right-0 h-full w-[85%] max-w-sm z-50 xl:hidden 
                       bg-[#050505] border-l border-white/10 shadow-[-20px_0_50px_-15px_rgba(0,0,0,0.9)]
                       overflow-y-auto overflow-x-hidden flex flex-col"
                    >
                        {/* Tactical Header Overlay */}
                        <div className="sticky top-0 z-10 p-6 bg-black/40 backdrop-blur-xl border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <img src={Img_Helper.mainlogo} alt="Logo" className="h-10 w-auto object-contain" />
                                        <div className="h-4 w-[1px] bg-white/20" /> {/* Divider */}
                                        <div className='flex flex-col items-start justify-center'>
                                            <h1 className="text-xl font-black tracking-widest text-white">
                                                MECA<span className="text-orange-600">TRONIX</span>
                                            </h1>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
                                                {subtitles[currentIndex]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-gray-400 font-mono">
                                            v{APP_VERSION}
                                        </span>
                                        {ENVIRONMENT !== 'production' && (
                                            <span className="px-2 py-0.5 rounded text-[10px] bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono uppercase">
                                                {ENVIRONMENT}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-3 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all active:scale-90"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        {/* 🔹 Navigation: Floating Pill Items */}
                        <nav className="p-4 space-y-1 flex-grow">
                            {NAV.map((item, index) => {
                                const isActive = location.pathname === item.id;
                                return (
                                    <a
                                        key={item.id}
                                        href={item.id}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate(item.id);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`group relative flex items-center p-4 transition-all duration-300 overflow-hidden ${isActive
                                            ? 'bg-orange-600/10 border border-orange-500/30'
                                            : 'bg-transparent border border-transparent hover:bg-white/5'
                                            }`}
                                    >
                                        {/* Active Indicator Bar */}
                                        {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-orange-500 " />}

                                        <div className={`p-1 rounded-lg mr-4 transition-colors ${isActive ? 'text-orange-400' : 'text-gray-500 group-hover:text-white'}`}>
                                            {index === 0 && <FaGlobe />}
                                            {index === 1 && <FaRocket />}
                                            {index === 2 && <FaSatellite />}
                                            {index === 3 && <FaStar />}
                                            {index === 4 && <FaFire />}
                                        </div>

                                        <span className={`text-sm font-medium tracking-wide ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                            {item.label}
                                        </span>
                                    </a>
                                );
                            })}
                        </nav>

                        {/* 🔹 Orbital Systems: Data Grid Look */}
                        <div className="p-6 bg-white/5 border-t border-white/5">
                            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                System Status
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                                {featureStatus.map((feature) => (
                                    <div key={feature.label} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <feature.icon className={`text-sm ${feature.color} opacity-80`} />
                                            <span className="text-xs font-medium text-gray-300">{feature.label}</span>
                                        </div>
                                        <div className={`w-1.5 h-1.5 rounded-full ${feature.enabled ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-orange-500'}`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 🔹 Launch Controls: Action Grid */}
                        <div className="p-6 grid grid-cols-2 gap-3">
                            <a href={`tel:${PRIMARY_PHONE}`} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all group">
                                <FaPhone className="text-gray-400 group-hover:text-orange-400 mb-2 transition-colors" />
                                <span className="text-[10px] font-bold text-gray-400 group-hover:text-white uppercase">Call HQ</span>
                            </a>
                            <a href={`https://wa.me/${WHATSAPP_NUMBER?.replace('+', '')}`} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-green-500/10 hover:border-green-500/30 transition-all group">
                                <FaWhatsapp className="text-gray-400 group-hover:text-green-400 mb-2 transition-colors" />
                                <span className="text-[10px] font-bold text-gray-400 group-hover:text-white uppercase">Comms</span>
                            </a>
                        </div>

                        <div className='p-3'>
                            <Link
                                to="/openline"
                                className="relative h-11 px-8 flex items-center justify-center bg-orange-600 text-white font-black text-[10px] tracking-[0.25em] uppercase transition-all hover:bg-white hover:text-black overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Start_Project <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                                </span>
                                {/* Shimmer effect */}
                                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-15 group-hover:left-[100%] transition-all duration-1000" />
                            </Link>
                        </div>
                    </div>
                </>
            )}

            {/* 🔸 Floating Buttons with orange/orange Theme (Static) */}
            <div className="fixed right-2 bottom-2 z-30 flex flex-col gap-3">
                {/* Scroll to Top */}
                {showScrollTop && (
                    <button
                        onClick={scrollToTopx}
                        aria-label="Scroll to top"
                        className={` bg-gradient-to-br from-orange-600 to-orange-500  text-white p-4 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-700 group cursor-pointer rounded-tl-full -rotate-5 rounded-br-full rounded-tr-full active:scale-90 hover:-rotate-45 hover:mb-3 ${animateRocket ? '-translate-y-[100vh] opacity-0' : 'hover:scale-110'}`}
                    >
                        <FaRocket className="text-lg skew-x-[-5deg]" />
                    </button>
                )}

                {/* Meteor Shower Button (Uses native JS Animation) */}
                <button
                    onClick={scrollToBottom}
                    className={`bg-gradient-to-tr from-orange-600 to-orange-500 text-white p-4 shadow-2xl rounded-tl-full rounded-br-full rounded-bl-full shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-700 active:scale-90 -rotate-5  ${animateRock
                        ? '-translate-x-[50vw] translate-y-[100vh] opacity-0'
                        : 'hover:scale-110'
                        }`}
                >
                    <FaMeteor className="text-lg" />
                </button>
            </div>

            {/* 🔸 Progress Bar (Static) */}
            <div className="fixed top-0 left-0 w-full h-[2px] bg-gray-900/50 z-40">
                <div
                    className="h-full bg-gradient-to-r from-orange-500 via-orange-500 to-rose-600 transition-all duration-500"
                    style={{
                        width: '100%',
                        boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                    }}
                />
            </div>

            {/* 09. HUD BORDER OVERLAY (STATIC) */}
            <div className="fixed inset-0 pointer-events-none z-50">
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 px-4 py-1 bg-black 
                  border-x border-b border-white/5 -rotate-90 origin-left">
                    <span className="block text-[8px] font-mono text-gray-600 tracking-[.5em] uppercase ">
                        System_Secure_Monitor
                    </span>
                </div>
            </div>

        </div >
    );
};

export default UserLayout;