import "server-only";
import { unstable_cache } from "next/cache";
import imported from "@/data/catalog-import.json";
import { SEED_DAYS_APART, seedCollections, seedProducts, type SeedProduct } from "@/data/catalog-seed";
import { createPublicClient, isSupabaseConfigured } from "@/lib/supabase/public";
import type { Collection, Product } from "@/types/catalog";

export type Catalog = { products: Product[]; collections: Collection[] };

const PRODUCT_SELECT = `
  id, slug, name, brand, description, price, compare_at_price, gender, images, featured, best_seller, created_at,
  collection:collections ( slug, name ),
  variants:product_variants ( id, size, stock, sku )
`;

async function fetchFromSupabase(): Promise<Catalog> {
  const supabase = createPublicClient();
  const [products, collections] = await Promise.all([
    supabase.from("products").select(PRODUCT_SELECT).eq("active", true).order("created_at", { ascending: false }),
    supabase.from("collections").select("id, slug, name, description, image, sort_order").order("sort_order"),
  ]);
  if (products.error) throw products.error;
  if (collections.error) throw collections.error;

  return {
    products: (products.data as unknown as Product[]).map((p) => ({
      ...p,
      // numeric llega como número o string según la versión de PostgREST
      variants: p.variants.map((v) => ({ ...v, size: Number(v.size) })).sort((a, b) => a.size - b.size),
    })),
    collections: collections.data as Collection[],
  };
}

// Catálogo real importado (npm run catalog:build); si está vacío, se usan los productos de ejemplo.
const sourceProducts: SeedProduct[] = (imported as SeedProduct[]).length > 0 ? (imported as SeedProduct[]) : seedProducts;

const collectionCover = (slug: string) =>
  (imported as SeedProduct[]).length > 0
    ? (sourceProducts.find((p) => p.collection === slug && p.featured) ?? sourceProducts.find((p) => p.collection === slug))?.images[0]
    : undefined;

/** Respaldo local con los mismos datos del seed, para trabajar sin Supabase. */
function fromSeed(): Catalog {
  // Con catálogo importado, la foto de cada colección es la portada de uno de sus modelos.
  const collections: Collection[] = seedCollections.map((c) => ({ id: c.slug, ...c, image: collectionCover(c.slug) ?? c.image }));
  const now = Date.now();
  const products: Product[] = sourceProducts.map(({ sizes, collection, ...p }, i) => {
    const col = collections.find((c) => c.slug === collection) ?? null;
    return {
      ...p,
      id: p.slug,
      collection: col && { slug: col.slug, name: col.name },
      created_at: new Date(now - i * SEED_DAYS_APART * 86_400_000).toISOString(),
      variants: sizes.map(([size, stock]) => ({
        id: `${p.slug}-${size}`,
        size,
        stock,
        sku: `FL-${String(i + 1).padStart(3, "0")}-${size}`,
      })),
    };
  });
  return { products, collections };
}

/** Catálogo completo de productos activos, cacheado 60 s (tag "catalog" para invalidar desde el admin). */
export const getCatalog = unstable_cache(
  async (): Promise<Catalog> => {
    if (!isSupabaseConfigured) {
      console.warn("[catalog] Supabase sin configurar: usando datos de ejemplo locales.");
      return fromSeed();
    }
    return fetchFromSupabase();
  },
  ["catalog"],
  { revalidate: 60, tags: ["catalog"] },
);
