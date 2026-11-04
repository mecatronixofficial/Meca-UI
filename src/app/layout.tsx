import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import PageWatermark from "../components/layout/PageWatermark";
import PublicOnly from "../components/layout/PublicOnly";
import PointerEffects from "../components/animations/PointerEffects";
import PageLoader from "../components/animations/PageLoader";
import MecaAssistant from "../components/assistant/MecaAssistant";
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

// Self-hosted (latin variable woff2) so dev and builds never depend on reaching Google Fonts
const display = localFont({
  src: "./fonts/space-grotesk-latin-wght-normal.woff2",
  weight: "300 700",
  variable: "--font-space-grotesk",
  display: "swap",
});

const sans = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

const mono = localFont({
  src: "./fonts/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${COMPANY_NAME} | Software Development Company in Coimbatore`,
    template: "%s | Mecatronix",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "technology",
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
    // `js` class is added before paint so scroll-reveal styles only apply when JS runs
    <html
      lang="en-IN"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <PublicOnly>
          <PageLoader />
        </PublicOnly>
        <div id="top" />
        <JsonLd data={organizationJsonLd()} />
        <PublicOnly>
          <Header />
        </PublicOnly>
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <PublicOnly>
          <PageWatermark />
          <Footer />
          <PointerEffects />
          <MecaAssistant />
        </PublicOnly>
      </body>
    </html>
  );
}
