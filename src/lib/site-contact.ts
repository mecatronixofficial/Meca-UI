import mecatronixConfig from "../config/envConfig";

/**
 * How to reach Mecatronix: emails, phones, addresses, hours and social profiles.
 * Managed in the admin panel (Contact details -> mec-api settings/contact) and
 * loaded per request by getSiteContact() (server) / useSiteContact() (client).
 * src/config/envConfig.ts provides the fallback when the API is unavailable.
 */

export type SocialKey = "linkedin" | "instagram" | "facebook" | "youtube" | "github" | "twitter";

const SOCIAL_LABELS: Record<SocialKey, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  github: "GitHub",
  twitter: "X",
};

export interface SiteAddress {
  label: string;
  full: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  mapsUrl: string;
  /** Map position, when known (admin panel, or the env fallback for the studio). */
  lat?: number;
  lng?: number;
  /** Google Maps directions to this address (exact position when known). */
  directionsUrl: string;
}

export interface SitePhone {
  label: string;
  display: string;
  /** For tel: links, e.g. "+918300454800". */
  tel: string;
  whatsapp: boolean;
}

export interface SiteContact {
  /** Primary email. */
  email: string;
  emails: { label: string; email: string }[];
  /** Primary phone for tel: links, and as displayed. */
  phone: string;
  phoneDisplay: string;
  phones: SitePhone[];
  /** Digits for wa.me links. */
  whatsapp: string;
  /** Primary (studio) address. */
  address: SiteAddress;
  addresses: SiteAddress[];
  businessHours: { days: string; start: string; end: string };
  /** e.g. "Mon-Sat, 10:00–19:00 IST". */
  hours: string;
  socialLinks: { key: SocialKey; label: string; href: string }[];
  /** Google "write a review" link — the same link as the printed review QR code. */
  reviewUrl: string;
  /** The Google Business profile on Google Maps ("See us on Google"). */
  googleProfileUrl: string;
}

/** Shape returned by mec-api GET settings/contact. */
export interface ContactSettings {
  emails: { label: string; email: string }[];
  phones: { label: string; number: string; whatsapp: boolean }[];
  socials: { platform: string; url: string }[];
  addresses: { label: string; street: string; city: string; state: string; pincode: string; country: string; map_url: string; lat?: number | null; lng?: number | null }[];
  hours: { days: string; open: string; close: string };
  /** Google "write a review" link; optional (older API versions don't send it). */
  review_url?: string;
  /** Google Business profile link; optional (older API versions don't send it). */
  google_profile_url?: string;
}

/** An admin-entered link when it is a full web URL, else the fallback. */
const webLink = (value: string | undefined, fallback: string) => {
  const link = value?.trim();
  return link && /^https?:\/\//i.test(link) ? link : fallback;
};

const digits = (phone: string) => phone.replace(/[^\d]/g, "");

/** "+918300454800" or "8300454800" -> "+91 83004 54800"; numbers already spaced are shown as entered. */
function displayPhone(phone: string) {
  const d = digits(phone);
  if (/\s/.test(phone.trim())) return phone.trim();
  if (d.length === 12 && d.startsWith("91")) return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  if (d.length === 10) return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  return phone.trim();
}

/** tel: value; 10-digit Indian numbers get +91. */
const telFor = (phone: string) => {
  const d = digits(phone);
  return d.length === 10 ? `+91${d}` : `+${d}`;
};

/** wa.me digits; 10-digit Indian numbers get 91. */
const waFor = (phone: string) => {
  const d = digits(phone);
  return d.length === 10 ? `91${d}` : d;
};

const coordinate = (value: unknown, limit: number) => {
  const n = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : NaN;
  return Number.isFinite(n) && Math.abs(n) <= limit ? n : undefined;
};

/** Normalised street for comparing addresses ("No.3/12, Old ESI St," == "no.3/12 old esi st"). */
const sameStreet = (a = "", b = "") => a.toLowerCase().replace(/[^a-z0-9]/g, "") === b.toLowerCase().replace(/[^a-z0-9]/g, "");

