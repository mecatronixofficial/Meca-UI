import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { articles, formatDate, getArticle, readingTime, type Block } from "../../../data/insights";
import { getService } from "../../../data/services";
import { articleJsonLd, pageMetadata } from "../../../lib/seo";
import JsonLd from "../../../components/seo/JsonLd";
import { Breadcrumbs } from "../../../components/ui/Breadcrumbs";
import { Container, Section } from "../../../components/ui/Container";
import { ContactCTA } from "../../../components/sections/ContactCTA";
import { ArticleCard } from "../../../components/insights/ArticleCard";
import { serviceIcons } from "../../../components/ui/icons";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  const meta = pageMetadata({
    title: article.title,
    description: article.description,
    path: `/insights/${article.slug}`,
  });
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: "article", publishedTime: article.published, authors: [article.author] },
  };
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "p":
      return <p key={i}>{block.text}</p>;
    case "h2":
      return <h2 key={i}>{block.text}</h2>;
    case "h3":
      return <h3 key={i}>{block.text}</h3>;
    case "ul":
      return <ul key={i}>{block.items.map((it) => <li key={it}>{it}</li>)}</ul>;
    case "ol":
      return <ol key={i}>{block.items.map((it) => <li key={it}>{it}</li>)}</ol>;
    case "note":
      return <aside key={i} className="note">{block.text}</aside>;
  }
}

// Long-form typography for article bodies
const prose = [
  "text-[1.075rem] leading-[1.8] text-surface/90",
  "[&>p]:mt-6",
  "[&>h2]:mt-16 [&>h2]:font-display [&>h2]:text-[1.75rem] [&>h2]:font-semibold [&>h2]:leading-tight [&>h2]:tracking-[-0.025em] [&>h2]:text-surface sm:[&>h2]:text-[2rem]",
  "[&>h3]:mt-10 [&>h3]:font-display [&>h3]:text-[1.3rem] [&>h3]:font-semibold [&>h3]:tracking-tight [&>h3]:text-surface",
  "[&>ul]:mt-6 [&>ul]:space-y-3 [&>ul]:pl-6 [&>ul]:list-disc [&>ul]:marker:text-accent",
  "[&>ol]:mt-6 [&>ol]:space-y-3 [&>ol]:pl-6 [&>ol]:list-decimal [&>ol]:marker:font-mono [&>ol]:marker:text-sm [&>ol]:marker:text-accent-ink",
  "[&_.note]:mt-12 [&_.note]:rounded-card [&_.note]:border-l-4 [&_.note]:border-accent [&_.note]:bg-paper [&_.note]:p-6 [&_.note]:text-surface",
].join(" ");

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const path = `/insights/${article.slug}`;
  const service = getService(article.service);
  const ServiceIcon = service ? serviceIcons[service.slug] : null;
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <>
      <JsonLd
        data={articleJsonLd({ title: article.title, description: article.description, path, published: article.published, author: article.author })}
      />

      <section className="relative isolate overflow-hidden bg-white pt-[72px] text-ink">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,black,transparent)]" />
          <div className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 glow-accent" />
        </div>
        <Container className="pb-20 pt-10 lg:pb-24 lg:pt-14">
          <Breadcrumbs crumbs={[{ path: "/insights", label: "Insights" }, { path, label: article.title }]} />
          <div className="mx-auto mt-14 max-w-3xl text-center lg:mt-20">
            <p className="text-label text-accent-ink motion-safe:animate-rise">{article.category}</p>
            <h1 className="text-h1 mt-6 motion-safe:animate-lift" style={{ animationDelay: "60ms" }}>{article.title}</h1>
            <p className="mt-8 text-[14.5px] text-muted-ink motion-safe:animate-rise" style={{ animationDelay: "140ms" }}>
              {article.author} · <time dateTime={article.published}>{formatDate(article.published)}</time> · {readingTime(article)} min read
            </p>
          </div>
        </Container>
      </section>

      <Section className="pt-16! lg:pt-24!">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12">
            <article className="lg:col-span-8 lg:col-start-2 xl:col-span-7 xl:col-start-2">
              <p className="text-lead font-medium text-surface">{article.description}</p>
              <div className={prose}>{article.body.map(renderBlock)}</div>
            </article>

            {service && ServiceIcon && (
              <aside className="lg:col-span-3 lg:col-start-10" aria-label="Related service">
                <div className="sticky top-28 overflow-hidden rounded-panel border border-line bg-white p-7 text-ink shadow-lift">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                    <ServiceIcon aria-hidden className="size-6" strokeWidth={1.6} />
                  </span>
                  <p className="text-label mt-8 text-muted">Related service</p>
                  <p className="mt-2 text-[1.2rem] font-semibold leading-snug">{service.title}</p>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-muted-ink">{service.summary}</p>
                  <Link href={`/services/${service.slug}`} className="mt-7 inline-flex items-center gap-1.5 text-[15px] font-medium text-accent-ink hover:text-accent">
                    Learn more <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </div>
              </aside>
            )}
          </div>
        </Container>
      </Section>

      <Section labelledBy="related-articles-title">
        <Container>
          <h2 id="related-articles-title" className="text-h2 text-surface">Keep reading.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </Container>
      </Section>

      <ContactCTA />
    </>
  );
}
