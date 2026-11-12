import type { Metadata } from "next";
import { getArticles } from "../../lib/content";
import { pageMetadata } from "../../lib/seo";
import { PageHero } from "../../components/sections/PageHero";
import { ContactCTA } from "../../components/sections/ContactCTA";
import { Container, Section } from "../../components/ui/Container";
import { ArticleCard } from "../../components/insights/ArticleCard";
import { Reveal } from "../../components/animations/Reveal";

export const metadata: Metadata = pageMetadata({
  title: "Blogs — Software, ERP & Web Development Articles",
  description:
    "Practical articles from the Mecatronix engineering team on custom ERP software, modern business websites and choosing the right technology stack.",
  path: "/blogs",
  keywords: ["custom ERP software benefits", "Next.js business website", "technology stack for business application", "Mecatronix blog"],
});

const delay = (i: number) => ({ "--reveal-delay": `${(i % 3) * 80}ms` }) as React.CSSProperties;

export default async function BlogsPage() {
  // Blogs published in the admin panel + hand-written articles, newest first
  const articles = await getArticles();
  const [featured, ...others] = articles;
  const beside = others.slice(0, 2);
  const more = others.slice(2);

  return (
    <>
      <PageHero
        crumbs={[{ path: "/blogs", label: "Blogs" }]}
        eyebrow="Blogs"
        title={<>Ideas, engineering <span className="text-gradient">and insights.</span></>}
        intro="Practical writing for business owners and teams on software, operations and the technology decisions behind them."
      />

      <Section labelledBy="articles-title" className="pt-14! lg:pt-20!">
        <Container>
          <h2 id="articles-title" className="sr-only">Latest blogs</h2>

          {!featured && <p className="text-center text-lead text-muted-ink">New articles are on the way. Check back soon.</p>}

          {featured && (
            <div className="grid gap-5 lg:grid-cols-12">
              <Reveal className={beside.length ? "lg:col-span-7" : "lg:col-span-12"}>
                <ArticleCard article={featured} large headingLevel="h2" />
              </Reveal>
              {beside.length > 0 && (
                <div className="grid gap-5 lg:col-span-5">
                  {beside.map((a, i) => (
                    <Reveal key={a.slug} style={delay(i + 1)}>
                      <ArticleCard article={a} headingLevel="h2" />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          )}

          {more.length > 0 && (
            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {more.map((a, i) => (
                <Reveal key={a.slug} style={delay(i)}>
                  <ArticleCard article={a} headingLevel="h2" />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <ContactCTA
        title={<>Have a question we haven&apos;t covered? <span className="text-gradient">Ask us.</span></>}
        text="If you're weighing up a software decision, we're happy to talk it through — no obligation."
      />
    </>
  );
}
