import { Star } from "lucide-react";
import { getVerifiedReviews } from "../../lib/backend";
import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";
import { Reveal } from "../animations/Reveal";
import { ReviewButton } from "../reviews/ReviewButton";

/**
 * Shows verified client reviews from the backend; renders nothing until there are any.
 * No placeholder or invented testimonials are ever shown.
 */
export async function Testimonials() {
  const reviews = (await getVerifiedReviews()).slice(0, 3);
  return reviews.length ? <ReviewGrid reviews={reviews} /> : null;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} aria-hidden className={i <= rating ? "size-4 fill-[#f5a524] text-[#f5a524]" : "size-4 text-line-strong"} strokeWidth={1.5} />
      ))}
    </span>
  );
}

function ReviewGrid({ reviews }: { reviews: Awaited<ReturnType<typeof getVerifiedReviews>> }) {
  return (
    <Section compact labelledBy="reviews-title">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading id="reviews-title" eyebrow="Client words" title="What our clients say." />
          <Reveal className="shrink-0">
            <ReviewButton />
          </Reveal>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal as="li" key={r.id} style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
              <figure className="hover-card spotlight relative flex h-full flex-col rounded-panel border border-line bg-paper p-8">
                <div className="flex items-center justify-between">
                  <span aria-hidden className="font-display text-5xl leading-none text-accent">&ldquo;</span>
                  <Stars rating={r.rating} />
                </div>
                <blockquote className="mt-4 flex-1 text-[16.5px] leading-relaxed text-surface">{r.quote}</blockquote>
                <figcaption className="mt-8 border-t border-line pt-5">
                  <p className="font-medium text-surface">{r.name}</p>
                  {r.company && <p className="text-sm text-muted-ink">{r.company}</p>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
