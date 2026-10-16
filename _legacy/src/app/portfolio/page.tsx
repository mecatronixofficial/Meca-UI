import type { Metadata } from "next";
import Portfolio from "../../views/portfolio/Portfolio";
import JsonLd from "../../components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Portfolio",
  description:
    "Explore Mecatronix portfolio showcasing web development, ecommerce solutions, and modern digital products.",
  path: "/portfolio",
  keywords: [
    "portfolio",
    "web projects",
    "ecommerce development",
    "react projects",
    "software company coimbatore",
  ],
  socialTitle: "Mecatronix Portfolio",
  socialDescription: "Our latest projects and work showcase.",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("/portfolio", "Portfolio")} />
      <Portfolio />
    </>
  );
}
