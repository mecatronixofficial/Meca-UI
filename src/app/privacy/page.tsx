import type { Metadata } from "next";
import { pageMetadata } from "../../lib/seo";
import { site } from "../../lib/site";
import { PageHero } from "../../components/sections/PageHero";
import { Container, Section } from "../../components/ui/Container";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Mecatronix Software Development collects, uses and protects information submitted through this website.",
  path: "/privacy",
});

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Information you send us",
    body: (
      <>
        <p>
          When you submit the project enquiry form we receive the details you enter: your name, email address, and
          optionally your phone number, company, the service you&apos;re interested in, a budget range and your project
          description. If you contact us by email, phone or WhatsApp, we receive the information you share there.
        </p>
        <p>We use this information only to respond to your enquiry and to discuss a potential project with you.</p>
      </>
    ),
  },
  {
    title: "The MECA assistant",
    body: (
      <p>
        If you use the MECA chat assistant, the messages you type are sent to our server and processed by an AI model
        provider (Anthropic) to generate replies. Please don&apos;t share sensitive personal information in the chat.
        Conversations are not used to contact you; if you&apos;d like us to get in touch, use the enquiry form.
      </p>
    ),
  },
  {
    title: "How information is stored and shared",
    body: (
      <p>
        Enquiries are delivered to our team by email and/or stored in our own enquiry system. We use service providers
        for hosting and email delivery, who process data on our behalf. We do not sell your personal information or share
        it with third parties for their own marketing.
      </p>
    ),
  },
  {
    title: "Cookies and analytics",
    body: (
      <p>
        This website does not use advertising cookies. Basic, technically necessary storage may be used by your browser to
        make the site work. If we add analytics in future, this policy will be updated to describe it.
      </p>
    ),
  },
  {
    title: "Your choices",
    body: (
      <p>
        You can ask us to access, correct or delete the information you&apos;ve sent us at any time by emailing{" "}
        <a href={`mailto:${site.email}`} className="text-accent-ink underline underline-offset-4">{site.email}</a>.
      </p>
    ),
  },
  {
    title: "Contact",
    body: (
      <p>
        {site.legalName}, {site.address.full}. Email{" "}
        <a href={`mailto:${site.email}`} className="text-accent-ink underline underline-offset-4">{site.email}</a> or call{" "}
        <a href={`tel:${site.phone}`} className="text-accent-ink underline underline-offset-4">{site.phoneDisplay}</a>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        crumbs={[{ path: "/privacy", label: "Privacy Policy" }]}
        eyebrow="Legal"
        title="Privacy Policy"
        intro="A plain-language explanation of what information this website collects and how we use it."
      />
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl space-y-14">
            {sections.map((s) => (
              <section key={s.title} aria-labelledby={s.title.replace(/\W+/g, "-")}>
                <h2 id={s.title.replace(/\W+/g, "-")} className="text-h3 text-surface">{s.title}</h2>
                <div className="mt-4 space-y-4 text-[16.5px] leading-relaxed text-muted-ink">{s.body}</div>
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
