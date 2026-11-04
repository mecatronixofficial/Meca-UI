import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "../../../data/projects";
import styles from "./work.module.css";

interface ProjectVisualProps {
  project: Project;
  compact?: boolean;
  priority?: boolean;
  sizes?: string;
}

/** Real screenshots when supplied; an explicitly abstract, typographic cover otherwise. */
export function ProjectVisual({
  project,
  compact = false,
  priority = false,
  sizes = "(min-width: 1024px) 55vw, 100vw",
}: ProjectVisualProps) {
  const image = project.images?.[0];
  const initials = project.client
    .split(/\s+/)
    .map((word) => word[0])
    .join("");

  return (
    <div
      className={`${styles.projectVisual} ${compact ? styles.compactVisual : ""}`}
      data-project={project.slug}
      data-kind={project.cover.kind}
    >
      <div className={styles.browserBar} aria-hidden="true">
        <span>
          <i />
          <i />
          <i />
        </span>
        <span>{image ? project.client : "MECATRONIX / PROJECT STUDY"}</span>
        <ArrowUpRight size={12} />
      </div>
      {image ? (
        <div className={styles.screenshot}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            className={styles.realImage}
          />
        </div>
      ) : (
        <div className={styles.abstractCover} aria-hidden="true">
          <div className={styles.coverGrid} />
          <div className={styles.coverGeometry}>
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <span className={styles.coverIndustry}>{project.industry}</span>
          <span className={styles.coverInitials}>{initials}</span>
          <div className={styles.coverTitle}>
            <span>{project.client}</span>
            <span>{project.scope[0]}</span>
          </div>
          <span className={styles.coverCross}>+</span>
        </div>
      )}
      <div className={styles.visualCaption}>
        <span>{image ? "PROJECT PREVIEW" : "ABSTRACT PROJECT COVER"}</span>
        <span>
          {project.cover.kind === "school"
            ? "EDUCATION / DIGITAL SYSTEMS"
            : "DESIGN / DEVELOPMENT"}
        </span>
      </div>
    </div>
  );
}
