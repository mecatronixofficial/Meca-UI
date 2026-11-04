import type { Metadata } from "next";
import { ArrowDownRight, ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone, AudioLines, Workflow, Rocket, Check, Navigation, Globe2 } from "lucide-react";
import { pageMetadata } from "../../lib/seo";
import { site, socialLinks, whatsappLink } from "../../lib/site";
import { Container } from "../../components/ui/Container";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { SocialIcon } from "../../components/ui/SocialIcon";
import { ContactForm } from "../../components/contact/ContactForm";
import { CopyEmail } from "../../components/contact/CopyEmail";
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
              <div className={styles.enquiryHeadingRow}>
                <p className={styles.eyebrow}><span /> YOUR NEXT CHAPTER</p>
                <span className={styles.launchIcon}><Rocket aria-hidden size={22} strokeWidth={1.5} /></span>
              </div>
              <h1 id="contact-title">Let’s make<br /><span>something</span><br />that matters<span className={styles.period}>.</span></h1>
              <p>A new website, a smarter system, or an idea waiting to happen. Tell us a little about it.</p>
            </div>
            <div className={styles.formTopline}><span><Mail aria-hidden size={16} /> THE PROJECT NOTE</span><span>01 — YOUR DETAILS</span></div>
            <div className={styles.formPanel}><ContactForm email={site.email} whatsapp={site.whatsapp} /></div>
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

        <section className={styles.location} aria-labelledby="location-title">
          <div className={styles.locationAmbient} aria-hidden />
          <svg className={styles.locationLines} viewBox="0 0 1200 800" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden><path d="M-80 620C180 100 550 110 850 280S1200 250 1320 0M-100 660C180 140 550 150 850 320S1200 290 1320 40" /><circle cx="850" cy="280" r="8" /><circle cx="850" cy="280" r="22" /></svg>
          <header className={styles.locationHeader}>
            <div>
              <Reveal as="p" className={styles.locationEyebrow}><Globe2 aria-hidden size={16} /> FIND US</Reveal>
              <Reveal as="h2" id="location-title">Built locally.<br /><span>Connected globally.</span></Reveal>
            </div>
            <Reveal as="p" className={styles.locationLead}>Meet us in {site.address.city}.<br />Build with us from anywhere.</Reveal>
          </header>
          <div className={styles.locationGrid}>
            <div className={styles.mapColumn}>
              <Reveal className={styles.mapFrame}>
                <div className={styles.mapToolbar}><span><span /> OUR STUDIO ON THE MAP</span><a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Open Mecatronix studio in Google Maps"><ArrowUpRight aria-hidden size={19} /></a></div>
                <iframe title={`Mecatronix studio — ${site.address.city}`} src={`https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              <a className={styles.studioMapCard} href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer">
                <span className={styles.studioMapPin}><MapPin aria-hidden size={20} /></span>
                <span className={styles.studioMapCopy}><span>MECATRONIX STUDIO</span><strong>{site.address.city}, India</strong></span>
                <ArrowUpRight aria-hidden size={22} />
              </a>
              </Reveal>
            </div>
            <div className={styles.locationInfo}>
              <Reveal className={styles.officeIntro}>
                <div className={styles.officeOverline}><span>THE STUDIO VISIT</span><ArrowUpRight aria-hidden size={19} /></div>
                <h3>Good ideas start<br />with <span>hello.</span></h3>
                <p>Pull up a chair. Let’s talk about what you want to build.</p>
              </Reveal>
              <div className={styles.officeCards}>
                <Reveal className={styles.officeCard} style={{ "--reveal-delay": "70ms" } as React.CSSProperties}><span className={styles.officeIcon}><MapPin aria-hidden size={21} /></span><div><h4>Our address</h4><p>{site.address.full}</p></div></Reveal>
                <Reveal className={styles.officeCard} style={{ "--reveal-delay": "140ms" } as React.CSSProperties}><span className={styles.officeIcon}><Clock aria-hidden size={21} /></span><div><h4>Studio hours</h4><p>{site.hours}</p></div></Reveal>
              </div>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.address.full)}`} target="_blank" rel="noopener noreferrer" className={styles.directions}><Navigation aria-hidden size={19} /> Get Directions <ArrowUpRight aria-hidden size={20} /></a>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
