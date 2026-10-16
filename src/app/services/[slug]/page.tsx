import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { getService, services } from "../../../data/services";
import { industries } from "../../../data/industries";
import { projects } from "../../../data/projects";
import { faqJsonLd, pageMetadata, serviceJsonLd } from "../../../lib/seo";
import { cn } from "../../../lib/cn";
import JsonLd from "../../../components/seo/JsonLd";
import { PageHero } from "../../../components/sections/PageHero";
import { ContactCTA } from "../../../components/sections/ContactCTA";
import { Faq } from "../../../components/sections/Faq";
import { Container, Section } from "../../../components/ui/Container";
import { Eyebrow, SectionHeading } from "../../../components/ui/Heading";
import { Button } from "../../../components/ui/Button";
import { serviceIcons } from "../../../components/ui/icons";
import { ServiceVisual } from "../../../components/visuals/ServiceVisual";
import { ProjectCard } from "../../../components/portfolio/ProjectCard";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return pageMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: `/services/${service.slug}`,
    keywords: service.seo.keywords,
    socialTitle: service.hero.headline,
  });
}

// Wide browser mockups sit under the hero; compact ones (phone, flow) beside it
const SIDE_VISUALS = new Set(["phone", "automation"]);

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const path = `/services/${service.slug}`;
  const Icon = serviceIcons[service.slug];
  const related = projects.filter((p) => p.services.includes(service.slug)).slice(0, 2);
  const relatedIndustries = industries.filter((ind) => service.industries.includes(ind.slug));
  const otherServices = services.filter((s) => s.slug !== service.slug);
  const sideVisual = SIDE_VISUALS.has(service.visual);

  return (
    <>
      <JsonLd data={serviceJsonLd({ name: service.title, description: service.seo.description, path })} />
      <JsonLd data={faqJsonLd(service.faqs)} />

      <PageHero
        crumbs={[{ path: "/services", label: "Services" }, { path, label: service.title }]}
        eyebrow={service.hero.eyebrow}
        title={service.hero.headline}
        intro={service.hero.intro}
        aside={sideVisual ? <ServiceVisual kind={service.visual} /> : undefined}
      >
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/contact" size="lg" arrow>Discuss your project</Button>
          <Button href="#deliverables" size="lg" variant="outline-light">What you get</Button>
        </div>
        {!sideVisual && (
          <div aria-hidden className="relative mt-16 h-[300px] overflow-hidden sm:h-[380px] lg:mt-20 lg:h-[440px] [mask-image:linear-gradient(to_bottom,black_65%,transparent)]">
            <ServiceVisual kind={service.visual} />
          </div>
        )}
      </PageHero>

      {/* Overview */}
      <Section labelledBy="overview-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4" data-reveal>
              <span className="flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <Icon aria-hidden className="size-6" strokeWidth={1.6} />
              </span>
              <Eyebrow className="mt-8">Overview</Eyebrow>
              <h2 id="overview-title" className="text-h3 mt-4 text-surface">{service.benefit}</h2>
            </div>
            <div className="space-y-6 lg:col-span-7 lg:col-start-6" data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
              {service.overview.map((p, i) => (
                <p key={i} className={cn("leading-relaxed", i === 0 ? "text-[1.3rem] text-surface sm:text-[1.45rem]" : "text-lead text-muted-ink")}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Challenges */}
      <Section labelledBy="challenges-title">
        <Container>
          <SectionHeading id="challenges-title" eyebrow="Challenges we solve" title="Sound familiar?" />
          <ol className="mt-14 grid gap-4 sm:grid-cols-2">
            {service.challenges.map((c, i) => (
              <li
                key={c.title}
                data-reveal
                style={{ "--reveal-delay": `${(i % 2) * 80}ms` } as React.CSSProperties}
                className="rounded-panel border border-line bg-white p-7 hover-card spotlight relative lg:p-9"
              >
                <span className="font-mono text-xs text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-[1.3rem] font-semibold leading-tight tracking-tight text-surface">{c.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-ink">{c.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Capabilities */}
      <Section labelledBy="capabilities-title">
        <Container>
          <SectionHeading
            id="capabilities-title"
            align="split"
            eyebrow="Key capabilities"
            title={`${service.title}, end to end.`}
          />
          <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {service.capabilities.map((c, i) => (
              <li key={c.title} data-reveal style={{ "--reveal-delay": `${(i % 3) * 70}ms` } as React.CSSProperties} className="border-t-2 border-accent pt-6">
                <h3 className="text-[1.2rem] font-semibold tracking-tight text-surface">{c.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-ink">{c.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Deliverables + technology */}
      <Section labelledBy="deliverables-title" id="deliverables" className="scroll-mt-20">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7" data-reveal>
              <Eyebrow>Typical deliverables</Eyebrow>
              <h2 id="deliverables-title" className="text-h2 mt-6 text-ink">What you get.</h2>
              <ul className="mt-10 grid gap-x-8 sm:grid-cols-2">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 border-b border-line py-4 text-[15.5px] text-surface">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent" strokeWidth={2.2} /> {d}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted">Exact deliverables are confirmed in the project scope.</p>
            </div>
            <div className="lg:col-span-5" data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
              <div className="rounded-panel border border-accent/15 bg-sand p-8">
                <p className="text-label text-accent-ink">Technology considerations</p>
                <ul className="mt-6 space-y-7">
                  {service.technology.map((t) => (
                    <li key={t.title}>
                      <h3 className="text-[1.1rem] font-semibold text-ink">{t.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted-ink">{t.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Process */}
      <Section labelledBy="service-process-title">
        <Container>
          <SectionHeading
            id="service-process-title"
            align="split"
            eyebrow="How it runs"
            title="The shape of a typical project."
            intro="Every engagement follows our six-stage process; this is how it applies to this service."
          />
          <ol className="mt-14 grid gap-px overflow-hidden rounded-panel border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, i) => (
              <li key={step.title} data-reveal style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties} className="bg-white p-7 lg:p-8">
                <span className="flex size-9 items-center justify-center rounded-full bg-accent-soft font-mono text-xs text-accent-ink">{i + 1}</span>
                <h3 className="mt-8 text-[1.15rem] font-semibold tracking-tight text-surface">{step.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-muted-ink">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Related work */}
      {related.length > 0 && (
        <Section labelledBy="related-work-title">
          <Container>
            <SectionHeading id="related-work-title" eyebrow="Related work" title="Projects in this area." />
            <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-10">
              {related.map((p, i) => (
                <div key={p.slug} data-reveal className={cn(i === 1 && "md:mt-20")}>
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Industries */}
      <Section labelledBy="service-industries-title" className="py-16! lg:py-20!">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <h2 id="service-industries-title" className="text-h3 max-w-md text-surface">Common in these industries</h2>
            <ul className="flex flex-wrap gap-2.5">
              {relatedIndustries.map((ind) => (
                <li key={ind.slug}>
                  <Link
                    href={`/industries/${ind.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-[14.5px] text-surface transition-colors hover:border-accent hover:bg-accent hover:text-white"
                  >
                    {ind.name} <ArrowUpRight aria-hidden className="size-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Faq faqs={service.faqs} />

      {/* Other services */}
      <Section labelledBy="other-services-title" className="py-16! lg:py-24!">
        <Container>
          <h2 id="other-services-title" className="text-label text-muted-ink">Other services</h2>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {otherServices.map((s) => {
              const SIcon = serviceIcons[s.slug];
              return (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="group flex h-full flex-col gap-6 bg-white p-6 transition-colors hover:bg-sand">
                    <SIcon aria-hidden className="size-5 text-accent" strokeWidth={1.6} />
                    <span className="flex items-center justify-between gap-2 text-[15px] font-medium text-surface">
                      {s.navLabel}
                      <ArrowUpRight aria-hidden className="size-4 text-muted-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <ContactCTA
        title={<>Let&apos;s scope your <span className="text-gradient">{service.navLabel}</span> project.</>}
      />
    </>
  );
}
