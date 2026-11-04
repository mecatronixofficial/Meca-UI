import { Mail } from "lucide-react";
import { site, whatsappLink } from "../../lib/site";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { Backdrop } from "../visuals/Backdrop";
import { Reveal } from "../animations/Reveal";

/** Closing call to action used at the end of most pages. `tone="dark"` is the animated home-page finale. */
export function ContactCTA({
  title,
  text = "Tell us about your idea, challenge or business requirements. We would love to explore how technology can help.",
  tone = "light",
}: {
  title?: React.ReactNode;
  text?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const heading = title ?? (
    <>
      Have a project in mind?
      <br />
      <span className={dark ? "text-shimmer-light" : "text-gradient"}>Let&apos;s build something that works.</span>
    </>
  );

  return (
    <section
      aria-labelledby="cta-title"
      className={cn(
        "relative isolate overflow-hidden border-t py-24 sm:py-32 lg:py-40",
        dark ? "border-white/10 bg-ink text-white" : "border-line bg-white text-ink",
      )}
    >
      {dark ? (
        <Backdrop
          tone="dark"
          image="circuit"
          imageClassName="[mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,transparent_25%,black_80%)]"
          aurora
          rings
          motes
          sweep
          className="-z-10"
        />
      ) : (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_70%_at_50%_100%,black,transparent)]" />
          <div className="absolute bottom-[-30%] left-1/2 h-[520px] w-[900px] -translate-x-1/2 glow-accent" />
        </div>
      )}

      <Container>
        <Reveal className="mx-auto max-w-4xl text-center">
          {dark && (
            <p className="text-label mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white/70 backdrop-blur-md">
              <span aria-hidden className="size-1.5 rounded-full bg-accent-glow motion-safe:animate-pulse" />
              Let&apos;s talk
            </p>
          )}
          <h2 id="cta-title" className={cn("text-h1", dark ? "text-white" : "text-ink")}>{heading}</h2>
          <p className={cn("text-lead mx-auto mt-7 max-w-2xl", dark ? "text-white/65" : "text-muted-ink")}>{text}</p>
          <div className="mt-11 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/contact" size="lg" arrow>Start Your Project</Button>
            <Button
              href={whatsappLink()}
              size="lg"
              variant={dark ? "outline-dark" : "outline-light"}
              arrow="external"
              external
              className={dark ? "backdrop-blur-md" : undefined}
            >
              Talk on WhatsApp
            </Button>
          </div>
          <p className={cn("mt-10 inline-flex items-center gap-2 text-sm", dark ? "text-white/60" : "text-muted")}>
            <Mail aria-hidden className={cn("size-4", dark ? "text-accent-glow" : "text-accent")} />
            Prefer email?{" "}
            <a
              href={`mailto:${site.email}`}
              className={cn("underline-offset-4 hover:underline", dark ? "text-white hover:text-accent-glow" : "text-ink hover:text-accent-ink")}
            >
              {site.email}
            </a>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
