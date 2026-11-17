import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { preloaderScript } from "@/lib/preloader";
import { Preloader } from "@/components/home/Preloader";
import { Providers } from "@/components/Providers";
import { site } from "@/config/site";
import { baseOpenGraph } from "@/lib/seo";
import "./globals.css";

// Serif clásica, en línea con el logotipo "PERFUMERÍA".
const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.legalName,
  openGraph: baseOpenGraph,
  twitter: { card: "summary_large_image" },
};

// Datos estructurados de la marca (Organization + WebSite).
const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#org`,
      name: site.legalName,
      url: site.url,
      logo: `${site.url}/brand/icon-512.png`,
      sameAs: Object.values(site.social).filter(Boolean),
    },
    { "@type": "WebSite", name: site.legalName, url: site.url, inLanguage: "es-CO", publisher: { "@id": `${site.url}/#org` } },
  ],
};

export const viewport: Viewport = {
  themeColor: "#1c0408",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: el script del preloader añade data-preload antes de hidratar.
    <html lang="es-CO" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloaderScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body>
        <Providers>
          {/* La intro vive en la raíz: el script de <head> puede activarla en cualquier ruta pública (incluida la 404). */}
          <Preloader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
