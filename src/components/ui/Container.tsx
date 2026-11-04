import { cn } from "../../lib/cn";

/** Max-width page column with the standard responsive gutter. */
export function Container({
  className,
  children,
  wide,
}: {
  className?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-10", wide ? "max-w-[1600px]" : "max-w-[1320px]", className)}>
      {children}
    </div>
  );
}

const sectionTones = {
  light: "border-line bg-white text-surface",
  paper: "border-line bg-paper text-surface",
  dark: "border-white/10 bg-ink text-white/80",
};

/** Page section with consistent vertical rhythm; white canvas unless a tone is given. */
export function Section({
  className,
  children,
  id,
  labelledBy,
  tone = "light",
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
  labelledBy?: string;
  tone?: keyof typeof sectionTones;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      // content-visibility lets the browser skip layout/paint of off-screen sections until they near the viewport
      className={cn("relative border-t py-20 [contain-intrinsic-size:auto_900px] [content-visibility:auto] sm:py-24 lg:py-32", sectionTones[tone], className)}
    >
      {children}
    </section>
  );
}
