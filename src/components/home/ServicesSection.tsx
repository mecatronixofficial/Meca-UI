import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";
import { serviceList } from "../../data/service-list";
import { cn } from "../../lib/cn";
import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";
import { ArrowLink } from "../ui/Button";
import { serviceIcons } from "../ui/icons";
import { Reveal } from "../animations/Reveal";
import styles from "./services.module.css";

/** One photo per service (Unsplash, stored locally in /public/assets/services). */
const photos: Record<string, string> = {
  "web-development": "/assets/services/web.jpg",
  "custom-software": "/assets/services/software.jpg",
  "mobile-app-development": "/assets/services/mobile.jpg",
  "ecommerce-development": "/assets/services/ecommerce.jpg",
  "erp-development": "/assets/services/erp.jpg",
  "ai-automation": "/assets/services/ai.jpg",
};

/** Bento layout on large screens: the first and last cards span two columns. */
const wide = (i: number, count: number) => i === 0 || i === count - 1;

export function ServicesSection() {
  return (
    <Section compact labelledBy="services-title" className="overflow-hidden">
      <div aria-hidden className={styles.backdrop}>
        <Image src="/assets/services/engineering-lab.jpg" alt="" fill sizes="100vw" className="object-cover object-center" />
      </div>
      <span aria-hidden className="pointer-events-none absolute -left-40 top-1/3 size-[32rem] glow-accent" />

      <Container className="relative">
        <SectionHeading
          id="services-title"
          align="split"
          eyebrow="What we do"
          title="Digital solutions built around your business."
          intro="Six focused disciplines, one engineering team. Most projects combine several — a website with an ordering portal, an ERP with a mobile app."
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5">
          {serviceList.map((s, i) => {
            const Icon = serviceIcons[s.slug] ?? Layers;
            const isWide = wide(i, serviceList.length);
            return (
              <Reveal as="li" key={s.slug} className={cn(isWide && "lg:col-span-2")} style={{ "--reveal-delay": `${(i % 3) * 70}ms` } as React.CSSProperties}>
                <Link href={`/services/${s.slug}`} className={cn(styles.card, isWide && styles.wide, "group")}>
                  <span aria-hidden className={styles.glow} />
                  <span className={styles.media}>
                    <Image src={photos[s.slug] ?? photos["web-development"]} alt="" fill sizes={isWide ? "(min-width: 1024px) 360px, 100vw" : "(min-width: 1024px) 300px, 100vw"} className={styles.photo} />
                    <span aria-hidden className={styles.tint} />
                    <span aria-hidden className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <span className={styles.body}>
                    <span className={styles.icon}>
                      <Icon aria-hidden className="size-[18px]" strokeWidth={1.8} />
                    </span>
                    <span className="mt-4 block font-display text-[1.12rem] font-semibold leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-accent-ink">
                      {s.title}
                    </span>
                    <span className="mt-2 block text-[13.5px] leading-relaxed text-muted-ink">{s.summary}</span>
                    {isWide && <span className="mt-3 hidden border-l-2 border-accent/40 pl-3 text-[13px] leading-relaxed text-surface/80 lg:block">{s.benefit}</span>}
                    <span className={styles.more}>
                      Explore service
                      <span className={styles.arrow}>
                        <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={2.2} />
                      </span>
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>

        <Reveal className="mt-10">
          <ArrowLink href="/services">Compare all services</ArrowLink>
        </Reveal>
      </Container>
    </Section>
  );
}
