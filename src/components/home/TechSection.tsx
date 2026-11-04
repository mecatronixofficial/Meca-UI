import { techStack } from "../../data/company";
import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";
import { Backdrop } from "../visuals/Backdrop";
import { Reveal } from "../animations/Reveal";

export function TechSection() {
  return (
    <Section labelledBy="tech-title" tone="dark" className="overflow-hidden">
      <Backdrop
        tone="dark"
        image="circuit"
        imageClassName="[mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        aurora
        beams
      />
      <Container className="relative">
        <SectionHeading
          id="tech-title"
          align="split"
          tone="dark"
          eyebrow="Technology"
          title={<>Built with <span className="text-shimmer-light">modern technologies.</span></>}
          intro="A deliberately focused stack: mature, well-supported tools we know deeply, chosen for performance, maintainability and the long run."
        />

        <dl className="mt-16 overflow-hidden rounded-panel border border-white/10 bg-white/[0.03] backdrop-blur-sm lg:mt-20">
          {techStack.map((group, i) => (
            <Reveal
              key={group.category}
              style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
              className="spotlight group relative grid gap-4 border-b border-white/10 px-6 py-7 [--spot:rgb(255_82_71/0.12)] last:border-b-0 md:grid-cols-12 md:items-center md:px-10 md:py-9"
            >
              <dt className="text-label flex items-center gap-2 text-accent-glow md:col-span-3">
                <span aria-hidden className="h-px w-0 bg-accent-glow transition-[width] duration-500 group-hover:w-6" />
                {group.category}
              </dt>
              <dd className="md:col-span-9">
                <ul className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  {group.items.map((item, j) => (
                    <li key={item} className="flex items-center gap-3">
                      {j > 0 && <span aria-hidden className="text-accent-glow/40 transition-colors group-hover:text-accent-glow">/</span>}
                      <span className="cursor-default font-display text-[1.45rem] font-medium tracking-[-0.02em] text-white transition-[color,translate] duration-300 hover:-translate-y-0.5 hover:text-accent-glow sm:text-[1.9rem]">{item}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
