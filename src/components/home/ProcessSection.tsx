import { processSteps } from "../../data/process";
import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";
import { ArrowLink } from "../ui/Button";
import { Reveal } from "../animations/Reveal";
import styles from "./process.module.css";

/** One emoji per step, in process order. */
const emojis = ["🔍", "🧭", "🎨", "💻", "🧪", "🚀"];
/** Soft tint behind each emoji, so every step has its own colour. */
const tints = ["#fff0ef", "#eef4ff", "#fdf0ff", "#ecfdf5", "#fff8e6", "#fff0ef"];

/** Step cards with an emoji each, joined by arrows; three per row on large screens. */
export function ProcessSection() {
  return (
    <Section compact labelledBy="process-title" tone="paper" className="overflow-hidden">
      <span aria-hidden className={styles.dots} />
      <Container className="relative">
        <SectionHeading
          id="process-title"
          align="split"
          eyebrow="Our process"
          title="From concept to confident launch."
          intro="A clear, collaborative process — so you always know what's happening, what's next and what we need from you."
        />

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
          {processSteps.map((step, i) => (
            <Reveal as="li" key={step.n} className="relative" style={{ "--reveal-delay": `${(i % 3) * 80}ms` } as React.CSSProperties}>
              <div className={styles.card} style={{ "--tint": tints[i % tints.length] } as React.CSSProperties}>
                <span aria-hidden className={styles.ghost}>{step.n}</span>
                <div className="flex items-center justify-between gap-3">
                  <span aria-hidden className={styles.emoji}>
                    <span>{emojis[i] ?? "✨"}</span>
                  </span>
                  <span className={styles.step}>Step {step.n}</span>
                </div>
                <h3 className="mt-5 font-display text-[1.15rem] font-semibold leading-snug tracking-tight text-ink transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-ink">{step.text}</p>
                <span aria-hidden className={styles.bar} />
              </div>
              {/* Arrow to the next step (desktop, within a row) */}
              {i < processSteps.length - 1 && (i + 1) % 3 !== 0 && (
                <span aria-hidden className={styles.next}>
                  →
                </span>
              )}
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-10">
          <ArrowLink href="/process">See the full process</ArrowLink>
        </Reveal>
      </Container>
    </Section>
  );
}
