import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Palette, Share2 } from "lucide-react";
import { pageMetadata } from "../../lib/seo";
import { Container } from "../../components/ui/Container";
import { TEMPLATES } from "../../data/templates";
import PreviewBuilder from "./PreviewBuilder";

export const metadata: Metadata = pageMetadata({
  title: "Preview Your Own Website — Free, in 60 Seconds",
  description: `Choose from ${TEMPLATES.length} industry templates — medical, textile, e-commerce, CRM, ERP, SaaS and more — add your logo and brand colour, and see your business website instantly.`,
  path: "/preview",
  keywords: ["website preview", "business website template", "free website mockup", "industry website design"],
});

export default function PreviewPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-white pt-[72px] text-ink">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,black,transparent)]" />
          <div className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 glow-accent" />
        </div>
        <Container className="pb-14 pt-12 text-center lg:pb-16 lg:pt-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-muted-ink shadow-soft motion-safe:animate-rise">
            <span className="size-1.5 rounded-full bg-accent" /> Free · No sign-up · {TEMPLATES.length} industries
          </p>
          <h1 className="text-h1 mx-auto mt-6 max-w-3xl motion-safe:animate-lift" style={{ animationDelay: "60ms" }}>
            See your website <span className="text-gradient">before we build it.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lead text-muted-ink motion-safe:animate-rise" style={{ animationDelay: "140ms" }}>
            Pick your industry, add your logo and brand colour, and get a complete, shareable website preview in under a minute.
          </p>
          <ul className="mx-auto mt-10 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
            {[
              { icon: Palette, title: "Your brand", text: "Logo, colours and services" },
              { icon: Clock, title: "60 seconds", text: "Generated instantly" },
              { icon: Share2, title: "Shareable", text: "A link for your team" },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-soft">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block text-[14.5px] font-semibold">{title}</span>
                  <span className="block text-[13px] text-muted-ink">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-line bg-paper py-12 lg:py-16">
        <Container>
          <Suspense>
            <PreviewBuilder />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
