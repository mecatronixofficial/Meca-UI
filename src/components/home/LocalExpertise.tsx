import Link from "next/link";
import { serviceList } from "../../data/service-list";
import { localServices, regionalPath } from "../../data/local-seo";
import { getSiteContact } from "../../lib/site-contact.server";
import { whatsappLink } from "../../lib/site-contact";
import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";
import { Button } from "../ui/Button";

export async function LocalExpertise() {
  const contact = await getSiteContact();
  return (
    <Section compact labelledBy="local-expertise-title" tone="paper">
      <Container>
        <SectionHeading id="local-expertise-title" eyebrow="Coimbatore · Tamil Nadu" title="Software for the way your business works."
          intro="From a company website that brings in enquiries to software that connects sales, stock and operations, choose the starting point that fits your business." />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceList.map((service) => (
            <li key={service.slug} className="rounded-panel border border-line bg-white p-6">
              <h3 className="text-lg font-semibold text-surface">
                <Link href={`/services/${service.slug}`} className="hover:text-accent-ink hover:underline underline-offset-4">{localServices[service.slug].heading}</Link>
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-ink">{service.summary}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-8 border-t border-line pt-8 lg:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold text-surface">Based in Coimbatore. Working across Tamil Nadu.</h3>
            <p className="mt-3 text-base leading-relaxed text-muted-ink">Our team works with manufacturers, textile businesses, retailers, educational organisations and service companies. Explore our <Link href="/industries" className="text-accent-ink underline underline-offset-4">industry solutions</Link>, <Link href="/work" className="text-accent-ink underline underline-offset-4">project work</Link> and <Link href={regionalPath} className="text-accent-ink underline underline-offset-4">software development services across Tamil Nadu</Link>.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-surface">Tell us what you need to build.</h3>
            <p className="mt-3 text-base leading-relaxed text-muted-ink">Share your business, the problem you want to solve and your preferred timeline. We will discuss the requirements and a practical next step.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href="/contact">Request a project quote</Button>
              <Button href={whatsappLink(contact)} external variant="outline-light">Discuss on WhatsApp</Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
