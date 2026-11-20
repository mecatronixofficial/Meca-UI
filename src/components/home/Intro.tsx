import { capabilities } from "../../data/company";
import { getSiteContact } from "../../lib/site-contact.server";
import { cn } from "../../lib/cn";
import { Container, Section } from "../ui/Container";
import { Eyebrow } from "../ui/Heading";
import { ArrowLink } from "../ui/Button";
import { PauseOffscreen } from "../animations/PauseOffscreen";
import { VisionScene } from "../visuals/VisionScene";
import frame from "../visuals/VisionScene.module.css";
import { Reveal } from "../animations/Reveal";
import { Backdrop } from "../visuals/Backdrop";
import { Cpu, Layers, PencilRuler, Target } from "lucide-react";
import styles from "./intro.module.css";

const capabilityIcons = [PencilRuler, Target, Cpu, Layers];

export async function Intro() {
  const { address } = await getSiteContact();
  return (
    <Section compact labelledBy="intro-title" className="overflow-hidden">
      <Backdrop image="contours" imageClassName="[mask-image:radial-gradient(ellipse_60%_70%_at_85%_30%,black,transparent_75%)]" />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
          <Reveal className="lg:col-span-7">
            <Eyebrow>Who we are</Eyebrow>
            <h2 id="intro-title" className="text-h1 mt-6 text-surface">
              Your vision.
              <br />
              <span className="text-gradient">Our engineering.</span>
            </h2>
            <PauseOffscreen className="mt-10 max-w-[640px] lg:mt-12">
              <VisionScene className="block h-auto w-full" />
            </PauseOffscreen>
          </Reveal>

          <Reveal className="lg:col-span-5" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
            <PauseOffscreen>
              <div className={cn(frame.frame, "p-8 lg:p-10")}>
                {/* Blueprint corner marks */}
                {["left-3 top-3 border-l-2 border-t-2", "right-3 top-3 border-r-2 border-t-2", "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"].map((pos) => (
                  <span key={pos} aria-hidden className={cn("absolute size-3 rounded-[2px] border-accent", pos)} />
                ))}

                <p className="text-label flex items-center gap-2.5 text-muted-ink">
                  <span className="relative flex size-1.5">
                    <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-ping" />
                    <span className="relative size-1.5 rounded-full bg-accent" />
                  </span>
                  Studio · {address.city}, {address.country}
                </p>
                <p className="text-lead mt-6 text-muted-ink">
                  Mecatronix Software Development partners with businesses to transform ideas, workflows and challenges into
                  reliable digital solutions — from the first conversation to the system your team uses every day.
                </p>
                <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
                  <ArrowLink href="/about" className="whitespace-nowrap">More about Mecatronix</ArrowLink>
                  <span aria-hidden className="hidden whitespace-nowrap font-mono text-[11px] tracking-[0.14em] text-accent-ink sm:inline">VISION → CODE</span>
                </div>
              </div>
            </PauseOffscreen>
          </Reveal>
        </div>

        {/* Expanding panels: the hovered (or focused) one widens and fills red; the first is open by default */}
        <Reveal as="ul" className={cn(styles.row, "mt-10 lg:mt-14")}>
          {capabilities.map((c, i) => {
            const Icon = capabilityIcons[i] ?? Layers;
            return (
              <li key={c.title} tabIndex={0} className={styles.panel}>
                <span aria-hidden className={styles.number}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.icon}>
                  <Icon aria-hidden className="size-4" strokeWidth={1.9} />
                </span>
                <div className={styles.copy}>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
                <span aria-hidden className={styles.progress} />
              </li>
            );
          })}
        </Reveal>
      </Container>
    </Section>
  );
}
