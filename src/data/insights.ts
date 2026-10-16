/**
 * Articles for /insights. Content is stored as simple blocks so it renders
 * as semantic HTML on the server with no CMS dependency.
 *
 * `published` is the real publication date (ISO). Use the date the article
 * actually goes live — never back-date.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "note"; text: string };

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  published: string;
  author: string;
  /** Related service slug for internal linking */
  service: string;
  body: Block[];
}

const AUTHOR = "Mecatronix Engineering Team";

export const articles: Article[] = [
  {
    slug: "custom-erp-software-business-operations",
    title: "How custom ERP software improves business operations",
    description:
      "What a custom ERP actually changes day to day for manufacturers and trading businesses — and how to start without a risky, all-at-once implementation.",
    category: "ERP & Operations",
    published: "2026-10-14",
    author: AUTHOR,
    service: "erp-development",
    body: [
      { type: "p", text: "Most growing businesses don't decide to need an ERP. They notice symptoms first: stock figures nobody fully trusts, invoices raised days after goods leave, production updates that arrive by phone call, and an owner who can only get a clear picture by asking three different people." },
      { type: "p", text: "An ERP — enterprise resource planning — system addresses those symptoms by connecting the stages of your operation in one place. A custom ERP does it around the way your business already works, rather than asking your team to adopt someone else's process." },
      { type: "h2", text: "What changes when operations are connected" },
      { type: "p", text: "The core benefit of an ERP is simple: information is entered once, at the point where it happens, and then flows to everyone who needs it. That single change has effects across the business." },
      { type: "h3", text: "Inventory you can rely on" },
      { type: "p", text: "When purchases, production consumption and dispatches all update stock automatically, inventory figures stop drifting away from reality. Teams spend less time on manual counts and reconciliation, and purchase decisions are based on actual levels rather than estimates." },
      { type: "h3", text: "Production you can see" },
      { type: "p", text: "Job cards and production stages recorded in the system give managers a live view of what is being made, where work is waiting and what will be ready for dispatch. Delays become visible early, while there is still time to act." },
      { type: "h3", text: "Faster billing and better cash flow" },
      { type: "p", text: "When a dispatch can generate an invoice directly from the sales order and delivery details, billing happens the same day instead of being batched at the end of the week. Outstanding payments are easier to track and follow up." },
      { type: "h3", text: "Reports without the spreadsheet marathon" },
      { type: "p", text: "Because the data is already structured, reports on sales, stock, production output and receivables can be generated on demand. Owners and managers see the numbers they need without waiting for someone to compile them." },
      { type: "h2", text: "Why custom instead of off-the-shelf?" },
      { type: "p", text: "Packaged ERP products work well for businesses whose processes match the software's assumptions. Many small and mid-sized manufacturers, especially in sectors like textiles, have specific ways of handling lots, job work, costing or approvals that generic software struggles with." },
      { type: "ul", items: [
        "A custom ERP includes only the modules and fields you actually use, which makes it easier for staff to adopt.",
        "Screens can use your terminology and follow your sequence of work.",
        "It can integrate with the tools you already rely on, such as your accounting software.",
        "You can extend it as the business changes, without waiting for a vendor's roadmap.",
      ] },
      { type: "p", text: "Custom is not automatically the right answer. If a well-supported product fits your process with little configuration, it may be the better choice. The decision should come from mapping your real workflow first." },
      { type: "h2", text: "Start with one module, not the whole system" },
      { type: "p", text: "The most common reason ERP projects struggle is trying to change everything at once. A phased approach reduces risk and gets value into the business sooner." },
      { type: "ol", items: [
        "Map the workflow. Walk through each department and document how work and information actually move, including the exceptions.",
        "Pick the biggest bottleneck. For many businesses this is inventory or production tracking.",
        "Build and pilot that module with the people who will use it every day, and refine it based on their feedback.",
        "Migrate master data carefully — items, customers, suppliers and opening balances — and validate it with your team.",
        "Extend into the next module once the first is part of daily routine.",
      ] },
      { type: "h2", text: "Signs your business is ready" },
      { type: "ul", items: [
        "The same data is typed into more than one spreadsheet or system.",
        "You can't answer 'how much stock do we have?' without someone checking.",
        "Invoicing lags behind dispatch.",
        "Decisions wait for reports to be prepared manually.",
        "New staff take a long time to learn informal processes.",
      ] },
      { type: "note", text: "If several of these sound familiar, a short discovery exercise is usually enough to tell whether a custom ERP, an existing product or a smaller targeted tool is the right next step." },
    ],
  },
  {
    slug: "nextjs-for-business-websites",
    title: "Why Next.js is a strong choice for modern business websites",
    description:
      "Speed, search visibility and room to grow: a practical look at what Next.js offers business websites, and when a simpler option is enough.",
    category: "Web Development",
    published: "2026-10-14",
    author: AUTHOR,
    service: "web-development",
    body: [
      { type: "p", text: "A business website has three jobs: be found, be trusted and make it easy to take the next step. The framework it's built on affects all three — through how fast pages load, how well search engines can read them and how easily the site can grow into something more." },
      { type: "p", text: "Next.js is a React framework that has become a common foundation for business websites and web applications. Here is what it offers in practical terms." },
      { type: "h2", text: "Pages that load quickly" },
      { type: "p", text: "Next.js can render pages on the server or at build time, so visitors receive ready-to-display HTML instead of waiting for JavaScript to assemble the page in their browser. Combined with automatic image optimisation, font optimisation and code splitting, this makes it practical to hit Google's Core Web Vitals targets." },
      { type: "p", text: "Speed matters most on mobile. Many visitors arrive on mid-range phones and variable connections, and a page that takes several seconds to become usable loses a meaningful share of them before they read a word." },
      { type: "h2", text: "Content search engines can read" },
      { type: "p", text: "Because pages are delivered as complete HTML, search engines can index the content reliably. Next.js also provides built-in support for the technical SEO details that are easy to get wrong:" },
      { type: "ul", items: [
        "Unique titles, descriptions and canonical URLs for every page.",
        "Automatically generated sitemaps and robots rules.",
        "Open Graph images for link previews on social platforms and messaging apps.",
        "Structured data (JSON-LD) that describes your business, services and articles.",
        "Permanent redirects that preserve rankings when URLs change.",
      ] },
      { type: "h2", text: "A website that can become an application" },
      { type: "p", text: "Many businesses start with a marketing site and later need more: a customer portal, product configurator, booking flow or dashboard. With Next.js these can be added to the same codebase, sharing design components and infrastructure, instead of being built as a separate system." },
      { type: "h2", text: "Flexible content management" },
      { type: "p", text: "Next.js doesn't dictate where content lives. Text and images can be stored in a headless CMS that your team edits through a friendly interface, in a database behind a custom admin panel, or directly in the codebase for sites that change rarely. The choice can be made based on how often you publish." },
      { type: "h2", text: "When something simpler is enough" },
      { type: "p", text: "Not every website needs a framework. A single landing page that rarely changes, or a blog run entirely by a marketing team, might be well served by a hosted website builder. The trade-offs to consider are control over performance and SEO, design flexibility, and whether the site will need to grow into an application." },
      { type: "h2", text: "What to ask your web development partner" },
      { type: "ol", items: [
        "How will pages be rendered, and what are the expected Core Web Vitals on mobile?",
        "How will my team update content?",
        "What happens to my existing URLs and rankings?",
        "Where will the site be hosted, and will the accounts be in my company's name?",
        "How easily can the site be extended later?",
      ] },
      { type: "note", text: "A good answer to these questions matters more than the framework name. Next.js is a strong default because it makes good answers easier to achieve." },
    ],
  },
  {
    slug: "choosing-technology-stack-business-application",
    title: "How to choose the right technology stack for a business application",
    description:
      "A non-technical guide to the decisions behind a business application's technology stack — and the questions that matter more than trends.",
    category: "Engineering",
    published: "2026-10-14",
    author: AUTHOR,
    service: "custom-software",
    body: [
      { type: "p", text: "When you commission a business application — an internal system, a customer portal, a mobile app — you'll hear about its 'stack': the languages, frameworks, databases and hosting it's built on. These choices are technical, but their consequences are business ones: cost, speed of delivery, reliability and how easy it will be to find people to maintain the software in future." },
      { type: "p", text: "You don't need to be an engineer to ask the right questions. Here is a practical way to think about it." },
      { type: "h2", text: "Start from the problem, not the technology" },
      { type: "p", text: "The right stack depends on what the application must do. Before any technology is discussed, it helps to be clear about:" },
      { type: "ul", items: [
        "Who will use it — customers, staff, partners — and on which devices.",
        "How many users and how much data you expect in the next few years.",
        "Which existing systems it must connect to.",
        "Whether it must work offline or in low-connectivity environments.",
        "Any regulatory, data-location or security requirements.",
      ] },
      { type: "h2", text: "The main layers of a stack" },
      { type: "h3", text: "Frontend: what users see" },
      { type: "p", text: "For web applications, React-based frameworks such as Next.js are a widely used, well-supported choice. For mobile, cross-platform tools such as React Native let one codebase serve both Android and iOS. Using the same language across web and mobile — typically TypeScript — reduces duplication." },
      { type: "h3", text: "Backend: the business logic" },
      { type: "p", text: "The backend enforces rules, processes data and connects to other systems. Node.js with a structured framework like NestJS is a common choice that shares TypeScript with the frontend. The most important qualities are clarity of structure and testability, not novelty." },
      { type: "h3", text: "Database: where data lives" },
      { type: "p", text: "Business data with relationships — customers, orders, invoices, stock — usually belongs in a relational database such as PostgreSQL, which protects consistency. Document databases such as MongoDB suit flexible or rapidly changing data structures. Many systems use one primary database and add others only for specific needs." },
      { type: "h3", text: "Hosting and deployment" },
      { type: "p", text: "Managed platforms reduce the operational work of running servers. What matters is reliability, backups, monitoring, and that accounts are owned by your company." },
      { type: "h2", text: "Five questions that matter more than trends" },
      { type: "ol", items: [
        "Is it mature and widely used? Popular, well-documented technologies are easier to maintain and hire for.",
        "Does it fit the team? A stack your developers know well will be built faster and with fewer mistakes.",
        "Is it appropriately simple? Fewer moving parts mean fewer things to break. Complexity should be justified by a real requirement.",
        "Can it integrate? Check that it works well with the payment, accounting, messaging or ERP systems you rely on.",
        "What is the long-term cost? Consider hosting, licences and maintenance over several years, not just the initial build.",
      ] },
      { type: "h2", text: "Red flags" },
      { type: "ul", items: [
        "A technology chosen mainly because it is new or fashionable.",
        "An architecture far more complex than the problem — for example, many separate services for a small internal tool.",
        "Proprietary platforms that make it difficult to move your data or code later.",
        "No clear plan for backups, monitoring and security updates.",
      ] },
      { type: "note", text: "The best stack is usually a boring one: proven technologies, combined simply, chosen to fit the problem and the people who will maintain it." },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

/** ~220 words per minute */
export function readingTime(article: Article) {
  const words = article.body
    .flatMap((b) => ("text" in b ? [b.text] : b.items))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}
