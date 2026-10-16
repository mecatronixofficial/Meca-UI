import type { Metadata, MetadataRoute } from "next";
import mecatronixConfig from "../config/envConfig";

export const SITE_URL = "https://www.mecatronix.one";
export const SITE_NAME = "Mecatronix";
export const COMPANY_NAME = "Mecatronix Software Development";
export const LOGO_PATH = "/assets/logos/Image.png";

export const DEFAULT_DESCRIPTION =
  "Mecatronix Software Development is a software engineering studio in Coimbatore building business websites, custom software, mobile apps, e-commerce platforms, ERP systems and automation.";

/**
 * Static, indexable routes. Drives the sitemap together with the dynamic
 * service, case study and article routes (see src/app/sitemap.ts).
 */
export const ROUTES: {
  path: string;
  label: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
}[] = [
  { path: "/", label: "Home", priority: 1, changeFrequency: "weekly" },
  { path: "/services", label: "Services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/work", label: "Work", priority: 0.8, changeFrequency: "monthly" },
  { path: "/industries", label: "Industries", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", label: "About", priority: 0.7, changeFrequency: "monthly" },
  { path: "/process", label: "Process", priority: 0.6, changeFrequency: "yearly" },
  { path: "/insights", label: "Insights", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contact", label: "Contact", priority: 0.8, changeFrequency: "yearly" },
  { path: "/privacy", label: "Privacy Policy", priority: 0.2, changeFrequency: "yearly" },
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

export interface Crumb {
  path: string;
  label: string;
}

/** Breadcrumb trail: Home > ...crumbs */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ path: "/", label: "Home" }, ...crumbs].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${SITE_URL}${c.path === "/" ? "" : c.path}`,
    })),
  };
}

/** A service offered by the business (service detail pages) */
export function serviceJsonLd({ name, description, path }: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: name,
    description,
    url: `${SITE_URL}${path}`,
    provider: { "@id": `${SITE_URL}/#localbusiness` },
    areaServed: [
      { "@type": "City", name: "Coimbatore" },
      { "@type": "State", name: "Tamil Nadu" },
      { "@type": "Country", name: "India" },
    ],
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleJsonLd(a: { title: string; description: string; path: string; published: string; author: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.description,
    url: `${SITE_URL}${a.path}`,
    mainEntityOfPage: `${SITE_URL}${a.path}`,
    datePublished: a.published,
    dateModified: a.published,
    inLanguage: "en-IN",
    image: `${SITE_URL}${ogImage(a.title).url}`,
    author: { "@type": "Organization", name: a.author, url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function caseStudyJsonLd(p: { client: string; description: string; path: string; industry: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${p.client} — ${p.industry}`,
    description: p.description,
    url: `${SITE_URL}${p.path}`,
    creator: { "@id": `${SITE_URL}/#organization` },
  };
}
