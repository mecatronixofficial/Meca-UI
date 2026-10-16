import { serviceList, type ServiceBasics } from "./service-list";

/**
 * Full service content for /services and /services/[slug] (server-side).
 * Names, nav labels, summaries and benefits come from ./service-list.ts.
 */

export type ServiceVisual = "site" | "software" | "phone" | "store" | "erp" | "automation";

export interface Service extends ServiceBasics {
  visual: ServiceVisual;
  seo: { title: string; description: string; keywords: string[] };
  hero: { eyebrow: string; headline: string; intro: string };
  overview: string[];
  challenges: { title: string; text: string }[];
  deliverables: string[];
  capabilities: { title: string; text: string }[];
  technology: { title: string; text: string }[];
  process: { title: string; text: string }[];
  /** Industries (slugs from src/data/industries.ts) this service is commonly used in */
  industries: string[];
  faqs: { q: string; a: string }[];
}

const details: Omit<Service, Exclude<keyof ServiceBasics, "slug">>[] = [
  {
    slug: "web-development",
    visual: "site",
    seo: {
      title: "Website Development Company in Coimbatore",
      description:
        "Mecatronix designs and builds fast, SEO-ready business websites and web applications in Coimbatore — corporate sites, dynamic platforms and custom web apps on Next.js.",
      keywords: [
        "website development company in Coimbatore",
        "web development Coimbatore",
        "business website design Tamil Nadu",
        "Next.js development company India",
      ],
    },
    hero: {
      eyebrow: "Web development",
      headline: "Websites engineered to be found, trusted and used.",
      intro:
        "From a focused company website to a full web platform, we design and build sites that load quickly, read clearly on every screen and give your team an easy way to keep content current.",
    },
    overview: [
      "For most businesses the website is the first conversation with a customer. It needs to explain what you offer in seconds, look credible next to larger competitors and make it effortless to get in touch.",
      "We treat a website as a product, not a brochure. That means structured content, a clear information architecture, server-rendered pages that search engines can read, and performance budgets that keep it fast on an average mobile connection.",
      "When a site needs to do more — customer portals, catalogues, booking, dashboards — we extend it into a web application on the same foundation, so you are not rebuilding from scratch as you grow.",
    ],
    challenges: [
      { title: "An outdated site that undersells you", text: "Design and copy that no longer reflect the quality of your products or services, and quietly cost you trust." },
      { title: "Slow pages on mobile", text: "Heavy templates and unoptimised images that make visitors leave before the page finishes loading." },
      { title: "Invisible in search", text: "Pages that are hard for Google to understand — missing metadata, weak structure and no local relevance." },
      { title: "Content locked with a developer", text: "Every small text or image change requires a support ticket instead of a two-minute edit." },
    ],
    deliverables: [
      "Sitemap and content structure",
      "Responsive UI design for key templates",
      "Production website on Next.js",
      "Enquiry forms connected to email or CRM",
      "On-page SEO: metadata, sitemap, structured data",
      "Analytics and Search Console setup",
      "Optional content management for your team",
      "Deployment, domain and SSL configuration",
    ],
    capabilities: [
      { title: "Corporate & brand websites", text: "Clear, editorial websites that present your company, products and credentials with confidence." },
      { title: "Dynamic platforms", text: "Catalogues, listings, resource libraries and multi-language content driven by a database or CMS." },
      { title: "Web applications", text: "Logged-in portals, booking flows, quoting tools and internal dashboards built as fast single codebases." },
      { title: "Performance engineering", text: "Image optimisation, server rendering and lean JavaScript tuned against Core Web Vitals." },
      { title: "Technical SEO", text: "Semantic markup, canonical URLs, structured data and redirect plans that protect existing rankings." },
      { title: "Accessibility", text: "Keyboard support, visible focus, contrast and form labelling aligned with WCAG 2.2 AA." },
    ],
    technology: [
      { title: "Next.js & React", text: "Server-rendered pages for SEO and speed, with interactive components only where they add value." },
      { title: "Headless content", text: "Content can live in a headless CMS or a simple admin panel, depending on how often your team publishes." },
      { title: "Edge hosting", text: "Deployment on platforms such as Vercel or Cloudflare puts pages close to visitors across India and abroad." },
    ],
    process: [
      { title: "Content & structure", text: "We map what visitors need to find and agree the page structure before design starts." },
      { title: "Design direction", text: "Key templates are designed and reviewed with you, desktop and mobile side by side." },
      { title: "Build & integrate", text: "Pages, forms and any CMS are built, connected and populated with your content." },
      { title: "Launch & measure", text: "We set up redirects, analytics and Search Console, then launch and monitor." },
    ],
    industries: ["manufacturing", "textiles", "education", "professional-services", "startups"],
    faqs: [
      { q: "How long does a business website take?", a: "A focused company website typically takes a few weeks from approved content to launch. Larger platforms with custom features are scoped and scheduled individually — we share a timeline before work begins." },
      { q: "Will I be able to update the website myself?", a: "Yes, if you need to. We can add a content management system so your team can edit text, images, products or articles without touching code." },
      { q: "Do you help with SEO?", a: "Every site we build includes technical SEO foundations: semantic HTML, metadata, a sitemap, structured data and fast loading. We can also advise on content and local search for Coimbatore and Tamil Nadu." },
      { q: "Can you redesign our existing website without losing rankings?", a: "Yes. We audit existing URLs and set up permanent redirects so search engines and backlinks carry over to the new pages." },
      { q: "Do you provide hosting?", a: "We deploy to reliable managed hosting platforms and can set up the domain and hosting accounts in your company's name." },
    ],
  },
  {
    slug: "custom-software",
    visual: "software",
    seo: {
      title: "Custom Software Development Company in Tamil Nadu",
      description:
        "Custom software development in Coimbatore and Tamil Nadu: internal tools, workflow systems, portals and integrations designed around how your business operates.",
      keywords: [
        "custom software development company in Tamil Nadu",
        "custom software Coimbatore",
        "business software development India",
        "workflow software development",
      ],
    },
    hero: {
      eyebrow: "Custom software",
      headline: "Software shaped around your business, not the other way round.",
      intro:
        "When spreadsheets, paper registers and disconnected apps start slowing you down, we design and build focused systems that capture your process, remove repeated work and give you a reliable view of operations.",
    },
    overview: [
      "Off-the-shelf software is built for the average company. When your process has steps, approvals or calculations that make you different, generic tools force workarounds — and workarounds become errors.",
      "Custom software starts with understanding the work itself: who does what, what information moves between people and where time is lost. We then design the smallest system that removes those friction points, and grow it in phases.",
      "You get software your team recognises as their own process, with clean data underneath it that can feed reports, integrations and future automation.",
    ],
    challenges: [
      { title: "Work trapped in spreadsheets", text: "Critical data spread across files and inboxes, with no single version of the truth." },
      { title: "Manual, repeated steps", text: "The same information typed into several places, creating delays and mistakes." },
      { title: "Tools that don't talk", text: "Accounting, sales and operations software that can't share data without exports." },
      { title: "No visibility", text: "Owners and managers who can't see status, bottlenecks or performance without asking around." },
    ],
    deliverables: [
      "Process and requirements documentation",
      "System architecture and data model",
      "Clickable UI prototype",
      "Web application with role-based access",
      "Admin and reporting screens",
      "Integrations with existing tools (APIs)",
      "Test coverage for critical workflows",
      "Deployment, handover and user guidance",
    ],
    capabilities: [
      { title: "Internal tools", text: "Purpose-built dashboards and back-office tools that replace spreadsheets and paper forms." },
      { title: "Customer & partner portals", text: "Secure portals where customers, dealers or suppliers can see orders, documents and status." },
      { title: "Workflow & approvals", text: "Multi-step processes with roles, notifications, audit trails and clear ownership." },
      { title: "Integrations", text: "Connecting your system to payment gateways, accounting, messaging and third-party APIs." },
      { title: "Data & reporting", text: "Structured data models with reports and exports your team will actually use." },
      { title: "Modernisation", text: "Rebuilding ageing desktop or legacy software as maintainable web applications." },
    ],
    technology: [
      { title: "TypeScript end to end", text: "One typed language across frontend and backend reduces errors and keeps the codebase approachable." },
      { title: "Node.js & NestJS", text: "Structured, testable backend services and REST APIs that other systems can integrate with." },
      { title: "Relational data first", text: "PostgreSQL for business data that needs integrity; document databases where flexibility matters more." },
    ],
    process: [
      { title: "Process discovery", text: "We sit with the people who do the work and map the real process, including the exceptions." },
      { title: "Prototype", text: "A clickable prototype lets your team test the workflow before any code is written." },
      { title: "Phased build", text: "We release the most valuable module first, then add to it in regular, reviewable increments." },
      { title: "Rollout & support", text: "Data migration, training and an agreed support period help your team adopt the new system." },
    ],
    industries: ["manufacturing", "textiles", "logistics", "professional-services", "startups"],
    faqs: [
      { q: "Is custom software expensive compared to ready-made tools?", a: "It can cost more up front, but it is scoped to what you actually need. We usually start with a focused first version that addresses the biggest bottleneck, so you see value before investing further." },
      { q: "Who owns the source code?", a: "Ownership of the source code and data is agreed in writing before the project starts, so there are no surprises later." },
      { q: "Can you work with our existing software?", a: "Usually, yes. If your current tools offer APIs or data exports we can integrate with them rather than replace them." },
      { q: "What happens after launch?", a: "We agree a post-launch support period for fixes and adjustments, and can continue with enhancements in planned phases." },
      { q: "How do you keep the project on track?", a: "Work is split into milestones with regular demos, so you can see progress and give feedback throughout rather than only at the end." },
    ],
  },
  {
    slug: "mobile-app-development",
    visual: "phone",
    seo: {
      title: "Mobile App Development Company in Coimbatore",
      description:
        "Android and iOS app development in Coimbatore. Mecatronix builds cross-platform mobile apps with React Native for customers, field teams and business operations.",
      keywords: [
        "mobile app development company in Coimbatore",
        "android app development Coimbatore",
        "iOS app development India",
        "React Native development company",
      ],
    },
    hero: {
      eyebrow: "Mobile apps",
      headline: "Mobile apps people keep on their home screen.",
      intro:
        "We build Android and iOS apps from a single codebase — for customers who want to order, book or track, and for teams who need to capture work on the move.",
    },
    overview: [
      "A good app does a few things exceptionally well. We start by identifying the actions your users repeat most often and design the app around making those actions fast and obvious.",
      "Using React Native, one codebase ships to both Android and iOS, which keeps development and maintenance practical for growing businesses while still feeling native on each platform.",
      "Apps are rarely standalone: we build the backend, admin panel and integrations that sit behind them, so the whole system works together.",
    ],
    challenges: [
      { title: "Customers expect an app", text: "Repeat customers want to reorder, track and get updates without calling or messaging." },
      { title: "Field work on paper", text: "Site visits, deliveries and inspections recorded on paper and typed up later." },
      { title: "Two platforms, one budget", text: "Separate Android and iOS projects double the cost and the maintenance." },
      { title: "Low adoption", text: "Apps that are installed once and forgotten because they're slower than a phone call." },
    ],
    deliverables: [
      "User journeys and app flow",
      "Mobile UI design for Android and iOS",
      "Cross-platform app (React Native)",
      "Backend API and admin panel",
      "Push notifications and authentication",
      "Offline handling where needed",
      "Play Store and App Store submission",
      "Crash reporting and analytics",
    ],
    capabilities: [
      { title: "Customer apps", text: "Ordering, booking, loyalty and account apps that keep customers connected to your business." },
      { title: "Field & team apps", text: "Attendance, delivery, inspection and data-capture apps with photos, location and sync." },
      { title: "Companion apps", text: "Mobile access to an existing web platform or ERP for managers on the move." },
      { title: "Notifications", text: "Timely, relevant push and in-app messages tied to real events in your system." },
      { title: "Payments", text: "Integration with Indian and international payment gateways for in-app purchases and orders." },
      { title: "Store release", text: "App store listings, review guidelines and release management handled end to end." },
    ],
    technology: [
      { title: "React Native", text: "One TypeScript codebase for Android and iOS, sharing logic with your web platform where possible." },
      { title: "Shared backend", text: "The same API powers the app, the website and the admin panel, so data is always consistent." },
      { title: "Offline-aware", text: "For field use, apps can queue work offline and sync when the connection returns." },
    ],
    process: [
      { title: "Core journeys", text: "We define the three to five actions the app must make effortless." },
      { title: "Prototype on device", text: "You test the flow on a real phone before development starts." },
      { title: "Build & beta", text: "The app is built in sprints and shared with a small group of test users." },
      { title: "Store launch", text: "We prepare listings, submit to the stores and monitor the first releases." },
    ],
    industries: ["retail", "education", "logistics", "startups"],
    faqs: [
      { q: "Do you build native or cross-platform apps?", a: "We primarily use React Native, which produces genuinely native apps for Android and iOS from one codebase. If a project needs platform-specific native code, we plan for it." },
      { q: "Do I need a website as well as an app?", a: "Not always. Many businesses start with an app and an admin panel. If you also need a website, both can share the same backend." },
      { q: "Will you publish the app to the stores?", a: "Yes. We prepare the store listings and handle submission. The developer accounts should be in your company's name." },
      { q: "Can the app work without internet?", a: "Where it matters — for example for field teams — we design offline support so work is saved locally and synced later." },
      { q: "How are updates handled after launch?", a: "Bug fixes and small changes are covered during the agreed support period. New features are planned as follow-on releases." },
    ],
  },
  {
    slug: "ecommerce-development",
    visual: "store",
    seo: {
      title: "E-commerce Website Development Company in Coimbatore",
      description:
        "E-commerce website development for retailers, textile brands and manufacturers: product catalogues, secure checkout, payment gateways and order management.",
      keywords: [
        "ecommerce website development",
        "ecommerce website development Coimbatore",
        "online store development India",
        "B2B ecommerce development",
      ],
    },
    hero: {
      eyebrow: "E-commerce",
      headline: "Online stores built for the work behind every order.",
      intro:
        "We build e-commerce platforms that look premium to customers and stay practical for your team — from product data and pricing to payments, invoices and dispatch.",
    },
    overview: [
      "Selling online is mostly operations. The storefront matters, but so does how products are added, how stock is tracked, how orders reach the warehouse and how customers are kept informed.",
      "We design the full flow: catalogue structure, product pages that answer real buying questions, a fast and trustworthy checkout, and an admin that matches your fulfilment process.",
      "For manufacturers and wholesalers, we also build B2B ordering — customer-specific pricing, bulk orders, enquiries for quotes and repeat ordering.",
    ],
    challenges: [
      { title: "Orders over WhatsApp and phone", text: "Manual order taking that doesn't scale and makes tracking difficult." },
      { title: "Messy product data", text: "Variants, sizes, colours and prices maintained in several places." },
      { title: "Abandoned checkouts", text: "Slow pages and complicated checkout steps that lose sales at the last moment." },
      { title: "Disconnected fulfilment", text: "No link between the store, stock levels, invoicing and dispatch." },
    ],
    deliverables: [
      "Catalogue and category structure",
      "Storefront UI design",
      "Product, variant and inventory management",
      "Cart, checkout and payment gateway integration",
      "Order, invoice and shipping workflow",
      "Customer accounts and order history",
      "E-commerce SEO and product structured data",
      "Admin training and launch support",
    ],
    capabilities: [
      { title: "D2C storefronts", text: "Brand-led online stores with fast product discovery and a frictionless checkout." },
      { title: "B2B ordering", text: "Wholesale portals with customer pricing, minimum quantities and quote requests." },
      { title: "Catalogue management", text: "Variants, bulk updates, image handling and import from spreadsheets." },
      { title: "Payments & tax", text: "Payment gateway integration, GST-ready invoices and refunds handled cleanly." },
      { title: "Shipping & tracking", text: "Courier integrations, shipping rules and order status updates for customers." },
      { title: "Growth foundations", text: "Analytics, product feeds and SEO so the store can be marketed effectively." },
    ],
    technology: [
      { title: "Headless or platform", text: "We recommend a headless custom build or an established commerce platform depending on catalogue size and workflow complexity." },
      { title: "Fast product pages", text: "Server-rendered, image-optimised product pages that load quickly and index well." },
      { title: "Secure by design", text: "Payments are handled by certified gateways; card details never touch your servers." },
    ],
    process: [
      { title: "Catalogue & flow", text: "We organise your products and map the order journey from cart to dispatch." },
      { title: "Storefront design", text: "Category, product, cart and checkout templates are designed and reviewed." },
      { title: "Build & integrate", text: "Store, admin, payments and shipping are built and tested with real orders." },
      { title: "Launch & optimise", text: "We launch, watch the funnel and refine based on how customers actually buy." },
    ],
    industries: ["retail", "textiles", "manufacturing", "startups"],
    faqs: [
      { q: "Which payment gateways can you integrate?", a: "We can integrate the major Indian payment gateways, and international options where you sell abroad. The final choice depends on your business and fees." },
      { q: "Can I manage products and orders myself?", a: "Yes. Every store includes an admin for products, stock, orders and customers, designed around your workflow." },
      { q: "Do you build B2B or wholesale stores?", a: "Yes — including customer-specific pricing, bulk ordering and request-for-quote flows, which are common for textile and manufacturing businesses." },
      { q: "Should I use a platform or a custom build?", a: "It depends on your catalogue, workflow and budget. We'll recommend the simplest option that fits, and explain the trade-offs honestly." },
      { q: "Is the store optimised for Google?", a: "Yes. Product pages include structured data, clean URLs and fast loading, which help both search and shopping listings." },
    ],
  },
  {
    slug: "erp-development",
    visual: "erp",
    seo: {
      title: "ERP Software Development for Manufacturers & SMEs",
      description:
        "Custom ERP software development in Coimbatore for manufacturing, textile and trading businesses — inventory, production, billing, sales and reporting in one system.",
      keywords: [
        "ERP software development",
        "custom ERP Coimbatore",
        "manufacturing software development",
        "textile ERP software",
        "inventory management software development",
      ],
    },
    hero: {
      eyebrow: "ERP & management systems",
      headline: "One system for the whole operation.",
      intro:
        "We build custom ERP and business management systems for manufacturers, textile units and trading companies — covering the modules you need, in the language your team already uses.",
    },
    overview: [
      "Large ERP suites promise everything and often deliver complexity: long implementations, features nobody uses and processes that don't match the shop floor.",
      "A custom ERP starts with your real workflow — purchase, stock, production, quality, billing, dispatch — and connects those stages so information is entered once and flows through.",
      "We build modularly. Start with the area causing the most pain, such as inventory or production tracking, then extend into sales, accounts and reporting as the team adopts the system.",
    ],
    challenges: [
      { title: "Stock you can't trust", text: "Physical stock and recorded stock that never quite match." },
      { title: "Production in the dark", text: "No live view of what's being produced, where jobs are stuck or what's ready for dispatch." },
      { title: "Billing delays", text: "Invoices prepared manually from delivery notes, days after goods leave." },
      { title: "Reports by request", text: "Owners waiting for someone to compile spreadsheets before they can make decisions." },
    ],
    deliverables: [
      "Workflow mapping across departments",
      "Module plan and phased roadmap",
      "Inventory and warehouse management",
      "Production planning and job tracking",
      "Sales orders, billing and GST invoices",
      "Purchase and supplier management",
      "Role-based dashboards and reports",
      "Data migration and staff onboarding",
    ],
    capabilities: [
      { title: "Inventory control", text: "Raw material, work-in-progress and finished goods tracked by location, lot or batch." },
      { title: "Production tracking", text: "Job cards, stages, machine or line allocation and output recording." },
      { title: "Sales & billing", text: "Quotations, orders, invoices and payment follow-up connected end to end." },
      { title: "Purchase", text: "Requisitions, purchase orders and supplier records tied to stock levels." },
      { title: "Dashboards", text: "Live operational KPIs for owners and managers, on desktop and mobile." },
      { title: "Integrations", text: "Connections to accounting software, e-commerce, barcode scanners and messaging." },
    ],
    technology: [
      { title: "Modular architecture", text: "Each module is a clean part of one system, so new areas can be added without rework." },
      { title: "PostgreSQL", text: "A relational database keeps transactional data consistent and auditable." },
      { title: "Web + mobile access", text: "Browser-based for the office, with mobile views or apps for the floor and the field." },
    ],
    process: [
      { title: "Operations walkthrough", text: "We walk through each department and document how work and data actually move." },
      { title: "Module roadmap", text: "Together we prioritise modules by impact and plan phased releases." },
      { title: "Build, pilot, refine", text: "Each module is piloted with real users and refined before the next begins." },
      { title: "Migrate & support", text: "Opening balances and master data are migrated, staff are onboarded and support continues." },
    ],
    industries: ["textiles", "manufacturing", "logistics", "retail"],
    faqs: [
      { q: "Why custom ERP instead of an off-the-shelf product?", a: "Off-the-shelf ERP works well for standard processes. If your production, costing or approval steps are specific to your business, a custom system can be simpler to use and cheaper to run over time." },
      { q: "Can we start with only one module?", a: "Yes, and we usually recommend it. Starting with the module that solves the biggest problem gets the team using the system quickly." },
      { q: "Will it work with our accounting software?", a: "We can integrate with common accounting tools or export data in the formats your accountant needs." },
      { q: "Can workers use it on the shop floor?", a: "Yes. We design simplified screens for tablets and phones, with large controls and minimal typing." },
      { q: "How do you handle our existing data?", a: "We plan the migration of master data and opening balances as part of the rollout, and validate it with your team." },
    ],
  },
  {
    slug: "ai-automation",
    visual: "automation",
    seo: {
      title: "Business Automation & AI Integration Services",
      description:
        "Practical business automation and AI integration from Mecatronix in Coimbatore — document processing, smart assistants, workflow automation and reporting.",
      keywords: [
        "business automation solutions",
        "AI integration services India",
        "workflow automation Coimbatore",
        "AI chatbot development",
      ],
    },
    hero: {
      eyebrow: "AI & automation",
      headline: "Automation that removes work, not adds complexity.",
      intro:
        "We identify the repetitive steps in your operations and automate them — using straightforward rules where they're enough, and AI models where they genuinely make a difference.",
    },
    overview: [
      "Most automation value comes from simple things done reliably: data that moves between systems without retyping, reminders that go out on time, reports that build themselves.",
      "AI adds new possibilities — reading documents, drafting responses, answering questions from your own knowledge base, classifying requests. We apply it carefully, with human review where accuracy matters.",
      "Every automation is designed to be measurable. Before building we agree what success looks like, such as hours saved or turnaround time, so you can judge the result.",
    ],
    challenges: [
      { title: "Copy-paste operations", text: "Staff moving the same data between email, spreadsheets and software every day." },
      { title: "Slow responses", text: "Customer questions and enquiries waiting hours for an answer that already exists somewhere." },
      { title: "Documents to process", text: "Invoices, purchase orders and forms read and typed in manually." },
      { title: "AI uncertainty", text: "Interest in AI, but no clear view of where it is useful or safe for the business." },
    ],
    deliverables: [
      "Automation opportunity assessment",
      "Workflow automation between your systems",
      "AI assistant trained on your content",
      "Document data extraction pipelines",
      "Scheduled reports and alerts",
      "Human-in-the-loop review screens",
      "Usage monitoring and cost controls",
      "Documentation and handover",
    ],
    capabilities: [
      { title: "Workflow automation", text: "Triggers, integrations and scheduled jobs that keep data moving between your tools." },
      { title: "AI assistants", text: "Website and internal assistants that answer from your own documents and policies." },
      { title: "Document processing", text: "Extracting structured data from invoices, orders and forms, with review for low-confidence cases." },
      { title: "Smart features", text: "Classification, summarisation, search and drafting built into your existing software." },
      { title: "Reporting automation", text: "Daily and weekly reports compiled and delivered automatically to the right people." },
      { title: "Responsible AI", text: "Data handling, access controls and review steps designed in from the start." },
    ],
    technology: [
      { title: "Right tool for the job", text: "Rules and integrations first; large language models only where they outperform simpler methods." },
      { title: "Your data stays scoped", text: "AI features are given access only to the data they need, with logging and limits." },
      { title: "Model-agnostic", text: "We integrate leading AI model APIs and keep the design flexible as the technology evolves." },
    ],
    process: [
      { title: "Find the hours", text: "We review workflows and identify where time is lost to repetitive tasks." },
      { title: "Prove it small", text: "A focused pilot tests the automation on real data with clear success measures." },
      { title: "Integrate", text: "Successful pilots are hardened and connected into your everyday systems." },
      { title: "Monitor", text: "Accuracy, usage and cost are monitored, and the automation is tuned over time." },
    ],
    industries: ["manufacturing", "professional-services", "retail", "logistics", "startups"],
    faqs: [
      { q: "Do we need AI, or just automation?", a: "Often simple automation solves most of the problem. We recommend AI only where it clearly adds value, and tell you when it doesn't." },
      { q: "Is our data safe when using AI?", a: "We design integrations so that only necessary data is sent, use providers with business data protections, and add access controls and logging." },
      { q: "Can you add an AI assistant to our website?", a: "Yes. Assistants can answer questions from your own content and hand over to your team for anything they can't answer reliably." },
      { q: "How do you measure results?", a: "Before building we agree measurable goals — such as processing time or manual steps removed — and track them after launch." },
      { q: "Can automation connect to our existing software?", a: "In most cases, yes, through APIs, webhooks, email or file-based integrations." },
    ],
  },
];

export const services: Service[] = details.map((d) => ({ ...serviceList.find((b) => b.slug === d.slug)!, ...d }));

export const getService = (slug: string) => services.find((s) => s.slug === slug);
