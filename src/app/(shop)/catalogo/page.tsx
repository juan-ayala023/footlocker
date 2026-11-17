import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Perfumes 100% originales para hombre y mujer. Filtra por marca, presentación, género, precio y colección.",
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
