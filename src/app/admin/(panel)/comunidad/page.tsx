import { CommunityManager } from "@/components/admin/CommunityManager";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { COMMUNITY_PENDING_BUCKET } from "@/lib/community-upload";
import { productTitle } from "@/lib/utils";

export const metadata = { title: "Comunidad" };

const dateFmt = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Bogota" });

export default async function CommunityAdminPage() {
  const { supabase } = await requireAdmin();
  const [{ data: photos }, { data: products }] = await Promise.all([
    supabase
      .from("community_photos")
      .select("id, image, handle, active, status, created_at, product:products ( name, brand )")
      .order("sort_order")
      .order("created_at", { ascending: false }),
    supabase.from("products").select("id, name, brand").eq("active", true).order("name"),
  ]);

  type Row = {
    id: string;
    image: string;
    handle: string | null;
    active: boolean;
    status: "pending" | "approved";
    created_at: string;
    product: { name: string; brand: string } | null;
  };
  const rows = (photos ?? []) as unknown as Row[];
  const pendingRows = rows.filter((r) => r.status === "pending");

  // Las fotos por revisar están en un bucket privado: se ven con URLs firmadas que vencen en 1 hora.
  const { data: signed } = pendingRows.length
    ? await supabase.storage.from(COMMUNITY_PENDING_BUCKET).createSignedUrls(pendingRows.map((r) => r.image), 3600)
    : { data: [] };
  const signedByPath = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  return (
    <>
      <PageHeader eyebrow="Tienda" title="Comunidad" />
      <p className="-mt-4 mb-8 max-w-2xl text-sm text-stone">
        Fotos de clientes para la sección “El estilo de otras personas” (Home y páginas de producto). Las que suben los clientes
        desde la web llegan a “Por revisar” y solo se publican cuando las aceptas.
      </p>
      <CommunityManager
        pending={pendingRows.map((r) => ({
          id: r.id,
          url: signedByPath.get(r.image) ?? null,
          handle: r.handle,
          createdAt: dateFmt.format(new Date(r.created_at)),
        }))}
        photos={rows
          .filter((r) => r.status === "approved")
          .map((p) => ({
            id: p.id,
            image: p.image,
            handle: p.handle,
            active: p.active,
            productName: p.product ? productTitle(p.product.brand, p.product.name) : null,
          }))}
        products={(products ?? []).map((p) => ({ id: p.id, label: productTitle(p.brand, p.name) }))}
      />
    </>
  );
}
