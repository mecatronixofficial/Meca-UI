import type { Metadata } from "next";
import Portal from "../views/portal/Portal";
import { pageMetadata } from "../lib/seo";

export const metadata: Metadata = pageMetadata({
  // The home page shares its segment with the root layout, so the
  // "%s | Mecatronix" template does not apply: the title is absolute.
  title: "Mecatronix | Software Development Company in Coimbatore",
  absolute: true,
  description:
    "Mecatronix is a software development company in Coimbatore offering web development, ecommerce websites, mobile apps, and scalable digital solutions.",
  path: "/",
  keywords: [
    "software development company in Coimbatore",
    "web development company in Coimbatore",
    "ecommerce website development",
    "mobile app development",
    "Mecatronix",
  ],
  socialTitle: "Software Development Company in Coimbatore",
  socialDescription:
    "Web development, ecommerce websites, mobile apps, and scalable digital solutions by Mecatronix.",
});

export default function Page() {
  return <Portal />;
}
