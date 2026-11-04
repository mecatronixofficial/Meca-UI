import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleDot,
  Code2,
  Compass,
  Layers,
  MessageCircle,
  Network,
  ShieldCheck,
} from "lucide-react";
import { industries } from "../../data/industries";
import { projects } from "../../data/projects";
import { serviceList } from "../../data/service-list";
import { processSteps } from "../../data/process";
import { pageMetadata } from "../../lib/seo";
import { whatsappLink } from "../../lib/site";
import { Container } from "../../components/ui/Container";
import { Button } from "../../components/ui/Button";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { serviceIcons } from "../../components/ui/icons";
import { ProjectCover } from "../../components/portfolio/ProjectCover";
import {
  IndustryExplorer,
  IndustryOrbit,
  IndustrySpotlight,
  WorkflowSystem,
} from "./IndustriesExperience";
import styles from "./industries.module.css";
import { Reveal, RevealLink } from "../../components/animations/Reveal";

export const metadata: Metadata = pageMetadata({
  title: "Software for Manufacturing, Textiles, Retail & Education",
  description:
    "Industry-specific software from Mecatronix in Coimbatore: textile and manufacturing ERP, retail and e-commerce platforms, school management systems, logistics apps and more.",
  path: "/industries",
  keywords: [
    "manufacturing software development",
    "textile ERP software Tamil Nadu",
    "school management system development",
    "retail billing software development",
  ],
});

const benefits = [
  {
    title: "Industry-focused solutions",
    text: "Your vocabulary, constraints and day-to-day workflows shape the software from the first conversation.",
    icon: Compass,
  },
  {
    title: "Custom-built architecture",
    text: "A considered foundation for your users, data and business rules, with a clear scope for each release.",
    icon: Layers,
  },
  {
    title: "Scalable engineering",
    text: "Maintainable systems with room for new users, new locations and the next stage of your business.",
    icon: Code2,
  },
  {
    title: "Seamless system integration",
    text: "Connect the tools you depend on and reduce the manual work between departments and platforms.",
    icon: Network,
  },
  {
    title: "Intuitive user experience",
    text: "Clear interfaces designed around the people using them, from the factory floor to the front office.",
    icon: CircleDot,
  },
  {
    title: "Ongoing technical support",
    text: "Agreed support, careful handover and a practical path for improvements after your software goes live.",
    icon: ShieldCheck,
  },
];

const stagger = (index: number) =>
  ({ "--reveal-delay": `${(index % 3) * 65}ms` }) as CSSProperties;

