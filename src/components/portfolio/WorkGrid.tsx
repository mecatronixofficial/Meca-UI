"use client";

import { useMemo, useState } from "react";
import { projectFilters, type Project } from "../../data/projects";
import { cn } from "../../lib/cn";
import { ProjectCard } from "./ProjectCard";

// Alternating editorial rhythm: wide, narrow-offset, narrow, wide...
const pattern = [
  { col: "md:col-span-7", aspect: "aspect-[16/11]", offset: "" },
  { col: "md:col-span-5", aspect: "aspect-[4/5]", offset: "md:mt-28" },
  { col: "md:col-span-5", aspect: "aspect-[4/5]", offset: "" },
  { col: "md:col-span-7", aspect: "aspect-[16/11]", offset: "md:mt-28" },
];

/** Filterable project grid for /work. */
export function WorkGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<string>("all");

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.industryKey === filter)),
    [filter, projects],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const p of projects) c[p.industryKey] = (c[p.industryKey] ?? 0) + 1;
    return c;
  }, [projects]);

  return (
    <>
      <div role="group" aria-label="Filter projects by industry" className="flex flex-wrap gap-2">
        {projectFilters
          .filter((f) => counts[f.key])
          .map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[14.5px] transition-colors",
                  active ? "border-accent bg-accent text-white shadow-glow" : "border-line-strong text-surface hover:border-accent hover:text-accent-ink",
                )}
              >
                {f.label}
                <span className={cn("font-mono text-[11px]", active ? "text-white/80" : "text-muted-ink")}>{counts[f.key]}</span>
              </button>
            );
          })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      <ul className="mt-14 grid gap-16 md:grid-cols-12 md:gap-x-10 md:gap-y-20 lg:gap-x-16">
        {visible.map((p, i) => {
          const slot = pattern[i % pattern.length];
          return (
            <li key={p.slug} className={cn(slot.col, slot.offset, "motion-safe:animate-rise")} style={{ animationDelay: `${(i % 4) * 60}ms` }}>
              <ProjectCard project={p} aspect={slot.aspect} headingLevel="h2" priority={i < 2} />
            </li>
          );
        })}
      </ul>
    </>
  );
}
