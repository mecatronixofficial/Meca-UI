import type { Metadata, Viewport } from "next";
import "./globals.css";
import UserLayout from "../components/layout/Userlayout";
import JsonLd from "../components/seo/JsonLd";
import {
  SITE_URL,
  SITE_NAME,
  COMPANY_NAME,
  DEFAULT_DESCRIPTION,
  LOGO_PATH,
  OG_IMAGE,
  baseOpenGraph,
  organizationJsonLd,
} from "../lib/seo";

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: COMPANY_NAME,
    template: "%s | Mecatronix",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "technology",
  keywords: [
    "software development company in Coimbatore",
    "web development company in Coimbatore",
    "ecommerce website development",
    "mobile app development",
    "Mecatronix",
  ],
  authors: [{ name: COMPANY_NAME, url: SITE_URL }],
  creator: COMPANY_NAME,
  publisher: COMPANY_NAME,
  // Stop iOS from auto-linking numbers/emails in the design; real links are explicit
  formatDetection: { telephone: false, email: false, address: false },
  icons: {
    icon: LOGO_PATH,
    shortcut: LOGO_PATH,
    apple: LOGO_PATH,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    ...baseOpenGraph,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body>
        <JsonLd data={organizationJsonLd()} />
        <UserLayout>{children}</UserLayout>
      </body>
    </html>
  );
}
