import type { Metadata, MetadataRoute } from "next";
import mecatronixConfig from "../config/envConfig";

export const SITE_URL = "https://www.mecatronix.one";
export const SITE_NAME = "Mecatronix";
export const COMPANY_NAME = "Mecatronix Software Development";
export const LOGO_PATH = "/assets/logos/Image.png";

export const DEFAULT_DESCRIPTION =
  "Mecatronix is a software development company in Coimbatore offering web development, ecommerce websites, mobile apps, and scalable digital solutions.";

/** Public, indexable routes. Drives the sitemap, so add new pages here. */
export const ROUTES: {
  path: string;
  label: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
}[] = [
  { path: "/", label: "Home", priority: 1, changeFrequency: "weekly" },
  { path: "/services", label: "Services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/portfolio", label: "Portfolio", priority: 0.8, changeFrequency: "monthly" },
  { path: "/ourworld", label: "Our World", priority: 0.7, changeFrequency: "monthly" },
  { path: "/openline", label: "Contact", priority: 0.8, changeFrequency: "yearly" },
];

/** 1200x630 share image rendered by src/app/og/route.tsx */
export const ogImage = (title?: string) => ({
  url: title ? `/og?title=${encodeURIComponent(title)}` : "/og",
  width: 1200,
  height: 630,
  alt: title ? `${title} | ${COMPANY_NAME}` : COMPANY_NAME,
});

export const OG_IMAGE = ogImage();

// Next.js does not deep-merge `openGraph` across layout/page segments — a page
// that sets its own `openGraph` object replaces the parent's entirely. Spread
// this into every page's `openGraph` so site-wide fields (image, name, locale)
// stay present everywhere instead of only on routes that omit `openGraph`.
export const baseOpenGraph = {
  siteName: SITE_NAME,
  locale: "en_IN",
  type: "website" as const,
  images: [OG_IMAGE],
};

interface PageSeo {
  /** Page title. Pass `absolute: true` to skip the "%s | Mecatronix" template. */
  title: string;
  absolute?: boolean;
  description: string;
  path: string;
  keywords?: string[];
  /** Headline used on social cards (defaults to the title) */
  socialTitle?: string;
  socialDescription?: string;
  noIndex?: boolean;
}

/** Builds complete per-page metadata: canonical URL, Open Graph, Twitter card and share image. */
export function pageMetadata({
  title,
  absolute,
  description,
  path,
  keywords,
  socialTitle,
  socialDescription,
  noIndex,
}: PageSeo): Metadata {
  const cardTitle = socialTitle ?? title;
  const cardDescription = socialDescription ?? description;
  const image = ogImage(cardTitle);

  return {
    title: absolute ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      ...baseOpenGraph,
      title: cardTitle,
      description: cardDescription,
      url: path,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: cardTitle,
      description: cardDescription,
      images: [image.url],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

/* ---------------------------------------------------------------------------
 * Structured data (JSON-LD)
 * ------------------------------------------------------------------------- */

const DAY_CODES: Record<string, string> = {
  mon: "Mo", tue: "Tu", wed: "We", thu: "Th", fri: "Fr", sat: "Sa", sun: "Su",
};

/** "Mon-Sat" + "10:00" + "19:00" -> "Mo-Sa 10:00-19:00" (schema.org openingHours format) */
function openingHours(): string | undefined {
  const { days, hoursStart, hoursEnd } = mecatronixConfig.business;
  const range = days
    .split("-")
    .map((d) => DAY_CODES[d.trim().slice(0, 3).toLowerCase()])
    .filter(Boolean);
  if (!range.length || !hoursStart || !hoursEnd) return undefined;
  return `${range.join("-")} ${hoursStart}-${hoursEnd}`;
}

const sameAs = () =>
  Object.values(mecatronixConfig.social).filter((url): url is string => Boolean(url));

export function organizationJsonLd() {
  const { contact, location } = mecatronixConfig;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: COMPANY_NAME,
        alternateName: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}${LOGO_PATH}`,
        description: DEFAULT_DESCRIPTION,
        email: contact.companyEmail,
        telephone: contact.primaryPhone,
        sameAs: sameAs(),
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#localbusiness`,
        name: COMPANY_NAME,
        url: SITE_URL,
        image: `${SITE_URL}${LOGO_PATH}`,
        telephone: contact.primaryPhone,
        email: contact.companyEmail,
        parentOrganization: { "@id": `${SITE_URL}/#organization` },
        address: {
          "@type": "PostalAddress",
          streetAddress: location.address,
          addressLocality: location.city,
          addressRegion: location.state,
          postalCode: location.pincode,
          addressCountry: location.country,
        },
        hasMap: location.googleMapsLink,
        openingHours: openingHours(),
        areaServed: ["Coimbatore", "Tamil Nadu", "India"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: "en-IN",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

/** Breadcrumb trail: Home > {label} */
export function breadcrumbJsonLd(path: string, label: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: label, item: `${SITE_URL}${path}` },
    ],
  };
}
