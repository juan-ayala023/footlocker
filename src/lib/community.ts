import "server-only";
import { unstable_cache } from "next/cache";
import { seedCommunity } from "@/data/catalog-seed";
import { getCatalog } from "@/lib/catalog";
import { createPublicClient, isSupabaseConfigured } from "@/lib/supabase/public";

export type CommunityPhoto = {
  id: string;
  image: string;
  handle: string | null;
  product: { slug: string; name: string; brand: string; price: number; image: string | null } | null;
};

type Row = { id: string; image: string; handle: string | null; product_id: string | null };

const getRows = unstable_cache(
  async (): Promise<Row[]> => {
    if (!isSupabaseConfigured) {
      // Respaldo local: en el seed el id del producto es su slug.
      return seedCommunity.map((c, i) => ({ id: `seed-${i}`, image: c.image, handle: c.handle, product_id: c.product }));
    }
    const { data, error } = await createPublicClient()
      .from("community_photos")
      .select("id, image, handle, product_id")
      .eq("active", true)
      .eq("status", "approved")
      .order("sort_order")
      .order("created_at", { ascending: false })
      .limit(60);
    if (error) throw error;
    return data as Row[];
  },
  ["community"],
  { revalidate: 60, tags: ["community", "catalog"] },
);

/** Fotos de la comunidad; si se pasa un producto, las de ese producto van primero. */
export async function getCommunityPhotos(productId?: string, limit = 12): Promise<CommunityPhoto[]> {
  const [rows, { products }] = await Promise.all([getRows(), getCatalog()]);
  const byId = new Map(products.map((p) => [p.id, p]));

  return [...rows]
    .sort((a, b) => Number(b.product_id === productId) - Number(a.product_id === productId))
    .slice(0, limit)
    .map((r) => {
      const p = r.product_id ? byId.get(r.product_id) : undefined;
      return {
        id: r.id,
        image: r.image,
        handle: r.handle,
        // Solo productos activos (los inactivos no están en el catálogo).
        product: p ? { slug: p.slug, name: p.name, brand: p.brand, price: p.price, image: p.images[0] ?? null } : null,
      };
    });
}
