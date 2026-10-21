import { site } from "@/config/site";

/** Base de Open Graph: el openGraph de una página reemplaza (no combina) el del layout. */
export const baseOpenGraph = {
  type: "website" as const,
  locale: "es_CO",
  siteName: site.legalName,
};
