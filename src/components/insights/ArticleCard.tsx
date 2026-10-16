import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate, readingTime, type Article } from "../../data/insights";
import { cn } from "../../lib/cn";

/** Editorial article preview with a typographic cover. */
export function ArticleCard({
  article,
  large,
  headingLevel = "h3",
}: {
  article: Article;
  large?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <article className="hover-card spotlight group relative flex h-full flex-col overflow-hidden rounded-panel border border-line bg-white">
      <div
        aria-hidden
        className={cn("relative overflow-hidden bg-sand", large ? "aspect-[16/9] lg:aspect-auto lg:min-h-[280px] lg:flex-1" : "aspect-[16/7]")}
      >
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -right-10 -top-16 size-56 glow-accent transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute -bottom-16 left-10 size-40 glow-wine" />
        <span className="absolute bottom-5 left-6 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-ink">{article.category}</span>
      </div>
      <div className={cn("flex flex-col p-7 lg:p-8", !large && "flex-1")}>
        <p className="text-[13px] text-muted-ink">
          <time dateTime={article.published}>{formatDate(article.published)}</time> · {readingTime(article)} min read
        </p>
        <Heading className={cn("mt-3 font-semibold tracking-[-0.025em] text-surface", large ? "text-h3" : "text-[1.25rem] leading-snug")}>
          <Link href={`/insights/${article.slug}`} className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat transition-[background-size,color] duration-500 after:absolute after:inset-0 after:content-[''] group-hover:bg-[length:100%_1.5px] group-hover:text-accent-ink">
            {article.title}
          </Link>
        </Heading>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted-ink">{article.description}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-surface group-hover:text-accent-ink">
          Read article <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
