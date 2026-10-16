import { Mail } from "lucide-react";
import { site, whatsappLink } from "../../lib/site";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";

/** Closing call to action used at the end of most pages. */
export function ContactCTA({
  title = (
    <>
      Have a project in mind?
      <br />
      <span className="text-gradient">Let&apos;s build something that works.</span>
    </>
  ),
  text = "Tell us about your idea, challenge or business requirements. We would love to explore how technology can help.",
}: {
  title?: React.ReactNode;
  text?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden border-t border-line bg-white py-24 text-ink sm:py-32 lg:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_70%_at_50%_100%,black,transparent)]" />
        <div className="absolute bottom-[-30%] left-1/2 h-[520px] w-[900px] -translate-x-1/2 glow-accent" />
      </div>

      <Container>
        <div className="mx-auto max-w-4xl text-center" data-reveal>
          <h2 id="cta-title" className="text-h1 text-ink">{title}</h2>
          <p className="text-lead mx-auto mt-7 max-w-2xl text-muted-ink">{text}</p>
          <div className="mt-11 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/contact" size="lg" arrow>Start Your Project</Button>
            <Button href={whatsappLink()} size="lg" variant="outline-light" arrow="external" external>
              Talk on WhatsApp
            </Button>
          </div>
          <p className="mt-10 inline-flex items-center gap-2 text-sm text-muted">
            <Mail aria-hidden className="size-4 text-accent" />
            Prefer email? <a href={`mailto:${site.email}`} className="text-ink underline-offset-4 hover:text-accent-ink hover:underline">{site.email}</a>
          </p>
        </div>
      </Container>
    </section>
  );
}
