import React, { useState, useEffect, useRef, useCallback } from "react";

const Eyes = () => {
    const [blink, setBlink] = useState(false);
    const eyeRefs = useRef({ left: null, right: null });
    const pupilRefs = useRef({ left: null, right: null });
    const rafRef = useRef(null);
    const anglesRef = useRef({ left: 0, right: 0 });

    // Blinking effect
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 200);
        }, 3000);
        return () => clearInterval(blinkInterval);
    }, []);

    // Apply transforms directly to DOM — no React re-render
    const applyTransforms = useCallback(() => {
        const { left, right } = anglesRef.current;

        if (pupilRefs.current.left) {
            const lx = Math.cos(left * Math.PI / 180) * 15;
            const ly = Math.sin(left * Math.PI / 180) * 15;
            pupilRefs.current.left.style.transform = `translate(${lx}px, ${ly}px)`;
        }
        if (pupilRefs.current.right) {
            const rx = Math.cos(right * Math.PI / 180) * 15;
            const ry = Math.sin(right * Math.PI / 180) * 15;
            pupilRefs.current.right.style.transform = `translate(${rx}px, ${ry}px)`;
        }
    }, []);

    // Mouse tracking — rAF throttled, no setState
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (rafRef.current) return; // skip if frame already pending

            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;

                const leftEl = eyeRefs.current.left;
                const rightEl = eyeRefs.current.right;
                if (!leftEl || !rightEl) return;

                const leftRect = leftEl.getBoundingClientRect();
                const rightRect = rightEl.getBoundingClientRect();

                anglesRef.current = {
                    left: Math.atan2(
                        e.clientY - (leftRect.top + leftRect.height / 2),
                        e.clientX - (leftRect.left + leftRect.width / 2)
                    ) * (180 / Math.PI),
                    right: Math.atan2(
                        e.clientY - (rightRect.top + rightRect.height / 2),
                        e.clientX - (rightRect.left + rightRect.width / 2)
                    ) * (180 / Math.PI),
                };

                applyTransforms();
            });
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [applyTransforms]);

    return (
        <div className="w-full h-full relative z-10 text-center flex items-center justify-center">
            <div className="flex flex-row items-center gap-16">
                {/* Left Eye */}
                <div
                    ref={el => eyeRefs.current.left = el}
                    className="relative flex items-center justify-center rounded-full w-8 h-8"
                >
                    <div
                        ref={el => pupilRefs.current.left = el}
                        className={`absolute w-5 bg-orange-600 rounded transition-[height] duration-100 ${blink ? "h-2" : "h-10"}`}
                        style={{ willChange: "transform" }}
                    />
                </div>

                {/* Right Eye */}
                <div
                    ref={el => eyeRefs.current.right = el}
                    className="relative flex items-center justify-center rounded-full w-8 h-8"
                >
                    <div
                        ref={el => pupilRefs.current.right = el}
                        className={`absolute w-5 bg-orange-600 rounded transition-[height] duration-100 ${blink ? "h-2" : "h-10"}`}
                        style={{ willChange: "transform" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Eyes;