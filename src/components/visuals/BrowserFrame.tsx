import { cn } from "../../lib/cn";

/** Minimal browser window chrome around an interface mockup. */
export function BrowserFrame({
  url,
  children,
  className,
}: {
  url: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-[14px] border border-line bg-white shadow-window", className)}>
      <div className="flex h-9 items-center gap-3 border-b border-line bg-paper px-3.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-accent" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
        </div>
        <div className="mx-auto flex h-5.5 w-full max-w-[280px] items-center justify-center rounded-md bg-white font-mono text-[10px] text-muted-ink ring-1 ring-line">
          {url}
        </div>
        <div className="w-[42px]" />
      </div>
      {children}
    </div>
  );
}
