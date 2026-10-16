import { techStack } from "../../data/company";
import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";

export function TechSection() {
  return (
    <Section labelledBy="tech-title" className="overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" />
      <Container className="relative">
        <SectionHeading
          id="tech-title"
          align="split"
          eyebrow="Technology"
          title="Built with modern technologies."
          intro="A deliberately focused stack: mature, well-supported tools we know deeply, chosen for performance, maintainability and the long run."
        />

        <dl className="mt-16 border-t border-line lg:mt-20">
          {techStack.map((group, i) => (
            <div
              key={group.category}
              data-reveal
              style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
              className="group grid gap-4 border-b border-line py-7 md:grid-cols-12 md:items-center md:py-9"
            >
              <dt className="text-label flex items-center gap-2 text-accent-ink md:col-span-3">
                <span aria-hidden className="h-px w-0 bg-accent transition-[width] duration-500 group-hover:w-6" />
                {group.category}
              </dt>
              <dd className="md:col-span-9">
                <ul className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  {group.items.map((item, j) => (
                    <li key={item} className="flex items-center gap-3">
                      {j > 0 && <span aria-hidden className="text-accent/40 transition-colors group-hover:text-accent">/</span>}
                      <span className="cursor-default font-display text-[1.45rem] font-medium tracking-[-0.02em] text-ink transition-[color,translate] duration-300 hover:-translate-y-0.5 hover:text-accent sm:text-[1.9rem]">{item}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
