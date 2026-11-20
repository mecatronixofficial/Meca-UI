"use client";

import { usePathname } from "next/navigation";

/** Renders its children on every page except the given paths (exact match). */
export function HideOn({ paths, children }: { paths: string[]; children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  return paths.includes(pathname) ? null : children;
}
