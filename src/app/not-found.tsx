import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../components/ui/Button";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist or has been moved.",
  robots: { index: false, follow: true },
};

const links = [
  { href: "/services", label: "Services", text: "What we build" },
  { href: "/work", label: "Work", text: "Selected projects" },
  { href: "/insights", label: "Insights", text: "Articles and guides" },
  { href: "/contact", label: "Contact", text: "Start a conversation" },
];

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-white px-4 pb-24 pt-40 text-ink sm:px-6 lg:pb-32 lg:pt-48">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
        <p className="absolute left-1/2 top-24 -translate-x-1/2 select-none font-display text-[38vw] font-semibold leading-none tracking-[-0.06em] text-accent/[0.06] lg:text-[22rem]">
          404
        </p>
      </div>
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-label text-accent-ink">Error 404</p>
        <h1 className="text-h1 mt-6">This page doesn&apos;t exist.</h1>
        <p className="text-lead mx-auto mt-6 max-w-lg text-muted-ink">
          It may have moved when we redesigned the site. Try one of these instead.
        </p>
        <div className="mt-10">
          <Button href="/" size="lg" arrow>Back to home</Button>
        </div>
      </div>
      <nav aria-label="Popular pages" className="mx-auto mt-16 grid max-w-4xl gap-px overflow-hidden rounded-panel border border-line bg-line shadow-soft sm:grid-cols-2 lg:grid-cols-4">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="group flex flex-col gap-6 bg-white p-6 transition-colors hover:bg-sand">
            <ArrowUpRight aria-hidden className="size-5 text-muted transition-colors group-hover:text-accent" />
            <span>
              <span className="block text-[15.5px] font-medium group-hover:text-accent-ink">{l.label}</span>
              <span className="mt-1 block text-[13.5px] text-muted">{l.text}</span>
            </span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
