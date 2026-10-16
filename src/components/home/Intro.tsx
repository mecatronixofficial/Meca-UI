import { capabilities } from "../../data/company";
import { site } from "../../lib/site";
import { cn } from "../../lib/cn";
import { Container, Section } from "../ui/Container";
import { Eyebrow } from "../ui/Heading";
import { ArrowLink } from "../ui/Button";
import { PauseOffscreen } from "../animations/PauseOffscreen";
import { VisionScene } from "../visuals/VisionScene";
import frame from "../visuals/VisionScene.module.css";

export function Intro() {
  return (
    <Section labelledBy="intro-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7" data-reveal>
            <Eyebrow>Who we are</Eyebrow>
            <h2 id="intro-title" className="text-h1 mt-6 text-surface">
              Your vision.
              <br />
              <span className="text-gradient">Our engineering.</span>
            </h2>
            <PauseOffscreen className="mt-10 max-w-[640px] lg:mt-12">
              <VisionScene className="block h-auto w-full" />
            </PauseOffscreen>
          </div>

          <div className="lg:col-span-5" data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
            <PauseOffscreen>
              <div className={cn(frame.frame, "p-8 lg:p-10")}>
                {/* Blueprint corner marks */}
                {["left-3 top-3 border-l-2 border-t-2", "right-3 top-3 border-r-2 border-t-2", "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"].map((pos) => (
                  <span key={pos} aria-hidden className={cn("absolute size-3 rounded-[2px] border-accent", pos)} />
                ))}

                <p className="text-label flex items-center gap-2.5 text-muted-ink">
                  <span className="relative flex size-1.5">
                    <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-ping" />
                    <span className="relative size-1.5 rounded-full bg-accent" />
                  </span>
                  Studio · {site.address.city}, {site.address.country}
                </p>
                <p className="text-lead mt-6 text-muted-ink">
                  Mecatronix Software Development partners with businesses to transform ideas, workflows and challenges into
                  reliable digital solutions — from the first conversation to the system your team uses every day.
                </p>
                <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
                  <ArrowLink href="/about" className="whitespace-nowrap">More about Mecatronix</ArrowLink>
                  <span aria-hidden className="hidden whitespace-nowrap font-mono text-[11px] tracking-[0.14em] text-accent-ink sm:inline">VISION → CODE</span>
                </div>
              </div>
            </PauseOffscreen>
          </div>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {capabilities.map((c, i) => (
            <li
              key={c.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
              className="spotlight group relative bg-white p-7 lg:p-8"
            >
              <span className="-ml-1.5 inline-block rounded-md px-1.5 py-0.5 font-mono text-xs text-accent-ink transition-colors duration-300 group-hover:bg-accent group-hover:text-white">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-10 text-[1.3rem] font-semibold leading-tight tracking-tight text-surface transition-colors duration-300 group-hover:text-accent-ink lg:mt-16">{c.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-ink">{c.text}</p>
              <span aria-hidden className="mt-6 block h-px w-8 bg-accent transition-[width] duration-500 group-hover:w-16" />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
