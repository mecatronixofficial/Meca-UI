import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { breadcrumbJsonLd, type Crumb } from "../../lib/seo";
import JsonLd from "../seo/JsonLd";

/** Visible breadcrumb trail plus matching BreadcrumbList structured data. */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const all = [{ path: "/", label: "Home" }, ...crumbs];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="text-surface">{c.label}</span>
                ) : (
                  <>
                    <Link href={c.path} className="transition-colors hover:text-accent-ink">{c.label}</Link>
                    <ChevronRight aria-hidden className="size-3.5 text-line-strong" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
