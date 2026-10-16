import Image from "next/image";
import type { Project } from "../../data/projects";
import { cn } from "../../lib/cn";

/**
 * Project cover. Uses the first real screenshot when one is provided in
 * src/data/projects.ts; otherwise renders a designed, clearly abstract
 * wireframe cover (not presented as a screenshot of the client's site).
 */
export function ProjectCover({
  project,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  priority,
  className,
}: {
  project: Project;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const shot = project.images?.[0];

  if (shot) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  const { from, to, ink, kind } = project.cover;
  const block = { backgroundColor: ink };

  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden", className)}
      style={{ background: `linear-gradient(140deg, ${from} 0%, ${to} 100%)` }}
    >
      <div className="absolute inset-0 opacity-[0.35] mix-blend-multiply bg-grid-light" />
      <span className="absolute left-5 top-5 font-mono text-[10.5px] uppercase tracking-[0.16em] sm:left-7 sm:top-6" style={{ color: ink, opacity: 0.65 }}>
        {project.industry}
      </span>

      {/* Wireframe window */}
      <div
        className="absolute inset-x-[9%] bottom-0 top-[22%] rounded-t-xl border border-b-0 bg-white/55 p-[3.5%] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.35)] backdrop-blur-sm transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-2"
        style={{ borderColor: `${ink}22` }}
      >
        <div className="mb-[4%] flex items-center gap-[2%]">
          <span className="h-[6px] w-[14%] rounded-full opacity-70" style={block} />
          <span className="ml-auto h-[5px] w-[8%] rounded-full opacity-25" style={block} />
          <span className="h-[5px] w-[8%] rounded-full opacity-25" style={block} />
          <span className="h-[5px] w-[8%] rounded-full opacity-25" style={block} />
        </div>

        {kind === "store" && (
          <div className="grid h-[78%] grid-cols-4 gap-[3%]">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex flex-col gap-[6%]">
                <span className="flex-1 rounded-md opacity-[0.14]" style={block} />
                <span className="h-[5px] w-3/4 rounded-full opacity-40" style={block} />
              </div>
            ))}
          </div>
        )}

        {kind === "catalogue" && (
          <div className="grid h-[78%] grid-cols-[1.2fr_1fr] gap-[4%]">
            <span className="rounded-lg opacity-80" style={block} />
            <div className="flex flex-col gap-[6%]">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-1 items-center gap-[6%] rounded-md bg-white/60 p-[5%]">
                  <span className="aspect-square h-full rounded opacity-20" style={block} />
                  <span className="h-[5px] flex-1 rounded-full opacity-40" style={block} />
                </div>
              ))}
            </div>
          </div>
        )}

        {kind === "site" && (
          <div className="flex h-[78%] flex-col gap-[5%]">
            <div className="flex flex-1 flex-col justify-center gap-[6%] rounded-lg p-[5%]" style={{ backgroundColor: `${ink}14` }}>
              <span className="h-[9px] w-[55%] rounded-full opacity-80" style={block} />
              <span className="h-[9px] w-[40%] rounded-full opacity-80" style={block} />
              <span className="mt-[2%] h-[14px] w-[16%] rounded-full opacity-90" style={block} />
            </div>
            <div className="grid h-[32%] grid-cols-3 gap-[3%]">
              {[0, 1, 2].map((i) => (
                <span key={i} className="rounded-md opacity-[0.12]" style={block} />
              ))}
            </div>
          </div>
        )}

        {kind === "school" && (
          <div className="grid h-[78%] grid-cols-[1fr_1.6fr] gap-[4%]">
            <div className="flex flex-col gap-[7%] rounded-lg p-[7%]" style={{ backgroundColor: `${ink}12` }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className="h-[5px] rounded-full opacity-40" style={{ ...block, width: `${80 - i * 8}%` }} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-[5%]">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="rounded-lg opacity-[0.16]" style={block} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
