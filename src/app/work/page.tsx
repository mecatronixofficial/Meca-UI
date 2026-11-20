import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  Check,
  ArrowUpRight,
  Mail,
  MessageCircle,
} from "lucide-react";
import { getProjects } from "../../lib/content";
import { serviceList } from "../../data/service-list";
import { pageMetadata } from "../../lib/seo";
import { whatsappLink } from "../../lib/site-contact";
import { getSiteContact } from "../../lib/site-contact.server";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { Button } from "../../components/ui/Button";
import { serviceIcons } from "../../components/ui/icons";
import { Reveal } from "../../components/animations/Reveal";
import { WorkGrid } from "../../components/portfolio/WorkGrid";
import {
  WorkHeroPreview,
  ProjectCount,
} from "../../components/portfolio/work/WorkHeroPreview";
import { ProjectSpotlight } from "../../components/portfolio/work/ProjectSpotlight";
import styles from "../../components/portfolio/work/work.module.css";
import next from "../../components/portfolio/work/next.module.css";
import expertise from "../../components/portfolio/work/expertise.module.css";

/** Service photos (Unsplash, stored locally in /public/assets/services), shared with the home page. */
const servicePhotos: Record<string, string> = {
  "web-development": "/assets/services/web.jpg",
  "custom-software": "/assets/services/software.jpg",
  "mobile-app-development": "/assets/services/mobile.jpg",
  "ecommerce-development": "/assets/services/ecommerce.jpg",
  "erp-development": "/assets/services/erp.jpg",
  "ai-automation": "/assets/services/ai.jpg",
};

export const metadata: Metadata = pageMetadata({
  title: "Our Work — Websites, E-commerce & Business Systems",
  description:
    "Selected projects by Mecatronix: websites, e-commerce storefronts and management systems for textile, manufacturing and education businesses in Tamil Nadu.",
  path: "/work",
  keywords: [
    "software development portfolio Coimbatore",
    "textile website development",
    "school management system",
    "industrial website design",
  ],
  socialTitle: "Selected work. Real solutions.",
});

