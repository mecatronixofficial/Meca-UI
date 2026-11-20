import "server-only";
import { articles as staticArticles, type Article, type Block } from "../data/insights";
import { projects as staticProjects, type Project } from "../data/projects";
import { backendBaseUrl } from "./backend";
import type { ProjectVideo } from "../data/projects";
import { mergeProjectContent, slugify, type ApiProject, type ApiWork } from "./project-content";
export { slugify } from "./project-content";

/**
 * Website content managed in the admin panel (mec-api), merged with the
 * hand-written content in src/data.
 *
 * Freshness: every request is cached under a tag. The API POSTs to
 * /api/revalidate after an admin edit, which expires the tag so the change
 * shows on the next visit. If that ping is missed, the cache still refreshes
 * every REFRESH_SECONDS. When the API is unreachable the site falls back to the
 * hand-written content, so pages never break.
 */

export const CONTENT_TAGS = {
  blogs: "content:blogs",
  projects: "content:projects",
  clients: "content:clients",
  reviews: "content:reviews",
  banners: "content:banners",
  // Emails, phones, addresses, hours and social links (src/lib/site-contact.server.ts)
  contact: "content:contact",
  // Kural of the day (changes at midnight IST; re-checked every minute like the rest)
  thirukkural: "content:thirukkural",
  // Founders and team (About page)
  team: "content:team",
  // "Technology" list (home page, hero, About page; src/lib/tech-stack.server.ts)
  tech: "content:tech",
  // MECA's board (every page; src/lib/meca-board.server.ts)
  meca: "content:meca",
} as const;

export type ContentTag = keyof typeof CONTENT_TAGS;

const REFRESH_SECONDS = 60;

