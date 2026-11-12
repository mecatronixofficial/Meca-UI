import Image from "next/image";
import { getClientCompanies, type ClientCompany } from "../../lib/content";
import { cn } from "../../lib/cn";
import { Container } from "../ui/Container";

/**
 * Logos of active clients' companies, managed in the admin panel (Clients).
 * Hidden until at least one client with a logo is active. Six or more logos
 * scroll as an endless strip; fewer sit in a calm row.
 */
export async function ClientLogos() {
  const companies = await getClientCompanies();
  if (!companies.length) return null;
  const scrolling = companies.length >= 6;

  return (
    <section aria-labelledby="clients-title" className="border-y border-line bg-paper/60 py-8 lg:py-10">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
          <h2 id="clients-title" className="text-label shrink-0 text-muted-ink lg:max-w-[11rem]">
            Trusted by growing businesses
          </h2>
          {scrolling ? (
            <div className="group relative flex min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
              <LogoRow companies={companies} className="animate-marquee pr-14 group-hover:[animation-play-state:paused] motion-reduce:animate-none" />
              <LogoRow companies={companies} className="animate-marquee pr-14 group-hover:[animation-play-state:paused] motion-reduce:hidden" hidden />
            </div>
          ) : (
            <LogoRow companies={companies} className="flex-wrap gap-y-6" />
          )}
        </div>
      </Container>
    </section>
  );
}

function LogoRow({ companies, className, hidden }: { companies: ClientCompany[]; className?: string; hidden?: boolean }) {
  return (
    <ul className={cn("flex shrink-0 items-center gap-14", className)} aria-hidden={hidden || undefined}>
      {companies.map((company) => (
        <li key={company.name} className="shrink-0">
          <Image
            src={company.img}
            alt={hidden ? "" : company.name}
            title={company.name}
            width={160}
            height={48}
            unoptimized
            className="h-10 w-auto max-w-[9rem] object-contain opacity-60 grayscale transition-[filter,opacity] duration-300 hover:opacity-100 hover:grayscale-0"
          />
        </li>
      ))}
    </ul>
  );
}
