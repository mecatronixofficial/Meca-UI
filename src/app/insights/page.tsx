import type { Metadata } from "next";
import { articles } from "../../data/insights";
import { pageMetadata } from "../../lib/seo";
import { PageHero } from "../../components/sections/PageHero";
import { ContactCTA } from "../../components/sections/ContactCTA";
import { Container, Section } from "../../components/ui/Container";
import { ArticleCard } from "../../components/insights/ArticleCard";

export const metadata: Metadata = pageMetadata({
  title: "Insights — Software, ERP & Web Development Articles",
  description:
    "Practical articles from the Mecatronix engineering team on custom ERP software, modern business websites and choosing the right technology stack.",
  path: "/insights",
  keywords: ["custom ERP software benefits", "Next.js business website", "technology stack for business application"],
});

export default function InsightsPage() {
  const sorted = [...articles].sort((a, b) => b.published.localeCompare(a.published));
  const [first, ...rest] = sorted;

  return (
    <>
      <PageHero
        crumbs={[{ path: "/insights", label: "Insights" }]}
        eyebrow="Insights"
        title={<>Ideas, engineering <span className="text-gradient">and insights.</span></>}
        intro="Practical writing for business owners and teams on software, operations and the technology decisions behind them."
      />

      <Section labelledBy="articles-title" className="pt-14! lg:pt-20!">
        <Container>
          <h2 id="articles-title" className="sr-only">Articles</h2>
          <div className="grid gap-5 lg:grid-cols-12">
            {first && (
              <div className="lg:col-span-7" data-reveal>
                <ArticleCard article={first} large headingLevel="h2" />
              </div>
            )}
            <div className="grid gap-5 lg:col-span-5">
              {rest.map((a, i) => (
                <div key={a.slug} data-reveal style={{ "--reveal-delay": `${(i + 1) * 80}ms` } as React.CSSProperties}>
                  <ArticleCard article={a} headingLevel="h2" />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <ContactCTA
        title={<>Have a question we haven&apos;t covered? <span className="text-gradient">Ask us.</span></>}
        text="If you're weighing up a software decision, we're happy to talk it through — no obligation."
      />
    </>
  );
}
