import Image from "next/image";
import type { CSSProperties } from "react";
import { Mail } from "lucide-react";
import type { TeamMember } from "../../lib/content";
import { Container } from "../../components/ui/Container";
import { Reveal } from "../../components/animations/Reveal";
import { SocialIcon } from "../../components/ui/SocialIcon";
import { cn } from "../../lib/cn";
import styles from "./about.module.css";

/**
 * Founders and team from the admin panel (Team). Renders nothing until at least one
 * active member is added — no placeholder people are ever shown.
 */
export function Founders({ members }: { members: TeamMember[] }) {
  if (!members.length) return null;
  const solo = members.length === 1;

  return (
    <section id="team" aria-labelledby="founders-title" className={styles.section}>
      <Container>
        <Reveal className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>
              <span /> THE PEOPLE BEHIND MECATRONIX
            </p>
            <h2 id="founders-title" className={styles.heading}>
              Team &amp; <span>founders.</span>
            </h2>
          </div>
          <p>Meet the people behind Mecatronix, working with you from the first conversation to launch and ongoing support.</p>
        </Reveal>

        <ul className={cn("grid gap-6", !solo && "lg:grid-cols-2")}>
          {members.map((member, i) => (
            <Reveal as="li" key={member.id} style={{ "--reveal-delay": `${(i % 2) * 90}ms` } as CSSProperties}>
              <article
                className={cn(
                  "group grid h-full overflow-hidden rounded-[22px] border border-line bg-white transition-shadow duration-500 hover:shadow-lift",
                  "sm:grid-cols-[minmax(0,220px)_1fr]",
                  solo && "lg:grid-cols-[minmax(0,320px)_1fr]",
                )}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-paper sm:aspect-auto sm:min-h-[300px]">
                  {/* Admin-uploaded photo (remote storage, served as-is) */}
                  <Image
                    src={member.photo}
                    alt={`${member.name}, ${member.role}`}
                    fill
                    unoptimized
                    sizes="(min-width: 640px) 320px, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[10.5px] tracking-[0.12em] text-ink backdrop-blur">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-col p-6 sm:p-8">
                  <p className="self-start rounded-full bg-accent-soft px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-accent-ink">{member.role}</p>
                  <h3 className="mt-4 font-display text-[1.7rem] font-semibold leading-tight tracking-[-0.03em] text-ink">{member.name}</h3>
                  {member.bio && <p className="mt-3 whitespace-pre-line text-[15.5px] leading-[1.8] text-muted-ink">{member.bio}</p>}

                  {(member.linkedin || member.email) && (
                    <div className="mt-auto flex flex-wrap gap-2 pt-6">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} on LinkedIn`}
                          className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-[14px] text-ink transition-colors hover:border-accent hover:text-accent-ink"
                        >
                          <SocialIcon name="linkedin" className="size-4" /> LinkedIn
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          aria-label={`Email ${member.name}`}
                          className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-[14px] text-ink transition-colors hover:border-accent hover:text-accent-ink"
                        >
                          <Mail aria-hidden className="size-4" /> {member.email}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
