import Image from "next/image";
import { getKuralOfTheDay } from "../../lib/content";
import { Container, Section } from "../ui/Container";
import { Reveal } from "../animations/Reveal";
import { KuralCard, tamilFont } from "./KuralCard";

/**
 * Thirukkural: the kural of the day from mec-api (changes at midnight IST).
 * Renders nothing if the API is unavailable.
 */
export async function KuralOfTheDay() {
  const kural = await getKuralOfTheDay();
  if (!kural) return null;
  const { chapter } = kural;

  return (
    <Section labelledBy="kural-title">
      <Container>
        <Reveal className="overflow-hidden rounded-panel border border-line bg-white shadow-lift">
          <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)]">
            {/* Thiruvalluvar */}
            <div className="relative isolate flex min-h-[240px] items-end justify-center overflow-hidden border-b border-line bg-gradient-to-br from-sand via-white to-accent-soft lg:border-b-0 lg:border-r">
              <span aria-hidden className="absolute -right-4 -top-6 -z-10 select-none font-display text-[9rem] font-bold leading-none text-accent/[0.07] lg:text-[11rem]">
                {kural.number}
              </span>
              <Image
                src="/assets/thiruvalluvar/thiruvalluvar.png"
                alt={kural.authorEn}
                width={500}
                height={500}
                sizes="(min-width: 1024px) 340px, 260px"
                className="h-auto w-[230px] mix-blend-multiply lg:w-[300px]"
              />
              <p className="absolute bottom-4 left-5 text-[13px] font-semibold text-muted-ink" style={tamilFont}>
                — {kural.author}
              </p>
            </div>

            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              {/* Header */}
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 id="kural-title" className="text-label text-accent-ink">
                  <span style={tamilFont}>இன்றைய குறள்</span> · Kural of the day
                </h2>
                <span className="ml-auto flex flex-wrap gap-2">
                  <span style={tamilFont} className="rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent-ink">
                    {chapter.paal}
                  </span>
                  <span style={tamilFont} className="rounded-full border border-line px-2.5 py-1 text-[12px] font-semibold text-muted-ink">
                    குறள் {kural.number}
                  </span>
                </span>
              </div>

              <div className="mt-6 flex-1">
                <KuralCard kural={kural} />
              </div>

              {/* Chapter */}
              <dl className="grid gap-x-8 gap-y-2 border-t border-line pt-5 text-[13.5px] sm:grid-cols-2">
                <div className="flex gap-2">
                  <dt style={tamilFont} className="text-muted">அதிகாரம்</dt>
                  <dd>
                    <span style={tamilFont} className="font-semibold text-ink">
                      {chapter.number}. {chapter.name}
                    </span>
                    <span className="text-muted-ink"> · {chapter.translation}</span>
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt style={tamilFont} className="text-muted">இயல்</dt>
                  <dd>
                    <span style={tamilFont} className="font-semibold text-ink">
                      {chapter.iyal}
                    </span>
                    <span className="text-muted-ink"> · {chapter.iyalEn}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
