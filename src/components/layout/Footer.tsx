import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, Bot, CircuitBoard, MapPin, MessageCircle, Phone } from "lucide-react";
import { footerNav } from "../../data/navigation";
import { site, socialLinks, whatsappLink } from "../../lib/site";
import { cn } from "../../lib/cn";
import { Container } from "../ui/Container";
import { Logo } from "../ui/Logo";
import { SocialIcon } from "../ui/SocialIcon";
import { StudioClock } from "./StudioClock";
import styles from "./service-marquee.module.css";
import contactStyles from "./footer-contact.module.css";
import { Reveal } from "../animations/Reveal";

/* All footer motion is CSS (transitions plus the marquee/spin keyframes in globals.css). */

const WORDMARK = "MECATRONIX".split("");

/** A slow service strip; pauses on hover and keyboard focus. */
function ServiceMarquee() {
  return (
    <div className={styles.robotStrip}>
      <div className={styles.stripHeader}><span><Bot aria-hidden size={18} /> MECATRONIX / ENGINEERING LAB</span><span><CircuitBoard aria-hidden size={14} /> DESIGN. DEVELOP. AUTOMATE.</span></div>
      <div className={styles.trackWindow}>
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          aria-hidden={copy === 1 || undefined}
          className={cn(styles.robotTrack, copy === 1 && styles.duplicateTrack)}
        >
          {footerNav.services.map((s, i) => (
            <li key={s.href} className={styles.robotItem}>
              <Link
                href={s.href}
                tabIndex={copy === 1 ? -1 : undefined}
                className={styles.robotModule}
              >
                <span className={styles.robotFace} aria-hidden><span /><span /></span>
                <span className={styles.moduleCopy}><span>CAPABILITY / 0{i + 1}</span><strong>{s.label}</strong></span>
                <ArrowUpRight aria-hidden size={17} className={styles.moduleArrow} />
              </Link>
              <span className={styles.circuitLink} aria-hidden><span /></span>
            </li>
          ))}
        </ul>
      ))}
      </div>
    </div>
  );
}

