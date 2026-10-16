import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industryHighlights } from "../../data/industries";
import { industryIcons } from "../ui/icons";
import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";
import { cn } from "../../lib/cn";

// Bento spans for the six tiles (12-column grid on large screens)
const layout = [
  "lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
];

export function IndustriesSection() {
  return (
    <Section labelledBy="industries-title">
      <Container>
        <SectionHeading
          id="industries-title"
          align="split"
          eyebrow="Industries"
          title="Solutions for the way businesses work."
          intro="Every industry has its own workflows, vocabulary and pressure points. We build around them."
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-12">
          {industryHighlights.map((ind, i) => {
            const Icon = industryIcons[ind.icon];
            const featured = i === 0;
            return (
              <li
                key={ind.title}
                data-reveal
                style={{ "--reveal-delay": `${(i % 3) * 70}ms` } as React.CSSProperties}
                className={cn(layout[i], featured && "sm:col-span-2 lg:col-span-7")}
              >
                <Link
                  href={`/industries/${ind.anchor}`}
                  className={cn(
                    "spotlight group relative flex h-full flex-col overflow-hidden rounded-panel border p-7 transition-[border-color,translate,box-shadow] duration-500 hover:-translate-y-1 lg:p-8",
                    featured
                      ? "min-h-[320px] border-transparent bg-gradient-to-br from-accent via-accent-strong to-wine text-white shadow-glow [--spot:rgb(255_255_255/0.2)] hover:shadow-glow-lg lg:min-h-[420px]"
                      : "min-h-[240px] border-line bg-white text-ink hover:border-accent/30 hover:shadow-lift",
                  )}
                >
                  {featured && (
                    <>
                      <div aria-hidden className="absolute inset-0 bg-grid-inverse [mask-image:radial-gradient(ellipse_at_80%_20%,black,transparent_70%)]" />
                      <div aria-hidden className="absolute -right-20 -top-20 size-72 glow-white" />
                    </>
                  )}
                  <div className="relative flex items-start justify-between">
                    <span
                      className={cn(
                        "flex size-12 items-center justify-center rounded-2xl transition-[background-color,color,box-shadow,scale] duration-500 group-hover:scale-110",
                        featured ? "border border-white/25 bg-white/10 text-white group-hover:bg-white group-hover:text-accent" : "bg-white text-accent shadow-soft group-hover:bg-accent group-hover:text-white group-hover:shadow-glow",
                      )}
                    >
                      <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className={cn("size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5", featured ? "text-white/80" : "text-muted-ink group-hover:text-accent")}
                    />
                  </div>
                  <div className="relative mt-auto pt-10">
                    <h3 className={cn("font-semibold tracking-[-0.025em] transition-colors duration-300", featured ? "text-h2 max-w-md" : "text-[1.35rem] leading-tight group-hover:text-accent-ink")}>
                      {ind.title}
                    </h3>
                    <p className={cn("mt-3 max-w-md text-[15px] leading-relaxed", featured ? "text-white/90" : "text-muted-ink")}>{ind.text}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
