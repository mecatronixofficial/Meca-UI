import { articles } from "../../data/insights";
import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";
import { ArrowLink } from "../ui/Button";
import { ArticleCard } from "../insights/ArticleCard";

export function InsightsSection() {
  const [first, ...rest] = articles.slice(0, 3);
  return (
    <Section labelledBy="insights-title">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading id="insights-title" eyebrow="Insights" title="Ideas, engineering and insights." />
          <div data-reveal className="shrink-0">
            <ArrowLink href="/insights">All articles</ArrowLink>
          </div>
        </div>

        <div className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-7" data-reveal>
            <ArticleCard article={first} large />
          </div>
          <div className="grid gap-5 lg:col-span-5">
            {rest.map((a, i) => (
              <div key={a.slug} data-reveal style={{ "--reveal-delay": `${(i + 1) * 80}ms` } as React.CSSProperties}>
                <ArticleCard article={a} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