function toAddress(a: ContactSettings["addresses"][number]): SiteAddress {
  const statePin = [a.state, a.pincode].map((s) => s?.trim()).filter(Boolean).join(" ");
  const full = [a.street?.replace(/,\s*$/, ""), a.city, statePin].map((s) => s?.trim()).filter(Boolean).join(", ");
  const { location } = mecatronixConfig;
  let lat = coordinate(a.lat, 90);
  let lng = coordinate(a.lng, 180);
  // Details saved before positions existed: the studio's own address still gets its known position
  if ((lat === undefined || lng === undefined) && sameStreet(a.street, location.address)) {
    lat = location.latitude;
    lng = location.longitude;
  }
  const located = lat !== undefined && lng !== undefined;
  const destination = located ? `${lat},${lng}` : [full, a.country].filter(Boolean).join(", ");
  return {
    label: a.label?.trim() || "Mecatronix Studio",
    full,
    street: a.street?.trim() ?? "",
    city: a.city?.trim() ?? "",
    state: a.state?.trim() ?? "",
    country: a.country?.trim() || "India",
    pincode: a.pincode?.trim() ?? "",
    mapsUrl: a.map_url?.trim() || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(full)}`,
    ...(located ? { lat, lng } : {}),
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`,
  };
}

/** Settings from env config (the fallback, and what the site showed before the admin managed it). */
function envSettings(): ContactSettings {
  const { contact, location, social, business } = mecatronixConfig;
  const whatsappDiffers = digits(contact.whatsappNumber) !== digits(contact.primaryPhone);
  return {
    emails: [
      { label: "General enquiries", email: contact.companyEmail },
      ...(contact.supportEmail && contact.supportEmail !== contact.companyEmail ? [{ label: "Support", email: contact.supportEmail }] : []),
    ],
    phones: [
      { label: "Studio", number: contact.primaryPhone, whatsapp: !whatsappDiffers },
      ...(whatsappDiffers ? [{ label: "WhatsApp", number: contact.whatsappNumber, whatsapp: true }] : []),
    ],
    socials: (Object.keys(SOCIAL_LABELS) as SocialKey[]).flatMap((key) => (social[key] ? [{ platform: key, url: social[key] as string }] : [])),
    addresses: [
      {
        label: "Mecatronix Studio",
        street: location.address,
        city: location.city,
        state: location.state,
        pincode: location.pincode,
        country: location.country,
        map_url: location.googleMapsLink,
        lat: location.latitude,
        lng: location.longitude,
      },
    ],
    hours: { days: business.days, open: business.hoursStart, close: business.hoursEnd },
  };
}

/** Builds the site's contact model from API settings, falling back to env config for anything missing. */
export function toSiteContact(settings: ContactSettings | null | undefined): SiteContact {
  const env = envSettings();
  const s: ContactSettings = {
    emails: settings?.emails?.filter((e) => e?.email)?.length ? settings.emails.filter((e) => e?.email) : env.emails,
    phones: settings?.phones?.filter((p) => p?.number)?.length ? settings.phones.filter((p) => p?.number) : env.phones,
    socials: settings?.socials ?? env.socials,
    addresses: settings?.addresses?.filter((a) => a?.street || a?.city)?.length ? settings.addresses.filter((a) => a?.street || a?.city) : env.addresses,
    hours: settings?.hours?.open && settings.hours.close ? settings.hours : env.hours,
  };

  const phones: SitePhone[] = s.phones.map((p) => ({ label: p.label?.trim() || "Phone", display: displayPhone(p.number), tel: telFor(p.number), whatsapp: !!p.whatsapp }));
  const addresses = s.addresses.map(toAddress);
  const whatsappPhone = s.phones.find((p) => p.whatsapp) ?? s.phones[0];
  const businessHours = { days: s.hours.days, start: s.hours.open, end: s.hours.close };

  return {
    email: s.emails[0].email,
    emails: s.emails.map((e) => ({ label: e.label?.trim() || "Email", email: e.email })),
    phone: phones[0].tel,
    phoneDisplay: phones[0].display,
    phones,
    whatsapp: waFor(whatsappPhone.number),
    address: addresses[0],
    addresses,
    businessHours,
    hours: `${businessHours.days}, ${businessHours.start}–${businessHours.end} IST`,
    socialLinks: s.socials
      .filter((x): x is { platform: SocialKey; url: string } => x.platform in SOCIAL_LABELS && Boolean(x.url))
      .map((x) => ({ key: x.platform, label: SOCIAL_LABELS[x.platform], href: x.url })),
    reviewUrl: webLink(settings?.review_url, mecatronixConfig.location.googleReviewLink),
    googleProfileUrl: webLink(settings?.google_profile_url, mecatronixConfig.location.googleMapsLink),
  };
}

/** The env-config contact details, for code that renders before the API answers. */
export const defaultSiteContact = toSiteContact(null);

export function whatsappLink(contact: Pick<SiteContact, "whatsapp">, message = "Hi Mecatronix, I'd like to discuss a project.") {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
