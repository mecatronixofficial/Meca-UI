import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Mail,
  MessageCircle,
} from "lucide-react";
import { projects } from "../../data/projects";
import { serviceList } from "../../data/service-list";
import { pageMetadata } from "../../lib/seo";
import { site, whatsappLink } from "../../lib/site";
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

export default function WorkPage() {
  const spotlight =
    projects.find((project) => project.slug === "little-mahilam-preschool") ??
    projects.find((project) => project.services.includes("custom-software"));

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="work-title">
        <div className={styles.contentWidth}>
          <Breadcrumbs crumbs={[{ path: "/work", label: "Work" }]} />
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
          <Reveal className={styles.expertiseHeading}>
            <h2 id="work-expertise-title">
              More than beautiful
              <br />
              interfaces.
            </h2>
            <p>
              We engineer connected digital experiences, applications and
              business systems that support the way companies work.
            </p>
          </Reveal>
          <Reveal>
            <ul className={styles.expertiseLinks}>
              {serviceList.map((service) => {
                const Icon = serviceIcons[service.slug];
                return (
                  <li key={service.slug}>
                    <Link href={`/services/${service.slug}`}>
                      <Icon size={21} strokeWidth={1.5} aria-hidden="true" />
                      <span>{service.navLabel}</span>
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      <section
        className={styles.ctaSection}
        aria-labelledby="work-contact-title"
      >
        <div className={styles.contentWidth}>
          <Reveal className={styles.workCta}>
            <div className={styles.ctaLines} aria-hidden="true" />
            <div className={styles.ctaCorner} aria-hidden="true">
              <ArrowRight />
            </div>
            <p className={styles.eyebrow}>
              <span /> YOUR PROJECT, NEXT
            </p>
            <h2 id="work-contact-title">
              Your next big idea deserves
              <br />
              <span>great engineering.</span>
            </h2>
            <p>
              Have a website, application or business system in mind? Let’s
              build something that makes a difference.
            </p>
            <div className={styles.ctaActions}>
              <Button href="/contact" size="lg" arrow>
                Start Your Project
              </Button>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsapp}
              >
                <MessageCircle size={17} aria-hidden="true" />
                Talk on WhatsApp
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
            <div className={styles.ctaBottom}>
              <a href={`mailto:${site.email}`}>
                <Mail size={16} aria-hidden="true" />
                {site.email}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <span>MECATRONIX / SOFTWARE DEVELOPMENT</span>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
