import Link from "next/link";
import { Empty, formatDate, PageHeader, Panel, StatusBadge } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import type { OrderStatus } from "@/lib/orders-types";
import { formatCOP } from "@/lib/utils";

export const metadata = { title: "Resumen" };

const PAID: OrderStatus[] = ["pagado", "enviado", "entregado"];

export default async function AdminHome() {
  const { supabase } = await requireAdmin();
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString();

  const [sales, toShip, pending, conflicts, lowStock, recent] = await Promise.all([
    supabase.from("orders").select("total").in("status", PAID).gte("paid_at", since),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pagado"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pendiente"),
    supabase.from("orders").select("reference").eq("stock_conflict", true).in("status", ["pagado", "enviado"]),
    supabase
      .from("product_variants")
      .select("id, size, stock, product:products!inner ( id, name, brand, active )")
      .lte("stock", 2)
      .eq("product.active", true)
      .order("stock")
      .limit(10),
    supabase.from("orders").select("reference, status, customer_name, city, total, created_at").order("created_at", { ascending: false }).limit(8),
  ]);

  const revenue = (sales.data ?? []).reduce((n, o) => n + o.total, 0);
  const kpis = [
    { label: "Ventas · 30 días", value: formatCOP(revenue), hint: `${sales.data?.length ?? 0} pedidos pagados` },
    { label: "Por enviar", value: String(toShip.count ?? 0), hint: "Pagados sin despachar", href: "/admin/pedidos?estado=pagado" },
    { label: "Pagos pendientes", value: String(pending.count ?? 0), hint: "Esperando confirmación", href: "/admin/pedidos?estado=pendiente" },
    { label: "Tallas por agotarse", value: String(lowStock.data?.length ?? 0), hint: "2 pares o menos", href: "/admin/productos" },
  ];

  type LowStockRow = { id: string; size: number; stock: number; product: { id: string; name: string; brand: string } };

  return (
    <>
      <PageHeader eyebrow="Panel" title="Resumen" />

      {(conflicts.data?.length ?? 0) > 0 && (
        <div role="alert" className="mb-8 border border-sand/50 bg-sand/10 px-5 py-4 text-sm text-sand">
          {conflicts.data!.length === 1 ? "1 pedido pagado" : `${conflicts.data!.length} pedidos pagados`} sin stock suficiente al confirmarse:{" "}
          {conflicts.data!.map((o, i) => (
            <span key={o.reference}>
              {i > 0 && ", "}
              <Link href={`/admin/pedidos/${o.reference}`} className="underline underline-offset-4">
                {o.reference}
              </Link>
            </span>
          ))}
          . Revisa inventario o contacta al cliente.
        </div>
      )}

      <div className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
        {kpis.map((k) => {
          const body = (
            <>
              <p className="eyebrow text-stone">{k.label}</p>
              <p className="font-display mt-3 text-2xl font-bold tabular-nums md:text-3xl">{k.value}</p>
              <p className="mt-1 text-xs text-stone">{k.hint}</p>
            </>
          );
          return k.href ? (
            <Link key={k.label} href={k.href} className="bg-ink p-5 transition-colors hover:bg-ink-raised">
              {body}
            </Link>
          ) : (
            <div key={k.label} className="bg-ink p-5">
              {body}
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_22rem]">
        <Panel title="Últimos pedidos">
          {recent.data?.length ? (
            <ul className="divide-y divide-line">
              {recent.data.map((o) => (
                <li key={o.reference}>
                  <Link href={`/admin/pedidos/${o.reference}`} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-3.5 transition-colors hover:bg-ink-raised sm:grid-cols-[1fr_auto_auto]">
                    <div className="min-w-0">
                      <p className="truncate text-sm">{o.customer_name}</p>
                      <p className="text-xs text-stone">
                        {o.reference} · {o.city} · {formatDate(o.created_at)}
                      </p>
                    </div>
                    <p className="text-sm tabular-nums">{formatCOP(o.total)}</p>
                    <div className="col-span-2 sm:col-span-1">
                      <StatusBadge status={o.status as OrderStatus} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>Aún no hay pedidos.</Empty>
          )}
        </Panel>

        <Panel title="Stock bajo">
          {lowStock.data?.length ? (
            <ul className="divide-y divide-line">
              {(lowStock.data as unknown as LowStockRow[]).map((v) => (
                <li key={v.id}>
                  <Link href={`/admin/productos/${v.product.id}`} className="flex items-center justify-between gap-4 px-5 py-3 text-sm transition-colors hover:bg-ink-raised">
                    <span className="min-w-0 truncate">
                      {v.product.brand} {v.product.name} <span className="text-stone">· T{Number(v.size)}</span>
                    </span>
                    <span className={v.stock === 0 ? "text-stone line-through" : "text-sand"}>{v.stock === 0 ? "Agotada" : `${v.stock} ${v.stock === 1 ? "par" : "pares"}`}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>Todo el inventario está bien.</Empty>
          )}
        </Panel>
      </div>
    </>
  );
}
