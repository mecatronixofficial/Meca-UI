import type { Metadata } from "next";
import { ArrowDownRight, ArrowUpRight, Mail, MessageCircle, Phone, AudioLines, Workflow, Rocket, Check } from "lucide-react";
import { pageMetadata } from "../../lib/seo";
import { whatsappLink } from "../../lib/site-contact";
import { getSiteContact } from "../../lib/site-contact.server";
import { Container } from "../../components/ui/Container";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { SocialIcon } from "../../components/ui/SocialIcon";
import { ContactForm } from "../../components/contact/ContactForm";
import { CopyEmail } from "../../components/contact/CopyEmail";
import { StudioDirections } from "../../components/contact/StudioDirections";
import styles from "./contact.module.css";
import { Reveal } from "../../components/animations/Reveal";

export const metadata: Metadata = pageMetadata({
  title: "Contact Mecatronix — Start Your Software Project",
  description: "Talk to Mecatronix about your website, app, ERP or custom software project. Send an enquiry, call or WhatsApp our team in Coimbatore, Tamil Nadu.",
  path: "/contact",
  keywords: ["contact software company Coimbatore", "software project enquiry", "hire software developers Coimbatore"],
  socialTitle: "Great things start with a conversation.",
});

const steps = [
  { label: "DISCOVER", outcome: "A shared understanding", icon: AudioLines, title: "We start by listening.", text: "We read your enquiry and get in touch by email or phone to understand what you need." },
  { label: "CONNECT THE DOTS", outcome: "Ideas with direction", icon: Workflow, title: "We explore the possibilities.", text: "Together, we talk through your goals, your users, and what a successful project looks like." },
  { label: "MOVE FORWARD", outcome: "Your project roadmap", icon: Rocket, title: "You get a clear way forward.", text: "We put together a proposal with a focused scope, an approach, and the next steps." },
];

export default async function ContactPage() {
  // Emails, phones, addresses, hours and social links are managed in the admin panel (Contact details)
  const contact = await getSiteContact();
  return (
    <div className={styles.page}>
      <Container>
        <div className={styles.breadcrumbs}><Breadcrumbs crumbs={[{ path: "/contact", label: "Contact" }]} /></div>
        <div className={styles.workspace}>
          <aside className={styles.contactColumn} aria-label="Contact our studio">
            <div className={styles.contactCard}>
              <div className={styles.cardTop}><span className={styles.studioLabel}><span /> THE MECATRONIX STUDIO</span><span className={styles.edition}>LET’S CONNECT / 01</span></div>
              <div className={styles.art} aria-hidden><div className={styles.artRing} /><div className={styles.artRing} /><div className={styles.artCore}><ArrowUpRight strokeWidth={1} /></div><span className={styles.artDot} /></div>
              <div className={styles.cardContent}>
                <p className={styles.cardEyebrow}>A small hello. A big possibility.</p>
                <h2>Good things<br />start <span>here.</span><ArrowDownRight aria-hidden size={34} strokeWidth={1.3} /></h2>
                <p className={styles.cardIntro}>Bring your ideas, your questions, your “what ifs”. We’ll bring the curiosity and the code.</p>
                <a className={styles.emailLink} href={`mailto:${contact.email}`}><span>{contact.email}</span><ArrowUpRight aria-hidden size={24} /></a>
                <CopyEmail email={contact.email} />
                <div className={styles.quickLinks}>
                  <a href={`tel:${contact.phone}`}><Phone aria-hidden size={18} /><span><small>Give us a call</small>{contact.phoneDisplay}</span><ArrowUpRight aria-hidden size={18} /></a>
                  <a href={whatsappLink(contact)} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden size={19} /><span><small>Prefer a quick chat?</small>Find us on WhatsApp</span><ArrowUpRight aria-hidden size={18} /></a>
                </div>
                <div className={styles.cardFooter}><span>BASED IN {contact.address.city.toUpperCase()}</span><span>BUILDING EVERYWHERE ↗</span></div>
              </div>
            </div>
            {contact.socialLinks.length > 0 && <div className={styles.socialBar}><span>Elsewhere on the internet</span><div>{contact.socialLinks.map((social) => <a key={social.key} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`Mecatronix on ${social.label}`}><SocialIcon name={social.key} className="size-4" /></a>)}</div></div>}
          </aside>

          <section className={styles.enquiry} aria-labelledby="contact-title">
            <div className={styles.formHeader}>
              <div className={styles.enquiryHeadingRow}>
                <p className={styles.eyebrow}><span /> YOUR NEXT CHAPTER</p>
                <span className={styles.launchIcon}><Rocket aria-hidden size={22} strokeWidth={1.5} /></span>
              </div>
              <h1 id="contact-title">Let’s make<br /><span>something</span><br />that matters<span className={styles.period}>.</span></h1>
              <p>A new website, a smarter system, or an idea waiting to happen. Tell us a little about it.</p>
            </div>
            <div className={styles.formTopline}><span><Mail aria-hidden size={16} /> THE PROJECT NOTE</span><span>01 — YOUR DETAILS</span></div>
            <div className={styles.formPanel}><ContactForm email={contact.email} whatsapp={contact.whatsapp} /></div>
            <div className={styles.formFootnote}><Check aria-hidden size={15} /><span>Straight to our team. The start of a real conversation.</span></div>
          </section>
        </div>

        <section className={styles.afterword} aria-labelledby="next-title">
          <Reveal className={styles.afterwordIntro}>
            <div>
              <p className={styles.eyebrow}>AFTER YOU HIT SEND</p>
              <h2 id="next-title">Your vision.<br /><span>A clear path forward.</span></h2>
            </div>
            <p>You bring the ambition. We connect the dots between your idea and the technology that brings it to life.</p>
          </Reveal>
          <ol className={styles.visionGrid}>
            {steps.map((step, i) => (
              <li key={step.title} className={styles.visionCard}>
                <div className={styles.visionCardTop}>
                  <span className={styles.visionIcon}><step.icon aria-hidden size={26} strokeWidth={1.5} /></span>
                  <span className={styles.visionIndex}>0{i + 1}<span aria-hidden> / 03</span></span>
                </div>
                <div className={styles.visionCircuit} aria-hidden><span /><span /><span /></div>
                <p className={styles.visionLabel}>{step.label}</p>
                <h3>{step.title}</h3>
                <p className={styles.visionDescription}>{step.text}</p>
                <div className={styles.visionOutcome}><Check aria-hidden size={14} /><span>{step.outcome}</span><ArrowUpRight aria-hidden size={18} /></div>
              </li>
            ))}
          </ol>
          <div className={styles.visionFootnote}><span aria-hidden /><p>Human conversations. Thoughtful technology. Meaningful next steps.</p></div>
        </section>

        <StudioDirections contact={contact} />
      </Container>
    </div>
  );
}
