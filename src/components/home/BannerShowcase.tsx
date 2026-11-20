import { getProjects } from "../../lib/content";
import { Container } from "../ui/Container";
import { Eyebrow } from "../ui/Heading";
import { Reveal } from "../animations/Reveal";
import { WorkScreens } from "./WorkScreens";

/** Highlights: an auto-scrolling strip of project screenshots. Renders nothing without projects. */
export async function BannerShowcase() {
  const projects = await getProjects();
  if (!projects.length) return null;
  return (
    <section aria-labelledby="banners-title" className="overflow-hidden py-10 lg:py-12">
      <Container>
        <Reveal className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between lg:mb-9">
          <div>
            <Eyebrow>Highlights</Eyebrow>
            <h2 id="banners-title" className="mt-3 font-display text-[1.9rem] font-semibold leading-tight tracking-[-0.035em] text-ink sm:text-[2.3rem]">
              What&apos;s new at Mecatronix
            </h2>
          </div>
          <p className="max-w-sm text-[14.5px] leading-relaxed text-muted-ink">Launches, offers and recent work from our studio — updated by our team.</p>
        </Reveal>
        <Reveal>
          <WorkScreens projects={projects} />
        </Reveal>
      </Container>
    </section>
  );
}
