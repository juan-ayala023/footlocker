import { NextResponse } from "next/server";
import { applyTransaction, getOrder } from "@/lib/orders";
import { isAdminClientConfigured } from "@/lib/supabase/admin";
import { fetchTransaction } from "@/lib/wompi";

export const dynamic = "force-dynamic";

/**
 * Estado de un pedido para la página de confirmación.
 * Si sigue pendiente y llega ?id=<transacción>, se consulta a Wompi y se reconcilia
 * (por si el webhook se retrasa o no está configurado). Solo devuelve datos no sensibles.
 */
export async function GET(request: Request, { params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  if (!isAdminClientConfigured || !/^FL-\d{8}-[A-F0-9]{10}$/.test(reference)) {
    return NextResponse.json({ status: "not_found" }, { status: 404 });
  }

  let order = await getOrder(reference);
  if (!order) return NextResponse.json({ status: "not_found" }, { status: 404 });

  const txId = new URL(request.url).searchParams.get("id");
  if (order.status === "pendiente" && txId) {
    const tx = await fetchTransaction(txId).catch(() => null);
    if (tx && tx.reference === reference) {
      await applyTransaction(tx);
      order = (await getOrder(reference)) ?? order;
    }
  }

  return NextResponse.json({ status: order.status }, { headers: { "Cache-Control": "no-store" } });
}
