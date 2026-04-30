import React from "react";

export const SpaceBackground = React.memo(({ stars, shootingStars }) => {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute bg-white rounded-full animate-pulse"
                    style={{
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        opacity: star.opacity,
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`,
                    }}
                />
            ))}

            {shootingStars.map((s, i) => (
                <div
                    key={i}
                    className="shooting-star"
                    style={{
                        left: `${s.left}%`,
                        top: `${s.top}%`,
                        animationDelay: `${s.delay}s`,
                    }}
                />
            ))}

            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        </div>
    );
});