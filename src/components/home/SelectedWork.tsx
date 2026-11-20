import { getProjects } from "../../lib/content";
import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";
import { Button } from "../ui/Button";
import { ProjectCard } from "../portfolio/ProjectCard";
import { Reveal } from "../animations/Reveal";

export async function SelectedWork() {
  // Newest admin projects lead, then the hand-written ones
  const [feature, a, b, c, d] = await getProjects();

  return (
    <Section compact labelledBy="work-title">
      <Container>
        <SectionHeading
          id="work-title"
          align="split"
          eyebrow="Selected work"
          title={<>Selected work.<br />Real solutions.</>}
          intro="Explore digital experiences and business systems engineered for real-world needs."
        />

        <div className="mt-10 space-y-14 lg:mt-14 lg:space-y-20">
          {feature && (
            <Reveal>
              <ProjectCard project={feature} variant="feature" aspect="aspect-[16/10]" />
            </Reveal>
          )}

          <div className="grid gap-12 md:grid-cols-2 md:gap-10 lg:gap-14">
            {a && <Reveal><ProjectCard project={a} /></Reveal>}
            {b && (
              <Reveal className="md:mt-20" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
                <ProjectCard project={b} aspect="aspect-[4/5]" />
              </Reveal>
            )}
          </div>

          <div className="grid gap-12 md:grid-cols-12 md:gap-10 lg:gap-14">
            {c && <Reveal className="md:col-span-5 md:mt-16"><ProjectCard project={c} aspect="aspect-[4/5]" /></Reveal>}
            {d && (
              <Reveal className="md:col-span-7" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
                <ProjectCard project={d} aspect="aspect-[16/11]" />
              </Reveal>
            )}
          </div>
        </div>

        <Reveal className="mt-12 flex justify-center">
          <Button href="/work" variant="outline-light" size="lg" arrow>View all work</Button>
        </Reveal>
      </Container>
    </Section>
  );
}
