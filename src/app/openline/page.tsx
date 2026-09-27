import type { Metadata } from "next";
import Openline from "../../views/openline/Openline";
import JsonLd from "../../components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Contact Mecatronix Software Development for web development, ecommerce, and app solutions. Get in touch today.",
  path: "/openline",
  keywords: [
    "contact mecatronix",
    "web development contact",
    "software company coimbatore contact",
    "ecommerce development contact",
    "contact for app development",
  ],
  socialTitle: "Contact Mecatronix",
  socialDescription: "Get in touch with our team for your next project.",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("/openline", "Contact")} />
      <Openline />
    </>
  );
}
