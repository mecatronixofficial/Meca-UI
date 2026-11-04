import { principles } from "../../data/company";
import { principleIcons } from "../ui/icons";
import { Container, Section } from "../ui/Container";
import { Eyebrow } from "../ui/Heading";
import { ArrowLink } from "../ui/Button";
import { Backdrop } from "../visuals/Backdrop";
import { cn } from "../../lib/cn";
import { Reveal } from "../animations/Reveal";

export function WhyMecatronix() {
  return (
    <Section labelledBy="why-title" tone="dark" className="overflow-hidden">
      <Backdrop tone="dark" image="contours" aurora motes sweep />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-glow/60 to-transparent" />
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal className="lg:sticky lg:top-32">
              <Eyebrow tone="dark">Why Mecatronix</Eyebrow>
              <h2 id="why-title" className="text-h2 mt-6 text-white">
                Technology with purpose.
                <br />
                <span className="text-shimmer-light">Engineering with precision.</span>
              </h2>
              <p className="text-lead mt-6 max-w-md text-white/65">
                Good software is a business decision before it&apos;s a technical one. These are the principles behind
                every project we take on.
              </p>
              <ArrowLink href="/process" tone="dark" className="mt-8">How we work</ArrowLink>
            </Reveal>
          </div>

          <ol className="lg:col-span-7">
            {principles.map((p, i) => {
              const Icon = principleIcons[p.glyph];
              const flip = i % 2 === 1;
              return (
                <Reveal as="li"
                  key={p.title}
                  className={cn(
                    "group grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-white/10 py-9 sm:gap-x-8 lg:py-11",
                    flip && "sm:pl-14",
                  )}
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-accent-glow backdrop-blur-sm transition-[background-color,color,box-shadow,rotate,border-color] duration-500 group-hover:-rotate-6 group-hover:border-accent group-hover:bg-accent group-hover:text-white group-hover:shadow-glow">
                    <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                  </span>
                  <div className="transition-[translate] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2">
                    <p className="font-mono text-xs text-accent-glow">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-2 text-h3 text-white transition-colors duration-300 group-hover:text-accent-glow">{p.title}</h3>
                    <p className="mt-3 max-w-lg text-[15.5px] leading-relaxed text-white/65">{p.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
