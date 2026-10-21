import "server-only";
import { revalidateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { WompiTransaction } from "@/lib/wompi";

import type { OrderStatus } from "@/lib/orders-types";

export type { OrderStatus };

export type OrderSummary = {
  reference: string;
  status: OrderStatus;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  wompi_transaction_id: string | null;
  stock_conflict: boolean;
  created_at: string;
  paid_at: string | null;
  items: {
    quantity: number;
    unit_price: number;
    variant: { size: number; sku: string; product: { id: string; name: string; brand: string; slug: string; images: string[] } };
  }[];
};

const ORDER_SELECT = `
  reference, status, customer_name, email, phone, address, city, region, subtotal, shipping, total,
  wompi_transaction_id, stock_conflict, created_at, paid_at,
  items:order_items ( quantity, unit_price, variant:product_variants ( size, sku, product:products ( id, name, brand, slug, images ) ) )
`;

export async function getOrder(reference: string): Promise<OrderSummary | null> {
  const { data, error } = await createAdminClient().from("orders").select(ORDER_SELECT).eq("reference", reference).maybeSingle();
  if (error) throw error;
  return data as OrderSummary | null;
}

/**
 * Aplica el estado de una transacción de Wompi al pedido. Idempotente:
 * lo usan tanto el webhook como la reconciliación de la página de confirmación.
 */
export async function applyTransaction(tx: WompiTransaction) {
  const supabase = createAdminClient();

  if (tx.status === "APPROVED") {
    const { data: result, error } = await supabase.rpc("confirm_order_payment", {
      p_reference: tx.reference,
      p_transaction_id: tx.id,
      p_amount_in_cents: tx.amount_in_cents,
    });
    if (error) throw error;

    if (result === "paid") {
      // El stock cambió: refrescar catálogo y avisar a la automatización.
      revalidateTag("catalog");
      const order = await getOrder(tx.reference);
      if (order) await notifyOrderPaid(order);
    }
    if (result === "amount_mismatch") {
      console.error(`[wompi] Monto no coincide para ${tx.reference}: ${tx.amount_in_cents} centavos`);
    }
    return result as "paid" | "already_paid" | "amount_mismatch" | "not_found";
  }

  if (tx.status === "DECLINED" || tx.status === "VOIDED" || tx.status === "ERROR") {
    const { error } = await supabase.rpc("mark_order_failed", { p_reference: tx.reference, p_transaction_id: tx.id });
    if (error) throw error;
    return "failed" as const;
  }

  return "pending" as const;
}

/** Webhook saliente (n8n) con el pedido pagado. Nunca hace fallar el flujo de pago. */
async function notifyOrderPaid(order: OrderSummary) {
  const url = process.env.N8N_ORDER_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        event: "order.paid",
        reference: order.reference,
        status: order.status,
        paid_at: order.paid_at,
        customer: {
          name: order.customer_name,
          email: order.email,
          phone: order.phone,
          address: order.address,
          city: order.city,
          region: order.region,
        },
        items: order.items.map((i) => ({
          name: `${i.variant.product.brand} ${i.variant.product.name}`,
          size: i.variant.size,
          sku: i.variant.sku,
          quantity: i.quantity,
          unit_price: i.unit_price,
        })),
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        stock_conflict: order.stock_conflict,
        wompi_transaction_id: order.wompi_transaction_id,
      }),
    });
  } catch (err) {
    console.error("[n8n] No se pudo notificar el pedido", order.reference, err);
  }
}
