import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Compass, Globe2, MapPin, Target } from "lucide-react";
import { principles, techStack } from "../../data/company";
import { services } from "../../data/services";
import { projects } from "../../data/projects";
import { processSteps } from "../../data/process";
import { pageMetadata } from "../../lib/seo";
import { site } from "../../lib/site";
import { Container } from "../../components/ui/Container";
import { Button, ArrowLink } from "../../components/ui/Button";
import { principleIcons, serviceIcons } from "../../components/ui/icons";
import { ProjectCard } from "../../components/portfolio/ProjectCard";
import { AboutVisual } from "./AboutVisual";
import styles from "./about.module.css";
import { Reveal } from "../../components/animations/Reveal";

export const metadata: Metadata = pageMetadata({
  title: "About Mecatronix — Software Engineering Studio in Coimbatore",
  description:
    "Mecatronix Software Development is a Coimbatore-based software engineering studio building websites, applications and business systems that move companies forward.",
  path: "/about",
  keywords: ["about Mecatronix", "software company Coimbatore", "software engineering studio Tamil Nadu"],
});

const stagger = (index: number) => ({ "--reveal-delay": `${(index % 3) * 80}ms` }) as CSSProperties;

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="about-title">
        <Container>
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/">Home</Link><span aria-hidden>/</span><span aria-current="page">About us</span>
          </nav>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}><span /> THE PEOPLE BEHIND THE SOFTWARE</p>
              <h1 id="about-title">Big on ideas.<br />Serious about<br /><span>building them.</span></h1>
              <p className={styles.heroIntro}>We’re Mecatronix. A software engineering studio turning business challenges into thoughtful digital experiences.</p>
              <div className={styles.heroActions}>
                <Button href="/contact" size="lg" arrow>Let’s build together</Button>
                <a href="#our-story" className={styles.storyLink}>Get to know us <ArrowDown aria-hidden size={16} /></a>
              </div>
              <div className={styles.heroLocation}><MapPin aria-hidden size={15} /><span>Rooted in {site.address.city}. Building beyond borders.</span></div>
            </div>
            <AboutVisual />
          </div>
          <div className={styles.heroFooter}>
            <p>Good software starts with<br /><strong>understanding your business.</strong></p>
            <div><span className={styles.footerIndex}>01 /</span><span>Business-first thinking</span></div>
            <div><span className={styles.footerIndex}>02 /</span><span>Thoughtful design</span></div>
            <div><span className={styles.footerIndex}>03 /</span><span>Reliable engineering</span></div>
          </div>
        </Container>
      </section>

      <section id="our-story" aria-labelledby="story-title" className={styles.section}>
        <Container>
          <div className={styles.storyGrid}>
            <Reveal>
              <p className={styles.eyebrow}><span /> A LITTLE ABOUT US</p>
              <h2 id="story-title" className={styles.heading}>Your ambition.<br /><span>Our engineering.</span></h2>
            </Reveal>
            <Reveal className={styles.storyCopy}>
              <p>Technology should make your work simpler, your team stronger, and your next step clearer.</p>
              <p>That’s why Mecatronix Software Development exists. Based in {site.address.city}, we design and build websites, applications, and business systems around the way your company actually works.</p>
              <p>From manufacturing and textiles to education and retail, we help businesses replace repetitive work with software that makes a practical difference. We stay involved from the first conversation through launch and ongoing support.</p>
              <div className={styles.storyTags}><span><Check aria-hidden size={14} /> Built around your workflow</span><span><Check aria-hidden size={14} /> A partner beyond launch</span></div>
            </Reveal>
          </div>
          <div className={styles.purposeGrid}>
            <Reveal as="article" className={`${styles.purposeCard} ${styles.mission} hover-card spotlight`}>
              <div className={styles.cardTop}><span className={styles.iconBox}><Target aria-hidden size={24} /></span><span className={styles.cardLabel}>01 / OUR MISSION</span></div>
              <h3>Make technology<br />work for people.</h3>
              <p>To engineer reliable, well-designed software that solves real business problems, and be a partner you can trust from first idea to long after launch.</p>
              <span className={styles.purposeFoot}>Practical solutions. Lasting partnerships.</span>
            </Reveal>
            <Reveal as="article" className={`${styles.purposeCard} ${styles.vision}`} style={stagger(1)}>
              <div className={styles.cardTop}><span className={styles.iconBox}><Compass aria-hidden size={24} /></span><span className={styles.cardLabel}>02 / OUR VISION</span></div>
              <h3>Better software.<br />More possibilities.</h3>
              <p>A future where every growing business has access to software built properly around the way it works, with the foundations to keep moving forward.</p>
              <span className={styles.purposeFoot}>Built for today. Ready for what’s next.</span>
              <div aria-hidden className={styles.visionRings} />
            </Reveal>
          </div>
        </Container>
      </section>

      <section aria-labelledby="values-title" className={`${styles.section} ${styles.tinted}`}>
        <Container>
          <Reveal className={styles.sectionHeader}>
            <div><p className={styles.eyebrow}><span /> WHAT WE STAND FOR</p><h2 id="values-title" className={styles.heading}>Good principles.<br /><span>Better outcomes.</span></h2></div>
            <p>How we think shapes what we build. These six principles guide every decision, every conversation, and every line of code.</p>
          </Reveal>
          <ul className={styles.cardGrid}>
            {principles.map((principle, index) => {
              const Icon = principleIcons[principle.glyph];
              return (
                <Reveal as="li" key={principle.title} className={`${styles.valueCard} hover-card spotlight`} style={stagger(index)}>
                  <div className={styles.cardTop}><span className={styles.iconBox}><Icon aria-hidden size={23} strokeWidth={1.7} /></span><span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span></div>
                  <h3>{principle.title}</h3><p>{principle.text}</p>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="process-title" className={styles.section}>
        <Container>
          <Reveal className={styles.sectionHeader}>
            <div><p className={styles.eyebrow}><span /> FROM FIRST HELLO TO LAUNCH</p><h2 id="process-title" className={styles.heading}>A clear process.<br /><span>A shared direction.</span></h2></div>
            <div className={styles.headerAside}><p>We listen first, build in the open, and make sure you have something real to review at every stage.</p><ArrowLink href="/process">Explore our process</ArrowLink></div>
          </Reveal>
          <ol className={styles.cardGrid}>
            {processSteps.map((step, index) => (
              <Reveal as="li" key={step.n} className={`${styles.processCard} hover-card`} style={stagger(index)}>
                <div className={styles.cardTop}><span className={styles.stepNumber}>{step.n}</span><ArrowRight aria-hidden className={styles.stepArrow} size={21} /></div>
                <h3>{step.title}</h3><p>{step.text}</p>
                <span className={styles.deliverable}><Check aria-hidden size={14} />{step.deliverables[0]}</span>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="services-title" className={`${styles.section} ${styles.tinted}`}>
        <Container>
          <Reveal className={styles.sectionHeader}>
            <div><p className={styles.eyebrow}><span /> OUR CAPABILITIES</p><h2 id="services-title" className={styles.heading}>Your next chapter.<br /><span>Built with us.</span></h2></div>
            <p>From your first website to the systems behind your business, we bring design and engineering together.</p>
          </Reveal>
          <ul className={styles.cardGrid}>
            {services.map((service, index) => {
              const Icon = serviceIcons[service.slug];
              return (
                <Reveal as="li" key={service.slug} style={stagger(index)}>
                  <Link href={`/services/${service.slug}`} className={`${styles.serviceCard} hover-card spotlight`}>
                    <div className={styles.cardTop}><span className={styles.iconBox}><Icon aria-hidden size={23} strokeWidth={1.7} /></span><ArrowUpRight aria-hidden className={styles.serviceArrow} size={21} /></div>
                    <h3>{service.title}</h3><p>{service.summary}</p><span className={styles.serviceLink}>Explore service <ArrowRight aria-hidden size={15} /></span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
          <Reveal className={styles.techPanel}>
            <div><p className={styles.eyebrow}>OUR TOOLKIT</p><h3>Modern tools.<br />Solid foundations.</h3><p>A focused stack chosen for performance and maintainability.</p></div>
            <dl className={styles.techGroups}>{techStack.map((group) => <div key={group.category}><dt>{group.category}</dt><dd>{group.items.map((item) => <span key={item}>{item}</span>)}</dd></div>)}</dl>
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="work-title" className={styles.section}>
        <Container>
          <Reveal className={styles.sectionHeader}>
            <div><p className={styles.eyebrow}><span /> IDEAS INTO REALITY</p><h2 id="work-title" className={styles.heading}>A look at<br /><span>what we’ve built.</span></h2></div>
            <ArrowLink href="/work">Explore all work</ArrowLink>
          </Reveal>
          <div className={styles.cardGrid}>{projects.slice(0, 3).map((project, index) => <Reveal key={project.slug} style={stagger(index)}><ProjectCard project={project} className={styles.projectCard} /></Reveal>)}</div>
        </Container>
      </section>

      <section aria-labelledby="about-contact-title" className={styles.ctaSection}>
        <Container>
          <Reveal className={styles.cta}>
            <div className={styles.ctaCopy}><p className={styles.eyebrow}><span /> THE NEXT GREAT IDEA COULD BE YOURS</p><h2 id="about-contact-title">Let’s build something<br />that moves you forward.</h2><p>Tell us what you have in mind. We’ll help you find the right way to build it.</p><Button href="/contact" variant="light" size="lg" arrow>Start a conversation</Button></div>
            <div className={styles.ctaStamp}><Globe2 aria-hidden size={52} strokeWidth={1} /><p>From {site.address.city},<br /><strong>to wherever you are.</strong></p><span>DESIGN. ENGINEER. DELIVER.</span></div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
