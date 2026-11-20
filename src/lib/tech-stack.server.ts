import "server-only";
import { cache } from "react";
import { techStack as fallback, type TechGroup } from "../data/company";
import { fetchContent } from "./content";

/**
 * The "Technology" list from the admin panel (mec-api GET settings/tech), cached under the
 * "tech" tag and refreshed by /api/revalidate after an admin edit. Falls back to src/data/company.ts
 * when the API is unavailable. Deduplicated per request (home hero and section share one fetch).
 */
export const getTechStack = cache(async (): Promise<TechGroup[]> => {
  const data = await fetchContent<{ groups?: unknown }>("settings/tech", "tech");
  const groups = (Array.isArray(data?.groups) ? data.groups : [])
    .map((g: { category?: unknown; items?: unknown }): TechGroup => ({
      category: typeof g?.category === "string" ? g.category.trim() : "",
      items: Array.isArray(g?.items) ? g.items.filter((i): i is string => typeof i === "string" && i.trim() !== "").map((i) => i.trim()) : [],
    }))
    .filter((g) => g.category && g.items.length);
  return groups.length ? groups : fallback;
});
