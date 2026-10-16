import mecatronixConfig from "../config/envConfig";

/**
 * Company facts used across the UI. Everything here comes from
 * src/config/envConfig.ts (env vars with real-world defaults), so contact
 * details are edited in one place.
 */

const { contact, location, social, business } = mecatronixConfig;

const digits = (phone: string) => phone.replace(/[^\d]/g, "");

/** "+918300454800" -> "+91 83004 54800" */
function formatIndianPhone(phone: string) {
  const d = digits(phone);
  if (d.length === 12 && d.startsWith("91")) return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  return phone;
}

export const site = {
  name: "Mecatronix",
  legalName: "Mecatronix Software Development",
  tagline: "Software engineering studio · Coimbatore",
  email: contact.companyEmail,
  supportEmail: contact.supportEmail,
  phone: contact.primaryPhone,
  phoneDisplay: formatIndianPhone(contact.primaryPhone),
  whatsapp: digits(contact.whatsappNumber),
  address: {
    full: location.fullAddress,
    street: location.address,
    city: location.city,
    state: location.state,
    country: location.country,
    pincode: location.pincode,
    mapsUrl: location.googleMapsLink,
  },
  hours: `${business.days}, ${business.hoursStart}–${business.hoursEnd} IST`,
  businessHours: { days: business.days, start: business.hoursStart, end: business.hoursEnd },
  logo: "/assets/logos/Mec.webp",
} as const;

export type SocialKey = keyof typeof social;

/** Only the social profiles that are actually configured */
export const socialLinks = (
  [
    ["linkedin", "LinkedIn"],
    ["instagram", "Instagram"],
    ["facebook", "Facebook"],
    ["youtube", "YouTube"],
    ["github", "GitHub"],
    ["twitter", "X"],
  ] as const
)
  .map(([key, label]) => ({ key, label, href: social[key] }))
  .filter((s): s is { key: SocialKey; label: (typeof s)["label"]; href: string } => Boolean(s.href));

export function whatsappLink(message = "Hi Mecatronix, I'd like to discuss a project.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
