"use client";

import { usePathname } from "next/navigation";

/**
 * Renders site chrome (header, footer, assistant…) everywhere except a visitor's
 * full-screen website preview (/preview/{id}), which is its own site.
 */
export default function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  return pathname.startsWith("/preview/") ? null : children;
}
