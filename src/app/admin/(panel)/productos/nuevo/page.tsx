import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata = { title: "Nuevo producto" };

export default async function NewProductPage() {
  const { supabase } = await requireAdmin();
  const [{ data: collections }, { data: brandRows }] = await Promise.all([
    supabase.from("collections").select("id, name").order("sort_order"),
    supabase.from("products").select("brand"),
  ]);

  return (
    <>
      <Link href="/admin/productos" className="eyebrow mb-6 inline-block text-stone hover:text-bone">
        ← Productos
      </Link>
      <PageHeader eyebrow="Catálogo" title="Nuevo producto" />
      <ProductForm
        collections={collections ?? []}
        brands={[...new Set((brandRows ?? []).map((b) => b.brand))].sort()}
        initial={{
          name: "",
          slug: "",
          brand: "",
          description: "",
          price: null,
          compare_at_price: null,
          gender: "unisex",
          collection_id: null,
          images: [],
          featured: false,
          best_seller: false,
          active: true,
          variants: [],
        }}
      />
    </>
  );
}
