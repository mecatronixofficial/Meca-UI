import { Check } from "lucide-react";
import { engagementModels } from "../../data/company";
import { getVerifiedReviews } from "../../lib/backend";
import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";

/**
 * Shows verified client reviews from the backend when there are any.
 * Until then, the slot explains how engagements work instead — no
 * placeholder or invented testimonials are ever shown.
 */
export async function Testimonials() {
  const reviews = (await getVerifiedReviews()).slice(0, 3);
  return reviews.length ? <ReviewGrid reviews={reviews} /> : <Engagement />;
}

function ReviewGrid({ reviews }: { reviews: Awaited<ReturnType<typeof getVerifiedReviews>> }) {
  return (
    <Section labelledBy="reviews-title">
      <Container>
        <SectionHeading id="reviews-title" eyebrow="Client words" title="What our clients say." />
        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <li key={r.id} data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
              <figure className="hover-card spotlight relative flex h-full flex-col rounded-panel border border-line bg-paper p-8">
                <span aria-hidden className="font-display text-5xl leading-none text-accent">&ldquo;</span>
                <blockquote className="mt-4 flex-1 text-[16.5px] leading-relaxed text-surface">{r.quote}</blockquote>
                <figcaption className="mt-8 border-t border-line pt-5">
                  <p className="font-medium text-surface">{r.name}</p>
                  {r.company && <p className="text-sm text-muted-ink">{r.company}</p>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

function Engagement() {
  return (
    <Section labelledBy="engage-title">
      <Container>
        <SectionHeading
          id="engage-title"
          align="split"
          eyebrow="Working together"
          title="Engagements shaped around the work."
          intro="Different projects need different structures. We agree the right one with you at the start, so expectations are clear on both sides."
        />
        <ol className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-3">
          {engagementModels.map((m, i) => (
            <li
              key={m.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
              className="hover-card spotlight group relative flex flex-col rounded-panel border border-line bg-white p-8 lg:p-9"
            >
              <span className="font-mono text-xs text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-8 text-h3 text-surface transition-colors duration-300 group-hover:text-accent-ink">{m.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted-ink">{m.text}</p>
              <ul className="mt-8 space-y-2.5 border-t border-line pt-6">
                {m.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-[14.5px] text-surface">
                    <Check aria-hidden className="size-4 text-accent-ink transition-transform duration-300 group-hover:scale-125" strokeWidth={2.2} /> {p}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
