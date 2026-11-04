import { projects } from "../../data/projects";
import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";
import { Button } from "../ui/Button";
import { ProjectCard } from "../portfolio/ProjectCard";
import { Reveal } from "../animations/Reveal";

export function SelectedWork() {
  const [feature, a, b, c, d] = projects;

  return (
    <Section labelledBy="work-title">
      <Container>
        <SectionHeading
          id="work-title"
          align="split"
          eyebrow="Selected work"
          title={<>Selected work.<br />Real solutions.</>}
          intro="Explore digital experiences and business systems engineered for real-world needs."
        />

        <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-28">
          {feature && (
            <Reveal>
              <ProjectCard project={feature} variant="feature" aspect="aspect-[16/10]" />
            </Reveal>
          )}

          <div className="grid gap-16 md:grid-cols-2 md:gap-10 lg:gap-16">
            {a && <Reveal><ProjectCard project={a} /></Reveal>}
            {b && (
              <Reveal className="md:mt-32" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
                <ProjectCard project={b} aspect="aspect-[4/5]" />
              </Reveal>
            )}
          </div>

          <div className="grid gap-16 md:grid-cols-12 md:gap-10 lg:gap-16">
            {c && <Reveal className="md:col-span-5 md:mt-24"><ProjectCard project={c} aspect="aspect-[4/5]" /></Reveal>}
            {d && (
              <Reveal className="md:col-span-7" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
                <ProjectCard project={d} aspect="aspect-[16/11]" />
              </Reveal>
            )}
          </div>
        </div>

        <Reveal className="mt-20 flex justify-center">
          <Button href="/work" variant="outline-light" size="lg" arrow>View all work</Button>
        </Reveal>
      </Container>
    </Section>
  );
}
