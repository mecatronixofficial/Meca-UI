import Link from "next/link";
import { ArrowUpRight, Check, Code2 } from "lucide-react";
import type { Project } from "../../../data/projects";
import { serviceList } from "../../../data/service-list";
import { Reveal } from "../../animations/Reveal";
import { ProjectVisual } from "./ProjectVisual";
import styles from "./work.module.css";

export function ProjectSpotlight({ project }: { project: Project }) {
  return (
    <section
      className={styles.spotlightSection}
      aria-labelledby="work-spotlight-title"
    >
      <div className={styles.contentWidth}>
        <Reveal className={styles.spotlightHeading}>
          <div>
            <p className={styles.eyebrow}>
              <span /> 03 / BEYOND THE INTERFACE
            </p>
            <h2 id="work-spotlight-title">
              A website is the beginning.
              <br />
              <span>The system is what’s next.</span>
            </h2>
          </div>
          <p>
            Thoughtful digital work connects what people see with the everyday
            operations behind it.
          </p>
        </Reveal>
        <Reveal className={styles.spotlightFrame}>
          <div className={styles.spotlightPicture}>
            <ProjectVisual
              project={project}
              sizes="(min-width: 1024px) 65vw, 100vw"
            />
          </div>
          <div className={styles.spotlightInfo}>
            <span className={styles.spotlightIcon}>
              <Code2 size={24} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <p className={styles.eyebrow}>
              IN FOCUS / {project.industry.toUpperCase()}
            </p>
            <h3>{project.client}</h3>
            <p>{project.overview}</p>
            <ul className={styles.spotlightScope} aria-label="Project scope">
              {project.scope.map((scope) => (
                <li key={scope}>
                  <Check size={14} aria-hidden="true" />
                  {scope}
                </li>
              ))}
            </ul>
            <div className={styles.spotlightServices}>
              {project.services.map((slug) => (
                <Link key={slug} href={`/services/${slug}`}>
                  {
                    serviceList.find((service) => service.slug === slug)
                      ?.navLabel
                  }
                  <ArrowUpRight size={12} aria-hidden="true" />
                </Link>
              ))}
            </div>
            <Link href={`/work/${project.slug}`} className={styles.textLink}>
              Explore the project <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
