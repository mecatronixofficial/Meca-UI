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

/** Page section on the white canvas with consistent vertical rhythm. */
export function Section({
  className,
  children,
  id,
  labelledBy,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      // content-visibility lets the browser skip layout/paint of off-screen sections until they near the viewport
      className={cn("relative border-t border-line bg-white py-20 text-surface [contain-intrinsic-size:auto_900px] [content-visibility:auto] sm:py-24 lg:py-32", className)}
    >
      {children}
    </section>
  );
}
