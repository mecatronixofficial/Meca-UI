import type { Metadata } from "next";
import { CalendarCheck, FileCheck2, MessagesSquare, ShieldCheck } from "lucide-react";
import { processSteps } from "../../data/process";
import { pageMetadata } from "../../lib/seo";
import { PageHero } from "../../components/sections/PageHero";
import { ContactCTA } from "../../components/sections/ContactCTA";
import { Faq } from "../../components/sections/Faq";
import { Container, Section } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/Heading";

export const metadata: Metadata = pageMetadata({
  title: "Our Software Development Process",
  description:
    "How Mecatronix runs software projects — discovery, planning, UI/UX design, development, quality assurance, launch and support — explained for business owners.",
  path: "/process",
  keywords: ["software development process", "how software projects work", "custom software development steps"],
});

const expectations = [
  { icon: CalendarCheck, title: "A predictable rhythm", text: "Regular check-ins and demos at an agreed cadence, so progress is visible and feedback is timely." },
  { icon: MessagesSquare, title: "One clear channel", text: "A named point of contact on both sides and a shared place for questions, decisions and files." },
  { icon: FileCheck2, title: "Written decisions", text: "Scope, priorities and changes are confirmed in writing, so there's never confusion about what was agreed." },
  { icon: ShieldCheck, title: "Your accounts, your data", text: "Domains, hosting and app store accounts are set up in your company's name wherever possible." },
];

const faqs = [
  { q: "Do I need technical knowledge to work with you?", a: "No. We explain decisions in plain language, show working software regularly and ask for feedback on things you know best — your business, customers and workflows." },
  { q: "How long does a project take?", a: "It depends on scope. A focused website may take a few weeks; a custom system is planned in phases over several months. You get a timeline after the planning stage, before development starts." },
  { q: "What if our requirements change during the project?", a: "Change is normal. We assess the impact on scope and timeline, agree it with you in writing, and adjust the plan — rather than silently absorbing or refusing it." },
  { q: "How do you estimate cost?", a: "After discovery we have enough understanding to estimate. Depending on the project, this may be a fixed price for a defined scope or a phased estimate for larger systems." },
  { q: "What happens after launch?", a: "Every project includes an agreed post-launch support period. After that, we can continue with ongoing maintenance and enhancements if you need them." },
];

export default function ProcessPage() {
  return (
    <>
      <PageHero
        crumbs={[{ path: "/process", label: "Process" }]}
        eyebrow="Our process"
        title={<>From concept to <span className="text-gradient">confident launch.</span></>}
        intro="Six stages, each with a clear purpose and clear outputs. Designed so business owners always know what's happening, what's next and what we need from them."
      >
        <ol className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-line bg-line shadow-soft sm:grid-cols-3 lg:grid-cols-6">
          {processSteps.map((s) => (
            <li key={s.n}>
              <a href={`#step-${s.n}`} className="group flex h-full flex-col gap-6 bg-white p-5 transition-colors hover:bg-sand">
                <span className="font-mono text-xs text-accent">{s.n}</span>
                <span className="text-[15px] font-medium text-ink group-hover:text-accent-ink">{s.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </PageHero>

      <Section labelledBy="steps-title">
        <Container>
          <h2 id="steps-title" className="sr-only">The six stages</h2>
          <ol className="relative">
            <span aria-hidden className="absolute bottom-0 left-[27px] top-0 hidden w-px bg-gradient-to-b from-accent via-line-strong to-transparent md:block" />
            {processSteps.map((s) => (
              <li key={s.n} id={`step-${s.n}`} className="relative grid scroll-mt-28 gap-8 pb-20 last:pb-0 md:grid-cols-[56px_1fr] md:gap-10 lg:pb-28">
                <span className="relative z-10 hidden size-14 items-center justify-center rounded-full border border-accent/30 bg-white font-mono text-sm text-accent-ink shadow-soft md:flex">
                  {s.n}
                </span>
                <div className="grid gap-10 lg:grid-cols-12" data-reveal>
                  <div className="lg:col-span-6">
                    <p className="font-mono text-xs text-accent-ink md:hidden">{s.n}</p>
                    <h3 className="text-h2 text-surface">{s.title}</h3>
                    <p className="text-lead mt-4 font-medium text-surface/85">{s.text}</p>
                    <p className="mt-5 text-[16px] leading-relaxed text-muted-ink">{s.detail}</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6 lg:grid-cols-1">
                    <div className="rounded-panel border border-line bg-paper p-7">
                      <p className="text-label text-muted-ink">Deliverables</p>
                      <ul className="mt-4 space-y-2.5">
                        {s.deliverables.map((d) => (
                          <li key={d} className="flex items-center gap-3 text-[15.5px] text-surface">
                            <span aria-hidden className="size-1.5 rounded-full bg-accent" /> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-panel border border-accent/15 bg-sand p-7 text-surface">
                      <p className="text-label text-accent-ink">What we need from you</p>
                      <p className="mt-4 text-[15.5px] leading-relaxed">{s.fromYou}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section labelledBy="collab-title">
        <Container>
          <SectionHeading
            id="collab-title"
            align="split"
            eyebrow="Collaboration"
            title="What working with us feels like."
            intro="Process is only useful if it makes the project easier for you. These are the habits we keep on every engagement."
          />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {expectations.map(({ icon: Icon, title, text }, i) => (
              <li key={title} data-reveal style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties} className="rounded-panel border border-line bg-white p-7 hover-card spotlight relative">
                <Icon aria-hidden className="size-6 text-accent" strokeWidth={1.6} />
                <h3 className="mt-10 text-[1.15rem] font-semibold text-ink">{title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-ink">{text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Faq faqs={faqs} title="Questions about the process" />
      <ContactCTA />
    </>
  );
}
