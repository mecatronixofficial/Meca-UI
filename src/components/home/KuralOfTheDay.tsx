import Image from "next/image";
import { getKuralOfTheDay, type KuralOfTheDay as Kural } from "../../lib/content";
import { Container, Section } from "../ui/Container";
import { Reveal } from "../animations/Reveal";
import { KuralCard, tamilFont } from "./KuralCard";
import styles from "./kural.module.css";

/**
 * Thirukkural: the kural of the day from mec-api (changes at midnight IST), in a compact card —
 * Thiruvalluvar inside a turning red ring on the left, the couplet and its views on the right.
 * Renders nothing if the API is unavailable.
 */
export async function KuralOfTheDay() {
  const kural = await getKuralOfTheDay();
  return kural ? <KuralSection kural={kural} /> : null;
}

/** The section itself, given a kural. */
export function KuralSection({ kural }: { kural: Kural }) {
  const { chapter } = kural;

  return (
    <Section compact labelledBy="kural-title" className="py-8! sm:py-10! lg:py-12!">
      <Container>
        <Reveal className={styles.card}>
          <span aria-hidden className={styles.watermark}>{kural.number}</span>

          {/* Thiruvalluvar in a turning ring */}
          <div className={styles.portrait}>
            <span aria-hidden className={styles.ring} />
            <span aria-hidden className={styles.disc}>
              <Image
                src="/assets/thiruvalluvar/thiruvalluvar.png"
                alt={kural.authorEn}
                width={500}
                height={500}
                sizes="180px"
                className={styles.valluvar}
              />
            </span>
            <p className="mt-3 text-center text-[12.5px] font-semibold text-muted-ink" style={tamilFont}>
              — {kural.author}
            </p>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="kural-title" className="text-label inline-flex items-center gap-2 text-accent-ink">
                <span aria-hidden className={styles.pulse} />
                <span style={tamilFont}>இன்றைய குறள்</span> · Kural of the day
              </h2>
              <span className="ml-auto flex flex-wrap gap-1.5">
                <span style={tamilFont} className={styles.chip}>
                  {chapter.paal}
                </span>
                <span style={tamilFont} className={`${styles.chip} ${styles.chipLine}`}>
                  குறள் {kural.number}
                </span>
              </span>
            </div>

            <div className="mt-3">
              <KuralCard kural={kural} />
            </div>

            <p className="mt-1 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-3 text-[12.5px] text-muted-ink">
              <span>
                <span style={tamilFont} className="text-muted">அதிகாரம் </span>
                <span style={tamilFont} className="font-semibold text-ink">
                  {chapter.number}. {chapter.name}
                </span>{" "}
                · {chapter.translation}
              </span>
              <span>
                <span style={tamilFont} className="text-muted">இயல் </span>
                <span style={tamilFont} className="font-semibold text-ink">
                  {chapter.iyal}
                </span>{" "}
                · {chapter.iyalEn}
              </span>
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
