import type { MetadataRoute } from "next";
import { COMPANY_NAME, DEFAULT_DESCRIPTION, LOGO_PATH, SITE_NAME } from "../lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: COMPANY_NAME,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    categories: ["business", "productivity"],
    icons: [
      {
        src: LOGO_PATH,
        sizes: "292x352",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
