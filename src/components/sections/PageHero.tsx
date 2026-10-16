import type { Crumb } from "../../lib/seo";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { Container } from "../ui/Container";
import { Eyebrow } from "../ui/Heading";
import { cn } from "../../lib/cn";

const delay = (ms: number) => ({ animationDelay: `${ms}ms` }) as React.CSSProperties;

/** Opening banner for inner pages. `aside` renders beside the copy on large screens; `children` below it. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  intro,
  aside,
  children,
  className,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-white pt-[72px] text-ink", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_75%_70%_at_30%_0%,black,transparent)]" />
        <div className="absolute -top-48 right-[-5%] h-[520px] w-[620px] glow-accent" />
      </div>

      <Container className="pb-20 pt-10 sm:pb-24 lg:pb-28 lg:pt-14">
        <div className="motion-safe:animate-fade">
          <Breadcrumbs crumbs={crumbs} />
        </div>

        <div className={cn("mt-14 grid gap-12 lg:mt-20", !!aside && "lg:grid-cols-12 lg:items-end")}>
          <div className={cn(!!aside && "lg:col-span-7")}>
            <Eyebrow className="motion-safe:animate-rise">{eyebrow}</Eyebrow>
            <h1 className="text-h1 mt-6 max-w-5xl text-ink motion-safe:animate-lift" style={delay(60)}>
              {title}
            </h1>
            {intro && (
              <p className="text-lead mt-7 max-w-2xl text-muted-ink motion-safe:animate-lift" style={delay(140)}>
                {intro}
              </p>
            )}
          </div>
          {aside && (
            <div className="motion-safe:animate-rise lg:col-span-5" style={delay(220)}>
              {aside}
            </div>
          )}
        </div>
        {children && <div className="motion-safe:animate-rise" style={delay(260)}>{children}</div>}
      </Container>
    </section>
  );
}
