import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm, type ProductFormValue } from "@/components/admin/ProductForm";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata = { title: "Editar producto" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireAdmin();

  const [{ data: product }, { data: collections }, { data: brandRows }] = await Promise.all([
    supabase
      .from("products")
      .select("id, slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, active, variants:product_variants ( id, size, stock, sku )")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("collections").select("id, name").order("sort_order"),
    supabase.from("products").select("brand"),
  ]);
  if (!product) notFound();

  const initial: ProductFormValue = {
    ...product,
    description: product.description ?? "",
    variants: product.variants.map((v) => ({ ...v, size: Number(v.size) })).sort((a, b) => a.size - b.size),
  };

  return (
    <>
      <Link href="/admin/productos" className="eyebrow mb-6 inline-block text-stone hover:text-bone">
        ← Productos
      </Link>
      <PageHeader eyebrow={product.brand} title={product.name}>
        <Link href={`/producto/${product.slug}`} target="_blank" className="eyebrow text-stone hover:text-bone">
          Ver en la tienda ↗
        </Link>
      </PageHeader>
      <ProductForm
        key={product.id}
        initial={initial}
        collections={collections ?? []}
        brands={[...new Set((brandRows ?? []).map((b) => b.brand))].sort()}
      />
    </>
  );
}
