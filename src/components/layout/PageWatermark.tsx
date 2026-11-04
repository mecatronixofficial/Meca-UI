import Image from "next/image";
import { site } from "../../lib/site";
import styles from "./page-watermark.module.css";

/** A shared, decorative company seal that stays visible as each page scrolls. */
export default function PageWatermark() {
  return (
    <div className={styles.watermark} aria-hidden="true">
      <div className={styles.seal}>
        <svg viewBox="0 0 120 120" className={styles.lettering}>
          <defs>
            <path id="page-watermark-ring" d="M60 60 m-49 0 a49 49 0 1 1 98 0 a49 49 0 1 1 -98 0" />
          </defs>
          <circle cx="60" cy="60" r="59" className={styles.outline} />
          <circle cx="60" cy="60" r="40" className={styles.outline} />
          <text fontSize="8.6" textLength="306" lengthAdjust="spacing">
            <textPath href="#page-watermark-ring">MECATRONIX &#8226; SOFTWARE DEVELOPMENT &#8226;</textPath>
          </text>
        </svg>
        <Image src={site.logo} alt="" width={site.logoWidth} height={site.logoHeight} sizes="(max-width: 640px) 90px, 150px" className={styles.logo} />
      </div>
    </div>
  );
}
