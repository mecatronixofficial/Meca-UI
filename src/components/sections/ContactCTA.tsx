import Image from "next/image";
import { Mail } from "lucide-react";
import { site } from "../../lib/site";
import { whatsappLink } from "../../lib/site-contact";
import { getSiteContact } from "../../lib/site-contact.server";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { Reveal } from "../animations/Reveal";
import styles from "./cta.module.css";

/** Closing call to action used at the end of most pages. `tone="red"` is the compact home-page finale: a looping red chat beside the call to action. */
export async function ContactCTA({
  title,
  text = "Tell us about your idea, challenge or business requirements. We would love to explore how technology can help.",
  tone = "light",
}: {
  title?: React.ReactNode;
  text?: string;
  tone?: "light" | "red";
}) {
  const contact = await getSiteContact();

  if (tone === "red") {
    return (
      <section aria-labelledby="cta-title" className="relative isolate overflow-hidden bg-white py-8 sm:py-10 lg:py-12">
        <span aria-hidden className={styles.glow} />
        <Container>
          <div className="grid items-center gap-7 lg:grid-cols-12 lg:gap-12">
            {/* A chat that keeps playing: our greeting, a client's reply, and us typing */}
            <Reveal className="hidden sm:block lg:col-span-5">
              <div aria-hidden className={styles.chat}>
                <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                  <span className={styles.avatar}>
                    <Image src={site.logo} alt="" width={296} height={387} className="h-5 w-auto" />
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block text-[13.5px] font-semibold text-ink">Mecatronix team</span>
                    <span className="flex items-center gap-1.5 text-[11.5px] text-emerald-600">
                      <span className="size-1.5 rounded-full bg-emerald-500" /> Online · replies in minutes
                    </span>
                  </span>
                </div>
                <div className="flex flex-col gap-2 px-4 py-4">
                  <span className={`${styles.msg} ${styles.them}`} style={{ animationDelay: "0.2s" }}>Hi there 👋</span>
                  <span className={`${styles.msg} ${styles.them}`} style={{ animationDelay: "0.9s" }}>Have a project in mind?</span>
                  <span className={`${styles.msg} ${styles.you}`} style={{ animationDelay: "2s" }}>Yes! A website with online ordering 🚀</span>
                  <span className={`${styles.msg} ${styles.them} ${styles.typing}`} style={{ animationDelay: "3.1s" }}>
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal className="min-w-0 lg:col-span-7" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
              <p className="text-label inline-flex items-center gap-2.5 text-accent-ink">
                <span aria-hidden className={styles.pulse} />
                Let&apos;s talk
              </p>
              <h2 id="cta-title" className="mt-3 font-display text-[clamp(1.35rem,1rem+1.6vw,2.2rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-ink">
                {title ?? (
                  <>
                    Have a project in mind? <span className="text-shimmer">Let&apos;s build something that works.</span>
                  </>
                )}
              </h2>
              <p className="mt-2.5 max-w-xl text-[clamp(0.84rem,0.8rem+0.2vw,0.94rem)] leading-relaxed text-muted-ink">{text}</p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <Button href="/contact" arrow>Start Your Project</Button>
                <Button href={whatsappLink(contact)} variant="outline-light" arrow="external" external>
                  Talk on WhatsApp
                </Button>
              </div>
              <p className="mt-4 inline-flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-ink">
                <Mail aria-hidden className="size-4 text-accent" />
                Prefer email?
                <a href={`mailto:${contact.email}`} className="font-medium text-ink underline-offset-4 [overflow-wrap:anywhere] hover:text-accent-ink hover:underline">
                  {contact.email}
                </a>
              </p>
            </Reveal>
          </div>
        </Container>
      </section>
    );
  }

  const heading = title ?? (
    <>
      Have a project in mind?
      <br />
      <span className="text-gradient">Let&apos;s build something that works.</span>
    </>
  );

  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden border-t border-line bg-white py-24 text-ink sm:py-32 lg:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_70%_at_50%_100%,black,transparent)]" />
        <div className="absolute bottom-[-30%] left-1/2 h-[520px] w-[900px] -translate-x-1/2 glow-accent" />
      </div>

      <Container>
        <Reveal className="mx-auto max-w-4xl text-center">
          <h2 id="cta-title" className="text-h1 text-ink">{heading}</h2>
          <p className="text-lead mx-auto mt-7 max-w-2xl text-muted-ink">{text}</p>
          <div className="mt-11 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/contact" size="lg" arrow>Start Your Project</Button>
            <Button href={whatsappLink(contact)} size="lg" variant="outline-light" arrow="external" external>
              Talk on WhatsApp
            </Button>
          </div>
          <p className="mt-10 inline-flex items-center gap-2 text-sm text-muted">
            <Mail aria-hidden className="size-4 text-accent" />
            Prefer email?{" "}
            <a href={`mailto:${contact.email}`} className="text-ink underline-offset-4 hover:text-accent-ink hover:underline">
              {contact.email}
            </a>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
