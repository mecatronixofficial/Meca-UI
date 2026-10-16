export type IndustryIcon =
  | "textiles"
  | "manufacturing"
  | "retail"
  | "ecommerce"
  | "education"
  | "logistics"
  | "services"
  | "startups";

export interface Industry {
  slug: string;
  name: string;
  icon: IndustryIcon;
  /** One-line use case */
  useCase: string;
  intro: string;
  workflows: string[];
  solutions: string[];
  /** Service slugs */
  services: string[];
}

export const industries: Industry[] = [
  {
    slug: "textiles",
    name: "Textile Manufacturing & Export",
    icon: "textiles",
    useCase: "Yarn-to-dispatch tracking, buyer-facing catalogues, export enquiries and order management.",
    intro:
      "Textile businesses run on detail — counts, GSM, colours, lots and deadlines. We build websites that present your range to domestic and international buyers, and systems that keep production and orders in step.",
    workflows: ["Yarn and fabric stock by lot", "Production stages and job work", "Sampling and buyer approvals", "Export documentation and dispatch"],
    solutions: ["Export and B2B catalogue websites", "Textile ERP and production tracking", "Wholesale ordering portals", "Inventory and lot management"],
    services: ["web-development", "erp-development", "ecommerce-development"],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing & Engineering",
    icon: "manufacturing",
    useCase: "Production tracking, inventory control, operational dashboards and reporting systems.",
    intro:
      "For manufacturers and engineering firms, visibility is everything. We connect purchase, stores, production and dispatch so owners can see the real state of the factory without chasing updates.",
    workflows: ["Job cards and work orders", "Raw material and finished goods stock", "Quality checks and rework", "Dispatch planning and invoicing"],
    solutions: ["Production and job tracking systems", "Inventory and stores management", "Operational dashboards", "Product and machinery websites"],
    services: ["erp-development", "custom-software", "web-development"],
  },
  {
    slug: "retail",
    name: "Retail",
    icon: "retail",
    useCase: "Billing, product management, stock across outlets and customer order platforms.",
    intro:
      "Retailers need speed at the counter and accuracy in the back office. We build billing, stock and customer systems that keep multiple outlets and channels consistent.",
    workflows: ["Point-of-sale billing", "Stock across outlets", "Supplier purchases", "Customer loyalty and repeat orders"],
    solutions: ["Billing and inventory systems", "Multi-outlet stock management", "Customer ordering apps", "Reporting dashboards"],
    services: ["custom-software", "mobile-app-development", "erp-development"],
  },
  {
    slug: "ecommerce",
    name: "E-commerce & D2C Brands",
    icon: "ecommerce",
    useCase: "Online stores, secure checkout, catalogue management and fulfilment workflows.",
    intro:
      "Selling direct means owning the whole experience. We build storefronts that convert and back-office workflows that make order volume manageable.",
    workflows: ["Catalogue and variants", "Checkout and payments", "Order fulfilment and returns", "Customer communication"],
    solutions: ["Custom and headless storefronts", "B2B and wholesale ordering", "Order and shipping integrations", "Product SEO and feeds"],
    services: ["ecommerce-development", "web-development", "ai-automation"],
  },
  {
    slug: "education",
    name: "Education",
    icon: "education",
    useCase: "School websites, admissions workflows and management systems.",
    intro:
      "Schools and training institutes need to communicate clearly with parents and students while keeping administration simple. We build websites and management systems designed for non-technical staff.",
    workflows: ["Admissions enquiries", "Student and class records", "Fees and receipts", "Parent communication"],
    solutions: ["School and institute websites", "Admissions and enquiry management", "School management systems", "Parent and student apps"],
    services: ["web-development", "custom-software", "mobile-app-development"],
  },
  {
    slug: "logistics",
    name: "Logistics & Distribution",
    icon: "logistics",
    useCase: "Order tracking, delivery management, warehouse stock and dealer portals.",
    intro:
      "Distribution businesses live between orders and deliveries. We build systems that track goods from warehouse to customer and keep dealers and drivers informed.",
    workflows: ["Dealer and distributor orders", "Warehouse stock movement", "Delivery scheduling", "Proof of delivery and collections"],
    solutions: ["Dealer ordering portals", "Delivery and driver apps", "Warehouse management", "Route and status dashboards"],
    services: ["custom-software", "mobile-app-development", "erp-development"],
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    icon: "services",
    useCase: "Client portals, appointment and case management, and practice websites.",
    intro:
      "Consultancies, clinics, firms and agencies sell expertise. We build websites that communicate credibility and tools that keep client work organised.",
    workflows: ["Lead and enquiry handling", "Appointments and scheduling", "Client documents and status", "Billing and follow-up"],
    solutions: ["Practice and firm websites", "Client portals", "Case and project management tools", "Automated follow-ups and reporting"],
    services: ["web-development", "custom-software", "ai-automation"],
  },
  {
    slug: "startups",
    name: "Startups & Growing Businesses",
    icon: "startups",
    useCase: "MVPs, product platforms and the systems that support early growth.",
    intro:
      "Early-stage teams need to learn quickly without building something they'll have to throw away. We help scope a focused first version and build it on foundations that can scale.",
    workflows: ["Validating a product idea", "Launching an MVP", "Onboarding first customers", "Scaling operations"],
    solutions: ["MVP web and mobile apps", "SaaS platforms", "Admin and operations tooling", "Analytics and product instrumentation"],
    services: ["custom-software", "mobile-app-development", "web-development"],
  },
];

/** Homepage groups (six tiles) linking into /industries */
export const industryHighlights = [
  { title: "Manufacturing & Textiles", anchor: "textiles", icon: "manufacturing", text: "Production tracking, inventory control, operational dashboards and reporting systems." },
  { title: "Retail & E-commerce", anchor: "retail", icon: "retail", text: "Billing, product management, e-commerce and customer order platforms." },
  { title: "Education", anchor: "education", icon: "education", text: "School websites, admissions workflows and management systems." },
  { title: "Logistics & Distribution", anchor: "logistics", icon: "logistics", text: "Dealer ordering, delivery tracking and warehouse stock visibility." },
  { title: "Professional Services", anchor: "professional-services", icon: "services", text: "Credible practice websites, client portals and automated follow-ups." },
  { title: "Startups & Growing Businesses", anchor: "startups", icon: "startups", text: "Focused MVPs and platforms built on foundations that can scale." },
] as const satisfies readonly { title: string; anchor: string; icon: IndustryIcon; text: string }[];
