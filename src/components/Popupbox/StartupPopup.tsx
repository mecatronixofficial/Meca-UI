import { useState, useEffect } from "react";

export default function StartupPopup() {
    const [open, setOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const visited = localStorage.getItem("mecatronix_visited");
        if (!visited) {
            setTimeout(() => {
                setOpen(true);
                setTimeout(() => setIsVisible(true), 100);
            }, 800);
            localStorage.setItem("mecatronix_visited", "true");
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => setOpen(false), 900);
    };

    if (!open) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-1000 ${isVisible ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-0'}`}>
            
            {/* Darker Overlay (95% black for less background brightness) */}
            <div className="absolute inset-0 bg-black/95" onClick={handleClose} />

            {/* Sharp Rectangle Container */}
            <div className="relative group bg-zinc-950 border border-white/10 p-10 w-[95%] max-w-2xl rounded-none shadow-none overflow-hidden">
                
                {/* Close Button - Technical Style */}
                <button 
                    onClick={handleClose}
                    className="absolute top-6 right-6 z-20 text-white/20 hover:text-white transition-colors duration-300"
                    aria-label="Close"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                {/* Internal Dimmed Starfield */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="stars-container animate-spin-slow" />
                </div>

                <div className="relative z-10 text-left border-l border-white/5 pl-8">
                    {/* Header Info */}
                    <div className="mb-12">
                        <span className="text-white/20 text-[10px] tracking-[0.6em] uppercase block mb-2">System.Init()</span>
                        <h2 className="text-white text-4xl font-light tracking-[0.4em] uppercase">
                            Mecatronix
                        </h2>
                    </div>

                    {/* Progress Decoration */}
                    <div className="flex items-center gap-4 mb-10 opacity-40">
                        <div className="h-[1px] w-20 bg-white/20" />
                        <span className="text-white text-[9px] tracking-[0.5em] uppercase font-bold">Protocol v4.0</span>
                    </div>

                    <p className="text-zinc-500 font-extralight text-sm tracking-[0.1em] leading-relaxed max-w-md mb-12 uppercase">
                        Establishing secure link to the <span className="text-zinc-300">Infinite Grid</span>. 
                        Data integrity verified. System ready for transition.
                    </p>

                    {/* Minimalist Rectangle Button */}
                    <button
                        onClick={handleClose}
                        className="group relative px-12 py-3 border border-white/10 transition-all duration-500 hover:bg-white hover:text-black"
                    >
                        <span className="relative z-10 text-white group-hover:text-black text-[10px] font-bold uppercase tracking-[0.6em]">
                            Enter Experience
                        </span>
                    </button>
                </div>

                {/* Technical Corner Markers (+) */}
                <div className="absolute top-2 left-2 text-white/10 text-xs font-light">+</div>
                <div className="absolute top-2 right-2 text-white/10 text-xs font-light">+</div>
                <div className="absolute bottom-2 left-2 text-white/10 text-xs font-light">+</div>
                <div className="absolute bottom-2 right-2 text-white/10 text-xs font-light">+</div>
            </div>
        </div>
    );
}