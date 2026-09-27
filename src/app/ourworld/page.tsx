import type { Metadata } from "next";
import Ourworld from "../../views/ourworld/Ourworld";
import JsonLd from "../../components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our World",
  description:
    "Learn about Mecatronix Software Development, a futuristic IT company delivering scalable web, app, and digital solutions.",
  path: "/ourworld",
  keywords: [
    "about mecatronix",
    "software company coimbatore",
    "web development company",
    "IT startup India",
    "Company Projects",
  ],
  socialTitle: "About Mecatronix",
  socialDescription: "Discover our vision, team, and technology expertise.",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("/ourworld", "Our World")} />
      <Ourworld />
    </>
  );
}
