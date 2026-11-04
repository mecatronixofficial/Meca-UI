"use client";

import { useRef, type PointerEvent } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, Layers3 } from "lucide-react";
import type { Project } from "../../../data/projects";
import { ProjectVisual } from "./ProjectVisual";
import styles from "./work.module.css";

export function WorkHeroPreview({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.15 });
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 100, damping: 28 });
  const springY = useSpring(y, { stiffness: 100, damping: 28 });
  const previews = projects.slice(0, 3);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (
      reducedMotion ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.025);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.025);
  };

  return (
    <div
      ref={ref}
      className={styles.heroStage}
      data-in-view={inView}
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <div className={styles.stageGrid} aria-hidden="true" />
      <span className={styles.stageWord} aria-hidden="true">
        WORK.
      </span>
      <svg
        className={styles.stageLines}
        viewBox="0 0 500 440"
        aria-hidden="true"
        fill="none"
      >
        <path d="M25 330 150 100 440 70M150 100l260 260M25 330l385 30" />
        <circle cx="150" cy="100" r="4" />
        <circle cx="410" cy="360" r="4" />
      </svg>
      <motion.div
        className={styles.previewComposition}
        style={{ x: springX, y: springY }}
      >
        {previews.map((project, index) => (
          <motion.div
            key={project.slug}
            className={styles.previewLayer}
            data-layer={index}
            initial={false}
            animate={{
              y: inView && !reducedMotion ? [0, index === 1 ? 5 : -5, 0] : 0,
            }}
            transition={{
              duration: 6 + index,
              repeat: inView && !reducedMotion ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            <Link
              href={`/work/${project.slug}`}
              aria-label={`View ${project.client} case study`}
            >
              <ProjectVisual
                project={project}
                compact
                priority={index === 0}
                sizes="(min-width: 1024px) 30vw, 75vw"
              />
              <span className={styles.previewLabel}>
                {project.client}
                <ArrowUpRight size={13} aria-hidden="true" />
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
      <div className={styles.stageBadge}>
        <Layers3 size={16} aria-hidden="true" />
        <span>
          REAL BUSINESSES.
          <br />
          <strong>CONSIDERED DIGITAL WORK.</strong>
        </span>
      </div>
      <div className={styles.stageFooter}>
        <span>
          <i /> FROM OUR PROJECT ARCHIVE
        </span>
        <span>MX / SELECTED WORK</span>
      </div>
    </div>
  );
}

export function ProjectCount({ count }: { count: number }) {
  const reducedMotion = useReducedMotion();
  return (
    <div className={styles.projectCount}>
      <motion.span
        initial={false}
        whileInView={{ y: reducedMotion ? 0 : [5, 0] }}
        viewport={{ once: true }}
        transition={{ duration: reducedMotion ? 0 : 0.6 }}
      >
        {String(count).padStart(2, "0")}
      </motion.span>
      <span>
        SELECTED
        <br />
        PROJECTS
      </span>
    </div>
  );
}
