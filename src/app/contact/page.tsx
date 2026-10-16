import type { Metadata } from "next";
import { ArrowDownRight, ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone, Plus } from "lucide-react";
import { pageMetadata } from "../../lib/seo";
import { site, socialLinks, whatsappLink } from "../../lib/site";
import { Container } from "../../components/ui/Container";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { SocialIcon } from "../../components/ui/SocialIcon";
import { ContactForm } from "../../components/contact/ContactForm";
import { CopyEmail } from "../../components/contact/CopyEmail";
import styles from "./contact.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Contact Mecatronix — Start Your Software Project",
  description: "Talk to Mecatronix about your website, app, ERP or custom software project. Send an enquiry, call or WhatsApp our team in Coimbatore, Tamil Nadu.",
  path: "/contact",
  keywords: ["contact software company Coimbatore", "software project enquiry", "hire software developers Coimbatore"],
  socialTitle: "Great things start with a conversation.",
});

const steps = [
  { title: "We start by listening.", text: "We read your enquiry and get in touch by email or phone to understand what you need." },
  { title: "We explore the possibilities.", text: "Together, we talk through your goals, your users, and what a successful project looks like." },
  { title: "You get a clear way forward.", text: "We put together a proposal with a focused scope, an approach, and the next steps." },
];

export default function ContactPage() {
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
                <a className={styles.emailLink} href={`mailto:${site.email}`}><span>{site.email}</span><ArrowUpRight aria-hidden size={24} /></a>
                <CopyEmail email={site.email} />
                <div className={styles.quickLinks}>
                  <a href={`tel:${site.phone}`}><Phone aria-hidden size={18} /><span><small>Give us a call</small>{site.phoneDisplay}</span><ArrowUpRight aria-hidden size={18} /></a>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden size={19} /><span><small>Prefer a quick chat?</small>Find us on WhatsApp</span><ArrowUpRight aria-hidden size={18} /></a>
                </div>
                <div className={styles.cardFooter}><span>BASED IN {site.address.city.toUpperCase()}</span><span>BUILDING EVERYWHERE ↗</span></div>
              </div>
            </div>
            {socialLinks.length > 0 && <div className={styles.socialBar}><span>Elsewhere on the internet</span><div>{socialLinks.map((social) => <a key={social.key} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`Mecatronix on ${social.label}`}><SocialIcon name={social.key} className="size-4" /></a>)}</div></div>}
          </aside>

          <section className={styles.enquiry} aria-labelledby="contact-title">
            <div className={styles.formHeader}>
              <p className={styles.eyebrow}><span /> YOUR NEXT CHAPTER</p>
              <h1 id="contact-title">Let’s make<br /><span>something</span><br />that matters<span className={styles.period}>.</span></h1>
              <p>A new website, a smarter system, or an idea waiting to happen. Tell us a little about it.</p>
            </div>
            <div className={styles.formTopline}><span><Mail aria-hidden size={15} /> THE PROJECT NOTE</span><span>01 — YOUR DETAILS</span></div>
            <div className={styles.formPanel}><ContactForm email={site.email} whatsapp={site.whatsapp} /></div>
            <div className={styles.formFootnote}><span aria-hidden>↳</span> Straight to our team. The start of a real conversation.</div>
          </section>
        </div>

        <section className={styles.afterword} aria-labelledby="next-title">
          <div className={styles.afterwordIntro} data-reveal><p className={styles.eyebrow}>AFTER YOU HIT SEND</p><h2 id="next-title">A little clarity.<br />A lot of possibility.</h2><p>You don’t need a perfect brief.<br />We’ll figure out the right questions together.</p></div>
          <div className={styles.accordion}>{steps.map((step, i) => <details key={step.title} className={styles.step} open={i === 0}><summary><span className={styles.stepIndex}>0{i + 1}</span><h3>{step.title}</h3><Plus aria-hidden size={20} /></summary><p>{step.text}</p></details>)}</div>
        </section>

        <section className={styles.location} aria-labelledby="location-title">
          <div className={styles.locationInfo}><p className={styles.eyebrow}>OUR CORNER OF THE WORLD</p><h2 id="location-title">Local roots.<br /><span>Limitless reach.</span></h2><div className={styles.address}><MapPin aria-hidden size={20} /><p>{site.address.full}</p></div><div className={styles.address}><Clock aria-hidden size={18} /><p>{site.hours}</p></div><a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className={styles.directions}>Find your way here <ArrowUpRight aria-hidden size={18} /></a></div>
          <div className={styles.mapFrame}><iframe title={`Mecatronix studio — ${site.address.city}`} src={`https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><span className={styles.mapTag}><span /> {site.address.city}, India</span></div>
        </section>
      </Container>
    </div>
  );
}
