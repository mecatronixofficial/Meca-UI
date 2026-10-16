import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import { Hero } from "../components/home/Hero";
import { Intro } from "../components/home/Intro";
import { SelectedWork } from "../components/home/SelectedWork";
import { ServicesSection } from "../components/home/ServicesSection";
import { WhyMecatronix } from "../components/home/WhyMecatronix";
import { IndustriesSection } from "../components/home/IndustriesSection";
import { ProcessSection } from "../components/home/ProcessSection";
import { TechSection } from "../components/home/TechSection";
import { Testimonials } from "../components/home/Testimonials";
import { InsightsSection } from "../components/home/InsightsSection";
import { ContactCTA } from "../components/sections/ContactCTA";

export const metadata: Metadata = pageMetadata({
  // The home page shares its segment with the root layout, so the
  // "%s | Mecatronix" template does not apply: the title is absolute.
  title: "Mecatronix | Software Development Company in Coimbatore",
  absolute: true,
  description:
    "Mecatronix is a software development company in Coimbatore building business websites, custom software, mobile apps, e-commerce stores, ERP systems and automation for growing companies.",
  path: "/",
  keywords: [
    "software development company in Coimbatore",
    "website development company in Coimbatore",
    "custom software development Tamil Nadu",
    "mobile app development Coimbatore",
    "ERP software development",
  ],
  socialTitle: "Engineering software. Empowering businesses.",
  socialDescription:
    "Websites, applications and business systems designed and built by Mecatronix in Coimbatore.",
});

// Verified reviews are fetched from the backend and refreshed hourly
export const revalidate = 3600;

export default function Page() {
  return (
    <>
      <Hero />
      <Intro />
      <SelectedWork />
      <ServicesSection />
      <WhyMecatronix />
      <IndustriesSection />
      <ProcessSection />
      <TechSection />
      <Testimonials />
      <InsightsSection />
      <ContactCTA />
    </>
  );
}
