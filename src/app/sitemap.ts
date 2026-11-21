import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "../lib/seo";
import { services } from "../data/services";
import { industries } from "../data/industries";
import { isCaseStudyComplete } from "../data/projects";
import { getArticles, getProjects } from "../lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Omit lastModified when the actual content update date is unknown.
  // A fresh crawl/build timestamp is not a meaningful page modification.
  // Includes content added in the admin panel
  const [articles, projects] = await Promise.all([getArticles(), getProjects()]);
  const url = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

  return [
    ...ROUTES.map((route) => ({
      url: url(route.path),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...industries.map((industry) => ({
      url: url(`/industries/${industry.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...services.map((s) => ({
      url: url(`/services/${s.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    // Case studies are listed once they have full content (they're noindex until then)
    ...projects.filter(isCaseStudyComplete).map((p) => ({
      url: url(`/work/${p.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...articles.map((a) => ({
      url: url(`/blogs/${a.slug}`),
      lastModified: new Date(a.published),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
