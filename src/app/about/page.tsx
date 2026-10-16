import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { principles } from "../../data/company";
import { services } from "../../data/services";
import { projects } from "../../data/projects";
import { processSteps } from "../../data/process";
import { pageMetadata } from "../../lib/seo";
import { site } from "../../lib/site";
import { PageHero } from "../../components/sections/PageHero";
import { ContactCTA } from "../../components/sections/ContactCTA";
import { Container, Section } from "../../components/ui/Container";
import { Eyebrow, SectionHeading } from "../../components/ui/Heading";
import { ArrowLink } from "../../components/ui/Button";
import { principleIcons, serviceIcons } from "../../components/ui/icons";
import { ProjectCard } from "../../components/portfolio/ProjectCard";
import { TechSection } from "../../components/home/TechSection";

export const metadata: Metadata = pageMetadata({
  title: "About Mecatronix — Software Engineering Studio in Coimbatore",
  description:
    "Mecatronix Software Development is a Coimbatore-based software engineering studio building websites, applications and business systems that move companies forward.",
  path: "/about",
  keywords: ["about Mecatronix", "software company Coimbatore", "software engineering studio Tamil Nadu"],
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ path: "/about", label: "About" }]}
        eyebrow="About Mecatronix"
        title={<>We build technology that <span className="text-gradient">moves businesses forward.</span></>}
        aside={
          <div className="rounded-panel border border-line bg-white/80 p-7 shadow-lift backdrop-blur">
            <p className="text-label text-muted">Based in</p>
            <p className="mt-3 flex items-start gap-2.5 text-[15.5px] leading-relaxed text-surface">
              <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-accent" />
              {site.address.city}, {site.address.state}, {site.address.country}
            </p>
            <p className="text-label mt-7 text-muted">Working with</p>
            <p className="mt-3 text-[15.5px] leading-relaxed text-surface">Businesses across India and internationally, in person and remotely.</p>
          </div>
        }
      />

      {/* Introduction */}
      <Section labelledBy="about-intro-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4" data-reveal>
              <Eyebrow>Who we are</Eyebrow>
              <h2 id="about-intro-title" className="sr-only">Who we are</h2>
            </div>
            <div className="space-y-7 lg:col-span-8" data-reveal>
              <p className="font-display text-[1.6rem] font-medium leading-[1.3] tracking-[-0.02em] text-surface sm:text-[2.1rem]">
                Mecatronix Software Development is a software engineering studio in Coimbatore. We design and build
                websites, applications and business systems for companies that want technology to do real work for them.
              </p>
              <p className="text-lead text-muted-ink">
                Our work spans the full journey — understanding how a business operates, designing software around it,
                engineering it properly and supporting it after launch. We focus on sectors such as manufacturing,
                textiles, education and retail, where the right software can remove hours of repetitive work and give
                leaders a clear view of what&apos;s happening.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Mission & vision */}
      <section aria-label="Mission and vision" className="grid border-t border-line bg-white md:grid-cols-2">
        <div className="border-b border-line p-10 sm:p-14 md:border-b-0 md:border-r lg:p-20" data-reveal>
          <p className="text-label text-accent-ink">Our mission</p>
          <p className="mt-8 font-display text-[1.6rem] font-medium leading-[1.25] tracking-[-0.025em] text-surface sm:text-[2rem]">
            To engineer reliable, well-designed software that solves real business problems — and to be a partner
            businesses can trust from first idea to long after launch.
          </p>
        </div>
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-accent via-accent-strong to-wine p-10 text-white sm:p-14 lg:p-20" data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
          <div aria-hidden className="absolute inset-0 -z-10 bg-grid-inverse [mask-image:radial-gradient(ellipse_at_100%_0%,black,transparent_70%)]" />
          <p className="text-label text-white/85">Our vision</p>
          <p className="mt-8 font-display text-[1.6rem] font-medium leading-[1.25] tracking-[-0.025em] sm:text-[2rem]">
            A future where every growing business — not only the largest — has access to software built properly
            around the way it works.
          </p>
        </div>
      </section>

      {/* Approach */}
      <Section labelledBy="approach-title">
        <Container>
          <SectionHeading
            id="approach-title"
            align="split"
            eyebrow="Our approach"
            title="How we think about building software."
            intro="Six principles shape every project, whatever its size."
          />
          <ul className="mt-16 grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p, i) => {
              const Icon = principleIcons[p.glyph];
              return (
                <li key={p.title} data-reveal style={{ "--reveal-delay": `${(i % 3) * 70}ms` } as React.CSSProperties}>
                  <Icon aria-hidden className="size-6 text-accent-ink" strokeWidth={1.6} />
                  <h3 className="mt-6 text-[1.25rem] font-semibold tracking-tight text-surface">{p.title}</h3>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-muted-ink">{p.text}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* Process difference */}
      <Section labelledBy="difference-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-5" data-reveal>
              <Eyebrow>Our process</Eyebrow>
              <h2 id="difference-title" className="text-h2 mt-6 text-surface">Understanding first. Code second.</h2>
              <p className="text-lead mt-6 text-muted-ink">
                What makes our process different is where it starts: with the people who will use the software and the
                problem it must solve. Requirements are discovered, not assumed — and every stage ends with something
                you can see and react to.
              </p>
              <ArrowLink href="/process" className="mt-8">Explore the full process</ArrowLink>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2 lg:col-span-7" data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
              {processSteps.map((s) => (
                <li key={s.n} className="rounded-card border border-line bg-white p-6 hover-card spotlight relative">
                  <span className="font-mono text-xs text-accent-ink">{s.n}</span>
                  <h3 className="mt-3 text-[1.08rem] font-semibold text-surface">{s.title}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted-ink">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* Capabilities */}
      <Section labelledBy="capabilities-title">
        <Container>
          <SectionHeading id="capabilities-title" eyebrow="Technical capabilities" title="What we build." />
          <ul className="mt-14 border-t border-line">
            {services.map((s, i) => {
              const Icon = serviceIcons[s.slug];
              return (
                <li key={s.slug} className="border-b border-line" data-reveal>
                  <Link href={`/services/${s.slug}`} className="group grid items-center gap-4 py-7 md:grid-cols-12">
                    <span className="flex items-center gap-4 md:col-span-5">
                      <span className="font-mono text-xs text-muted-ink">{String(i + 1).padStart(2, "0")}</span>
                      <Icon aria-hidden className="size-5 text-accent-ink" strokeWidth={1.6} />
                      <span className="text-[1.3rem] font-semibold tracking-tight text-surface group-hover:text-accent-ink">{s.title}</span>
                    </span>
                    <span className="text-[15px] leading-relaxed text-muted-ink md:col-span-6">{s.summary}</span>
                    <ArrowUpRight aria-hidden className="hidden size-5 justify-self-end text-muted-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:block" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <TechSection />

      {/* Selected projects */}
      <Section labelledBy="about-work-title">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading id="about-work-title" eyebrow="Selected projects" title="Work we've delivered." />
            <ArrowLink href="/work">All work</ArrowLink>
          </div>
          <div className="mt-14 grid gap-14 md:grid-cols-3 md:gap-8">
            {projects.slice(0, 3).map((p, i) => (
              <div key={p.slug} data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <ContactCTA />
    </>
  );
}
