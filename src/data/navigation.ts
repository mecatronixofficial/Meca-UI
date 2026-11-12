import { serviceList as services } from "./service-list";

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services", children: services.map((s) => ({ href: `/services/${s.slug}`, label: s.navLabel, summary: s.summary })) },
  { href: "/work", label: "Our Work" },
  { href: "/industries", label: "Industries" },
  { href: "/about", label: "About" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];

export const footerNav = {
  services: services.map((s) => ({ href: `/services/${s.slug}`, label: s.navLabel })),
  company: [
    { href: "/about", label: "About" },
    { href: "/process", label: "Our Process" },
    { href: "/industries", label: "Industries" },
    { href: "/blogs", label: "Blogs" },
    { href: "/contact", label: "Contact" },
    // Opens the review dialog on any page (src/components/reviews/ReviewModal.tsx)
    { href: "#write-review", label: "Write a review" },
  ],
};
