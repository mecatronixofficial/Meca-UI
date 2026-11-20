import Image from "next/image";
import { ArrowUpRight, PenLine, ScanLine, Star } from "lucide-react";
import { getGoogleReviews, type GoogleReviews as Data } from "../../lib/google-reviews";
import { getSiteContact } from "../../lib/site-contact.server";
import { Container, Section } from "../ui/Container";
import { Reveal } from "../animations/Reveal";
import styles from "./google-reviews.module.css";

/** Google's "G", in its own colours, to credit the source of the reviews. */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Stars({ value, size = 15 }: { value: number; size?: number }) {
  return (
    <span className={styles.stars} role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={styles.star} style={{ "--fill": `${Math.max(0, Math.min(1, value - (i - 1))) * 100}%` } as React.CSSProperties}>
          <Star size={size} aria-hidden />
          <Star size={size} aria-hidden />
        </span>
      ))}
    </span>
  );
}

/**
 * Home "Reviews on Google": the live rating and reviews from Google (src/lib/google-reviews.ts),
 * scrolling in an endless strip that pauses on hover, beside the printed "Scan to review us" QR
 * poster. Until Google is connected (or if it has no reviews), the summary card invites visitors
 * to review the studio on Google instead.
 *
 * "Write a review" and the poster open the review link from the admin panel (mec-api
 * settings/contact `review_url`, the same link as the QR code; see src/lib/site-contact.ts).
 */
export async function GoogleReviews() {
  const [google, contact] = await Promise.all([getGoogleReviews(), getSiteContact()]);
  return <GoogleReviewsSection google={google} profileUrl={contact.googleProfileUrl} reviewUrl={contact.reviewUrl} />;
}

/** "Write a review" opens the admin's review link; "See us on Google" the admin's Google Business profile link. */
export function GoogleReviewsSection({ google, profileUrl, reviewUrl }: { google: Data | null; profileUrl: string; reviewUrl: string }) {
  const writeUrl = reviewUrl || google?.writeUrl || profileUrl;
  const readUrl = profileUrl || google?.mapsUrl || writeUrl;
  const reviews = google?.reviews ?? [];
  const live = Boolean(google && google.total > 0);
  // Enough cards to fill a wide strip; the two copies make the loop seamless
  const strip = reviews.length ? Array.from({ length: Math.ceil(6 / reviews.length) }, () => reviews).flat() : [];

  return (
    <Section compact labelledBy="google-reviews-title" className="overflow-hidden py-10! sm:py-12! lg:py-14!">
      <Container>
        <Reveal className={styles.head}>
          <div>
            <p className={styles.tag}>
              <GoogleG className="size-4" /> REVIEWS ON GOOGLE
              {live && (
                <span className={styles.live}>
                  <i aria-hidden /> Live
                </span>
              )}
            </p>
            <h2 id="google-reviews-title" className={styles.title}>
              What clients say <span className="text-shimmer">about us.</span>
            </h2>
          </div>
          <p className={styles.headText}>
            {live ? "Real reviews from our Google Business profile, updated automatically." : "Worked with us? Your review on Google helps other businesses choose with confidence."}
          </p>
        </Reveal>

        <div className={styles.layout}>
          {/* Summary */}
          <Reveal className={styles.summary}>
            <span className={styles.summaryG}>
              <GoogleG className="size-7" />
            </span>
            {live && google ? (
              <>
                <p className={styles.score}>
                  {google.rating.toFixed(1)}
                  <span>/ 5</span>
                </p>
                <Stars value={google.rating} size={18} />
                <p className={styles.count}>Based on {google.total.toLocaleString("en-IN")} Google reviews</p>
              </>
            ) : (
              <>
                <p className={styles.invite}>Rate us on Google</p>
                <Stars value={5} size={20} />
                <p className={styles.count}>Tap a star on Google — it takes less than a minute.</p>
              </>
            )}
            <div className={styles.actions}>
              <a href={writeUrl} target="_blank" rel="noopener noreferrer" className={styles.primary}>
                <PenLine size={15} aria-hidden /> Write a review
              </a>
              <a href={readUrl} target="_blank" rel="noopener noreferrer" className={styles.secondary}>
                {live ? "Read all on Google" : "See us on Google"} <ArrowUpRight size={14} aria-hidden />
              </a>
            </div>
          </Reveal>

          {/* Live reviews */}
          {strip.length > 0 ? (
            <Reveal className={styles.viewport} style={{ "--strip-duration": `${strip.length * 9}s` } as React.CSSProperties}>
              {[0, 1].map((copy) => (
                <ul key={copy} className={styles.strip} aria-hidden={copy === 1 || undefined}>
                  {strip.map((r, i) => (
                    <li key={`${r.id}-${i}`} className={styles.card}>
                      <div className="flex items-center gap-3">
                        {r.photo ? (
                          // Reviewer photo from Google (shown as Google provides it)
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.photo} alt="" width={40} height={40} referrerPolicy="no-referrer" className={styles.avatar} />
                        ) : (
                          <span className={styles.avatar}>{r.author[0]}</span>
                        )}
                        <span className="min-w-0 flex-1 leading-tight">
                          {r.authorUrl ? (
                            <a href={r.authorUrl} target="_blank" rel="noopener noreferrer" tabIndex={copy === 1 ? -1 : undefined} className={styles.author}>
                              {r.author}
                            </a>
                          ) : (
                            <span className={styles.author}>{r.author}</span>
                          )}
                          <span className="mt-0.5 block text-[11.5px] text-muted">{r.when}</span>
                        </span>
                        <GoogleG className="size-4 shrink-0" />
                      </div>
                      <Stars value={r.rating} size={14} />
                      <p className={styles.text}>{r.text}</p>
                    </li>
                  ))}
                </ul>
              ))}
            </Reveal>
          ) : (
            <Reveal className={styles.empty}>
              <p className={styles.emptyTitle}>Be the first to review Mecatronix on Google</p>
              <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-muted-ink">
                New reviews appear here automatically once they&apos;re published on our Google Business profile.
              </p>
              <span aria-hidden className={styles.ghostStars}>
                <Star size={26} />
                <Star size={26} />
                <Star size={26} />
                <Star size={26} />
                <Star size={26} />
              </span>
            </Reveal>
          )}

          {/* The printed QR poster: scan it from a laptop, or tap it on a phone */}
          <Reveal className={styles.poster}>
            <a href={writeUrl} target="_blank" rel="noopener noreferrer" className={styles.posterLink} aria-label="Review Mecatronix on Google (opens in a new tab)">
              <Image
                src="/assets/reviews/google-review-qr.jpg"
                alt="Mecatronix poster: scan the QR code to review us on Google"
                width={501}
                height={660}
                sizes="(min-width: 1280px) 16rem, (min-width: 768px) 15rem, 20rem"
                className={styles.posterImg}
              />
            </a>
            <p className={styles.posterNote}>
              <ScanLine size={14} aria-hidden /> Scan with your phone camera
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
