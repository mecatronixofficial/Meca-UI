import Image from "next/image";
import { site } from "../../lib/site";
import styles from "./page-loader.module.css";

export default function BrandLoader({ initial = false, leaving = false }: { initial?: boolean; leaving?: boolean }) {
  return (
    <div
      className={`${styles.loader} ${initial ? styles.initial : ""} ${leaving ? styles.leaving : ""}`}
      role="status"
      aria-label="Loading Mecatronix"
      aria-live="polite"
    >
      <div className={styles.brand} aria-hidden="true">
        <div className={styles.mark}>
          <span className={styles.ring} />
          <Image src={site.logo} alt="" width={site.logoWidth} height={site.logoHeight} priority className={styles.logo} />
        </div>
        <div className={styles.wordmark}>MECATRONIX</div>
        <p className={styles.tagline}>SOFTWARE DEVELOPMENT</p>
        <div className={styles.track}><span /></div>
        <p className={styles.caption}>Loading your experience</p>
      </div>
    </div>
  );
}
