"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultSiteContact, type SiteContact } from "../../lib/site-contact";

const SiteContactContext = createContext<SiteContact>(defaultSiteContact);

/** Hands the admin-managed contact details (loaded in the root layout) to client components. */
export function SiteContactProvider({ value, children }: { value: SiteContact; children: ReactNode }) {
  return <SiteContactContext.Provider value={value}>{children}</SiteContactContext.Provider>;
}

/** Contact details in client components. Server components use getSiteContact(). */
export function useSiteContact() {
  return useContext(SiteContactContext);
}
