import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { industries } from "../../../data/industries";
import { getService } from "../../../data/services";
import { projects } from "../../../data/projects";
import { pageMetadata } from "../../../lib/seo";
import { PageHero } from "../../../components/sections/PageHero";
import { ContactCTA } from "../../../components/sections/ContactCTA";
import { Container, Section } from "../../../components/ui/Container";
import { Button } from "../../../components/ui/Button";
import { industryIcons } from "../../../components/ui/icons";
import { ProjectCard } from "../../../components/portfolio/ProjectCard";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const current = industries.find((item) => item.slug === slug);
  if (!current) notFound();
  return pageMetadata({
    title: `${current.name} Software Solutions`,
    description: current.useCase,
    path: `/industries/${current.slug}`,
  });
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = industries.find((item) => item.slug === slug);
  if (!industry) notFound();
  const Icon = industryIcons[industry.icon];
  const relatedWork = projects.filter((project) => project.industryKey === slug);

  return (
    <>
      <PageHero
        crumbs={[{ path: "/industries", label: "Industries" }, { path: `/industries/${slug}`, label: industry.name }]}
        eyebrow="Industry solutions"
        title={<>{industry.name} <span className="text-gradient">software solutions.</span></>}
        intro={industry.intro}
        aside={
          <div className="rounded-panel border border-line bg-paper p-8">
            <Icon aria-hidden className="size-10 text-accent" strokeWidth={1.5} />
            <p className="text-label mt-6 text-accent-ink">Built around your business</p>
            <p className="text-lead mt-4 text-surface">{industry.useCase}</p>
          </div>
        }
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/contact" arrow>Discuss your project</Button>
          <Button href="/industries" variant="outline-light">All industries</Button>
        </div>
      </PageHero>

      <Section labelledBy="workflows-title">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-panel border border-line bg-paper p-8 sm:p-10">
              <h2 id="workflows-title" className="text-h3 text-ink">Workflows we support</h2>
              <ul className="mt-7 space-y-4">
                {industry.workflows.map((workflow) => (
                  <li key={workflow} className="flex gap-3 text-surface"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />{workflow}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-panel bg-gradient-to-br from-accent via-accent-strong to-wine p-8 text-white sm:p-10">
              <h2 className="text-h3">What we can build</h2>
              <ul className="mt-7 space-y-4">
                {industry.solutions.map((solution) => <li key={solution}>{solution}</li>)}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="services-title">
        <Container>
          <h2 id="services-title" className="text-h2 text-ink">Services for {industry.name}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {industry.services.map((serviceSlug) => {
              const service = getService(serviceSlug);
              if (!service) return null;
              return (
                <Link key={serviceSlug} href={`/services/${serviceSlug}`} className="group rounded-panel border border-line bg-paper p-7 transition-colors hover:border-accent">
                  <h3 className="flex items-start justify-between gap-4 text-h3 text-ink">{service.navLabel}<ArrowUpRight aria-hidden className="size-5 shrink-0 text-accent" /></h3>
                  <p className="mt-4 leading-relaxed text-muted-ink">{service.summary}</p>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      {relatedWork.length > 0 && (
        <Section labelledBy="work-title">
          <Container>
            <h2 id="work-title" className="text-h2 text-ink">Related work</h2>
            <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {relatedWork.map((project) => <ProjectCard key={project.slug} project={project} />)}
            </div>
          </Container>
        </Section>
      )}

      <Section labelledBy="industries-title">
        <Container>
          <h2 id="industries-title" className="text-h2 text-ink">Explore other industries</h2>
          <nav aria-label="Other industries" className="mt-8 flex flex-wrap gap-3">
            {industries.filter((item) => item.slug !== slug).map((item) => (
              <Button key={item.slug} href={`/industries/${item.slug}`} variant="outline-light">{item.name}</Button>
            ))}
          </nav>
        </Container>
      </Section>
      <ContactCTA />
    </>
  );
}
