import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import { Hero } from "../components/home/Hero";
import { Intro } from "../components/home/Intro";
import { ClientLogos } from "../components/home/ClientLogos";
import { ServicesSection } from "../components/home/ServicesSection";
import { WhyMecatronix } from "../components/home/WhyMecatronix";
import { GoogleReviews } from "../components/home/GoogleReviews";
import { TechSection } from "../components/home/TechSection";
import { Testimonials } from "../components/home/Testimonials";
import { InsightsSection } from "../components/home/InsightsSection";
import { KuralOfTheDay } from "../components/home/KuralOfTheDay";
import { PreviewSection } from "../components/home/PreviewSection";
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

// Banners, projects, articles, client logos and reviews come from the admin panel (src/lib/content.ts):
// refreshed on demand via /api/revalidate, and at least every minute.

export default function Page() {
  return (
    <>
      <Hero />
      <KuralOfTheDay />
      <ClientLogos />
      <Intro />
      <ServicesSection />
      <PreviewSection />
      <WhyMecatronix />
      <GoogleReviews />
      <TechSection />
      <Testimonials />
      <InsightsSection />
      <ContactCTA tone="red" />
    </>
  );
}
