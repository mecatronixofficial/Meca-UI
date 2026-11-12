import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, GitBranch, Layers, Wrench } from "lucide-react";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { PauseOffscreen } from "../animations/PauseOffscreen";
import { AssemblyScene } from "../visuals/AssemblyScene";
import { serviceIcons } from "../ui/icons";
import { services } from "../../data/services";
import { industries } from "../../data/industries";
import { processSteps } from "../../data/process";
import { capabilities, techStack } from "../../data/company";
import { HeroContactLine, HeroStatus } from "./HeroStatus";
import styles from "./hero.module.css";

const delay = (ms: number) => ({ animationDelay: `${ms}ms` }) as React.CSSProperties;

const technologies = techStack.flatMap((group) => group.items);

/**
 * Home hero: a studio overview. Headline, live status and ways to get in touch on the left;
 * what we build, how we work and what we build with on the right; then the robot-cell animation.
 */
export function Hero() {
  const facts: [value: string, label: string, icon: typeof Layers][] = [
    [String(services.length), "Core services", Layers],
    [String(industries.length), "Industries served", BadgeCheck],
    [String(technologies.length), "Technologies", Wrench],
  ];

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-white pt-[72px] text-ink">
      <Container className="pt-12 sm:pt-16 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* ---------- Left: headline and next steps ---------- */}
          <div className="lg:col-span-7">
            <HeroStatus className="motion-safe:animate-rise" />

            <h1
              id="hero-title"
              className="mt-7 font-display text-[2.8rem] font-semibold leading-[1] tracking-[-0.045em] text-ink motion-safe:animate-lift sm:text-[4rem] lg:text-[4.4rem] xl:text-[5rem]"
              style={delay(60)}
            >
              Engineering software.
              <br />
              <span className="text-shimmer">Empowering businesses.</span>
            </h1>

            <p className="text-lead mt-7 max-w-xl text-muted-ink motion-safe:animate-lift" style={delay(160)}>
              We design and develop modern websites, powerful applications and intelligent business systems that help
              companies innovate, streamline operations and grow with confidence.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row motion-safe:animate-rise" style={delay(240)}>
              <Button href="/contact" size="lg" arrow>
                Start a Project
              </Button>
              <Button href="/services" size="lg" variant="outline-light">
                Explore Services
              </Button>
            </div>

            <HeroContactLine className="mt-7 motion-safe:animate-fade" />

            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-7 motion-safe:animate-fade" style={delay(380)}>
              {facts.map(([value, label, Icon]) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="hidden size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent sm:grid">
                    <Icon aria-hidden className="size-5" strokeWidth={1.8} />
                  </span>
                  <div>
                    <dt className="sr-only">{label}</dt>
                    <dd className="font-display text-[1.9rem] font-semibold leading-none tracking-tight text-ink">{value}</dd>
                    <dd className="mt-1.5 text-[13px] leading-snug text-muted-ink">{label}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* ---------- Right: the studio at a glance ---------- */}
          <div className="grid gap-4 self-start lg:col-span-5 motion-safe:animate-rise" style={delay(300)}>
            {/* What we build */}
            <section aria-labelledby="hero-build" className="rounded-panel border border-white/80 bg-white/75 p-5 shadow-lift backdrop-blur-md sm:p-6">
              <CardHeading id="hero-build" index="01" title="What we build" href="/services" link="All services" />
              <ul className="mt-4 grid grid-cols-2 gap-2">
                {services.map((s) => {
                  const Icon = serviceIcons[s.slug];
                  return (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="group flex items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2.5 text-[13.5px] font-medium text-surface transition-[border-color,color,translate] duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent-ink"
                      >
                        {Icon && (
                          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-paper text-accent transition-colors group-hover:bg-accent group-hover:text-white sm:size-8">
                            <Icon aria-hidden className="size-4" strokeWidth={1.8} />
                          </span>
                        )}
                        <span className="min-w-0 leading-tight">{s.navLabel}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* How we work */}
            <section aria-labelledby="hero-how" className="rounded-panel border border-white/80 bg-white/75 p-5 shadow-lift backdrop-blur-md sm:p-6">
              <CardHeading id="hero-how" index="02" title="How we work" href="/process" link="Our process" />
              <ol className="mt-5 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-6 lg:grid-cols-3">
                {processSteps.map((step) => (
                  <li key={step.n}>
                    <span className="flex items-center gap-2">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full border border-accent/30 bg-accent-soft font-mono text-[11px] font-semibold text-accent-ink">
                        {step.n}
                      </span>
                      <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent" />
                    </span>
                    <p className="mt-2 text-[12.5px] font-medium leading-snug text-surface">{step.title}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Built with */}
            <section aria-labelledby="hero-stack" className="rounded-panel border border-white/80 bg-white/75 p-5 shadow-lift backdrop-blur-md sm:p-6">
              <CardHeading id="hero-stack" index="03" title="Built with" />
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {technologies.map((t) => (
                  <li key={t} className="rounded-full border border-line bg-white px-2.5 py-1 font-mono text-[11.5px] text-muted-ink">
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* What every engagement gets */}
        <ul className="mt-14 grid gap-5 border-y border-line py-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 motion-safe:animate-fade" style={delay(500)} aria-label="Why Mecatronix">
          {capabilities.map((c) => (
            <li key={c.title} className="flex items-start gap-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ink text-white">
                <Check aria-hidden className="size-3.5" strokeWidth={2.6} />
              </span>
              <span>
                <span className="block text-[14px] font-semibold text-ink">{c.title}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-muted-ink">{c.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>

      {/* Robot cell: code → robotic arm → production → pipeline */}
      <div className="relative mt-14 pb-16 sm:mt-16 sm:pb-20 lg:mt-14 lg:pb-28">
        <Container wide>
          <div className="relative mx-auto max-w-[1240px] motion-safe:animate-rise" style={delay(320)}>
            <span aria-hidden className={styles.chip} style={{ left: "-1.5rem", top: "22%" }}>
              <span className="flex size-6 items-center justify-center rounded-full bg-accent text-white">
                <GitBranch className="size-3.5" strokeWidth={2} />
              </span>
              main · build passed
            </span>
            <span aria-hidden className={styles.chip} style={{ right: "-1.5rem", bottom: "18%" }}>
              <span className="flex size-6 items-center justify-center rounded-full bg-ink text-white">
                <Check className="size-3.5" strokeWidth={2.4} />
              </span>
              deployed to production
            </span>

            <PauseOffscreen>
              <div className={styles.frame}>
                <div className="relative overflow-hidden bg-white">
                  <div aria-hidden className="flex h-11 items-center justify-between gap-4 border-b border-line bg-paper px-4 sm:px-5">
                    <div className="flex items-center gap-3">
                      <span className="flex gap-1.5">
                        <span className="size-2.5 rounded-full bg-accent" />
                        <span className="size-2.5 rounded-full bg-line-strong" />
                        <span className="size-2.5 rounded-full bg-line-strong" />
                      </span>
                      <span className="font-mono text-[11px] text-muted-ink">mecatronix / robot-cell</span>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent-ink">
                      <span className="size-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
                      Running
                    </span>
                  </div>
                  <PauseOffscreen className="relative aspect-[5/4] bg-grid sm:aspect-[1200/520]">
                    <AssemblyScene className="absolute inset-0 size-full" />
                  </PauseOffscreen>
                </div>
              </div>
            </PauseOffscreen>
          </div>
        </Container>
        <p className="sr-only">
          Illustrative animation: code is written, a robotic arm moves the compiled module into production, and the
          deployment pipeline completes.
        </p>
      </div>
    </section>
  );
}

function CardHeading({ id, index, title, href, link }: { id: string; index: string; title: string; href?: string; link?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 id={id} className="flex items-center gap-2.5 font-display text-[15.5px] font-semibold tracking-tight text-ink">
        <span className="font-mono text-[11px] font-medium text-accent-ink">{index}</span>
        {title}
      </h2>
      {href && link && (
        <Link href={href} className="group inline-flex items-center gap-1 text-[12.5px] font-medium text-muted-ink hover:text-accent-ink">
          {link}
          <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
