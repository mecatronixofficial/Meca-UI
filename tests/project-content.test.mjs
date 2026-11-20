import { describe, expect, test } from "bun:test";
import { mergeProjectContent } from "../src/lib/project-content.ts";

const screenshot = "https://media.example.com/work/screenshot.jpg";
const work = (overrides = {}) => ({
  id: "work-1", title: "MK", is_active: true, project_id: null,
  info: [{ heading: "New work", details: "Project walkthrough", img: screenshot }],
  ...overrides,
});
const project = (overrides = {}) => ({
  id: "project-1", project_name: "Client website", project_image: "",
  short_description: "A client website", project_url: "", is_active: true,
  ...overrides,
});
const curated = {
  slug: "client-website", client: "Client website", industry: "Retail", industryKey: "retail",
  services: [], summary: "Website", overview: "Website", scope: [],
  images: [{ src: "https://media.example.com/old.jpg", alt: "Old", width: 1600, height: 1000 }],
  cover: { kind: "site", from: "#fff", to: "#eee", ink: "#000" },
};

describe("admin Work screenshots in the public portfolio", () => {
  test("a published standalone Work appears even with no API Projects", () => {
    const result = mergeProjectContent([], [], [work()]);
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("mk");
    expect(result[0].images[0].src).toBe(screenshot);
    expect(result[0].sections[0].details).toBe("Project walkthrough");
  });

  test("standalone Works survive an unavailable Projects endpoint", () => {
    expect(mergeProjectContent([curated], null, [work()]).map((entry) => entry.slug))
      .toEqual(["mk", "client-website"]);
  });

  test.each([
    ["Project.work_id", { work_id: "work-1" }, {}],
    ["Work.project_id", {}, { project_id: "project-1" }],
    ["Work.project.id", {}, { project: { id: "project-1" } }],
  ])("resolves %s without duplicating the Work", (_, projectFields, workFields) => {
    const result = mergeProjectContent([], [project(projectFields)], [work(workFields)]);
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("client-website");
    expect(result[0].images[0].src).toBe(screenshot);
  });

  test("inactive Works and Works belonging to inactive Projects stay hidden", () => {
    expect(mergeProjectContent([], [], [work({ is_active: false })])).toEqual([]);
    expect(mergeProjectContent([], [project({ is_active: false })], [work({ project_id: "project-1" })])).toEqual([]);
  });

  test("screenshots uploaded to a curated project's Work replace its old cover", () => {
    const result = mergeProjectContent([curated], [project()], [work({ project_id: "project-1" })]);
    expect(result[0].images[0].src).toBe(screenshot);
    expect(curated.images[0].src).toBe("https://media.example.com/old.jpg");
  });

  test("a standalone Work matching a curated project enriches it without a duplicate", () => {
    const result = mergeProjectContent([curated], [], [work({ title: "Client website" })]);
    expect(result).toHaveLength(1);
    expect(result[0].images[0].src).toBe(screenshot);
    expect(curated.images[0].src).toBe("https://media.example.com/old.jpg");
  });

  test("image-only sections still supply a cover", () => {
    const result = mergeProjectContent([], [], [work({ info: [{ heading: "", details: "", img: screenshot }] })]);
    expect(result[0].images[0].src).toBe(screenshot);
  });
});

describe("case-study edits from mec-admin", () => {
  test("linked work updates the overview and scope while retaining the project summary", () => {
    const sections = [
      { heading: "Overview", details: "Updated summary", img: screenshot },
      { heading: "Delivery", details: "Updated delivery details", img: screenshot },
    ];
    const result = mergeProjectContent([curated], [project()], [work({ project_id: "project-1", info: sections })]);
    expect(result[0].summary).toBe("A client website");
    expect(result[0].overview).toBe("Updated summary\n\nUpdated delivery details");
    expect(result[0].scope).toEqual(["Overview", "Delivery"]);
    expect(curated.summary).toBe("Website");
  });

  test("a new case study can manage an existing website project without a backend Project", () => {
    const result = mergeProjectContent([curated], [], [work({ title: "Client website" })]);
    expect(result[0].summary).toBe("Project walkthrough");
    expect(result[0].overview).toBe("Project walkthrough");
    expect(result[0].scope).toEqual(["New work"]);
  });

  test("saved sections replace fallback sections so removed details stay removed", () => {
    const old = { ...curated, sections: [{ heading: "Old section", details: "Outdated", img: screenshot }] };
    const result = mergeProjectContent([old], [], [work({ title: "Client website" })]);
    expect(result[0].sections.map((section) => section.heading)).toEqual(["New work"]);
    expect(old.sections[0].heading).toBe("Old section");
  });

  test("project description edits apply when there is no case study", () => {
    const result = mergeProjectContent([curated], [project({ short_description: "Revised description" })], []);
    expect(result[0].summary).toBe("Revised description");
    expect(result[0].overview).toBe("Revised description");
  });
});
