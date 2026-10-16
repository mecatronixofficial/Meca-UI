import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { services } from "../../data/services";
import { pageMetadata } from "../../lib/seo";
import { cn } from "../../lib/cn";
import { PageHero } from "../../components/sections/PageHero";
import { ContactCTA } from "../../components/sections/ContactCTA";
import { Container, Section } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/Heading";
import { serviceIcons } from "../../components/ui/icons";
import { ServiceVisual } from "../../components/visuals/ServiceVisual";
import { TechSection } from "../../components/home/TechSection";

export const metadata: Metadata = pageMetadata({
  title: "Software Development Services in Coimbatore",
  description:
    "Web development, custom software, mobile apps, e-commerce, ERP systems and AI automation — software development services from Mecatronix in Coimbatore, Tamil Nadu.",
  path: "/services",
  keywords: [
    "software development services Coimbatore",
    "website development company in Coimbatore",
    "custom software development Tamil Nadu",
    "ERP software development",
  ],
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ path: "/services", label: "Services" }]}
        eyebrow="Services"
        title={<>Software services, engineered around <span className="text-gradient">your business.</span></>}
        intro="Six disciplines, one team. Whether you need a credible website, a system to run operations or an app for your customers, we take it from first conversation to production."
      >
        <nav aria-label="Services" className="mt-14 grid gap-px overflow-hidden rounded-panel border border-line bg-line shadow-soft sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = serviceIcons[s.slug];
            return (
              <a key={s.slug} href={`#${s.slug}`} className="group flex items-center gap-4 bg-white p-5 transition-colors hover:bg-sand">
                <Icon aria-hidden className="size-5 text-accent" strokeWidth={1.6} />
                <span className="flex-1 text-[15px] text-surface group-hover:text-accent-ink">{s.title}</span>
                <span className="font-mono text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
              </a>
            );
          })}
        </nav>
      </PageHero>

      <Section labelledBy="services-list-title">
        <Container>
          <h2 id="services-list-title" className="sr-only">Our services</h2>
          <div className="space-y-24 lg:space-y-36">
            {services.map((s, i) => {
              const Icon = serviceIcons[s.slug];
              const flip = i % 2 === 1;
              return (
                <article key={s.slug} id={s.slug} className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-12 lg:gap-16">
                  <div className={cn("min-w-0 lg:col-span-5", flip && "lg:order-2")} data-reveal>
                    <div className="flex items-center gap-4">
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                        <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                      </span>
                      <span className="font-mono text-xs text-muted-ink">{String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}</span>
                    </div>
                    <h3 className="text-h2 mt-7 text-surface">{s.title}</h3>
                    <p className="text-lead mt-5 text-muted-ink">{s.summary}</p>
                    <ul className="mt-7 space-y-2.5">
                      {s.capabilities.slice(0, 4).map((c) => (
                        <li key={c.title} className="flex items-start gap-3 text-[15px] text-surface">
                          <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent" strokeWidth={2.2} /> {c.title}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-7 border-l-2 border-accent pl-4 text-[15px] leading-relaxed text-surface/85">{s.benefit}</p>
                    <Link
                      href={`/services/${s.slug}`}
                      className="group mt-9 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[15px] font-medium text-white transition-[background-color,box-shadow] hover:bg-accent-strong hover:shadow-glow"
                    >
                      Explore {s.navLabel}
                      <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                  <div
                    className={cn("relative min-w-0 lg:col-span-7", flip && "lg:order-1")}
                    data-reveal
                    style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
                  >
                    <div className={cn("relative overflow-hidden rounded-panel p-6 sm:p-10", i % 2 ? "bg-sand" : "bg-paper")}>
                      <div aria-hidden className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_75%)]" />
                      <div className="relative max-h-[420px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
                        <ServiceVisual kind={s.visual} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section labelledBy="combine-title">
        <Container>
          <SectionHeading
            id="combine-title"
            align="split"
            eyebrow="Not sure where to start?"
            title="Most projects combine more than one service."
            intro="A manufacturer might need a website for buyers, an ERP for the factory and a mobile app for dispatch. We'll help you decide what to build first — and what can wait."
          />
          <div className="mt-12 flex flex-wrap gap-3" data-reveal>
            <Link href="/contact" className="inline-flex h-12 items-center gap-2 rounded-full bg-accent-strong px-6 text-[15px] font-medium text-white shadow-glow transition-[background-color,box-shadow] hover:bg-accent-ink hover:shadow-glow-lg">
              Talk through your requirements <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link href="/process" className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-[15px] font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white">
              See how we work
            </Link>
          </div>
        </Container>
      </Section>

      <TechSection />
      <ContactCTA />
    </>
  );
}
