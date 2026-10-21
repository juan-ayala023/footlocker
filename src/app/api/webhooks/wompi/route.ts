import { NextResponse } from "next/server";
import { applyTransaction } from "@/lib/orders";
import { isAdminClientConfigured } from "@/lib/supabase/admin";
import { verifyEventSignature, wompiPublicKey, type WompiEvent } from "@/lib/wompi";

export const dynamic = "force-dynamic";

/**
 * Eventos de Wompi (configurar en el panel: https://<dominio>/api/webhooks/wompi).
 * Wompi reintenta mientras no reciba 200, así que solo se responde error cuando
 * reintentar tiene sentido (firma válida pero fallo interno).
 */
export async function POST(request: Request) {
  const event = (await request.json().catch(() => null)) as WompiEvent | null;

  if (!event || !verifyEventSignature(event)) {
    return NextResponse.json({ ok: false, error: "firma inválida" }, { status: 401 });
  }

  // Ignorar eventos de un ambiente distinto al de la llave configurada.
  const expectedEnv = wompiPublicKey.startsWith("pub_prod_") ? "prod" : "test";
  if (event.environment && event.environment !== expectedEnv) {
    return NextResponse.json({ ok: true, ignored: "environment" });
  }

  if (event.event !== "transaction.updated" || !event.data?.transaction) {
    return NextResponse.json({ ok: true, ignored: event.event });
  }

  if (!isAdminClientConfigured) {
    return NextResponse.json({ ok: false, error: "base de datos no configurada" }, { status: 503 });
  }

  try {
    const result = await applyTransaction(event.data.transaction);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error("[wompi] Error procesando evento", event.data.transaction.reference, err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
