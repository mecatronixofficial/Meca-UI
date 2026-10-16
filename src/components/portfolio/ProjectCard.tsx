import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "../../data/projects";
import { getService } from "../../data/services";
import { cn } from "../../lib/cn";
import { ProjectCover } from "./ProjectCover";

/**
 * Editorial project card. "feature" puts the cover and details side by side;
 * "standard" stacks them. The title link is stretched over the whole card.
 */
export function ProjectCard({
  project,
  variant = "standard",
  aspect = "aspect-[4/3]",
  headingLevel = "h3",
  className,
  priority,
}: {
  project: Project;
  variant?: "feature" | "standard";
  aspect?: string;
  headingLevel?: "h2" | "h3";
  className?: string;
  priority?: boolean;
}) {
  const Heading = headingLevel;
  const serviceNames = project.services.map((s) => getService(s)?.navLabel).filter(Boolean) as string[];

  const details = (
    <div className={cn(variant === "feature" ? "lg:col-span-4 lg:flex lg:flex-col lg:justify-end lg:pb-2" : "mt-6")}>
      <p className="text-label text-muted-ink">{project.industry}</p>
      <Heading className="mt-3 text-h3 text-surface transition-colors duration-300 group-hover:text-accent-ink">
        <Link href={`/work/${project.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
          {project.client}
        </Link>
      </Heading>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-ink">{project.summary}</p>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Services delivered">
        {serviceNames.map((s) => (
          <li key={s} className="rounded-full border border-line-strong/80 px-3 py-1 text-[12.5px] text-surface/80 transition-colors duration-300 group-hover:border-accent/30 group-hover:bg-sand">
            {s}
          </li>
        ))}
      </ul>
      <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-surface transition-colors group-hover:text-accent-ink">
        View case study
        <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </div>
  );

  return (
    <article
      className={cn(
        "group relative rounded-panel focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-accent",
        variant === "feature" && "grid gap-8 lg:grid-cols-12 lg:gap-10",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-panel shadow-soft transition-shadow duration-500 group-hover:shadow-lift",
          variant === "feature" ? "lg:col-span-8" : "",
        )}
      >
        <ProjectCover
          project={project}
          priority={priority}
          className={cn(aspect, "w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]")}
          sizes={variant === "feature" ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 45vw, 100vw"}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-accent/20 via-accent/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-5 right-5 flex size-14 translate-y-3 scale-75 items-center justify-center rounded-full bg-accent text-white opacity-0 shadow-glow transition-[opacity,translate,scale] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>
      {details}
    </article>
  );
}
