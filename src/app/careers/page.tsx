import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, BriefcaseBusiness, Check, Clock, GraduationCap, Mail, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { hiringSteps, perks, roles, type Role } from "../../data/careers";
import { pageMetadata } from "../../lib/seo";
import { whatsappLink } from "../../lib/site-contact";
import { getSiteContact } from "../../lib/site-contact.server";
import { Container } from "../../components/ui/Container";
import { Button } from "../../components/ui/Button";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { Reveal } from "../../components/animations/Reveal";
import styles from "./careers.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Careers at Mecatronix — Jobs in Coimbatore",
  description:
    "Join Mecatronix in Coimbatore. Open roles: Telecalling Executive, Graphic Designer and Full Stack Developer. Build websites, software and apps for real businesses.",
  path: "/careers",
  keywords: ["jobs in Coimbatore", "telecalling executive jobs Coimbatore", "graphic designer jobs Coimbatore", "full stack developer jobs Coimbatore"],
  socialTitle: "Build what's next with Mecatronix",
});

const stagger = (i: number) => ({ "--reveal-delay": `${(i % 3) * 80}ms` }) as CSSProperties;

export default async function CareersPage() {
  const contact = await getSiteContact();
  const apply = (role: Role) => ({
    whatsapp: whatsappLink(contact, `Hi Mecatronix, I'd like to apply for the ${role.title} role. I'll share my CV here.`),
    email: `mailto:${contact.email}?subject=${encodeURIComponent(`Application: ${role.title}`)}`,
  });

  return (
    <div className={styles.page}>
      {/* ---------- Hero ---------- */}
      <section className={styles.hero} aria-labelledby="careers-title">
        <Container>
          <Breadcrumbs crumbs={[{ path: "/careers", label: "Careers" }]} />
          <div className={styles.heroGrid}>
            <Reveal>
              <p className={styles.tag}>
                <i aria-hidden="true" /> CAREERS · WE&apos;RE HIRING
              </p>
              <h1 id="careers-title" className={styles.title}>
                Build what&apos;s next <span className="text-shimmer">with us.</span>
              </h1>
              <p className={styles.lead}>
                Join a focused team in Coimbatore building websites, business software and apps for real companies. Talk to clients, design
                brands or write the code — and see your work go live.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button href="#open-roles" arrow>
                  See open roles
                </Button>
                <span className={styles.count}>
                  <b>{String(roles.length).padStart(2, "0")}</b> open positions
                </span>
              </div>
            </Reveal>
            <Reveal className={styles.heroMedia} style={{ "--reveal-delay": "120ms" } as CSSProperties}>
              <Image src="/assets/careers/team.jpg" alt="The team planning a project together" fill priority sizes="(min-width: 1024px) 560px, 100vw" className={styles.heroImg} />
              <span className={`${styles.float} ${styles.floatA}`}>
                <MapPin size={15} aria-hidden="true" /> Coimbatore, Tamil Nadu
              </span>
              <span className={`${styles.float} ${styles.floatB}`}>
                <Sparkles size={15} aria-hidden="true" /> Real client projects
              </span>
            </Reveal>
          </div>
          <a href="#open-roles" className={styles.scroll}>
            <ArrowDown size={14} aria-hidden="true" /> Scroll to open roles
          </a>
        </Container>
      </section>

      {/* ---------- Open roles: cards ---------- */}
      <section id="open-roles" className={styles.section} aria-labelledby="roles-title">
        <Container>
          <Reveal className={styles.head}>
            <div>
              <p className={styles.tag}>
                <i aria-hidden="true" /> 01 / OPEN ROLES
              </p>
              <h2 id="roles-title" className={styles.h2}>
                Find your place <span className="text-shimmer">on the team.</span>
              </h2>
            </div>
            <p className={styles.headText}>Pick a role to read what you&apos;ll do and what we&apos;re looking for, then apply on WhatsApp or by email.</p>
          </Reveal>

          <ul className={styles.roleGrid}>
            {roles.map((role, i) => (
              <Reveal as="li" key={role.slug} style={stagger(i)}>
                <a href={`#${role.slug}`} className={styles.roleCard}>
                  <span className={styles.roleMedia}>
                    <Image src={role.image} alt="" fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className={styles.roleImg} />
                    <span className={styles.roleTeam}>{role.team}</span>
                  </span>
                  <span className={styles.roleBody}>
                    <span className={styles.roleTitle}>{role.title}</span>
                    <span className={styles.meta}>
                      <span>
                        <Clock size={13} aria-hidden="true" /> {role.type}
                      </span>
                      <span>
                        <MapPin size={13} aria-hidden="true" /> {role.location}
                      </span>
                      <span>
                        <GraduationCap size={13} aria-hidden="true" /> {role.experience}
                      </span>
                    </span>
                    <span className={styles.roleSummary}>{role.summary}</span>
                    <span className={styles.roleMore}>
                      View role & apply
                      <span>
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </span>
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------- Role details ---------- */}
      <section className={`${styles.section} ${styles.detailsSection}`} aria-label="Role details">
        <Container>
          <div className={styles.details}>
            {roles.map((role, i) => {
              const links = apply(role);
              return (
                <Reveal as="article" key={role.slug} id={role.slug} className={styles.detail} aria-labelledby={`${role.slug}-title`}>
                  <div className={styles.detailMedia}>
                    <Image src={role.image} alt="" fill sizes="(min-width: 1024px) 420px, 100vw" className={styles.detailImg} />
                    <span className={styles.detailIndex}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className={styles.detailBody}>
                    <p className={styles.detailTeam}>
                      <BriefcaseBusiness size={14} aria-hidden="true" /> {role.team}
                    </p>
                    <h3 id={`${role.slug}-title`} className={styles.detailTitle}>
                      {role.title}
                    </h3>
                    <p className={styles.meta}>
                      <span>
                        <Clock size={13} aria-hidden="true" /> {role.type}
                      </span>
                      <span>
                        <MapPin size={13} aria-hidden="true" /> {role.location}
                      </span>
                      <span>
                        <GraduationCap size={13} aria-hidden="true" /> {role.experience}
                      </span>
                    </p>
                    <p className={styles.detailSummary}>{role.summary}</p>

                    <div className={styles.lists}>
                      <div>
                        <h4>What you&apos;ll do</h4>
                        <ul>
                          {role.responsibilities.map((item) => (
                            <li key={item}>
                              <Check size={14} aria-hidden="true" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4>What we&apos;re looking for</h4>
                        <ul>
                          {role.requirements.map((item) => (
                            <li key={item}>
                              <Check size={14} aria-hidden="true" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        {role.niceToHave && role.niceToHave.length > 0 && (
                          <>
                            <h4 className="mt-4">Nice to have</h4>
                            <p className={styles.chips}>
                              {role.niceToHave.map((item) => (
                                <span key={item}>{item}</span>
                              ))}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className={styles.applyRow}>
                      <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.applyPrimary}>
                        <MessageCircle size={16} aria-hidden="true" /> Apply on WhatsApp
                        <span>
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </span>
                      </a>
                      <a href={links.email} className={styles.applySecondary}>
                        <Mail size={15} aria-hidden="true" /> Email your CV
                      </a>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ---------- Life here ---------- */}
      <section className={styles.section} aria-labelledby="life-title">
        <Container>
          <div className={styles.life}>
            <Reveal className={styles.lifeMedia}>
              <Image src="/assets/careers/culture.jpg" alt="Two colleagues celebrating a win at the office" fill sizes="(min-width: 1024px) 480px, 100vw" className={styles.lifeImg} />
            </Reveal>
            <div>
              <Reveal>
                <p className={styles.tag}>
                  <i aria-hidden="true" /> 02 / LIFE AT MECATRONIX
                </p>
                <h2 id="life-title" className={styles.h2}>
                  Small team. <span className="text-shimmer">Real impact.</span>
                </h2>
              </Reveal>
              <ul className={styles.perks}>
                {perks.map((perk, i) => (
                  <Reveal as="li" key={perk.title} style={stagger(i)} className={styles.perk}>
                    <span className={styles.perkIcon}>
                      <Check size={15} strokeWidth={2.6} aria-hidden="true" />
                    </span>
                    <span>
                      <b>{perk.title}</b>
                      <span>{perk.text}</span>
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Hiring process ---------- */}
      <section className={`${styles.section} ${styles.stepsSection}`} aria-labelledby="steps-title">
        <Container>
          <Reveal className={styles.head}>
            <div>
              <p className={styles.tag}>
                <i aria-hidden="true" /> 03 / HOW HIRING WORKS
              </p>
              <h2 id="steps-title" className={styles.h2}>
                Simple, quick <span className="text-shimmer">and human.</span>
              </h2>
            </div>
          </Reveal>
          <ol className={styles.steps}>
            {hiringSteps.map((step, i) => (
              <Reveal as="li" key={step.title} style={stagger(i)} className={styles.step}>
                <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <b>{step.title}</b>
                <span>{step.text}</span>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>
    </div>
  );
}
