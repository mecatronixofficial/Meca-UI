import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { getProject, isCaseStudyComplete, projects } from "../../../data/projects";
import { getService } from "../../../data/services";
import { caseStudyJsonLd, pageMetadata } from "../../../lib/seo";
import JsonLd from "../../../components/seo/JsonLd";
import { PageHero } from "../../../components/sections/PageHero";
import { ContactCTA } from "../../../components/sections/ContactCTA";
import { Container, Section } from "../../../components/ui/Container";
import { Eyebrow } from "../../../components/ui/Heading";
import { ProjectCover } from "../../../components/portfolio/ProjectCover";
import { ProjectCard } from "../../../components/portfolio/ProjectCard";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return pageMetadata({
    title: `${project.client} — ${project.industry} Case Study`,
    description: project.overview,
    path: `/work/${project.slug}`,
    // Keep thin case studies out of the index until challenge + solution are written
    noIndex: !isCaseStudyComplete(project),
  });
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-6 border-t border-line py-12 lg:grid-cols-12 lg:gap-10 lg:py-16" data-reveal>
      <h2 className="text-label text-muted-ink lg:col-span-3 lg:pt-2">{label}</h2>
      <div className="lg:col-span-8 lg:col-start-5">{children}</div>
    </div>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const path = `/work/${project.slug}`;
  const services = project.services.map((s) => getService(s)).filter((s) => s !== undefined);
  const related = projects
    .filter((p) => p.slug !== project.slug)
    .sort((a, b) => Number(b.industryKey === project.industryKey) - Number(a.industryKey === project.industryKey))
    .slice(0, 2);
  const gallery = project.images?.slice(1) ?? [];

  return (
    <>
      <JsonLd data={caseStudyJsonLd({ client: project.client, description: project.overview, path, industry: project.industry })} />

      <PageHero
        crumbs={[{ path: "/work", label: "Work" }, { path, label: project.client }]}
        eyebrow={project.industry}
        title={project.client}
        intro={project.summary}
      >
        <dl className="mt-14 grid gap-px overflow-hidden rounded-panel border border-line bg-line shadow-soft sm:grid-cols-3">
          <div className="bg-white p-6">
            <dt className="text-label text-accent-ink">Industry</dt>
            <dd className="mt-3 text-[15.5px] text-ink">{project.industry}</dd>
          </div>
          <div className="bg-white p-6">
            <dt className="text-label text-accent-ink">Services</dt>
            <dd className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[15.5px] text-ink">
              {services.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent-ink hover:decoration-accent">
                  {s.navLabel}
                </Link>
              ))}
            </dd>
          </div>
          <div className="bg-white p-6">
            <dt className="text-label text-accent-ink">{project.url ? "Live site" : "Delivered by"}</dt>
            <dd className="mt-3 text-[15.5px] text-ink">
              {project.url ? (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent-ink">
                  Visit website <ArrowUpRight aria-hidden className="size-4" />
                </a>
              ) : (
                "Mecatronix Software Development"
              )}
            </dd>
          </div>
        </dl>
      </PageHero>

      <section className="bg-white pt-10 pb-4 lg:pt-16">
        <Container>
          <div className="overflow-hidden rounded-panel shadow-lift">
            <ProjectCover project={project} priority className="aspect-[16/9] w-full" sizes="(min-width: 1320px) 1240px, 100vw" />
          </div>
        </Container>
      </section>

      <Section className="border-t-0! pt-12! lg:pt-16!">
        <Container>
          <Block label="Project overview">
            <p className="text-[1.3rem] leading-relaxed text-surface sm:text-[1.5rem]">{project.overview}</p>
          </Block>

          {project.challenge && (
            <Block label="The challenge">
              <p className="text-lead text-muted-ink">{project.challenge}</p>
            </Block>
          )}

          {project.solution && (
            <Block label="What we built">
              <p className="text-lead text-muted-ink">{project.solution}</p>
            </Block>
          )}

          <Block label="Scope of work">
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {project.scope.map((s) => (
                <li key={s} className="flex items-center gap-3 border-b border-line py-4 text-[16px] text-surface">
                  <Check aria-hidden className="size-4 shrink-0 text-accent" strokeWidth={2.2} /> {s}
                </li>
              ))}
            </ul>
          </Block>

          {project.stack && project.stack.length > 0 && (
            <Block label="Technology">
              <ul className="flex flex-wrap gap-2">
                {project.stack.map((t) => (
                  <li key={t} className="rounded-full border border-line-strong px-4 py-1.5 text-[14.5px] text-surface">{t}</li>
                ))}
              </ul>
            </Block>
          )}

          {project.results && project.results.length > 0 && (
            <Block label="Results">
              <ul className="space-y-4">
                {project.results.map((r) => (
                  <li key={r} className="text-lead text-surface">{r}</li>
                ))}
              </ul>
            </Block>
          )}

          {gallery.length > 0 && (
            <div className="grid gap-6 border-t border-line py-12 md:grid-cols-2" data-reveal>
              <h2 className="sr-only">Screens</h2>
              {gallery.map((img) => (
                <Image key={img.src} src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width: 768px) 50vw, 100vw" className="h-auto w-full rounded-card shadow-soft" />
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section labelledBy="more-work-title">
        <Container>
          <Eyebrow>More work</Eyebrow>
          <h2 id="more-work-title" className="text-h2 mt-5 text-surface">Related projects.</h2>
          <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-10">
            {related.map((p, i) => (
              <div key={p.slug} data-reveal className={i === 1 ? "md:mt-20" : undefined}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <ContactCTA title={<>Planning something similar? <span className="text-gradient">Let&apos;s talk.</span></>} />
    </>
  );
}
