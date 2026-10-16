/**
 * Lightweight service index: the fields navigation, forms and other client
 * components need. Full page content lives in ./services.ts, which merges
 * these entries in — edit names and summaries here.
 */

export interface ServiceBasics {
  slug: string;
  title: string;
  /** Short label for navigation */
  navLabel: string;
  /** One-line card description */
  summary: string;
  /** Business outcome in one sentence */
  benefit: string;
}

export const serviceList: ServiceBasics[] = [
  {
    slug: "web-development",
    title: "Web Development",
    navLabel: "Web Development",
    summary: "Responsive corporate websites, dynamic platforms and high-performance web applications.",
    benefit: "A fast, credible web presence that explains what you do and turns visitors into enquiries.",
  },
  {
    slug: "custom-software",
    title: "Custom Software Development",
    navLabel: "Custom Software",
    summary: "Tailored systems that simplify operations and solve business-specific challenges.",
    benefit: "Software that fits how your business actually works — instead of bending your process around a generic tool.",
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    navLabel: "Mobile Apps",
    summary: "Modern Android and iOS applications with intuitive user experiences.",
    benefit: "An app your customers or field teams open every day — because it's genuinely quicker than the alternative.",
  },
  {
    slug: "ecommerce-development",
    title: "E-commerce Development",
    navLabel: "E-commerce",
    summary: "Scalable online stores, product management, secure checkout integration and order workflows.",
    benefit: "An online store that's easy to run day to day — not just one that looks good on launch day.",
  },
  {
    slug: "erp-development",
    title: "ERP & Business Management Systems",
    navLabel: "ERP Systems",
    summary: "Custom management solutions for inventory, production, billing, sales, reports and operations.",
    benefit: "One connected system for the daily work of the business — and real-time numbers for the decisions.",
  },
  {
    slug: "ai-automation",
    title: "AI Integration & Automation",
    navLabel: "AI & Automation",
    summary: "Practical workflow automation, intelligent features and AI integrations where they provide measurable business value.",
    benefit: "Less repetitive work for your team, with AI applied only where it clearly helps.",
  },
];
