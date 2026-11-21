import Link from "next/link";
import { pageMetadata, faqJsonLd, serviceJsonLd } from "../../lib/seo";
import { localFaqs, localServices, regionalPath } from "../../data/local-seo";
import { serviceList } from "../../data/service-list";
import { getSiteContact } from "../../lib/site-contact.server";
import { whatsappLink } from "../../lib/site-contact";
import JsonLd from "../../components/seo/JsonLd";
import { PageHero } from "../../components/sections/PageHero";
import { Faq } from "../../components/sections/Faq";
import { Container, Section } from "../../components/ui/Container";
import { Button } from "../../components/ui/Button";

const description = "Software development for Tamil Nadu businesses from Mecatronix in Coimbatore. Websites, mobile apps, ecommerce, custom ERP and automation. Discuss your project.";

export const metadata = pageMetadata({
  title: "Software Development Company in Tamil Nadu",
  description,
  path: regionalPath,
});

export default async function TamilNaduPage() {
  const contact = await getSiteContact();
  return (
    <>
      <JsonLd data={serviceJsonLd({ name: "Software development for Tamil Nadu businesses", description, path: regionalPath })} />
      <JsonLd data={faqJsonLd(localFaqs)} />
      <PageHero crumbs={[{ path: regionalPath, label: "Tamil Nadu" }]} eyebrow="Coimbatore studio · Tamil Nadu businesses"
        title="Software development company in Tamil Nadu"
        intro="Mecatronix builds business websites, applications and connected operational software from Coimbatore. We work with businesses across Tamil Nadu on the systems they need to attract customers, manage work and grow.">
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/contact" size="lg">Request a project quote</Button>
          <Button href={whatsappLink(contact, "Hi Mecatronix, I run a business in Tamil Nadu and would like to discuss a software project.")} external variant="outline-light" size="lg">Chat on WhatsApp</Button>
        </div>
      </PageHero>
      <Section labelledBy="regional-services-title">
        <Container>
          <h2 id="regional-services-title" className="text-h2 text-surface">Choose the right starting point.</h2>
          <p className="text-lead mt-6 max-w-3xl text-muted-ink">A new website, a mobile experience and an internal ERP solve different problems. Start with the outcome your business needs, then scope the technology and integrations around it.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {serviceList.map((service) => (
              <article key={service.slug} className="rounded-panel border border-line bg-white p-7">
                <h3 className="text-xl font-semibold text-surface"><Link href={`/services/${service.slug}`} className="hover:text-accent-ink hover:underline underline-offset-4">{service.title}</Link></h3>
                <p className="mt-4 text-base leading-relaxed text-muted-ink">{service.benefit}</p>
                <ul className="mt-5 list-disc space-y-2 pl-5 text-base text-muted-ink marker:text-accent">
                  {localServices[service.slug].examples.map((example) => <li key={example}>{example}</li>)}
                </ul>
                <Link href={`/contact?service=${service.slug}`} className="mt-6 inline-block font-medium text-accent-ink underline underline-offset-4">Discuss {service.navLabel.toLowerCase()}</Link>
              </article>
            ))}
          </div>
        </Container>
      </Section>
      <Section labelledBy="regional-industries-title" tone="paper">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 id="regional-industries-title" className="text-h2 text-surface">Built around your operations.</h2>
              <p className="mt-6 text-base leading-relaxed text-muted-ink">For a manufacturer, the first priority may be an accurate view of materials and production. A textile business may need product variants and dispatch tracking. A retailer may need a store that keeps stock and orders aligned. We use these workflows to define a focused first release.</p>
              <div className="mt-6 flex flex-wrap gap-4 text-base text-accent-ink underline underline-offset-4">
                <Link href="/industries/manufacturing">Manufacturing software</Link>
                <Link href="/industries/textiles">Textile business systems</Link>
                <Link href="/industries">All industry solutions</Link>
              </div>
            </div>
            <div>
              <h2 className="text-h3 text-surface">A Coimbatore team, with a clear delivery process.</h2>
              <p className="mt-6 text-base leading-relaxed text-muted-ink">Our studio is in {contact.address.city}, {contact.address.state}. Businesses elsewhere in Tamil Nadu can work with us through calls, shared requirements and demonstrations. We agree the scope, project milestones, handover and support arrangements before the build.</p>
              <p className="mt-4 text-base leading-relaxed text-muted-ink">Chennai, Tiruppur, Erode, Salem and Madurai businesses can discuss their requirements with the same Coimbatore team. Project discussions outside Coimbatore are arranged remotely; contact us to agree any on-site requirements.</p>
              <div className="mt-6 flex flex-wrap gap-4 text-base text-accent-ink underline underline-offset-4"><Link href="/process">How projects are delivered</Link><Link href="/work">Explore our work</Link><Link href="/about">Meet Mecatronix</Link></div>
            </div>
          </div>
        </Container>
      </Section>
      <Section labelledBy="regional-quote-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 id="regional-quote-title" className="text-h2 text-surface">What goes into your project quote?</h2>
              <p className="mt-6 text-base leading-relaxed text-muted-ink">The scope depends on your users, workflows, content, integrations and existing data. A useful brief helps us separate the first release from features that can follow later.</p>
              <ul className="mt-6 list-disc space-y-3 pl-5 text-base text-muted-ink">
                <li>Your business, location and the problem the project should solve.</li>
                <li>The pages, screens or modules you need first.</li>
                <li>Existing software, data and services the new system must connect to.</li>
                <li>Your preferred launch date, budget range and support needs.</li>
              </ul>
            </div>
            <div className="rounded-panel border border-line bg-paper p-8">
              <h3 className="text-h3 text-surface">Talk to our team.</h3>
              <address className="mt-5 not-italic text-base leading-relaxed text-muted-ink">{contact.address.full}</address>
              <p className="mt-3 text-base text-muted-ink">{contact.hours}</p>
              <div className="mt-6 flex flex-col items-start gap-4 font-medium text-accent-ink">
                <a href={`tel:${contact.phone}`}>Call {contact.phoneDisplay}</a>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                <a href={contact.address.directionsUrl} target="_blank" rel="noopener noreferrer">Directions to our Coimbatore studio</a>
              </div>
              <Button href="/contact" className="mt-8">Send your project requirements</Button>
            </div>
          </div>
        </Container>
      </Section>
      <Faq faqs={localFaqs} title="Planning a project in Tamil Nadu" />
    </>
  );
}
