import { brandLogo } from "./brand";

/**
 * Fixed brand facts used across the UI.
 *
 * Contact details (emails, phones, addresses, hours, social links) are managed in
 * the admin panel: use getSiteContact() in server components and useSiteContact()
 * in client components (src/lib/site-contact.ts).
 */
export const site = {
  name: "Mecatronix",
  legalName: "Mecatronix Software Development",
  tagline: "Software engineering studio · Coimbatore",
  logo: brandLogo.src,
  logoWidth: brandLogo.width,
  logoHeight: brandLogo.height,
} as const;

export type { SocialKey } from "./site-contact";
