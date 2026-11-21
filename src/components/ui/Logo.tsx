import Image from "next/image";
import Link from "next/link";
import { cn } from "../../lib/cn";
import { site } from "../../lib/site";

const wordmarkTone = {
  light: "text-ink",
  dark: "text-white",
  brand: "text-accent-strong",
  onRed: "text-white",
} as const;

const taglineTone = {
  light: "text-muted-ink",
  dark: "text-muted",
  brand: "text-accent/75",
  onRed: "text-white/80",
} as const;

/** Official Mecatronix mark with the wordmark set in the display face. */
export function Logo({
  className,
  tone = "light",
  priority,
}: {
  className?: string;
  /** `onRed` sets the red mark on a white badge so it stays visible on red */
  tone?: keyof typeof wordmarkTone;
  priority?: boolean;
}) {
  const mark = (
    <Image
      src={site.logo}
      alt=""
      width={site.logoWidth}
      height={site.logoHeight}
      priority={priority}
      className={cn(
        "w-auto transition-transform duration-500 group-hover:scale-105",
        tone === "onRed" ? "h-7 sm:h-8" : "h-8 sm:h-9",
      )}
    />
  );

  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)}>
      {tone === "onRed" ? (
        <span className="flex size-11 items-center justify-center rounded-xl bg-white shadow-[0_6px_18px_-6px_rgb(110_10_15/0.6)] ring-1 ring-white/60 sm:size-12">
          {mark}
        </span>
      ) : (
        mark
      )}
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[17px] font-semibold tracking-[0.08em] sm:text-lg", wordmarkTone[tone])}>
          MECATRONIX
        </span>
        <span className={cn("mt-1 font-mono text-[8.5px] tracking-[0.28em]", taglineTone[tone])}>
          SOFTWARE DEVELOPMENT
        </span>
      </span>
    </Link>
  );
}
