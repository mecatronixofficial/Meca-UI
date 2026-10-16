import Link from "next/link";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { PauseOffscreen } from "../animations/PauseOffscreen";
import { AssemblyScene } from "../visuals/AssemblyScene";
import { services } from "../../data/services";

const delay = (ms: number) => ({ animationDelay: `${ms}ms` }) as React.CSSProperties;

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-white pt-[72px] text-ink">
      {/* Background: restrained light + engineering grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-40 right-[-10%] h-[620px] w-[720px] glow-accent" />
        <div className="absolute left-[-15%] top-[30%] h-[420px] w-[520px] glow-wine" />
      </div>

      <Container className="pt-14 sm:pt-20 lg:pt-28">
        <p className="text-label flex items-center gap-3 text-muted-ink motion-safe:animate-rise" style={delay(0)}>
          <span className="relative flex size-2">
            <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-ping" />
            <span className="relative size-2 rounded-full bg-accent" />
          </span>
          Software Engineering Studio • Coimbatore
        </p>

        <h1 id="hero-title" className="text-display mt-7 max-w-[13ch] text-ink motion-safe:animate-lift sm:max-w-none" style={delay(60)}>
          Engineering software.
          <br />
          <span className="text-gradient">Empowering businesses.</span>
        </h1>

        <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="text-lead max-w-xl text-muted-ink motion-safe:animate-lift" style={delay(160)}>
              We design and develop modern websites, powerful applications and intelligent business systems that help
              companies innovate, streamline operations and grow with confidence.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row motion-safe:animate-rise" style={delay(240)}>
              <Button href="/contact" size="lg" arrow>Start a Project</Button>
              <Button href="/work" size="lg" variant="outline-light">Explore Our Work</Button>
            </div>
          </div>

          <ul
            className="hidden gap-x-6 gap-y-2.5 border-l border-accent/30 pl-6 font-mono text-[12.5px] text-muted-ink lg:col-span-4 lg:col-start-9 lg:grid lg:grid-cols-2 motion-safe:animate-fade"
            style={delay(400)}
            aria-label="What we build"
          >
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="group inline-flex items-center gap-2 transition-colors hover:text-accent-ink">
                  <span className="inline-block text-accent transition-transform duration-300 group-hover:rotate-[24deg] group-hover:scale-125">/</span>
                  {s.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* Robot cell: code → robotic arm → production → pipeline */}
      <div className="relative mt-16 pb-16 sm:mt-20 sm:pb-20 lg:mt-24 lg:pb-24">
        <Container wide>
          <div
            className="relative mx-auto max-w-[1240px] overflow-hidden rounded-card border border-line bg-white shadow-window motion-safe:animate-rise"
            style={delay(320)}
          >
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
        </Container>
        <p className="sr-only">
          Illustrative animation: code is written, a robotic arm moves the compiled module into production, and the
          deployment pipeline completes.
        </p>
      </div>
    </section>
  );
}