/** GET `path` from mec-api; resolves `data`, or null when unavailable. */
export async function fetchContent<T>(path: string, tag: ContentTag): Promise<T | null> {
  const base = backendBaseUrl();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/${path}`, {
      next: { revalidate: REFRESH_SECONDS, tags: [CONTENT_TAGS[tag]] },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { success?: boolean; data?: T };
    return json?.success ? (json.data ?? null) : null;
  } catch {
    return null;
  }
}

/* ---------- Shared helpers ---------- */

const titleCase = (value: string) => value.replace(/\b\w/g, (character) => character.toUpperCase());

/** YYYY-MM-DD in India for an ISO timestamp. */
const indiaDate = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

/** Plain text from the admin -> paragraphs and bullet lists. */
function textBlocks(text = ""): Block[] {
  const blocks: Block[] = [];
  for (const chunk of text.split(/\n\s*\n/)) {
    const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!lines.length) continue;
    if (lines.every((line) => /^[-*•]\s+/.test(line))) blocks.push({ type: "ul", items: lines.map((line) => line.replace(/^[-*•]\s+/, "")) });
    else blocks.push({ type: "p", text: lines.join(" ") });
  }
  return blocks;
}

/* ---------- Blogs -> /blogs articles ---------- */

interface ApiBlog {
  id: string;
  blog_name: string;
  blog_images: string[];
  short_description: string;
  blog_descriptions: { heading?: string; content?: string; image?: string }[];
  is_active: boolean;
  createdAt: string;
}

function toArticle(blog: ApiBlog): Article {
  const body: Block[] = [];
  for (const section of blog.blog_descriptions ?? []) {
    if (section.heading?.trim()) body.push({ type: "h2", text: section.heading.trim() });
    body.push(...textBlocks(section.content));
    if (section.image) body.push({ type: "img", src: section.image, alt: section.heading?.trim() || blog.blog_name });
  }
  for (const src of (blog.blog_images ?? []).slice(1)) body.push({ type: "img", src, alt: blog.blog_name });

  return {
    slug: slugify(blog.blog_name),
    title: blog.blog_name.trim(),
    description: blog.short_description.trim(),
    category: "From the team",
    published: indiaDate(blog.createdAt),
    author: "Mecatronix Engineering Team",
    service: "",
    cover: blog.blog_images?.[0],
    body,
  };
}

/** Admin blogs (published only) plus the hand-written articles, newest first. A blog with the same slug replaces the hand-written one. */
export async function getArticles(): Promise<Article[]> {
  const blogs = await fetchContent<ApiBlog[]>("blogs/published", "blogs");
  const active = (blogs ?? []).filter((b) => b.is_active);
  // Same-titled blogs would share a URL: the oldest keeps it, newer ones get an id suffix (stable over time)
  const seen = new Set<string>();
  const fromAdmin = active
    .reverse()
    .map((blog) => {
      const article = toArticle(blog);
      if (seen.has(article.slug)) article.slug = `${article.slug}-${blog.id.slice(0, 8)}`;
      seen.add(article.slug);
      return article;
    });
  const taken = new Set(fromAdmin.map((a) => a.slug));
  return [...fromAdmin, ...staticArticles.filter((a) => !taken.has(a.slug))].sort((a, b) => b.published.localeCompare(a.published));
}

export async function getArticle(slug: string) {
  return (await getArticles()).find((a) => a.slug === slug);
}

/* ---------- Projects + works -> Work case studies ---------- */

async function getBaseProjects(): Promise<Project[]> {
  const [projects, works] = await Promise.all([
    fetchContent<ApiProject[]>("project/all", "projects"),
    fetchContent<ApiWork[]>("work/get", "projects"),
  ]);
  return mergeProjectContent(staticProjects, projects, works);
}

export interface ProjectMedia {
  slug: string;
  images: { src: string; alt: string }[];
  videos: ProjectVideo[];
}

/** Media can be managed for both curated projects and projects created in mec-api. */
export async function getProjectMedia(): Promise<ProjectMedia[]> {
  return (await fetchContent<ProjectMedia[]>("project/media", "projects")) ?? [];
}

export async function getProjects(): Promise<Project[]> {
  const [projects, media] = await Promise.all([getBaseProjects(), getProjectMedia()]);
  const bySlug = new Map(media.map((entry) => [entry.slug, entry]));
  return projects.map((project) => {
    const entry = bySlug.get(project.slug);
    if (!entry) return project;
    return {
      ...project,
      images: entry.images.map((image) => ({ ...image, width: 1600, height: 1000 })),
      videos: entry.videos,
    };
  });
}

export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug);
}

/* ---------- Client companies -> logo strip ---------- */

export interface ClientCompany {
  name: string;
  img: string;
  url: string;
  industry: string;
}

/** Companies of active clients (the API already excludes hidden clients). */
export async function getClientCompanies(): Promise<ClientCompany[]> {
  const companies = await fetchContent<ClientCompany[]>("clients/get_all_clients_company", "clients");
  const seen = new Set<string>();
  return (
    (companies ?? [])
      .filter((c) => {
        const key = c.name?.trim().toLowerCase();
        if (!key || !c.img || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      // The API stores company names in lower case (for review matching); capitalise them for display
      .map((c) => ({ ...c, name: titleCase(c.name.trim()), industry: c.industry ? titleCase(c.industry) : c.industry }))
  );
}

/* ---------- Banners -> home page showcase ---------- */

interface ApiBanner {
  id: string;
  name: string;
  description: string;
  img: string;
  position: number;
  is_active: boolean;
  tag?: string | null;
  highlights?: string[] | null;
  cta_label?: string | null;
  cta_link?: string | null;
}

export interface SiteBanner {
  id: string;
  title: string;
  description: string;
  img: string;
  /** Short label above the title, e.g. "New launch". */
  tag: string | null;
  highlights: string[];
  /** Button, when the admin set both its text and link. */
  cta: { label: string; href: string; external: boolean } | null;
}

/** A banner button link: a site path ("/contact") or an http(s) URL; anything else is dropped. */
function bannerCta(label?: string | null, link?: string | null): SiteBanner["cta"] {
  const text = label?.trim();
  const href = link?.trim();
  if (!text || !href) return null;
  if (/^\/(?!\/)/.test(href)) return { label: text, href, external: false };
  if (/^https?:\/\//i.test(href)) return { label: text, href, external: true };
  return null;
}

/** Active banners from the admin panel, in their configured position order. */
export async function getBanners(): Promise<SiteBanner[]> {
  const banners = await fetchContent<ApiBanner[]>("banner/get", "banners");
  return (Array.isArray(banners) ? banners : [])
    .filter((b) => b.is_active && b.img)
    .sort((a, b) => a.position - b.position)
    .map((b) => ({
      id: b.id,
      title: b.name.trim(),
      description: b.description.trim(),
      img: b.img,
      tag: b.tag?.trim() || null,
      highlights: (b.highlights ?? []).map((h) => h.trim()).filter(Boolean).slice(0, 4),
      cta: bannerCta(b.cta_label, b.cta_link),
    }));
}

/* ---------- Team -> About page founders ---------- */

interface ApiTeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  photo: string;
  linkedin?: string | null;
  email?: string | null;
  position: number;
  is_active?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  linkedin: string | null;
  email: string | null;
}

/** Founders and team from the admin panel (Team), in display order. Empty when none are active. */
export async function getTeam(): Promise<TeamMember[]> {
  const members = await fetchContent<ApiTeamMember[]>("team/get", "team");
  return (Array.isArray(members) ? members : [])
    .filter((m) => m.is_active !== false && m.name?.trim() && m.photo)
    .sort((a, b) => a.position - b.position)
    .map((m) => ({
      id: m.id,
      name: m.name.trim(),
      role: m.role.trim(),
      bio: m.bio?.trim() ?? "",
      photo: m.photo,
      linkedin: m.linkedin && /^https:\/\//i.test(m.linkedin) ? m.linkedin : null,
      email: m.email?.trim() || null,
    }));
}

/* ---------- Thirukkural -> kural of the day (home page) ---------- */

export interface KuralOfTheDay {
  /** YYYY-MM-DD (IST). */
  date: string;
  author: string;
  authorEn: string;
  number: number;
  lines: [string, string];
  transliteration: [string, string];
  translation: string;
  explanation: string;
  /** Tamil commentaries: Mu. Varadarasanar, Kalaignar Mu. Karunanidhi, Solomon Pappaiah. */
  urai: { mv: string; mk: string; sp: string };
  chapter: { number: number; name: string; translation: string; paal: string; paalEn: string; iyal: string; iyalEn: string };
}

interface ApiKuralToday {
  date: string;
  author: string;
  author_en: string;
  kural: {
    number: number;
    line1: string;
    line2: string;
    transliteration1: string;
    transliteration2: string;
    translation: string;
    explanation: string;
    urai_mv: string;
    urai_mk: string;
    urai_sp: string;
    chapter: { number: number; name: string; translation: string; paal_name: string; paal_translation: string; iyal_name: string; iyal_translation: string };
  };
}

/** Today's kural from mec-api (/thirukkural/today), or null when the API is unavailable. */
export async function getKuralOfTheDay(): Promise<KuralOfTheDay | null> {
  const today = await fetchContent<ApiKuralToday>("thirukkural/today", "thirukkural");
  const k = today?.kural;
  if (!today || !k?.line1 || !k.chapter) return null;
  return {
    date: today.date,
    author: today.author,
    authorEn: today.author_en,
    number: k.number,
    lines: [k.line1, k.line2],
    transliteration: [k.transliteration1, k.transliteration2],
    translation: k.translation,
    explanation: k.explanation,
    urai: { mv: k.urai_mv, mk: k.urai_mk, sp: k.urai_sp },
    chapter: {
      number: k.chapter.number,
      name: k.chapter.name,
      translation: k.chapter.translation,
      paal: k.chapter.paal_name,
      paalEn: k.chapter.paal_translation,
      iyal: k.chapter.iyal_name,
      iyalEn: k.chapter.iyal_translation,
    },
  };
}
