import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";
import { ArrowLink } from "../ui/Button";
import { ServicesExplorer } from "./ServicesExplorer";
import { Reveal } from "../animations/Reveal";
import { Backdrop } from "../visuals/Backdrop";

export function ServicesSection() {
  return (
    <Section labelledBy="services-title" tone="paper" className="overflow-hidden">
      <Backdrop image="contours" imageClassName="opacity-80 [mask-image:linear-gradient(to_left,black,transparent_70%)]" motes />
      <Container className="relative">
        <SectionHeading
          id="services-title"
          align="split"
          eyebrow="What we do"
          title="Digital solutions built around your business."
          intro="Six focused disciplines, one engineering team. Most projects combine several — a website with an ordering portal, an ERP with a mobile app."
        />
        <Reveal className="mt-14 lg:mt-20">
          <ServicesExplorer />
        </Reveal>
        <Reveal className="mt-12">
          <ArrowLink href="/services">Compare all services</ArrowLink>
        </Reveal>
      </Container>
    </Section>
  );
}
