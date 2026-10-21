import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusButton } from "@/components/admin/OrderStatusButton";
import { formatDate, PageHeader, Panel, StatusBadge } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import type { OrderSummary } from "@/lib/orders";
import { formatCOP } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ reference: string }> }) {
  return { title: (await params).reference };
}

export default async function OrderDetail({ params }: { params: Promise<{ reference: string }> }) {
  const { supabase } = await requireAdmin();
  const { reference } = await params;

  const { data } = await supabase
    .from("orders")
    .select(
      `reference, status, customer_name, email, phone, address, city, region, subtotal, shipping, total,
       wompi_transaction_id, stock_conflict, created_at, paid_at,
       items:order_items ( quantity, unit_price, variant:product_variants ( size, sku, product:products ( name, brand, slug, images ) ) )`,
    )
    .eq("reference", reference)
    .maybeSingle();
  if (!data) notFound();
  const order = data as unknown as OrderSummary;

  const firstName = order.customer_name.split(" ")[0];
  const wa = `https://wa.me/57${order.phone}?text=${encodeURIComponent(`Hola ${firstName}, te escribimos por tu pedido ${order.reference}.`)}`;

  return (
    <>
      <Link href="/admin/pedidos" className="eyebrow mb-6 inline-block text-stone hover:text-bone">
        ← Pedidos
      </Link>
      <PageHeader eyebrow={formatDate(order.created_at)} title={order.reference}>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={order.status} />
          <OrderStatusButton reference={order.reference} status={order.status} />
        </div>
      </PageHeader>

      {order.stock_conflict && (
        <div role="alert" className="mb-8 border border-sand/50 bg-sand/10 px-5 py-4 text-sm text-sand">
          Al confirmarse el pago, alguna talla ya no tenía stock suficiente. Verifica el inventario físico antes de despachar o contacta al cliente.
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[1fr_22rem]">
        <Panel title="Productos">
          <ul className="divide-y divide-line">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden bg-ink-raised">
                  {item.variant.product.images[0] && <Image src={item.variant.product.images[0]} alt="" fill sizes="56px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    {item.variant.product.brand} {item.variant.product.name}
                  </p>
                  <p className="text-xs text-stone">
                    Talla {Number(item.variant.size)} · SKU {item.variant.sku}
                  </p>
                </div>
                <p className="text-right text-sm tabular-nums">
                  {item.quantity} × {formatCOP(item.unit_price)}
                </p>
              </li>
            ))}
          </ul>
          <dl className="space-y-1.5 border-t border-line px-5 py-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-mist">Subtotal</dt>
              <dd className="tabular-nums">{formatCOP(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mist">Envío</dt>
              <dd className="tabular-nums">{order.shipping ? formatCOP(order.shipping) : "Gratis"}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3">
              <dt className="eyebrow self-center">Total</dt>
              <dd className="font-display text-xl font-bold tabular-nums">{formatCOP(order.total)}</dd>
            </div>
          </dl>
        </Panel>

        <div className="space-y-8">
          <Panel title="Cliente">
            <dl className="space-y-4 px-5 py-5 text-sm">
              <div>
                <dt className="text-xs text-stone">Nombre</dt>
                <dd>{order.customer_name}</dd>
              </div>
              <div>
                <dt className="text-xs text-stone">Correo</dt>
                <dd>
                  <a href={`mailto:${order.email}`} className="underline-offset-4 hover:underline">
                    {order.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-stone">Celular</dt>
                <dd className="flex items-center gap-3">
                  <a href={`tel:+57${order.phone}`} className="tabular-nums underline-offset-4 hover:underline">
                    {order.phone}
                  </a>
                  <a href={wa} target="_blank" rel="noreferrer" className="eyebrow text-sand hover:text-bone">
                    WhatsApp ↗
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-stone">Dirección de envío</dt>
                <dd>
                  {order.address}
                  <br />
                  {order.city}
                  {order.region ? `, ${order.region}` : ""}
                </dd>
              </div>
            </dl>
          </Panel>

          <Panel title="Pago">
            <dl className="space-y-4 px-5 py-5 text-sm">
              <div>
                <dt className="text-xs text-stone">Pagado</dt>
                <dd>{formatDate(order.paid_at)}</dd>
              </div>
              <div>
                <dt className="text-xs text-stone">Transacción Wompi</dt>
                <dd className="break-all tabular-nums">{order.wompi_transaction_id ?? "—"}</dd>
              </div>
            </dl>
          </Panel>
        </div>
      </div>
    </>
  );
}
