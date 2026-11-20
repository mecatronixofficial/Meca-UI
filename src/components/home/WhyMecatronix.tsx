import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { principles } from "../../data/company";
import { principleIcons } from "../ui/icons";
import { Container, Section } from "../ui/Container";
import { Eyebrow } from "../ui/Heading";
import { Reveal } from "../animations/Reveal";
import styles from "./why.module.css";

/** Why Mecatronix: the team photo on one side, the heading and principles on the other. */
export function WhyMecatronix() {
  return (
    <Section compact labelledBy="why-title" className="overflow-hidden">
      <span aria-hidden className="pointer-events-none absolute -left-40 top-10 size-[30rem] glow-accent" />

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* ---------- Photo ---------- */}
          <Reveal className="relative lg:col-span-5">
            <div className={styles.frame}>
              <Image src="/assets/why/team.jpg" alt="The Mecatronix team working together at laptops" fill sizes="(min-width: 1024px) 480px, 100vw" className={styles.photo} />
            </div>
            <span aria-hidden className={`${styles.badge} -right-2 bottom-6 sm:-right-5`}>
              <span className="grid size-9 place-items-center rounded-xl bg-accent font-display text-[15px] font-semibold text-white">{principles.length}</span>
              <span className="leading-tight">
                <span className="block text-[13px] font-semibold text-ink">Principles</span>
                <span className="block text-[11.5px] text-muted-ink">behind every project</span>
              </span>
            </span>
            <span aria-hidden className={`${styles.badge} ${styles.badgeLate} -left-2 top-6 sm:-left-5`}>
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="text-[12.5px] font-semibold text-ink">One team, design to support</span>
            </span>
          </Reveal>

          {/* ---------- Content ---------- */}
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow className="mb-4">Why Mecatronix</Eyebrow>
              <h2 id="why-title" className="font-display text-[1.6rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2rem] lg:text-[2.3rem]">
                Technology with purpose.
                <br />
                <span className="text-shimmer">Engineering with precision.</span>
              </h2>
              <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-muted-ink">
                Good software is a business decision before it&apos;s a technical one. These are the principles behind every project we take on.
              </p>
            </Reveal>

            <ol className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {principles.map((p, i) => {
                const Icon = principleIcons[p.glyph];
                return (
                  <Reveal as="li" key={p.title} style={{ "--reveal-delay": `${(i % 2) * 70}ms` } as React.CSSProperties}>
                    <div className={styles.item} title={p.text}>
                      <span className={styles.icon}>
                        <Icon aria-hidden className="size-4" strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0">
                        <span className={styles.itemTitle}>{p.title}</span>
                        <span className="mt-0.5 block text-[12.5px] leading-snug text-muted-ink">{p.text}</span>
                      </span>
                    </div>
                  </Reveal>
                );
              })}
            </ol>

            <Reveal className="mt-6">
              <Link href="/process" className={styles.cta}>
                How we work
                <span className={styles.ctaArrow}>
                  <ArrowRight aria-hidden className="size-3.5" />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
