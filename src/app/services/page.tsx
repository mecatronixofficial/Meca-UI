import type { Metadata } from "next";
import Services from "../../views/services/Services";
import JsonLd from "../../components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Development Services",
  description:
    "Explore Mecatronix web development services including business websites, ecommerce solutions, scalable platforms, UI/UX, and modern technology stacks.",
  path: "/services",
  keywords: [
    "web development services",
    "ecommerce development",
    "website development Coimbatore",
    "React development",
    "scalable web applications",
    "Mecatronix",
  ],
  socialTitle: "Web Development Services",
  socialDescription: "Discover modern web development, ecommerce, and scalable digital solutions by Mecatronix.",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("/services", "Services")} />
      <Services />
    </>
  );
}
