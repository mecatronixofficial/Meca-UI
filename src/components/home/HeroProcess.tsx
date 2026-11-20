import Link from "next/link";
import { Code, Compass, PenTool, Rocket, Search, ShieldCheck } from "lucide-react";
import { processSteps } from "../../data/process";

const stepIcons = [Search, Compass, PenTool, Code, ShieldCheck, Rocket];

/** "How we work" for the hero: one link per process step, styled like the "What we build" list. */
export function HeroProcess() {
  return (
    <ol className="mt-4 grid grid-cols-2 gap-2">
      {processSteps.map((s, i) => {
        const Icon = stepIcons[i] ?? Code;
        return (
          <li key={s.n}>
            <Link
              href={`/process#step-${s.n}`}
              title={s.text}
              className="group flex items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2.5 text-[13.5px] font-medium text-surface transition-[border-color,color,translate] duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent-ink"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-paper text-accent transition-colors group-hover:bg-accent group-hover:text-white sm:size-8">
                <Icon aria-hidden className="size-4" strokeWidth={1.8} />
              </span>
              <span className="min-w-0 leading-tight">{s.title}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