export default async function WorkPage() {
  const [projects, contact] = await Promise.all([getProjects(), getSiteContact()]);
  const spotlight =
    projects.find((project) => project.slug === "little-mahilam-preschool") ??
    projects.find((project) => project.services.includes("custom-software"));

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="work-title">
        <div className={styles.contentWidth}>
          <Breadcrumbs crumbs={[{ path: "/work", label: "Our Work" }]} />
          <div className={styles.heroLayout}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span /> 01 / SELECTED WORK
              </p>
              <h1 id="work-title">
                <span>Built with purpose.</span>
                <span>Designed to</span>
                <span>make an impact.</span>
              </h1>
              <p className={styles.heroIntro}>
                Explore websites, digital experiences and custom business
                systems engineered by Mecatronix for real-world businesses.
              </p>
              <div className={styles.heroActions}>
                <Button href="#selected-projects" size="lg" arrow>
                  Explore Projects
                </Button>
                <a href="#selected-projects" className={styles.scrollLink}>
                  <span>
                    <ArrowDown size={13} aria-hidden="true" />
                  </span>
                  Scroll to discover
                </a>
              </div>
            </div>
            <WorkHeroPreview projects={projects} />
          </div>
          <div className={styles.heroFoot}>
            <p>
              Websites. Storefronts. Business systems.
              <br />
              <strong>Thoughtful work for the people behind them.</strong>
            </p>
            <span className={styles.heroFootNote}>
              DESIGN WITH INTENT. ENGINEER WITH CARE.
            </span>
            <ProjectCount count={projects.length} />
          </div>
        </div>
      </section>

      <section
        id="selected-projects"
        aria-labelledby="projects-heading"
        className={styles.projectsSection}
      >
        <div className={styles.contentWidth}>
          <Reveal className={styles.galleryHeading}>
            <div>
              <p className={styles.eyebrow}>
                <span /> 02 / THE PROJECT INDEX
              </p>
              <h2 id="projects-heading">
                A selection of our work.
                <br />
                <span>Each with a purpose.</span>
              </h2>
            </div>
            <p>
              Real businesses, distinct challenges, and digital experiences
              built around the details.
            </p>
          </Reveal>
          <WorkGrid projects={projects} />
        </div>
      </section>

      {spotlight && <ProjectSpotlight project={spotlight} />}

      <section
        className={styles.expertiseSection}
        aria-labelledby="work-expertise-title"
      >
        <div className={styles.contentWidth}>
          <Reveal className={expertise.head}>
            <div>
              <p className={next.tag}>
                <i aria-hidden="true" /> WHAT ELSE WE BUILD
              </p>
              <h2 id="work-expertise-title" className={next.title}>
                More than beautiful <span className="text-shimmer">interfaces.</span>
              </h2>
            </div>
            <p className="max-w-md text-[clamp(13.5px,0.8rem+0.2vw,15px)] leading-relaxed text-muted-ink">
              We engineer connected digital experiences, applications and
              business systems that support the way companies work.
            </p>
          </Reveal>
          <ul className={expertise.grid}>
            {serviceList.map((service, i) => {
              const Icon = serviceIcons[service.slug];
              return (
                <Reveal as="li" key={service.slug} style={{ "--reveal-delay": `${(i % 3) * 80}ms` } as React.CSSProperties}>
                  <Link href={`/services/${service.slug}`} className={expertise.tile}>
                    <span className={expertise.photo}>
                      <Image src={servicePhotos[service.slug] ?? servicePhotos["web-development"]} alt="" fill sizes="96px" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={expertise.icon}>
                        <Icon size={14} strokeWidth={2} aria-hidden="true" />
                      </span>
                      <span className="mt-2 block text-[15px] font-semibold leading-tight text-ink">{service.navLabel}</span>
                      <span className="mt-1 line-clamp-2 block text-[12.5px] leading-snug text-muted-ink">{service.summary}</span>
                    </span>
                    <span className={expertise.go} aria-hidden="true">
                      <ArrowUpRight size={15} />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <section
        className={styles.ctaSection}
        aria-labelledby="work-contact-title"
      >
        <div className={styles.contentWidth}>
          <Reveal className={next.card}>
            <div>
              <p className={next.tag}>
                <i aria-hidden="true" /> YOUR PROJECT, NEXT
              </p>
              <h2 id="work-contact-title" className={next.title}>
                Your next big idea deserves{" "}
                <span className="text-shimmer">great engineering.</span>
              </h2>
              <p className="mt-3 max-w-md text-[clamp(13.5px,0.8rem+0.2vw,15px)] leading-relaxed text-muted-ink">
                Have a website, application or business system in mind? Let’s
                build something that makes a difference.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <Button href="/contact" arrow>
                  Start Your Project
                </Button>
                <a
                  href={whatsappLink(contact)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={next.whatsapp}
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  Talk on WhatsApp
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
              <a href={`mailto:${contact.email}`} className={`${next.mail} mt-5`}>
                <Mail size={16} aria-hidden="true" />
                {contact.email}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>

            {/* Roadmap that keeps replaying: each step fills, then the rocket lifts off */}
            <div className={next.board} aria-hidden="true">
              <div className={next.boardBar}>
                <span className={next.live} />
                your-project.app
                <span className="ml-auto">building…</span>
              </div>
              <ol className={next.steps}>
                {[
                  ["💡", "Idea & discovery"],
                  ["🎨", "Design"],
                  ["💻", "Build"],
                  ["🚀", "Launch"],
                ].map(([emoji, label], i) => (
                  <li key={label} className={next.step} style={{ "--i": i } as React.CSSProperties}>
                    <span className={next.emoji}>
                      <span className={i === 3 ? next.rocket : undefined}>{emoji}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-semibold text-ink">{label}</span>
                      <span className={next.track}>
                        <span />
                      </span>
                    </span>
                    <span className={next.check}>
                      <Check size={13} strokeWidth={3} />
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
