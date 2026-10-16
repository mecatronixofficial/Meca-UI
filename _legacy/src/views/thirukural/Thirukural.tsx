"use client";

import React, { useState, useEffect, useRef } from 'react';
import Img_Helper from "../../helper/img_help";
import Image from "next/image";
import kuralDetails from './thirukkural.json';
import kuralStructure from './detail.json';
import Icons from "../../helper/icon_help";

interface TypewriterProps {
    text: string;
    delay?: number;
    className?: string;
    onComplete?: () => void;
}

const Typewriter = ({ text, delay = 50, className = "", onComplete }: TypewriterProps) => {
    const [displayText, setDisplayText] = useState("");
    // Keep the latest callback without restarting the animation when it changes
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useEffect(() => {
        setDisplayText("");
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(interval);
                onCompleteRef.current?.();
            }
        }, delay);
        return () => clearInterval(interval);
    }, [text, delay]);

    return <span className={className}>{displayText}</span>;
};

const Caret = ({ className = "bg-orange-500" }: { className?: string }) => (
    <span className={`inline-block w-0.5 h-5 ml-2 animate-pulse align-middle ${className}`} />
);

type Kural = (typeof kuralDetails)["kural"][number];
type KuralMeta = { paal: string; athigaram: string; iyal: string };

const STEPS = ["தமிழ்", "ENGLISH", "URAI1", "URAI2", "URAI3"] as const;
const STEP_LABELS: Record<(typeof STEPS)[number], string> = {
    "தமிழ்": "குறள்",
    ENGLISH: "English",
    URAI1: "மு.வ",
    URAI2: "கலைஞர்",
    URAI3: "சா.பா",
};
const URAI = {
    URAI1: { title: "M. Varatharasanar Explanation", key: "mv" },
    URAI2: { title: "M. Karunanidhi Explanation", key: "mk" },
    URAI3: { title: "Solomon Pappaiah Explanation", key: "sp" },
} as const;

