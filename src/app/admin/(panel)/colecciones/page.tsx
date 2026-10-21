import { CollectionsManager } from "@/components/admin/CollectionsManager";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata = { title: "Colecciones" };

export default async function CollectionsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("collections")
    .select("id, name, slug, description, image, sort_order, products ( count )")
    .order("sort_order");

  const collections = (data ?? []).map(({ products, ...c }) => ({
    ...c,
    count: (products as unknown as { count: number }[])[0]?.count ?? 0,
  }));

  return (
    <>
      <PageHeader eyebrow="Catálogo" title="Colecciones" />
      <CollectionsManager collections={collections} />
    </>
  );
}
