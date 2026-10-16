import type { Metadata } from "next";
import { projects } from "../../data/projects";
import { pageMetadata } from "../../lib/seo";
import { PageHero } from "../../components/sections/PageHero";
import { ContactCTA } from "../../components/sections/ContactCTA";
import { Container, Section } from "../../components/ui/Container";
import { WorkGrid } from "../../components/portfolio/WorkGrid";

export const metadata: Metadata = pageMetadata({
  title: "Our Work — Websites, E-commerce & Business Systems",
  description:
    "Selected projects by Mecatronix: websites, e-commerce storefronts and management systems for textile, manufacturing and education businesses in Tamil Nadu.",
  path: "/work",
  keywords: ["software development portfolio Coimbatore", "textile website development", "school management system", "industrial website design"],
  socialTitle: "Selected work. Real solutions.",
});

export default function WorkPage() {
  return (
    <>
      <PageHero
        crumbs={[{ path: "/work", label: "Work" }]}
        eyebrow="Work"
        title={<>Selected work. <span className="text-gradient">Real solutions.</span></>}
        intro="Websites, storefronts and business systems we've designed and built for companies in textiles, manufacturing and education."
      />

      <Section labelledBy="projects-heading" className="pt-14! lg:pt-20!">
        <Container>
          <h2 id="projects-heading" className="sr-only">Projects</h2>
          <WorkGrid projects={projects} />
        </Container>
      </Section>

      <ContactCTA
        title={<>Your project could be <span className="text-gradient">the next one here.</span></>}
      />
    </>
  );
}
