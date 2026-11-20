import Image from "next/image";
import { Cloud, Database, Layers, Layout, Server, Smartphone } from "lucide-react";
import { getTechStack } from "../../lib/tech-stack.server";
import { Container, Section } from "../ui/Container";
import { Eyebrow } from "../ui/Heading";
import { TechLogo } from "../ui/TechLogo";
import { Reveal } from "../animations/Reveal";
import styles from "./tech.module.css";

/** Laptop and dashboard photos that slowly cross-fade in the showcase frame (Unsplash, stored locally). */
const photos = ["/assets/tech/erp-report.jpg", "/assets/tech/analytics-screen.jpg", "/assets/tech/laptop-glow.jpg"];

/** Group icon from its name, so groups added or reordered in the admin still get a fitting icon. */
function groupIcon(category: string) {
  if (/front|web|ui/i.test(category)) return Layout;
  if (/back|server|api/i.test(category)) return Server;
  if (/data/i.test(category)) return Database;
  if (/mobile|app/i.test(category)) return Smartphone;
  if (/cloud|deploy|host|devops/i.test(category)) return Cloud;
  return Layers;
}

export async function TechSection() {
  const techStack = await getTechStack();
  const total = techStack.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <Section compact labelledBy="tech-title" className="overflow-hidden">
      <span aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[34rem] glow-accent" />
      <span aria-hidden className="pointer-events-none absolute -bottom-48 -left-40 size-[30rem] glow-wine" />

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* ---------- Stack ---------- */}
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow className="mb-4">Technology</Eyebrow>
              <h2 id="tech-title" className="font-display text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.1rem] lg:text-[2.5rem]">
                Built with <span className="text-shimmer">modern technologies.</span>
              </h2>
              <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-muted-ink">
                A deliberately focused stack: mature, well-supported tools we know deeply, chosen for performance, maintainability and the long run.
              </p>
            </Reveal>

            <dl className="mt-7 grid gap-2.5">
              {techStack.map((group, i) => {
                const Icon = groupIcon(group.category);
                return (
                  <Reveal
                    key={group.category}
                    style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
                    className="group flex items-center gap-4 rounded-2xl border border-line bg-white/80 p-3 pr-4 backdrop-blur-sm transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lift"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                      <Icon aria-hidden className="size-[18px]" strokeWidth={1.8} />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
                      <dt className="w-32 shrink-0 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted-ink">{group.category}</dt>
                      <dd>
                        <ul className="flex flex-wrap gap-1.5">
                          {group.items.map((item) => (
                            <li
                              key={item}
                              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper py-1 pl-2 pr-2.5 text-[12.5px] font-medium text-surface transition-colors duration-300 hover:border-accent hover:bg-white hover:text-accent-ink"
                            >
                              <TechLogo name={item} size={14} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </Reveal>
                );
              })}
            </dl>
          </div>

          {/* ---------- Photo showcase ---------- */}
          <Reveal className="relative lg:col-span-6" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
            <div className={styles.frame}>
              <div aria-hidden className={styles.slides}>
                {photos.map((src, i) => (
                  <Image key={src} src={src} alt="" fill sizes="(min-width: 1024px) 600px, 100vw" className={styles.slide} style={{ animationDelay: `${i * 6}s` }} />
                ))}
              </div>
              <span aria-hidden className={styles.shade} />
              <p className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white">
                <span>
                  <span className="block font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/75">ERP · Dashboards · Web apps</span>
                  <span className="mt-1 block font-display text-[1.15rem] font-semibold tracking-tight">Software that runs the business</span>
                </span>
              </p>
            </div>

            <span aria-hidden className={`${styles.chip} left-3 top-6 sm:-left-5`}>
              <span className="grid size-7 place-items-center rounded-full bg-accent text-[11px] font-semibold text-white">{total}</span>
              Technologies in production
            </span>
            <span aria-hidden className={`${styles.chip} ${styles.chipLate} right-3 top-1/2 sm:-right-5`}>
              <span className="size-2 rounded-full bg-emerald-500" />
              Typed · Tested · Deployed
            </span>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
