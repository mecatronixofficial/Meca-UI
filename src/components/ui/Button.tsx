import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "light" | "outline-dark" | "outline-light" | "ghost-dark" | "ghost-light";
type Size = "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform,translate] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "btn-shine bg-accent-strong text-white shadow-glow hover:bg-accent-ink hover:shadow-glow-lg",
  light: "bg-white text-ink hover:bg-paper",
  "outline-dark": "border border-white/15 text-white hover:border-white/40 hover:bg-white/5",
  "outline-light": "border border-line-strong bg-white text-ink hover:border-accent hover:bg-accent hover:text-white hover:shadow-glow",
  "ghost-dark": "text-white hover:text-white/70",
  "ghost-light": "text-surface hover:text-accent-ink",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-[15px] sm:text-base",
};

export interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  arrow?: boolean | "external";
  className?: string;
  external?: boolean;
}

/** Link styled as a button. Use for navigation CTAs. */
export function Button({ href, children, variant = "primary", size = "md", arrow, className, external }: ButtonProps) {
  const Icon = arrow === "external" ? ArrowUpRight : ArrowRight;
  const content = (
    <>
      {children}
      {arrow && (
        <Icon
          aria-hidden
          className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5"
          strokeWidth={2}
        />
      )}
    </>
  );
  const classes = cn(base, variants[variant], sizes[size], className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

/** Inline text link with an animated arrow. */
export function ArrowLink({
  href,
  children,
  tone = "light",
  className,
}: {
  href: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/link inline-flex items-center gap-1.5 text-[15px] font-medium",
        tone === "light" ? "text-ink hover:text-accent-ink" : "text-white hover:text-white/70",
        className,
      )}
    >
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover/link:bg-[length:100%_1px]">
        {children}
      </span>
      <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover/link:translate-x-1" />
    </Link>
  );
}