function FooterColumn({ index, title, links }: { index: string; title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-label flex items-center gap-2 text-muted">
        <span className="text-accent-ink">{index}</span>
        {title}
      </h2>
      <ul className="mt-6 space-y-3.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="group inline-flex items-center text-[15px] text-surface/80 transition-colors hover:text-ink">
              <span aria-hidden className="h-px w-0 bg-accent transition-[width,margin] duration-300 group-hover:mr-2 group-hover:w-3" />
              {l.label}
              <ArrowUpRight
                aria-hidden
                className="ml-1 size-3.5 -translate-x-1 text-accent opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Compact contact channel with matching keyboard and pointer feedback. */
function ContactCard({
  href,
  icon: Icon,
  label,
  value,
  external,
}: {
  href: string;
  icon: typeof Phone;
  label: string;
  value: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={contactStyles.channel}
    >
      <span className={contactStyles.channelIcon}>
        <Icon aria-hidden className="size-5" strokeWidth={1.8} />
      </span>
      <span className={contactStyles.channelCopy}>
        <span>{label}</span>
        <strong>{value}</strong>
      </span>
      <ArrowUpRight aria-hidden size={17} className={contactStyles.channelArrow} />
    </a>
  );
}

/** Logo seal under the wordmark: the mark in a white disc, ringed by slowly turning text. */
function LogoSeal() {
  return (
    <Link
      href="/"
      aria-label="Mecatronix home"
      className="group relative flex size-32 items-center justify-center text-muted md:size-36 transition-colors duration-500 hover:text-accent-ink"
    >
      <svg viewBox="0 0 120 120" aria-hidden className="absolute inset-0 size-full motion-safe:animate-spin-slow">
        <defs>
          <path id="footer-seal-ring" d="M60 60 m-49 0 a49 49 0 1 1 98 0 a49 49 0 1 1 -98 0" />
        </defs>
        <text fontSize="8.6" className="fill-current font-mono uppercase">
          <textPath href="#footer-seal-ring" textLength="306" lengthAdjust="spacing">
            Mecatronix • Software Development •
          </textPath>
        </text>
      </svg>
      <span className="relative flex size-[76px] items-center justify-center rounded-full bg-white md:size-[86px] ring-1 ring-line transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110 group-hover:ring-accent/40">
        <Image src={site.logo} alt="" width={site.logoWidth} height={site.logoHeight} className="h-10 w-auto transition-transform duration-500 group-hover:-translate-y-0.5 md:h-11" />
      </span>
    </Link>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden border-t border-line bg-white text-ink">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute -top-48 right-[-10%] -z-10 h-[480px] w-[680px] glow-accent opacity-70" />
      <div aria-hidden className="pointer-events-none absolute bottom-24 left-[-12%] -z-10 h-[420px] w-[560px] glow-wine motion-safe:animate-float" />

      <ServiceMarquee />

      <Container className={contactStyles.contactContainer}>
        {/* Contact */}
        <Reveal as="section" className={contactStyles.contactBand} aria-labelledby="footer-contact-title">
          <div className={contactStyles.robotPortrait} aria-hidden>
            <span className={contactStyles.antenna} />
            <div className={contactStyles.robotHead}><span /><span /><i /></div>
            <div className={contactStyles.robotShoulders} />
          </div>
          <div className={contactStyles.contactIntro}>
            <p className={contactStyles.eyebrow}><CircuitBoard aria-hidden size={14} /> HUMAN IDEAS. SMART ENGINEERING.</p>
            <h2 id="footer-contact-title">Start a <span>conversation.</span></h2>
            <a href={`mailto:${site.email}`} className={contactStyles.emailLink}><span>{site.email}</span><ArrowUpRight aria-hidden size={21} /></a>
            <p className={contactStyles.contactNote}>One hello closer to your next big thing.</p>
          </div>
          <div className={contactStyles.channels}>
            <ContactCard href={`tel:${site.phone}`} icon={Phone} label="Call us" value={site.phoneDisplay} />
            <ContactCard href={whatsappLink()} icon={MessageCircle} label="WhatsApp" value="Chat with our team" external />
          </div>
        </Reveal>

        {/* Brand + navigation */}
        <div className="grid gap-14 py-14 lg:grid-cols-12 lg:gap-10 lg:py-20">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted-ink">
              A software engineering studio in Coimbatore, building websites, applications and business systems for
              companies in India and abroad.
            </p>

            <a
              href={site.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-start gap-3 text-[14.5px] text-surface transition-colors hover:text-accent-ink"
            >
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-accent transition-transform duration-300 group-hover:-translate-y-0.5" />
              <span className="max-w-xs leading-relaxed">{site.address.full}</span>
            </a>

            {socialLinks.length > 0 && (
              <ul className="mt-8 flex items-center gap-2" aria-label="Social media">
                {socialLinks.map((s) => (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Mecatronix on ${s.label}`}
                      className="flex size-11 items-center justify-center rounded-full border border-line-strong text-surface/70 transition-[background-color,border-color,color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-accent hover:bg-accent hover:text-white hover:shadow-glow"
                    >
                      <SocialIcon name={s.key} className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid gap-12 sm:grid-cols-[1fr_1fr_1.35fr] sm:gap-10 lg:col-span-7 lg:col-start-6">
            <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:col-span-2">
              <FooterColumn index="01" title="Services" links={footerNav.services} />
              <FooterColumn index="02" title="Company" links={footerNav.company} />
            </nav>
            <div>
              <h2 className="text-label flex items-center gap-2 text-muted">
                <span className="text-accent-ink">03</span>
                Studio
              </h2>
              <StudioClock className="mt-6 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lift" />
            </div>
          </div>
        </div>
      </Container>

      {/* Oversized wordmark: each letter lifts and turns red under the cursor */}
      <div aria-hidden className="select-none overflow-hidden px-2">
        <p className="flex justify-center font-display text-[17vw] font-semibold leading-[0.85] tracking-[-0.06em]">
          {WORDMARK.map((ch, i) => (
            <span
              key={i}
              className="inline-block bg-[linear-gradient(180deg,rgb(225_6_0/0.2),rgb(225_6_0/0.03)_85%)] bg-clip-text text-transparent transition-[transform,color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-[0.07em] hover:text-accent"
            >
              {ch}
            </span>
          ))}
        </p>
      </div>

      {/* Bottom bar; from md up the logo seal sits on its top edge */}
      <div className="relative border-t border-line bg-white">
        <div className="flex justify-center pt-8 md:absolute md:left-1/2 md:top-0 md:z-10 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-full md:bg-white md:pt-0">
          <LogoSeal />
        </div>
        <Container className="grid gap-4 pb-6 pt-6 text-center text-sm text-muted md:grid-cols-[1fr_10rem_1fr] md:items-center md:gap-8 md:pt-6 md:text-left">
          <p>
            © {year} {site.legalName}.
            <span className="block text-[12.5px] md:mt-0.5">All rights reserved · Engineered in Coimbatore, India</span>
          </p>
          <span aria-hidden className="hidden md:block" />
          <div className="flex shrink-0 items-center justify-center gap-6 whitespace-nowrap md:justify-end">
            <Link href="/privacy" className="transition-colors hover:text-accent-ink">Privacy Policy</Link>
            <a href="#top" className="group inline-flex items-center gap-2 transition-colors hover:text-accent-ink">
              Back to top
              <span className="flex size-8 items-center justify-center rounded-full border border-line-strong transition-[background-color,border-color,color] duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                <ArrowUp aria-hidden className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
              </span>
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