const Thirukural = () => {
    const { AiOutlineDoubleRight } = Icons;
    const [step, setStep] = useState(0);
    const [data, setData] = useState<(Kural & KuralMeta) | null>(null);
    const [showLine2, setShowLine2] = useState(false);

    useEffect(() => {
        const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
        const kuralNumber = (daysSinceEpoch % 1330) + 1;
        const foundKural = kuralDetails.kural.find(k => k.Number === kuralNumber);
        if (!foundKural) return;

        const meta: KuralMeta = { paal: "", athigaram: "", iyal: "" };
        kuralStructure[0].section.detail.forEach(section => {
            section.chapterGroup.detail.forEach(group => {
                group.chapters.detail.forEach(chap => {
                    if (kuralNumber >= chap.start && kuralNumber <= chap.end) {
                        meta.paal = section.name;
                        meta.athigaram = chap.name;
                        meta.iyal = group.name;
                    }
                });
            });
        });

        setData({ ...foundKural, ...meta });
    }, []);

    const goToStep = (index: number) => {
        setShowLine2(false);
        setStep(index);
    };

    const nextStep = () => goToStep((step + 1) % STEPS.length);

    const isTamil = step % 2 === 0;

    if (!data) {
        return (
            <div className="px-4 sm:px-6 my-6 md:my-12">
                <div className="max-w-5xl mx-auto h-64 rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[.4em] text-orange-500">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                    INIT_SYSTEM...
                </div>
            </div>
        );
    }

    const renderContent = () => {
        const current = STEPS[step];

        if (current === "தமிழ்") {
            return (
                <div className="space-y-4">
                    <span className="tamil text-[11px] text-orange-500 font-bold tracking-[.3em] block uppercase">
                        மூலக்குறள் <span className="text-gray-600">// Source</span>
                    </span>
                    <h2 className="tamil text-xl md:text-3xl font-extrabold text-white leading-relaxed break-words border-l-2 border-orange-500/60 pl-5">
                        <Typewriter text={data.Line1} onComplete={() => setShowLine2(true)} />
                        <br />
                        {showLine2 && (
                            <Typewriter
                                text={data.Line2}
                                className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400"
                            />
                        )}
                        <Caret />
                    </h2>
                </div>
            );
        }

        if (current === "ENGLISH") {
            return (
                <div className="space-y-4">
                    <span className="text-[11px] font-mono text-orange-500 font-bold tracking-[.3em] block uppercase">
                        Translation
                    </span>
                    <p className="text-lg md:text-2xl text-gray-200 italic font-light leading-relaxed border-l-2 border-orange-500/60 pl-5">
                        &ldquo;<Typewriter text={data.Translation} />&rdquo;
                        <Caret className="bg-white" />
                    </p>
                </div>
            );
        }

        const urai = URAI[current];
        return (
            <div className="space-y-4">
                <span className="text-[11px] font-mono text-orange-500 font-bold tracking-[.3em] block uppercase">
                    {urai.title}
                </span>
                <p className="tamil text-base md:text-lg text-gray-300 leading-relaxed border-l-2 border-orange-500/60 pl-5">
                    <Typewriter text={data[urai.key]} />
                    <Caret className="bg-white" />
                </p>
            </div>
        );
    };

    return (
        <div className="relative z-10 px-4 sm:px-6 my-6 md:my-12">
            <section
                role="button"
                tabIndex={0}
                aria-label="Thirukkural of the day. Activate to see the next explanation."
                onClick={nextStep}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        nextStep();
                    }
                }}
                className="group relative max-w-5xl mx-auto p-px rounded-[2rem] bg-gradient-to-br from-orange-600/60 via-white/10 to-orange-500/30 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
            >
                <div className="relative overflow-hidden rounded-[2rem] bg-black/80 backdrop-blur-2xl flex flex-col md:flex-row">
                    {/* Decor */}
                    <div className="absolute inset-0 opacity-[0.05] bg-[size:28px_28px] bg-[linear-gradient(to_right,#f97316_1px,transparent_1px),linear-gradient(to_bottom,#f97316_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_right,black,transparent_70%)] pointer-events-none" />
                    <span className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-orange-500/70 z-20" />
                    <span className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-orange-500/70 z-20" />

                    {/* Portrait */}
                    <div className="relative w-full md:w-[28%] h-56 md:h-auto flex items-end justify-center border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/20 via-orange-600/5 to-transparent" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-orange-500/25 blur-[60px] group-hover:bg-orange-500/40 transition-colors duration-700" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-orange-500/20" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-dashed border-orange-500/10 animate-spin-slow" />

                        <Image
                            src={Img_Helper.thiruvalluvar}
                            alt="Thiruvalluvar"
                            width={500}
                            height={500}
                            sizes="(min-width: 768px) 300px, 60vw"
                            className="relative h-full max-h-72 w-auto object-contain p-4 md:p-3 opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 drop-shadow-[0_10px_30px_rgba(249,115,22,0.35)]"
                        />

                        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-orange-500/30">
                            <p className="font-mono text-[8px] uppercase tracking-[.3em] text-gray-500">Kural</p>
                            <p className="font-mono text-lg font-black text-orange-400 leading-none">
                                {String(data.Number).padStart(4, "0")}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative w-full md:w-[72%]">
                        <div className="relative z-10 p-6 md:p-10 flex flex-col h-full">
                            {/* Header */}
                            <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
                                        <p className="tamil text-xs md:text-sm font-extrabold text-white uppercase tracking-[0.35em]">
                                            {isTamil ? "திருக்குறள்" : "Thirukkural"}
                                        </p>
                                    </span>
                                    <span className="tamil px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/30 text-[10px] text-orange-300 font-bold rounded-full">
                                        {data.paal}
                                    </span>
                                    <span className="ml-auto font-mono text-[9px] uppercase tracking-[.3em] text-gray-600">
                                        Daily_Wisdom
                                    </span>
                                </div>

                                {/* Step tabs */}
                                <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
                                    {STEPS.map((s, i) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                goToStep(i);
                                            }}
                                            className={`tamil shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300 ${step === i
                                                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                                                : "bg-white/[0.03] border border-white/10 text-gray-500 hover:text-white hover:border-white/20"
                                                }`}
                                        >
                                            {STEP_LABELS[s]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Body */}
                            <div key={step} className="relative py-8 md:py-10 flex items-center min-h-[200px] animate-fade-in">
                                {renderContent()}
                            </div>

                            {/* Footer HUD */}
                            <div className="mt-auto flex flex-col sm:flex-row justify-between items-start sm:items-end border-t border-white/10 pt-5 gap-4">
                                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 items-baseline">
                                    <span className="font-mono text-[9px] uppercase tracking-[.3em] text-gray-600">Chapter</span>
                                    <span className="tamil text-sm font-semibold text-white">{data.athigaram}</span>
                                    <span className="font-mono text-[9px] uppercase tracking-[.3em] text-gray-600">Group</span>
                                    <span className="tamil text-sm font-semibold text-white">{data.iyal}</span>
                                </div>
                                <div className="w-full sm:w-auto flex flex-col items-end gap-2">
                                    <span className="tamil text-sm md:text-base font-extrabold text-orange-500 tracking-[0.2em] italic">
                                        {isTamil ? "– திருவள்ளுவர்" : "– Thiruvalluvar"}
                                    </span>
                                    <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.3em] text-gray-500 group-hover:text-orange-300 transition-colors">
                                        Next: <span className="tamil normal-case tracking-normal text-[11px]">{STEP_LABELS[STEPS[(step + 1) % STEPS.length]]}</span>
                                        <AiOutlineDoubleRight className="text-orange-500 animate-pulse" />
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Number watermark */}
                        <div className="absolute bottom-0 right-6 text-7xl md:text-9xl font-black text-white/[0.03] pointer-events-none select-none leading-none">
                            {data.Number}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Thirukural;
