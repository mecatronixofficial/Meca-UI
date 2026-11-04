import type { IndustryIcon } from "../../data/industries";

/** Short interface labels; business descriptions stay in the shared industry data. */
export const industryPresentation: Record<
  IndustryIcon,
  { label: string; group: string; steps: [string, string, string, string] }
> = {
  textiles: {
    label: "Textile",
    group: "operations",
    steps: ["Yarn & fabric", "Production", "Buyer approval", "Dispatch"],
  },
  manufacturing: {
    label: "Manufacturing",
    group: "operations",
    steps: ["Work order", "Materials", "Quality check", "Dispatch"],
  },
  retail: {
    label: "Retail",
    group: "commerce",
    steps: ["Products", "Billing", "Stock sync", "Repeat orders"],
  },
  ecommerce: {
    label: "E-commerce",
    group: "commerce",
    steps: ["Catalogue", "Checkout", "Fulfilment", "Customer care"],
  },
  education: {
    label: "Education",
    group: "people",
    steps: ["Enquiry", "Admission", "Student records", "Parent updates"],
  },
  logistics: {
    label: "Logistics",
    group: "operations",
    steps: ["Dealer order", "Warehouse", "Delivery", "Confirmation"],
  },
  services: {
    label: "Professional Services",
    group: "people",
    steps: ["Client enquiry", "Scheduling", "Project work", "Follow-up"],
  },
  startups: {
    label: "Startups",
    group: "people",
    steps: ["Validate", "Build MVP", "Onboard", "Scale"],
  },
};

export const industryFilters = [
  { key: "all", label: "All industries" },
  { key: "operations", label: "Make & move" },
  { key: "commerce", label: "Sell & connect" },
  { key: "people", label: "People & growth" },
] as const;
