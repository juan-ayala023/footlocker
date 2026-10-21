import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Tenis de Nike, Jordan, Adidas, Vans y Puma. Filtra por talla, marca, género, precio y colección.",
  alternates: { canonical: "/catalogo" },
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Leer searchParams hace la página dinámica: el HTML del servidor ya llega filtrado (SEO + LCP).
  // Después, el cliente filtra sin recargar reescribiendo la query.
  const [{ products, collections }] = await Promise.all([getCatalog(), searchParams]);
  return <CatalogView products={products} collections={collections} />;
}
