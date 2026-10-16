import { serviceList as services } from "./service-list";

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services", children: services.map((s) => ({ href: `/services/${s.slug}`, label: s.navLabel, summary: s.summary })) },
  { href: "/work", label: "Work" },
  { href: "/industries", label: "Industries" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export const footerNav = {
  services: services.map((s) => ({ href: `/services/${s.slug}`, label: s.navLabel })),
  company: [
    { href: "/about", label: "About" },
    { href: "/process", label: "Our Process" },
    { href: "/industries", label: "Industries" },
    { href: "/insights", label: "Insights" },
    { href: "/contact", label: "Contact" },
  ],
};
