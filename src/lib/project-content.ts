import type { IndustryKey, Project, ProjectCoverStyle } from "../data/projects";

export interface ApiProject {
  id: string;
  project_name: string;
  project_image: string;
  short_description: string;
  project_url: string;
  work_id?: string | null;
  is_active: boolean;
  client?: { id: string; client_name: string; companies?: { name: string; industry: string }[] } | null;
}

export interface ApiWork {
  id: string;
  title: string;
  info: { heading: string; details: string; img: string }[];
  project_id?: string | null;
  project?: { id: string } | null;
  is_active: boolean;
}

export const slugify = (value: string) =>
  value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "").slice(0, 80) || "item";

const INDUSTRY_RULES: [RegExp, IndustryKey][] = [
  [/textile|garment|apparel|fabric|yarn|weav|knit|hosiery/i, "textiles"],
  [/e-?commerce|online store/i, "ecommerce"],
  [/school|education|college|academy|preschool|institut|training/i, "education"],
  [/logistic|transport|shipping|courier|freight/i, "logistics"],
  [/retail|shop|store|supermarket|boutique/i, "retail"],
  [/manufactur|machine|industrial|engineering|factory|mill|automation/i, "manufacturing"],
  [/consult|legal|account|clinic|agency|professional|finance/i, "professional-services"],
  [/startup|saas/i, "startups"],
];

const COVERS: ProjectCoverStyle[] = [
  { kind: "site", from: "#e4ecf2", to: "#b9cddd", ink: "#1d3446" },
  { kind: "store", from: "#efe6d8", to: "#d9c6a8", ink: "#3b2f22" },
  { kind: "catalogue", from: "#e6e9ef", to: "#b6c0d1", ink: "#1b2332" },
  { kind: "site", from: "#e8e6f4", to: "#c5c0e6", ink: "#262046" },
  { kind: "school", from: "#fbe9de", to: "#f3c9b0", ink: "#4a2617" },
];
const coverFor = (slug: string) => COVERS[[...slug].reduce((sum, c) => sum + c.charCodeAt(0), 0) % COVERS.length];
const image = (src: string, alt: string) => ({ src, alt, width: 1600, height: 1000 });
const sectionsFor = (works: ApiWork[]) => works.filter((work) => work.is_active)
  .flatMap((work) => work.info ?? [])
  .filter((section) => section.heading?.trim() || section.details?.trim() || section.img?.trim());

function toProject(project: ApiProject, works: ApiWork[]): Project {
  const slug = slugify(project.project_name);
  const industry = project.client?.companies?.find((company) => company.industry?.trim())?.industry.trim();
  const sections = sectionsFor(works);
  const images = [
    ...(project.project_image ? [image(project.project_image, `${project.project_name} screenshot`)] : []),
    ...sections.filter((section) => section.img).map((section) => image(section.img, section.heading || project.project_name)),
  ];
  return {
    slug,
    client: project.project_name.trim(),
    industry: industry ? industry.replace(/\b\w/g, (character) => character.toUpperCase()) : "Client project",
    industryKey: industry ? INDUSTRY_RULES.find(([pattern]) => pattern.test(industry))?.[1] ?? "other" : "other",
    services: [],
    summary: project.short_description.trim(),
    overview: sections.map((section) => section.details?.trim()).filter(Boolean).join("\n\n") || project.short_description.trim(),
    scope: sections.map((section) => section.heading.trim()).filter(Boolean),
    sections,
    url: project.project_url ? (/^https?:\/\//i.test(project.project_url) ? project.project_url : `https://${project.project_url}`) : undefined,
    images: images.filter((entry, index) => images.findIndex((candidate) => candidate.src === entry.src) === index),
    cover: coverFor(slug),
  };
}

/** Supports Projects -> work_id, Works -> project_id, and standalone published Works. */
export function mergeProjectContent(curated: Project[], projects: ApiProject[] | null, works: ApiWork[] | null): Project[] {
  const claimed = new Set<string>();
  const hidden = new Set<string>();
  const fromAdmin = new Map((projects ?? []).map((project) => {
    const linked = (works ?? []).filter((work) => work.id === project.work_id || work.project_id === project.id || work.project?.id === project.id);
    linked.forEach((work) => claimed.add(work.id));
    const slug = slugify(project.project_name);
    if (!project.is_active) hidden.add(slug);
    return [slug, { active: project.is_active, project: toProject(project, linked) }];
  }));

  const merged = curated.flatMap((project) => {
    const match = fromAdmin.get(project.slug);
    if (!match) return [project];
    fromAdmin.delete(project.slug);
    if (!match.active) return [];
    const admin = match.project;
    return [{
      ...project,
      client: admin.client,
      summary: admin.summary || project.summary,
      overview: admin.overview || project.overview,
      scope: admin.scope.length ? admin.scope : project.scope,
      url: admin.url ?? project.url,
      images: admin.images?.length ? admin.images : project.images,
      sections: admin.sections?.length ? admin.sections : project.sections,
    }];
  });
  const added = [...fromAdmin.values()].filter((entry) => entry.active).map((entry) => entry.project);
  const result = [...added, ...merged];
  const standalone: Project[] = [];
  const usedSlugs = new Set(result.map((project) => project.slug));

  for (const work of works ?? []) {
    // A linked Work follows its parent project's publication status.
    if (!work.is_active || claimed.has(work.id) || work.project_id || work.project?.id) continue;
    const slug = slugify(work.title);
    if (hidden.has(slug)) continue;
    const sections = sectionsFor([work]);
    const screenshots = sections.filter((section) => section.img).map((section) => image(section.img, section.heading || work.title));
    const description = sections.map((section) => section.details?.trim()).filter(Boolean).join("\n\n");
    const existingIndex = result.findIndex((project) => project.slug === slug);
    if (existingIndex !== -1) {
      const existing = result[existingIndex];
      result[existingIndex] = {
        ...existing,
        summary: description.split("\n\n")[0] || existing.summary,
        overview: description || existing.overview,
        scope: sections.length ? sections.map((section) => section.heading.trim()).filter(Boolean) : existing.scope,
        sections: sections.length ? sections : existing.sections,
        images: [...screenshots, ...(existing.images ?? [])].filter((entry, index, images) => images.findIndex((candidate) => candidate.src === entry.src) === index),
      };
      continue;
    }
    const uniqueSlug = usedSlugs.has(slug) ? `${slug.slice(0, 71)}-${work.id.slice(0, 8)}` : slug;
    usedSlugs.add(uniqueSlug);
    standalone.push({
      slug: uniqueSlug,
      client: work.title.trim(),
      industry: "Client project",
      industryKey: "other",
      services: [],
      summary: description.split("\n\n")[0] || work.title.trim(),
      overview: description || work.title.trim(),
      scope: sections.map((section) => section.heading.trim()).filter(Boolean),
      sections,
      images: screenshots,
      cover: coverFor(uniqueSlug),
    });
  }
  return [...standalone, ...result];
}
