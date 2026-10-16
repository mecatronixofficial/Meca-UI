import { cn } from "../../lib/cn";

/** Small mono label above headings, e.g. "02 — Selected work". */
export function Eyebrow({
  children,
  tone = "light",
  className,
  dot = true,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
  dot?: boolean;
}) {
  return (
    <p
      className={cn(
        "text-label inline-flex items-center gap-2.5",
        tone === "light" ? "text-muted-ink" : "text-muted",
        className,
      )}
    >
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-accent" />}
      {children}
    </p>
  );
}

/** Standard section header: eyebrow, h2 and optional intro. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  tone = "light",
  align = "left",
  className,
  as: Tag = "h2",
}: {
  id?: string;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  intro?: React.ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "split";
  className?: string;
  as?: "h1" | "h2";
}) {
  if (align === "split") {
    return (
      <div className={cn("grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10", className)}>
        <div className="lg:col-span-7" data-reveal>
          {eyebrow && <Eyebrow tone={tone} className="mb-5">{eyebrow}</Eyebrow>}
          <Tag id={id} className={cn(Tag === "h1" ? "text-h1" : "text-h2", tone === "dark" ? "text-white" : "text-surface")}>
            {title}
          </Tag>
        </div>
        {intro && (
          <p
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className={cn("text-lead max-w-xl lg:col-span-5 lg:justify-self-end", tone === "dark" ? "text-muted" : "text-muted-ink")}
          >
            {intro}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("max-w-3xl", className)} data-reveal>
      {eyebrow && <Eyebrow tone={tone} className="mb-5">{eyebrow}</Eyebrow>}
      <Tag id={id} className={cn(Tag === "h1" ? "text-h1" : "text-h2", tone === "dark" ? "text-white" : "text-surface")}>
        {title}
      </Tag>
      {intro && (
        <p className={cn("text-lead mt-6 max-w-2xl", tone === "dark" ? "text-muted" : "text-muted-ink")}>{intro}</p>
      )}
    </div>
  );
}
