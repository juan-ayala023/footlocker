import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getCatalog } from "@/lib/catalog";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, collections } = await getCatalog();
  const now = new Date();

  return [
    { url: site.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/catalogo`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...["ayuda", "proposito", "terminos"].map((s) => ({
      url: `${site.url}/${s}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    ...collections.map((c) => ({
      url: `${site.url}/catalogo?coleccion=${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${site.url}/producto/${p.slug}`,
      lastModified: new Date(p.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      // Google exige URLs absolutas en las imágenes del sitemap (las del catálogo son rutas locales).
      images: p.images.slice(0, 2).map((src) => new URL(src, site.url).href),
    })),
  ];
}
