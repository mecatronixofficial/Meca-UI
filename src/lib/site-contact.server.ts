import "server-only";
import { cache } from "react";
import { fetchContent } from "./content";
import { toSiteContact, type ContactSettings, type SiteContact } from "./site-contact";

/**
 * Contact details from the admin panel (cached under the "contact" tag, refreshed
 * by /api/revalidate). Deduplicated per request, so layout and page share one fetch.
 */
export const getSiteContact = cache(async (): Promise<SiteContact> => {
  const settings = await fetchContent<ContactSettings>("settings/contact", "contact");
  return toSiteContact(settings);
});
