/**
 * Client projects shown on the homepage and /work.
 *
 * Only verified facts belong here. Optional fields that are left empty are
 * simply not rendered — nothing is filled in automatically.
 *
 * To complete a case study:
 *  1. Add screenshots to /public/work/<slug>/ and list them in `images`
 *     (the first image becomes the cover on cards).
 *  2. Fill in `challenge`, `solution` and (if measured) `results`.
 *     A project becomes indexable by search engines once it has both a
 *     challenge and a solution (see `isCaseStudyComplete`).
 *  3. Add `url` if the client is happy for the live site to be linked.
 */

export type CoverKind = "site" | "store" | "school" | "catalogue";

export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  client: string;
  industry: string;
  /** Industry filter key (matches src/data/industries.ts slugs) */
  industryKey: "textiles" | "manufacturing" | "education" | "retail";
  /** Service slugs from src/data/services.ts */
  services: string[];
  /** Short description for cards */
  summary: string;
  overview: string;
  scope: string[];
  /** Optional, verified details */
  challenge?: string;
  solution?: string;
  results?: string[];
  stack?: string[];
  url?: string;
  images?: ProjectImage[];
  /** Designed cover shown until real screenshots are added */
  cover: { kind: CoverKind; from: string; to: string; ink: string };
}

export const projects: Project[] = [
  {
    slug: "thangavel-textile",
    client: "Thangavel Textile",
    industry: "Textiles",
    industryKey: "textiles",
    services: ["web-development", "ecommerce-development"],
    summary: "Website and online storefront for a textile business — product catalogue, enquiries and ordering.",
    overview:
      "A textile website with e-commerce, giving the business a professional online presence and a way for customers to browse the product range and order online.",
    scope: ["Website design & development", "E-commerce storefront", "Product catalogue", "Responsive build"],
    cover: { kind: "store", from: "#efe6d8", to: "#d9c6a8", ink: "#3b2f22" },
  },
  {
    slug: "svn-enterprises",
    client: "SVN Enterprises",
    industry: "Industrial machinery",
    industryKey: "manufacturing",
    services: ["web-development"],
    summary: "Corporate website presenting an industrial machinery business and its product range.",
    overview:
      "An industrial machinery website that presents the company and its machines clearly to prospective buyers and makes it straightforward to send an enquiry.",
    scope: ["Corporate website", "Product presentation", "Enquiry flow", "Responsive build"],
    cover: { kind: "catalogue", from: "#e6e9ef", to: "#b6c0d1", ink: "#1b2332" },
  },
  {
    slug: "jai-export-enterprises",
    client: "Jai Export Enterprises",
    industry: "Home textile exports",
    industryKey: "textiles",
    services: ["web-development"],
    summary: "Export-focused website showcasing a home textile range to international buyers.",
    overview:
      "A home textile export website built to present the product range and company to buyers overseas, with a clear route to start a trade enquiry.",
    scope: ["Website design & development", "Product range showcase", "Buyer enquiry flow", "Responsive build"],
    cover: { kind: "site", from: "#e4ecf2", to: "#b9cddd", ink: "#1d3446" },
  },
  {
    slug: "little-mahilam-preschool",
    client: "Little Mahilam Preschool",
    industry: "Education",
    industryKey: "education",
    services: ["web-development", "custom-software"],
    summary: "Preschool website with a management system for day-to-day school administration.",
    overview:
      "A website for a preschool, paired with a management system that supports the school's day-to-day administration.",
    scope: ["School website", "Management system", "Admissions information", "Responsive build"],
    cover: { kind: "school", from: "#fbe9de", to: "#f3c9b0", ink: "#4a2617" },
  },
  {
    slug: "rms-textile-mills",
    client: "RMS Textile Mills",
    industry: "Textile manufacturing",
    industryKey: "textiles",
    services: ["web-development"],
    summary: "Website for a textile manufacturing business, presenting the company and its capabilities.",
    overview:
      "A textile manufacturing website that introduces the mill, its capabilities and its products to customers and partners.",
    scope: ["Corporate website", "Capabilities presentation", "Enquiry flow", "Responsive build"],
    cover: { kind: "site", from: "#e8e6f4", to: "#c5c0e6", ink: "#262046" },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const isCaseStudyComplete = (p: Project) => Boolean(p.challenge && p.solution);

export const projectFilters = [
  { key: "all", label: "All work" },
  { key: "textiles", label: "Textiles" },
  { key: "manufacturing", label: "Manufacturing" },
  { key: "education", label: "Education" },
] as const;
