"use client";

import React, { useEffect, useRef } from "react";

/**
 * Site-wide space backdrop. Rendered once in UserLayout as a fixed layer,
 * so individual pages must NOT render their own background or use opaque
 * section backgrounds (e.g. `bg-black`) that would hide it.
 *
 * Layers (back to front): neutral black gradient → canvas starfield
 * (dust + small ✦ stars + shooting stars) → vignette. Monochrome by design.
 */

interface CanvasStar {
  x: number;
  y: number;
  r: number;
  layer: number;
  phase: number;
  speed: number;
  tint: string;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

// Far → mid. The far layer is fine "dust" dots; the mid layer is small
// four-point ✦ stars that pulse and rotate. Nearer = more parallax.
// (No near / big glowing stars by design.)
const LAYERS: {
  density: number;
  size: [number, number];
  alpha: number;
  parallax: number;
  drift: number;
  shape: "dot" | "star";
}[] = [
  { density: 1 / 3000, size: [0.5, 1.0], alpha: 0.6, parallax: 0.015, drift: 0.004, shape: "dot" },
  { density: 1 / 12000, size: [2.2, 3.6], alpha: 0.85, parallax: 0.04, drift: 0.009, shape: "star" },
];

// Monochrome: pure and slightly dimmed whites only
const TINTS = ["255,255,255", "255,255,255", "235,235,240"];

const MAX_STARS = 600;

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export const SpaceBackground = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let stars: CanvasStar[] = [];
    const meteors: Meteor[] = [];
    let nextMeteorAt = performance.now() + rand(2500, 6000);
    let raf = 0;

    // Eased mouse offset for a subtle parallax
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const buildStars = () => {
      const area = width * height;
      stars = [];
      LAYERS.forEach((layer, layerIndex) => {
        const count = Math.min(Math.round(area * layer.density), MAX_STARS);
        for (let i = 0; i < count; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: rand(layer.size[0], layer.size[1]),
            layer: layerIndex,
            phase: Math.random() * Math.PI * 2,
            speed: rand(0.6, 1.6),
            tint: TINTS[Math.floor(Math.random() * TINTS.length)],
          });
        }
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    };

    const wrap = (value: number, max: number) => ((value % max) + max) % max;

    // Four-point star with curved (concave) sides: ✦
    const drawStarShape = (x: number, y: number, size: number, rotation: number, alpha: number) => {
      const c = size * 0.14;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(c, -c, size, 0);
      ctx.quadraticCurveTo(c, c, 0, size);
      ctx.quadraticCurveTo(-c, c, -size, 0);
      ctx.quadraticCurveTo(-c, -c, 0, -size);
      ctx.closePath();
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
      ctx.restore();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      const scroll = window.scrollY;

      for (const star of stars) {
        const layer = LAYERS[star.layer];
        const x = wrap(star.x + time * layer.drift - mouse.x * layer.parallax * 40, width);
        const y = wrap(star.y - scroll * layer.parallax - mouse.y * layer.parallax * 40, height);
        const pulse = reduceMotion ? 1 : 0.5 + 0.5 * Math.sin(time * 0.0015 * star.speed + star.phase);

        // Far layer: tiny dust dots
        if (layer.shape === "dot") {
          ctx.fillStyle = `rgba(${star.tint},${layer.alpha * (0.35 + 0.65 * pulse)})`;
          ctx.beginPath();
          ctx.arc(x, y, star.r, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        const rotation = star.phase + (reduceMotion ? 0 : time * 0.00025 * star.speed);
        const size = star.r * (0.65 + 0.35 * pulse);
        const alpha = layer.alpha * (0.45 + 0.55 * pulse);

        drawStarShape(x, y, size, rotation, alpha);

        // Bright core
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, alpha + 0.2)})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.6, size * 0.12), 0, Math.PI * 2);
        ctx.fill();
      }

      // Shooting stars
      if (!reduceMotion && time > nextMeteorAt) {
        meteors.push({
          x: rand(width * 0.2, width * 1.1),
          y: rand(-40, height * 0.35),
          vx: -rand(7, 11),
          vy: rand(3, 5),
          life: 0,
          maxLife: rand(55, 85),
        });
        nextMeteorAt = time + rand(3500, 8000);
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life += 1;

        const fade = 1 - m.life / m.maxLife;
        const tailX = m.x - m.vx * 14;
        const tailY = m.y - m.vy * 14;
        const gradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255,255,255,${0.95 * fade})`);
        gradient.addColorStop(0.3, `rgba(255,255,255,${0.35 * fade})`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        if (m.life >= m.maxLife) meteors.splice(i, 1);
      }
    };

    const loop = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };

    const onMouseMove = (event: MouseEvent) => {
      mouse.tx = event.clientX / width - 0.5;
      mouse.ty = event.clientY / height - 0.5;
    };

    // Static frame for reduced motion; redraw on scroll so parallax still reads
    const onScrollStatic = () => draw(0);

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      draw(0);
      window.addEventListener("scroll", onScrollStatic, { passive: true });
    } else {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScrollStatic);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Deep space gradient (neutral) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#111114_0%,#060607_55%,#000000_100%)]" />

      {/* Starfield */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.45)_100%)]" />
    </div>
  );
});

SpaceBackground.displayName = "SpaceBackground";

export default SpaceBackground;