export default function IndustriesPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="industries-title">
        <Container>
          <Breadcrumbs
            crumbs={[{ path: "/industries", label: "Industries" }]}
          />
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span /> INDUSTRIES WE SERVE
              </p>
              <h1 id="industries-title">
                Technology <br />
                built around <br />
                <span>your industry.</span>
              </h1>
              <p className={styles.heroIntro}>
                Different industries. Different challenges. Software that
                understands the way <strong>your business works.</strong>
              </p>
              <div className={styles.heroActions}>
                <Button href="#explore-industries" size="lg" arrow>
                  Explore Industries
                </Button>
                <Link href="/contact" className={styles.textLink}>
                  Start a Project <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
              <a href="#explore-industries" className={styles.scrollCue}>
                <span>
                  <ArrowDown size={14} aria-hidden="true" />
                </span>
                REAL-WORLD WORK. THOUGHTFULLY ENGINEERED.
              </a>
            </div>
            <IndustryOrbit />
          </div>
          <div className={styles.heroFoot}>
            <p>
              Built for the details.
              <br />
              <strong>Connected for the bigger picture.</strong>
            </p>
            <div>
              <span>01 /</span> Understand your operations
            </div>
            <div>
              <span>02 /</span> Design around your people
            </div>
            <div>
              <span>03 /</span> Engineer what comes next
            </div>
          </div>
        </Container>
      </section>

      <section
        id="explore-industries"
        className={styles.section}
        aria-labelledby="explorer-title"
      >
        <Container>
          <Reveal className={styles.sectionHead}>
            <div>
              <p className={styles.eyebrow}>
                <span /> 01 / FIND YOUR WORLD
              </p>
              <h2 id="explorer-title" className={styles.heading}>
                Real industries.
                <br />
                <span>Specific possibilities.</span>
              </h2>
            </div>
            <p>
              From the first yarn lot to the final delivery, we build around the
              workflows, vocabulary and pressure points that make your industry
              different.
            </p>
          </Reveal>
          <Reveal>
            <IndustryExplorer />
          </Reveal>
          <p className={styles.sectionNote}>
            <span aria-hidden="true" />{" "}
            {industries.length.toString().padStart(2, "0")} INDUSTRIES. ONE
            APPROACH: UNDERSTAND FIRST, BUILD SECOND.
          </p>
        </Container>
      </section>

      <section
        className={`${styles.section} ${styles.spotlightSection}`}
        aria-labelledby="spotlight-title"
      >
        <Container>
          <Reveal className={styles.sectionHead}>
            <div>
              <p className={styles.eyebrow}>
                <span /> 02 / A CLOSER LOOK
              </p>
              <h2 id="spotlight-title" className={styles.heading}>
                Your world.
                <br />
                <span>Thoughtfully connected.</span>
              </h2>
            </div>
            <p>
              Look inside the workflows we support and the systems we can build.
              Choose an industry to explore its possibilities.
            </p>
          </Reveal>
          <Reveal>
            <IndustrySpotlight />
          </Reveal>
        </Container>
      </section>

      <section
        className={`${styles.section} ${styles.workflowSection}`}
        aria-labelledby="workflow-title"
      >
        <Container>
          <Reveal className={styles.workflowHead}>
            <p className={styles.eyebrow}>
              <span /> 03 / CONNECT THE DOTS
            </p>
            <h2 id="workflow-title" className={styles.heading}>
              From complex workflows <br />
              to <span>seamless digital systems.</span>
            </h2>
            <p>
              Orders, inventory, people and information should work together. We
              turn disconnected tasks into a considered system, one useful step
              at a time.
            </p>
          </Reveal>
          <Reveal>
            <WorkflowSystem />
          </Reveal>
        </Container>
      </section>

      <section className={styles.section} aria-labelledby="solutions-title">
        <Container>
          <div className={styles.solutionsLayout}>
            <Reveal className={styles.solutionsIntro}>
              <p className={styles.eyebrow}>
                <span /> 04 / WHAT WE ENGINEER
              </p>
              <h2 id="solutions-title" className={styles.heading}>
                The right tools.
                <br />
                <span>Built your way.</span>
              </h2>
              <p>
                A storefront, an operations platform, or the connection between
                them. The technology follows what your business needs.
              </p>
              <Link href="/services" className={styles.textLink}>
                Explore our capabilities{" "}
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <div className={styles.solutionsSignature} aria-hidden="true">
                <Code2 size={30} strokeWidth={1.2} />
                <span>
                  HUMAN PROBLEMS.
                  <br />
                  <strong>THOUGHTFUL SOFTWARE.</strong>
                </span>
              </div>
            </Reveal>
            <div className={styles.solutionRows}>
              {serviceList.map((service, index) => {
                const Icon = serviceIcons[service.slug];
                return (
                  <RevealLink
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className={styles.solutionRow}
                    style={stagger(index)}
                  >
                    <span className={styles.rowIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon size={24} strokeWidth={1.4} aria-hidden="true" />
                    <div>
                      <h3>{service.title}</h3>
                      <p>{service.summary}</p>
                    </div>
                    <div
                      className={styles.servicePreview}
                      data-service={service.slug}
                      aria-hidden="true"
                    >
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                    <ArrowUpRight
                      size={21}
                      className={styles.rowArrow}
                      aria-hidden="true"
                    />
                  </RevealLink>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <section
        className={`${styles.section} ${styles.expertiseSection}`}
        aria-labelledby="expertise-title"
      >
        <Container>
          <Reveal className={styles.sectionHead}>
            <div>
              <p className={styles.eyebrow}>
                <span /> 05 / BUILT ON UNDERSTANDING
              </p>
              <h2 id="expertise-title" className={styles.heading}>
                Industry context.
                <br />
                <span>Engineering depth.</span>
              </h2>
            </div>
            <p>
              Why industries choose Mecatronix: practical thinking, careful
              design and software that keeps working beyond launch.
            </p>
          </Reveal>
          <div className={styles.benefits}>
            {benefits.map((benefit, index) => (
              <Reveal as="article"
                key={benefit.title}
                className={styles.benefit}
                style={stagger(index)}
              >
                <span className={styles.benefitNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </div>
                <benefit.icon size={24} strokeWidth={1.3} aria-hidden="true" />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className={styles.section} aria-labelledby="projects-title">
        <Container>
          <Reveal className={styles.sectionHead}>
            <div>
              <p className={styles.eyebrow}>
                <span /> 06 / FROM OUR WORK
              </p>
              <h2 id="projects-title" className={styles.heading}>
                Real businesses.
                <br />
                <span>Considered digital work.</span>
              </h2>
            </div>
            <div className={styles.headAside}>
              <p>
                A selection of websites, storefronts and management systems
                built for the businesses behind them.
              </p>
              <Link href="/work" className={styles.textLink}>
                View all work <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
          <div className={styles.projectGrid}>
            {projects.map((project, index) => (
              <Reveal as="article"
                key={project.slug}
                className={styles.project}
                style={stagger(index)}
              >
                <Link
                  href={`/work/${project.slug}`}
                  className={`${styles.projectLink} group`}
                >
                  <div className={styles.projectImage}>
                    <ProjectCover
                      project={{
                        ...project,
                        cover: {
                          ...project.cover,
                          from: "#fff5f4",
                          to: "#fff0ef",
                          ink: "#a30400",
                        },
                      }}
                      className={styles.projectCover}
                      sizes="(min-width: 768px) 55vw, 100vw"
                    />
                    <span className={styles.projectCoverLabel}>
                      {project.images?.length
                        ? "PROJECT VIEW"
                        : "ABSTRACT PROJECT COVER"}
                    </span>
                    <span className={styles.projectImageArrow}>
                      <ArrowUpRight size={23} aria-hidden="true" />
                    </span>
                  </div>
                  <div className={styles.projectDetails}>
                    <p className={styles.microLabel}>{project.industry}</p>
                    <h3>
                      {project.client}
                      <ArrowUpRight size={22} aria-hidden="true" />
                    </h3>
                    <p>{project.summary}</p>
                    <ul aria-label="Services delivered">
                      {project.services.map((slug) => (
                        <li key={slug}>
                          {
                            serviceList.find((service) => service.slug === slug)
                              ?.navLabel
                          }
                        </li>
                      ))}
                    </ul>
                    <span className={styles.textLink}>
                      View Project <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section
        className={`${styles.section} ${styles.approachSection}`}
        aria-labelledby="approach-title"
      >
        <Container>
          <Reveal className={styles.sectionHead}>
            <div>
              <p className={styles.eyebrow}>
                <span /> 07 / HOW WE GET THERE
              </p>
              <h2 id="approach-title" className={styles.heading}>
                A clear process.
                <br />
                <span>A shared direction.</span>
              </h2>
            </div>
            <div className={styles.headAside}>
              <p>
                From the first conversation to the next release, you know what
                we’re building, why it matters, and what comes next.
              </p>
              <Link href="/process" className={styles.textLink}>
                Our development process{" "}
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
          <ol className={styles.approachSteps}>
            {processSteps.map((step, index) => (
              <Reveal as="li" key={step.n} style={stagger(index)}>
                <span>
                  {step.n}
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <small>
                  <Check size={12} aria-hidden="true" />
                  {step.deliverables[0]}
                </small>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className={styles.ctaSection} aria-labelledby="enquiry-title">
        <Container>
          <Reveal className={styles.cta}>
            <div className={styles.ctaGrid} aria-hidden="true" />
            <div className={styles.ctaOrbit} aria-hidden="true">
              <span />
              <span />
              <span />
              <Code2 strokeWidth={0.8} />
            </div>
            <div className={styles.ctaContent}>
              <p className={styles.eyebrow}>
                <span /> THE NEXT CHAPTER STARTS HERE
              </p>
              <h2 id="enquiry-title">
                Your industry.
                <br />
                Your challenges.
                <br />
                <span>Our engineering.</span>
              </h2>
              <p>
                From manufacturing workflows to digital storefronts, we build
                software around the way your business actually works.
              </p>
              <div className={styles.ctaActions}>
                <Button href="/contact" size="lg" variant="light" arrow>
                  Start Your Project
                </Button>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsapp}
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  Talk on WhatsApp
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className={styles.ctaFoot}>
              <span>MECATRONIX / SOFTWARE DEVELOPMENT</span>
              <span>UNDERSTAND. DESIGN. ENGINEER.</span>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
