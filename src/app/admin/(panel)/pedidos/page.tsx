import Link from "next/link";
import { Empty, formatDate, PageHeader, Panel, StatusBadge } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { ORDER_STATUSES, STATUS_LABEL } from "@/lib/admin/status";
import type { OrderStatus } from "@/lib/orders-types";
import { cn, formatCOP } from "@/lib/utils";

export const metadata = { title: "Pedidos" };

const PAGE_SIZE = 25;

type Search = { estado?: string; q?: string; pagina?: string };

export default async function OrdersPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const estado = ORDER_STATUSES.includes(sp.estado as OrderStatus) ? (sp.estado as OrderStatus) : undefined;
  // Solo caracteres seguros para el filtro or() de PostgREST.
  const q = (sp.q ?? "").replace(/[^\p{L}\p{N}@.\-\s]/gu, "").trim().slice(0, 60);
  const page = Math.max(1, Number(sp.pagina) || 1);

  let query = supabase
    .from("orders")
    .select("reference, status, customer_name, email, city, total, created_at, stock_conflict", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (estado) query = query.eq("status", estado);
  if (q) query = query.or(`reference.ilike.%${q}%,email.ilike.%${q}%,customer_name.ilike.%${q}%`);

  const { data: orders, count, error } = await query;
  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  const href = (patch: Search) => {
    const next = new URLSearchParams();
    const merged = { estado, q: q || undefined, ...patch };
    Object.entries(merged).forEach(([k, v]) => v && next.set(k, String(v)));
    const s = next.toString();
    return `/admin/pedidos${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader eyebrow="Ventas" title="Pedidos">
        <form className="flex w-full items-center border-b border-line focus-within:border-bone sm:w-72">
          {estado && <input type="hidden" name="estado" value={estado} />}
          <input
            name="q"
            defaultValue={q}
            placeholder="Referencia, correo o nombre"
            aria-label="Buscar pedidos"
            className="h-11 flex-1 bg-transparent text-sm placeholder:text-stone focus:outline-none"
          />
          <button type="submit" className="eyebrow pl-3 text-stone hover:text-bone">
            Buscar
          </button>
        </form>
      </PageHeader>

      <nav aria-label="Filtrar por estado" className="-mx-4 mb-6 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
        <ul className="flex gap-2">
          {[undefined, ...ORDER_STATUSES].map((s) => (
            <li key={s ?? "todos"}>
              <Link
                href={href({ estado: s, pagina: undefined })}
                aria-current={s === estado ? "page" : undefined}
                className={cn(
                  "block rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors",
                  s === estado ? "border-bone bg-bone text-ink" : "border-line text-mist hover:border-bone",
                )}
              >
                {s ? STATUS_LABEL[s] : "Todos"}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Panel>
        {error ? (
          <Empty>No se pudieron cargar los pedidos: {error.message}</Empty>
        ) : orders?.length ? (
          <>
            <div className="hidden grid-cols-[1.2fr_1.4fr_1fr_auto_7rem] gap-4 border-b border-line px-5 py-3 text-xs text-stone md:grid">
              <span>Pedido</span>
              <span>Cliente</span>
              <span>Ciudad</span>
              <span className="text-right">Total</span>
              <span className="text-right">Estado</span>
            </div>
            <ul className="divide-y divide-line">
              {orders.map((o) => (
                <li key={o.reference}>
                  <Link
                    href={`/admin/pedidos/${o.reference}`}
                    className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 px-5 py-4 transition-colors hover:bg-ink-raised md:grid-cols-[1.2fr_1.4fr_1fr_auto_7rem] md:items-center"
                  >
                    <div>
                      <p className="text-sm tabular-nums">{o.reference}</p>
                      <p className="text-xs text-stone">{formatDate(o.created_at)}</p>
                    </div>
                    <div className="order-3 min-w-0 md:order-none">
                      <p className="truncate text-sm">{o.customer_name}</p>
                      <p className="truncate text-xs text-stone">{o.email}</p>
                    </div>
                    <p className="order-4 text-sm text-mist md:order-none">{o.city}</p>
                    <p className="text-right text-sm tabular-nums">{formatCOP(o.total)}</p>
                    <div className="order-5 flex items-center gap-2 md:order-none md:justify-end">
                      {o.stock_conflict && (
                        <span title="Sin stock suficiente al pagar" className="text-sand">
                          ⚠
                        </span>
                      )}
                      <StatusBadge status={o.status as OrderStatus} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Empty>{q || estado ? "Ningún pedido coincide con el filtro." : "Aún no hay pedidos."}</Empty>
        )}
      </Panel>

      {pages > 1 && (
        <nav aria-label="Paginación" className="mt-6 flex items-center justify-between text-sm">
          <span className="text-stone">
            Página {page} de {pages} · {count} pedidos
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={href({ pagina: String(page - 1) })} className="rounded-full border border-line px-4 py-2 hover:border-bone">
                Anterior
              </Link>
            )}
            {page < pages && (
              <Link href={href({ pagina: String(page + 1) })} className="rounded-full border border-line px-4 py-2 hover:border-bone">
                Siguiente
              </Link>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
