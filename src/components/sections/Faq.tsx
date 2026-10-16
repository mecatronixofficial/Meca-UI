import { Plus } from "lucide-react";
import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";

/** Accessible FAQ list built on native <details>/<summary> (works without JS). */
export function Faq({
  faqs,
  title = "Frequently asked questions",
  intro,
}: {
  faqs: { q: string; a: string }[];
  title?: string;
  intro?: string;
}) {
  return (
    <Section labelledBy="faq-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading id="faq-title" eyebrow="FAQ" title={title} intro={intro} className="lg:sticky lg:top-32" />
          </div>
          <div className="border-t border-line lg:col-span-8" data-reveal>
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-line">
                <summary className="group/q flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
                  <span className="text-[1.08rem] font-medium leading-snug text-surface transition-[color,translate] duration-300 group-hover/q:translate-x-1 group-hover/q:text-accent-ink sm:text-[1.15rem]">{f.q}</span>
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink transition-[transform,background-color,border-color] duration-300 group-hover/q:border-accent group-open:rotate-45 group-open:border-accent group-open:bg-accent group-open:text-white">
                    <Plus aria-hidden className="size-4" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-7 pr-12 text-[15.5px] leading-relaxed text-muted-ink">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
