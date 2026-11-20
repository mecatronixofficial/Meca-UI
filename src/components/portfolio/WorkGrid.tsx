"use client";

import type { CSSProperties } from "react";
import type { Project } from "../../data/projects";
import { WorkProjectCard } from "./work/WorkProjectCard";
import { Reveal } from "../animations/Reveal";
import styles from "./work/work.module.css";

/** Project grid for /work: the featured project first, then the rest in alternating widths. */
export function WorkGrid({ projects }: { projects: Project[] }) {
  const featured = projects.find((project) => project.slug === "thangavel-textile");
  const ordered = featured ? [featured, ...projects.filter((project) => project !== featured)] : projects;

  return (
    <>
      <ul id="work-project-gallery" className={styles.projectGallery} aria-label="Selected projects">
        {ordered.map((project, index) => {
          const isFeatured = project === featured;
          const slot = index - (featured ? 1 : 0);
          const wide = slot % 4 === 1 || slot % 4 === 2;
          return (
            <li
              key={project.slug}
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
              {/* Rises in as it scrolls into view; neighbours in a row follow one after another */}
              <Reveal style={{ "--reveal-delay": `${(slot % 2) * 110}ms` } as CSSProperties}>
                <WorkProjectCard project={project} featured={isFeatured} index={projects.indexOf(project)} />
              </Reveal>
            </li>
          );
        })}
      </ul>
      {projects.length === 0 && (
        <p className={styles.emptyGallery}>Project details will appear here when work is added to the portfolio.</p>
      )}
    </>
  );
}
