import Link from "next/link";
import { TEMPLATES, getTemplate } from "../../data/templates";
import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";
import { Button } from "../ui/Button";
import { Reveal } from "../animations/Reveal";
import { ScaledFrame } from "../preview/ScaledFrame";
import { SiteTemplate } from "../preview/SiteTemplate";

/** Home page invitation to "Preview your own website", with a live sample template. */
export function PreviewSection() {
  const sample = getTemplate("medical")!;
  return (
    <Section labelledBy="preview-title" className="bg-paper">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              id="preview-title"
              eyebrow="Free website preview"
              title={
                <>
                  See your website <span className="text-gradient">in 60 seconds.</span>
                </>
              }
              intro="Choose your industry, add your logo and brand colour, and we'll generate a complete website for your business — instantly, and free."
            />
            <Reveal className="mt-8 flex flex-wrap gap-2" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
              {TEMPLATES.slice(0, 10).map((t) => (
                <Link
                  key={t.slug}
                  href={`/preview?industry=${t.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-[13.5px] font-medium text-surface transition-colors hover:border-accent hover:text-accent-ink"
                >
                  <t.icon aria-hidden className="size-4" style={{ color: t.color }} />
                  {t.short}
                </Link>
              ))}
              <Link href="/preview" className="inline-flex items-center rounded-full px-3 py-2 text-[13.5px] font-medium text-accent-ink hover:underline">
                +{TEMPLATES.length - 10} more
              </Link>
            </Reveal>
            <Reveal className="mt-10" style={{ "--reveal-delay": "160ms" } as React.CSSProperties}>
              <Button href="/preview" size="lg" arrow>
                Preview your website
              </Button>
            </Reveal>
          </div>
          <Reveal className="min-w-0 lg:col-span-7" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
            <ScaledFrame url="www.sunriseclinic.com" maxHeight={520}>
              <SiteTemplate
                template={sample}
                brand={{ company: "Sunrise Clinic", color: sample.color, city: "Coimbatore", tagline: "Caring for families since 1998" }}
              />
            </ScaledFrame>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
