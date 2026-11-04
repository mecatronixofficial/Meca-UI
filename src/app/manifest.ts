import type { MetadataRoute } from "next";
import { COMPANY_NAME, DEFAULT_DESCRIPTION, LOGO_PATH, SITE_NAME } from "../lib/seo";
import { brandLogo } from "../lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: COMPANY_NAME,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    categories: ["business", "productivity"],
    icons: [
      {
        src: LOGO_PATH,
        sizes: `${brandLogo.width}x${brandLogo.height}`,
        type: brandLogo.type,
        purpose: "any",
      },
    ],
  };
}
