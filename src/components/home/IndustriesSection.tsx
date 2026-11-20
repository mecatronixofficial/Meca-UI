import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industryHighlights } from "../../data/industries";
import { industryIcons } from "../ui/icons";
import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";
import { cn } from "../../lib/cn";
import { Reveal } from "../animations/Reveal";
import { Backdrop } from "../visuals/Backdrop";

// Bento spans for the six tiles (12-column grid on large screens)
const layout = [
  "lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
];

/** One photo per tile, keyed by industry anchor (Unsplash, stored locally in /public/assets/industries). */
const photos: Record<string, string> = {
  textiles: "/assets/industries/manufacturing.jpg",
  retail: "/assets/industries/retail.jpg",
  education: "/assets/industries/education.jpg",
  logistics: "/assets/industries/logistics.jpg",
  "professional-services": "/assets/industries/professional.jpg",
  startups: "/assets/industries/startups.jpg",
};

export function IndustriesSection() {
  return (
    <Section compact labelledBy="industries-title" className="overflow-hidden">
      <Backdrop aurora motes />
      <Container className="relative">
        <SectionHeading
          id="industries-title"
          align="split"
          eyebrow="Industries"
          title="Solutions for the way businesses work."
          intro="Every industry has its own workflows, vocabulary and pressure points. We build around them."
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-12">
          {industryHighlights.map((ind, i) => {
            const Icon = industryIcons[ind.icon];
            const featured = i === 0;
            const photo = photos[ind.anchor];
            return (
              <Reveal as="li"
                key={ind.title}
                style={{ "--reveal-delay": `${(i % 3) * 70}ms` } as React.CSSProperties}
                className={cn(layout[i], featured && "sm:col-span-2 lg:col-span-7")}
              >
                <Link
                  href={`/industries/${ind.anchor}`}
                  className={cn(
                    "spotlight group relative isolate flex h-full flex-col overflow-hidden rounded-panel border p-7 transition-[border-color,translate,box-shadow] duration-500 hover:-translate-y-1 lg:p-8",
                    featured
                      ? "min-h-[320px] border-transparent bg-wine text-white shadow-glow [--spot:rgb(255_255_255/0.2)] hover:shadow-glow-lg lg:min-h-[420px]"
                      : "min-h-[240px] border-line bg-white text-ink hover:border-accent/30 hover:shadow-lift",
                  )}
                >
                  {featured ? (
                    <>
                      {photo && (
                        <Image src={photo} alt="" fill sizes="(min-width: 1024px) 700px, 100vw" className="-z-10 object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
                      )}
                      {/* Brand-red wash over the photo keeps the white text readable */}
                      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/80 via-accent-strong/50 to-wine/85" />
                      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-wine/90 via-wine/30 to-transparent" />
                      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-inverse [mask-image:radial-gradient(ellipse_at_80%_20%,black,transparent_70%)]" />
                      <div aria-hidden className="absolute -right-20 -top-20 -z-10 size-72 glow-white" />
                    </>
                  ) : (
                    photo && (
                      <span aria-hidden className="relative -mx-7 -mt-7 block h-36 overflow-hidden lg:-mx-8 lg:-mt-8 lg:h-40">
                        <Image src={photo} alt="" fill sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
                        <span className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
                        <span className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/35 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </span>
                    )
                  )}
                  <div className={cn("relative flex items-start justify-between", !featured && photo && "-mt-7")}>
                    <span
                      className={cn(
                        "flex size-12 items-center justify-center rounded-2xl transition-[background-color,color,box-shadow,scale] duration-500 group-hover:scale-110",
                        featured
                          ? "border border-white/25 bg-white/10 text-white backdrop-blur-sm group-hover:bg-white group-hover:text-accent"
                          : "bg-white text-accent shadow-soft ring-4 ring-white group-hover:bg-accent group-hover:text-white group-hover:shadow-glow",
                      )}
                    >
                      <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className={cn("size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5", featured ? "text-white/80" : "mt-6 text-muted-ink group-hover:text-accent")}
                    />
                  </div>
                  <div className={cn("relative mt-auto", featured ? "pt-10" : "pt-5")}>
                    <h3 className={cn("font-semibold tracking-[-0.025em] transition-colors duration-300", featured ? "text-h2 max-w-md" : "text-[1.35rem] leading-tight group-hover:text-accent-ink")}>
                      {ind.title}
                    </h3>
                    <p className={cn("mt-3 max-w-md text-[15px] leading-relaxed", featured ? "text-white/90" : "text-muted-ink")}>{ind.text}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
