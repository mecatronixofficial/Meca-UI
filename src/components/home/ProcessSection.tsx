import { processSteps } from "../../data/process";
import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";
import { ArrowLink } from "../ui/Button";

/** Horizontal timeline on large screens, vertical on small ones. */
export function ProcessSection() {
  return (
    <Section labelledBy="process-title">
      <Container>
        <SectionHeading
          id="process-title"
          align="split"
          eyebrow="Our process"
          title="From concept to confident launch."
          intro="A clear, collaborative process — so you always know what's happening, what's next and what we need from you."
        />

        <ol className="relative mt-16 grid gap-0 lg:mt-24 lg:grid-cols-6 lg:gap-6">
          {/* Connecting line (desktop) */}
          <span aria-hidden className="absolute left-0 right-0 top-[19px] hidden h-px bg-gradient-to-r from-accent via-line-strong to-line-strong lg:block" />

          {processSteps.map((step, i) => (
            <li
              key={step.n}
              data-reveal
              style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
              className="group relative grid grid-cols-[40px_1fr] gap-x-5 pb-10 last:pb-0 lg:block lg:pb-0"
            >
              {/* Vertical line (mobile) */}
              {i < processSteps.length - 1 && (
                <span aria-hidden className="absolute bottom-0 left-[19.5px] top-10 w-px bg-line-strong lg:hidden" />
              )}
              <span className="relative z-10 flex size-10 items-center justify-center rounded-full border border-line-strong bg-paper font-mono text-[12px] text-surface transition-[background-color,border-color,color,box-shadow,scale] duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110 group-hover:border-accent group-hover:bg-accent group-hover:text-white group-hover:shadow-glow">
                {i === 0 ? <span className="size-2.5 rounded-full bg-accent transition-colors group-hover:bg-white" /> : step.n}
              </span>
              <div className="transition-[translate] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 lg:mt-8 lg:group-hover:-translate-y-1 lg:group-hover:translate-x-0">
                <p className="font-mono text-xs text-accent-ink lg:hidden">{step.n}</p>
                <h3 className="mt-1 text-[1.2rem] font-semibold leading-snug tracking-tight text-surface transition-colors duration-300 group-hover:text-accent-ink lg:mt-0">{step.title}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted-ink">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14" data-reveal>
          <ArrowLink href="/process">See the full process</ArrowLink>
        </div>
      </Container>
    </Section>
  );
}
