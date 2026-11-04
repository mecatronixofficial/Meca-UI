"use client";

import type { PointerEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { Project } from "../../../data/projects";
import { serviceList } from "../../../data/service-list";
import { ProjectVisual } from "./ProjectVisual";
import styles from "./work.module.css";

export function WorkProjectCard({
  project,
  index,
  featured = false,
}: {
  project: Project;
  index: number;
  featured?: boolean;
}) {
  const move = (event: PointerEvent<HTMLAnchorElement>) => {
    if (
      event.pointerType !== "mouse" ||
      !window.matchMedia(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      ).matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--project-x",
      `${event.clientX - rect.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--project-y",
      `${event.clientY - rect.top}px`,
    );
  };

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`${styles.projectCard} ${featured ? styles.featuredCard : ""}`}
      onPointerMove={move}
    >
      <div className={styles.projectImage}>
        <div className={styles.projectImageHeader}>
          <span>
            {featured ? "FEATURED PROJECT" : project.industry.toUpperCase()}
          </span>
          <span>{String(index + 1).padStart(2, "0")} /</span>
        </div>
        <ProjectVisual
          project={project}
          sizes={
            featured
              ? "(min-width: 1024px) 62vw, 100vw"
              : "(min-width: 768px) 50vw, 100vw"
          }
        />
        <span className={styles.imageAction}>
          VIEW PROJECT <ArrowUpRight size={15} aria-hidden="true" />
        </span>
      </div>
      <div className={styles.projectInfo}>
        <p className={styles.eyebrow}>
          {featured ? "TEXTILE WEBSITE & E-COMMERCE" : project.industry}
        </p>
        <h3>
          {project.client}
          <ArrowUpRight size={24} aria-hidden="true" />
        </h3>
        <p className={styles.projectSummary}>{project.summary}</p>
        <ul className={styles.serviceTags} aria-label="Services delivered">
          {project.services.map((slug) => (
            <li key={slug}>
              {serviceList.find((service) => service.slug === slug)?.navLabel ??
                slug}
            </li>
          ))}
        </ul>
        {featured && (
          <div className={styles.featuredScope}>
            <span>THE PROJECT</span>
            <p>{project.scope.slice(0, 3).join(" / ")}</p>
          </div>
        )}
        <span className={styles.caseStudyLink}>
          {featured ? "Explore Case Study" : "View Case Study"}
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
