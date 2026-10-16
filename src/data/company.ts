/** Company-level content shared by the homepage, About and Process pages. */

export const capabilities = [
  { title: "Custom-Built Solutions", text: "Every system is designed around your workflow, not adapted from a template." },
  { title: "Business-Focused Engineering", text: "We start from the outcome you need and choose the technology to match." },
  { title: "Modern Technology", text: "Current, well-supported frameworks that keep software fast and maintainable." },
  { title: "Scalable Architecture", text: "Foundations that let you add users, modules and features without rebuilding." },
] as const;

export type PrincipleGlyph = "target" | "layers" | "cursor" | "code" | "chat" | "launch";

export const principles: { title: string; text: string; glyph: PrincipleGlyph }[] = [
  {
    title: "Business-first thinking",
    text: "We ask what the software should change for your business — time saved, errors removed, customers served — before we discuss features or frameworks.",
    glyph: "target",
  },
  {
    title: "Custom architecture",
    text: "Systems are structured around your data and processes, with clear boundaries between modules so they can grow without becoming fragile.",
    glyph: "layers",
  },
  {
    title: "Thoughtful user experiences",
    text: "Interfaces are designed for the people who will actually use them — whether that's a buyer on a phone or an operator on the factory floor.",
    glyph: "cursor",
  },
  {
    title: "Maintainable software",
    text: "Typed, reviewed, documented code in version control. Software that another engineer can understand and extend years from now.",
    glyph: "code",
  },
  {
    title: "Transparent communication",
    text: "Clear scope, regular demos and direct conversations with the engineers building your product. You always know where the project stands.",
    glyph: "chat",
  },
  {
    title: "Deployment & ongoing support",
    text: "We take software all the way to production, monitor it after launch and stay available for agreed support and future improvements.",
    glyph: "launch",
  },
];

export const techStack = [
  { category: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "NestJS", "REST APIs"] },
  { category: "Databases", items: ["PostgreSQL", "MongoDB"] },
  { category: "Mobile", items: ["React Native"] },
  { category: "Cloud & Deployment", items: ["Vercel", "Cloudflare", "Managed cloud hosting"] },
] as const;

/** How engagements are structured — shown on the homepage in place of testimonials until verified reviews exist */
export const engagementModels = [
  {
    title: "Defined-scope projects",
    text: "For websites and well-understood systems. Scope, milestones and deliverables are agreed up front, and progress is reviewed at each milestone.",
    points: ["Agreed scope and timeline", "Milestone reviews", "Launch and handover"],
  },
  {
    title: "Phased product builds",
    text: "For ERP, custom software and apps. We release the most valuable module first, learn from real use, then plan the next phase together.",
    points: ["Prioritised roadmap", "Working software early", "Room to adapt"],
  },
  {
    title: "Ongoing improvement",
    text: "For live products that need to keep evolving. A steady cadence of enhancements, fixes and monitoring after launch.",
    points: ["Agreed monthly scope", "Monitoring and fixes", "Continuous enhancements"],
  },
] as const;
