import Image from "next/image";
import Link from "next/link";
import { cn } from "../../lib/cn";
import { site } from "../../lib/site";

/** Official Mecatronix mark with the wordmark set in the display face. */
export function Logo({ className, tone = "light", priority }: { className?: string; tone?: "dark" | "light"; priority?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)}>
      <Image
        src={site.logo}
        alt=""
        width={296}
        height={387}
        priority={priority}
        className="h-8 w-auto transition-transform duration-500 group-hover:scale-105 sm:h-9"
      />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[17px] font-semibold tracking-[0.08em] sm:text-lg", tone === "dark" ? "text-white" : "text-ink")}>
          MECATRONIX
        </span>
        <span className={cn("mt-1 font-mono text-[8.5px] tracking-[0.28em]", tone === "dark" ? "text-muted" : "text-muted-ink")}>
          SOFTWARE DEVELOPMENT
        </span>
      </span>
    </Link>
  );
}
