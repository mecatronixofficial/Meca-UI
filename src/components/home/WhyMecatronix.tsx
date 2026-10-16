import { principles } from "../../data/company";
import { principleIcons } from "../ui/icons";
import { Container, Section } from "../ui/Container";
import { Eyebrow } from "../ui/Heading";
import { ArrowLink } from "../ui/Button";
import { cn } from "../../lib/cn";

export function WhyMecatronix() {
  return (
    <Section labelledBy="why-title" className="overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 size-[520px] glow-accent opacity-60" />
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32" data-reveal>
              <Eyebrow>Why Mecatronix</Eyebrow>
              <h2 id="why-title" className="text-h2 mt-6 text-ink">
                Technology with purpose.
                <br />
                <span className="text-gradient">Engineering with precision.</span>
              </h2>
              <p className="text-lead mt-6 max-w-md text-muted-ink">
                Good software is a business decision before it&apos;s a technical one. These are the principles behind
                every project we take on.
              </p>
              <ArrowLink href="/process" className="mt-8">How we work</ArrowLink>
            </div>
          </div>

          <ol className="lg:col-span-7">
            {principles.map((p, i) => {
              const Icon = principleIcons[p.glyph];
              const flip = i % 2 === 1;
              return (
                <li
                  key={p.title}
                  data-reveal
                  className={cn(
                    "group grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-line py-9 sm:gap-x-8 lg:py-11",
                    flip && "sm:pl-14",
                  )}
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent transition-[background-color,color,box-shadow,rotate] duration-500 group-hover:-rotate-6 group-hover:bg-accent group-hover:text-white group-hover:shadow-glow">
                    <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                  </span>
                  <div className="transition-[translate] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2">
                    <p className="font-mono text-xs text-accent-ink">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-2 text-h3 text-ink transition-colors duration-300 group-hover:text-accent-ink">{p.title}</h3>
                    <p className="mt-3 max-w-lg text-[15.5px] leading-relaxed text-muted-ink">{p.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
