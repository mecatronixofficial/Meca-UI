import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "../../data/projects";
import { cn } from "../../lib/cn";
import { ProjectVisual } from "../portfolio/work/ProjectVisual";
import styles from "./work-screens.module.css";

/** Copies of the project list per strip, so even a short list fills a wide screen. */
const MIN_CARDS = 6;

/**
 * Endless strip of project screenshots (or each project's designed cover until screenshots are
 * added), each linking to its case study. Pauses on hover or focus; holds still for reduced motion.
 */
export function WorkScreens({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  const cards = Array.from({ length: Math.ceil(MIN_CARDS / projects.length) }, () => projects).flat();

  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-4">
        <p className="flex items-center gap-3">
          <span className="relative flex size-2">
            <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-ping" />
            <span className="relative size-2 rounded-full bg-accent" />
          </span>
          <span className="text-label text-muted-ink">Recent work · on screen</span>
        </p>
        <Link href="/work" className="group inline-flex items-center gap-1.5 text-[13.5px] font-medium text-muted-ink hover:text-accent-ink">
          All work
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className={styles.viewport} style={{ "--work-duration": `${cards.length * 7}s` } as React.CSSProperties}>
        <Strip cards={cards} />
        <Strip cards={cards} hidden />
      </div>
    </div>
  );
}

function Strip({ cards, hidden }: { cards: Project[]; hidden?: boolean }) {
  return (
    <ul className={cn(styles.strip, hidden && styles.copy)} aria-hidden={hidden || undefined}>
      {cards.map((project, i) => (
        <li key={`${project.slug}-${i}`} className={styles.item}>
          <Link href={`/work/${project.slug}`} tabIndex={hidden ? -1 : undefined} className={styles.card}>
            <span className={styles.screen}>
              <ProjectVisual project={project} compact sizes="(min-width: 640px) 420px, 300px" />
              <span aria-hidden className={styles.overlay}>
                <span className={styles.cta}>
                  View case study
                  <ArrowUpRight className="size-4" strokeWidth={2.2} />
                </span>
              </span>
            </span>
            <span className="mt-3.5 flex items-baseline justify-between gap-3 px-1">
              <span className="truncate font-display text-[15.5px] font-semibold tracking-tight text-ink">{project.client}</span>
              <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">{project.industry}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
