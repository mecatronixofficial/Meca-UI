/** Run against a production build: bun scripts/seo-audit.ts http://localhost:3100 */
import { serviceList } from "../src/data/service-list";
import { localServices, regionalPath } from "../src/data/local-seo";
import { SITE_URL } from "../src/lib/seo";

const origin = (process.argv[2] || "http://localhost:3100").replace(/\/+$/, "");
const routes = ["/", regionalPath, "/contact", ...serviceList.map((service) => `/services/${service.slug}`)];
const failures: string[] = [];
const assert = (condition: unknown, message: string) => { if (!condition) failures.push(message); };
const fetchPage = (path: string) => fetch(`${origin}${path}`, { headers: { "User-Agent": "Googlebot" }, signal: AbortSignal.timeout(30000) });

for (const path of routes) {
  const response = await fetchPage(path);
  const html = await response.text();
  assert(response.ok, `${path}: HTTP ${response.status}`);
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  assert(title, `${path}: missing title`);
  assert((html.match(/<h1\b/g) ?? []).length === 1, `${path}: expected one H1`);
  const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
  assert(canonical === `${SITE_URL}${path === "/" ? "" : path}`, `${path}: unexpected canonical ${canonical}`);
  assert(/<meta\b[^>]*name="description"[^>]*content="[^"]+"/.test(html), `${path}: missing description`);
  assert(!/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html), `${path}: unexpectedly noindex`);
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert(schemas.some((schema) => schema["@graph"]?.some((node: Record<string, unknown>) => node["@type"] === "ProfessionalService")), `${path}: missing local business schema`);
  const slug = path.split("/").at(-1) ?? "";
  if (path.startsWith("/services/")) {
    assert(Boolean(localServices[slug]), `${path}: missing local content`);
    assert(html.includes(`/contact?service=${slug}`), `${path}: missing service-specific enquiry link`);
    assert(schemas.some((schema) => schema["@type"] === "Service"), `${path}: missing service schema`);
  }
  console.log(`${response.status} ${path}: ${title}`);
}

const sitemap = await (await fetchPage("/sitemap.xml")).text();
assert(sitemap.includes(`${SITE_URL}${regionalPath}`), "sitemap: missing Tamil Nadu page");
assert(!sitemap.includes("/preview/"), "sitemap: includes personal previews");
for (const service of serviceList) assert(sitemap.includes(`${SITE_URL}/services/${service.slug}`), `sitemap: missing ${service.slug}`);
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert(new Set(locations).size === locations.length, "sitemap: duplicate URLs");
const homeEntry = sitemap.match(/<url>\s*<loc>https:\/\/www\.mecatronix\.one<\/loc>([\s\S]*?)<\/url>/)?.[1] ?? "";
assert(!homeEntry.includes("<lastmod>"), "sitemap: homepage has an unsupported modification date");
const robots = await (await fetchPage("/robots.txt")).text();
assert(robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`), "robots: missing sitemap declaration");
console.log(`Sitemap: ${locations.length} distinct URLs; robots.txt checked.`);
if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else console.log("SEO HTTP checks passed.");
