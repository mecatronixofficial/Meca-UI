import Image from "next/image";
import type { Project } from "../../data/projects";
import { cn } from "../../lib/cn";
import styles from "./hero.module.css";

/** Laptop photos mixed in between the project screenshots (Unsplash, stored locally). */
const laptops = ["/assets/blog/nextjs-workspace.jpg", "/assets/tech/erp-report.jpg", "/assets/tech/analytics-screen.jpg"];

const COLUMNS = 3;
/** Tiles per column before it is doubled for the seamless loop. */
const PER_COLUMN = 4;

type Tile = { src: string; screen: boolean };

/**
 * Hero background: a tilted wall of project screenshots and laptop photos, three columns
 * drifting up and down at different speeds, under a white veil that keeps the copy readable.
 */
export function HeroWall({ projects }: { projects: Project[] }) {
  const screens: Tile[] = projects.flatMap((p) => (p.images ?? []).slice(0, 2).map((img) => ({ src: img.src, screen: true })));
  const photos: Tile[] = laptops.map((src) => ({ src, screen: false }));
  // Spread the laptop photos through the screenshots, then repeat to fill every column
  const mixed: Tile[] = [];
  screens.forEach((tile, i) => {
    mixed.push(tile);
    if (i % 3 === 1 && photos.length) mixed.push(photos.shift()!);
  });
  mixed.push(...photos);
  const pool = Array.from({ length: Math.ceil((COLUMNS * PER_COLUMN) / mixed.length) }, () => mixed).flat();
  const columns = Array.from({ length: COLUMNS }, (_, c) => pool.filter((_, i) => i % COLUMNS === c).slice(0, PER_COLUMN));

  return (
    <div aria-hidden className={styles.wall}>
      <div className={styles.wallTilt}>
        {columns.map((tiles, c) => (
          <div key={c} className={cn(styles.wallColumn, c % 2 === 1 && styles.wallReverse)} style={{ animationDuration: `${60 + c * 12}s` }}>
            {[...tiles, ...tiles].map((tile, i) => (
              <div key={i} className={styles.wallTile}>
                {tile.screen && (
                  <span className={styles.wallBar}>
                    <i />
                    <i />
                    <i />
                  </span>
                )}
                <span className={cn(styles.wallShot, !tile.screen && styles.wallPhoto)}>
                  <Image src={tile.src} alt="" fill sizes="320px" unoptimized={/^https?:\/\//.test(tile.src)} className="object-cover object-top" />
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <span className={styles.wallVeil} />
    </div>
  );
}
