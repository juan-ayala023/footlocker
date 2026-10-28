import Image from "next/image";
import Link from "next/link";
import { BulkPrice, InlinePrice } from "@/components/admin/PriceEditor";
import { ProductToggles } from "@/components/admin/ProductToggles";
import { Empty, PageHeader, Panel } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { cn } from "@/lib/utils";

export const metadata = { title: "Productos" };

type Row = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
  active: boolean;
  featured: boolean;
  collection: { name: string } | null;
  variants: { stock: number }[];
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; estado?: string }> }) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const q = (sp.q ?? "").replace(/[^\p{L}\p{N}\-\s']/gu, "").trim().slice(0, 60);
  const estado = sp.estado === "activos" || sp.estado === "inactivos" ? sp.estado : undefined;

  let query = supabase
    .from("products")
    .select("id, slug, name, brand, price, images, active, featured, collection:collections ( name ), variants:product_variants ( stock )")
    .order("created_at", { ascending: false });
  if (q) query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,slug.ilike.%${q}%`);
  if (estado) query = query.eq("active", estado === "activos");
  const [{ data, error }, { count: total }] = await Promise.all([
    query,
    supabase.from("products").select("id", { count: "exact", head: true }),
  ]);
  const products = (data ?? []) as unknown as Row[];

  return (
    <>
      <PageHeader eyebrow="Catálogo" title="Productos">
        <Link href="/admin/productos/nuevo" className="eyebrow inline-flex h-11 items-center justify-center rounded-full bg-sand px-6 text-ink hover:bg-bone">
          Nuevo producto
        </Link>
      </PageHeader>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Filtrar" className="flex gap-2">
          {[
            { v: undefined, l: "Todos" },
            { v: "activos", l: "Activos" },
            { v: "inactivos", l: "Inactivos" },
          ].map((f) => (
            <Link
              key={f.l}
              href={`/admin/productos${f.v || q ? `?${new URLSearchParams({ ...(f.v && { estado: f.v }), ...(q && { q }) })}` : ""}`}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                f.v === estado ? "border-bone bg-bone text-ink" : "border-line text-mist hover:border-bone",
              )}
            >
              {f.l}
            </Link>
          ))}
        </nav>
        <form className="flex items-center border-b border-line focus-within:border-bone sm:w-72">
          {estado && <input type="hidden" name="estado" value={estado} />}
          <input name="q" defaultValue={q} placeholder="Nombre, marca o slug" aria-label="Buscar productos" className="h-11 flex-1 bg-transparent text-sm placeholder:text-stone focus:outline-none" />
          <button type="submit" className="eyebrow pl-3 text-stone hover:text-bone">
            Buscar
          </button>
        </form>
      </div>

      {!!total && (
        <Panel title="Precio para todos" className="mb-6">
          <BulkPrice count={total} />
        </Panel>
      )}

      <Panel>
        {error ? (
          <Empty>No se pudieron cargar los productos: {error.message}</Empty>
        ) : products.length ? (
          <ul className="divide-y divide-line">
            {products.map((p) => {
              const stock = p.variants.reduce((n, v) => n + v.stock, 0);
              const sizesOut = p.variants.filter((v) => v.stock === 0).length;
              return (
                <li key={p.id} className={cn("flex items-center gap-4 px-4 py-3 sm:px-5", !p.active && "opacity-60")}>
                  <Link href={`/admin/productos/${p.id}`} className="relative aspect-[4/5] w-12 shrink-0 overflow-hidden bg-ink-raised sm:w-14">
                    {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="56px" className="object-cover" />}
                  </Link>
                  <Link href={`/admin/productos/${p.id}`} className="min-w-0 flex-1">
                    <p className="eyebrow text-stone">{p.brand}</p>
                    <p className="truncate text-sm hover:text-sand">{p.name}</p>
                    {p.collection && <p className="text-xs text-stone">{p.collection.name}</p>}
                  </Link>
                  <InlinePrice key={p.price} id={p.id} price={p.price} />
                  <div className="hidden w-28 text-right text-sm sm:block">
                    <p className={cn("tabular-nums", stock === 0 && "text-sand")}>{stock === 0 ? "Sin stock" : `${stock} pares`}</p>
                    <p className="text-xs text-stone">
                      {p.variants.length} tallas{sizesOut ? ` · ${sizesOut} agotadas` : ""}
                    </p>
                  </div>
                  <ProductToggles id={p.id} active={p.active} featured={p.featured} />
                </li>
              );
            })}
          </ul>
        ) : (
          <Empty>{q || estado ? "Ningún producto coincide." : "Aún no hay productos. Crea el primero."}</Empty>
        )}
      </Panel>
    </>
  );
}
