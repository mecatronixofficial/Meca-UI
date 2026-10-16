import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries } from "../../data/industries";
import { projects } from "../../data/projects";
import { getService } from "../../data/services";
import { pageMetadata } from "../../lib/seo";
import { cn } from "../../lib/cn";
import { PageHero } from "../../components/sections/PageHero";
import { ContactCTA } from "../../components/sections/ContactCTA";
import { Container } from "../../components/ui/Container";
import { industryIcons } from "../../components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Software for Manufacturing, Textiles, Retail & Education",
  description:
    "Industry-specific software from Mecatronix in Coimbatore: textile and manufacturing ERP, retail and e-commerce platforms, school management systems, logistics apps and more.",
  path: "/industries",
  keywords: [
    "manufacturing software development",
    "textile ERP software Tamil Nadu",
    "school management system development",
    "retail billing software development",
  ],
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ path: "/industries", label: "Industries" }]}
        eyebrow="Industries"
        title={<>Solutions for the way <span className="text-gradient">businesses work.</span></>}
        intro="We build around the workflows, vocabulary and pressure points of each industry — from yarn lots and job cards to admissions and dealer orders."
      >
        <nav aria-label="Industries on this page" className="mt-12 flex flex-wrap gap-2">
          {industries.map((ind) => (
            <a key={ind.slug} href={`#${ind.slug}`} className="rounded-full border border-line-strong bg-white px-4 py-2 text-[14px] text-surface transition-colors hover:border-accent hover:bg-accent hover:text-white">
              {ind.name}
            </a>
          ))}
        </nav>
      </PageHero>

      {industries.map((ind, i) => {
        const Icon = industryIcons[ind.icon];
        const flip = i % 2 === 1;
        const work = projects.filter((p) => p.industryKey === ind.slug);

        return (
          <section
            key={ind.slug}
            id={ind.slug}
            aria-labelledby={`${ind.slug}-title`}
            className="scroll-mt-16 border-t border-line bg-white py-20 sm:py-24 lg:py-28"
          >
            <Container>
              <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                <div className={cn("lg:col-span-5", flip && "lg:order-2 lg:col-start-8")} data-reveal>
                  <div className="flex items-center gap-4">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                      <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                    </span>
                    <span className="font-mono text-xs text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h2 id={`${ind.slug}-title`} className="text-h2 mt-7 text-ink">{ind.name}</h2>
                  <p className="text-lead mt-5 text-muted-ink">{ind.intro}</p>
                  <Link href={`/industries/${ind.slug}`} className="mt-6 inline-flex items-center gap-2 font-medium text-accent-ink hover:underline">
                    Explore industry solutions <ArrowUpRight aria-hidden className="size-4" />
                  </Link>

                  <ul className="mt-8 flex flex-wrap gap-2">
                    {ind.services.map((slug) => {
                      const s = getService(slug);
                      if (!s) return null;
                      return (
                        <li key={slug}>
                          <Link
                            href={`/services/${slug}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-[14px] text-surface transition-colors hover:border-accent hover:text-accent-ink"
                          >
                            {s.navLabel} <ArrowUpRight aria-hidden className="size-3.5" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className={cn("grid gap-4 sm:grid-cols-2 lg:col-span-7", flip && "lg:order-1")} data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
                  <div className="rounded-panel border border-line bg-paper p-7">
                    <h3 className="text-label text-muted-ink">Workflows we support</h3>
                    <ul className="mt-5 space-y-3.5">
                      {ind.workflows.map((w) => (
                        <li key={w} className="flex gap-3 text-[15.5px] leading-snug text-surface">
                          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" /> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative isolate overflow-hidden rounded-panel bg-gradient-to-br from-accent via-accent-strong to-wine p-7 shadow-glow">
                    <div aria-hidden className="absolute -right-16 -top-16 -z-10 size-56 glow-white" />
                    <h3 className="text-label text-white/85">Typical solutions</h3>
                    <ul className="mt-5 space-y-3.5">
                      {ind.solutions.map((s) => (
                        <li key={s} className="text-[15.5px] leading-snug text-white">{s}</li>
                      ))}
                    </ul>
                  </div>

                  {work.length > 0 && (
                    <div className="rounded-panel border border-line p-6 sm:col-span-2">
                      <h3 className="text-label text-muted-ink">Related work</h3>
                      <ul className="mt-4 divide-y divide-line">
                        {work.map((p) => (
                          <li key={p.slug}>
                            <Link href={`/work/${p.slug}`} className="group flex items-center justify-between gap-4 py-3 text-ink">
                              <span className="text-[15.5px] font-medium transition-colors group-hover:text-accent-ink">{p.client}</span>
                              <span className="flex items-center gap-1.5 text-[13.5px] text-muted-ink">
                                {p.industry}
                                <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </section>
        );
      })}

      <ContactCTA
        title={<>Don&apos;t see your industry? <span className="text-gradient">Let&apos;s talk anyway.</span></>}
        text="Good software starts with understanding how your business runs. If you can describe the workflow, we can design the system around it."
      />
    </>
  );
}
