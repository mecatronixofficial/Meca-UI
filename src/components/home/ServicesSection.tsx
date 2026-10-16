import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";
import { ArrowLink } from "../ui/Button";
import { ServicesExplorer } from "./ServicesExplorer";

export function ServicesSection() {
  return (
    <Section labelledBy="services-title">
      <Container>
        <SectionHeading
          id="services-title"
          align="split"
          eyebrow="What we do"
          title="Digital solutions built around your business."
          intro="Six focused disciplines, one engineering team. Most projects combine several — a website with an ordering portal, an ERP with a mobile app."
        />
        <div className="mt-14 lg:mt-20" data-reveal>
          <ServicesExplorer />
        </div>
        <div className="mt-12" data-reveal>
          <ArrowLink href="/services">Compare all services</ArrowLink>
        </div>
      </Container>
    </Section>
  );
}
