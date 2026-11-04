"use client";

import { useId, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { projectFilters, type Project } from "../../data/projects";
import { WorkProjectCard } from "./work/WorkProjectCard";
import styles from "./work/work.module.css";

/** Filterable project grid for /work. */
export function WorkGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<string>("all");
  const reducedMotion = useReducedMotion();
  const groupId = useId();
  const counts: Record<string, number> = { all: projects.length };
  for (const project of projects)
    counts[project.industryKey] = (counts[project.industryKey] ?? 0) + 1;
  const knownKeys = new Set<string>(projectFilters.map((item) => item.key));
  const filters: { key: string; label: string }[] = [
    ...projectFilters.filter((item) => item.key === "all" || counts[item.key]),
    ...Array.from(new Set(projects.map((project) => project.industryKey)))
      .filter((key) => !knownKeys.has(key))
      .map((key) => ({
        key,
        label: projects.find((project) => project.industryKey === key)!
          .industry,
      })),
  ];
  const visible =
    filter === "all"
      ? projects
      : projects.filter((project) => project.industryKey === filter);
  const featured = visible.find(
    (project) => project.slug === "thangavel-textile",
  );
  const ordered = featured
    ? [featured, ...visible.filter((project) => project !== featured)]
    : visible;

  return (
    <>
      <LayoutGroup id={groupId}>
        <div className={styles.filterToolbar}>
          <div
            role="group"
            aria-label="Filter projects by industry"
            className={styles.filters}
          >
            {filters.map((item) => (
              <button
                key={item.key}
                type="button"
                aria-pressed={filter === item.key}
                aria-controls="work-project-gallery"
                onClick={() => setFilter(item.key)}
              >
                {filter === item.key && (
                  <motion.span
                    className={styles.activeFilter}
                    layoutId="active-category"
                    transition={{ duration: reducedMotion ? 0 : 0.25 }}
                  />
                )}
                <span>{item.key === "all" ? "All Work" : item.label}</span>
                <span className={styles.filterCount}>
                  {String(counts[item.key] ?? 0).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
          <p className={styles.filterResult} role="status" aria-live="polite">
            <ArrowDownRight size={17} aria-hidden="true" />
            <span>
              SHOWING <strong>{String(visible.length).padStart(2, "0")}</strong>{" "}
              / {String(projects.length).padStart(2, "0")} PROJECTS
            </span>
          </p>
        </div>
        <ul
          id="work-project-gallery"
          className={styles.projectGallery}
          aria-label="Selected projects"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {ordered.map((project, index) => {
              const isFeatured = project === featured;
              const slot = index - (featured ? 1 : 0);
              const wide = slot % 4 === 1 || slot % 4 === 2;
              return (
                <motion.li
                  key={project.slug}
                  layout={reducedMotion ? false : "position"}
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
                  transition={{ duration: reducedMotion ? 0 : 0.24 }}
                  className={
                    isFeatured
                      ? styles.featuredSlot
                      : ordered.length === 1
                        ? styles.singleSlot
                        : wide
                          ? styles.galleryWide
                          : styles.galleryMedium
                  }
                  data-project-slug={project.slug}
                >
                  <WorkProjectCard
                    project={project}
                    featured={isFeatured}
                    index={projects.indexOf(project)}
                  />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </LayoutGroup>
      {projects.length === 0 && (
        <p className={styles.emptyGallery}>
          Project details will appear here when work is added to the portfolio.
        </p>
      )}
    </>
  );
}
