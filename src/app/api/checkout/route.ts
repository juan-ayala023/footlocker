import { NextResponse } from "next/server";
import { site } from "@/config/site";
import { checkoutSchema, type CheckoutResponse } from "@/lib/checkout-schema";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";
import { createReference, integritySignature, isWompiConfigured, wompiPublicKey } from "@/lib/wompi";

export const dynamic = "force-dynamic";

const reply = (body: CheckoutResponse, status = 200) => NextResponse.json(body, { status });

/**
 * Crea el pedido en estado "pendiente" y devuelve los datos firmados para abrir el widget de Wompi.
 * Precios, envío y total se calculan en la base de datos (create_order), nunca desde el cliente.
 */
export async function POST(request: Request) {
  if (!isAdminClientConfigured || !isWompiConfigured) {
    return reply(
      { ok: false, code: "NOT_CONFIGURED", message: "Los pagos aún no están configurados. Escríbenos por WhatsApp para completar tu pedido." },
      503,
    );
  }

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.at(-1);
      if (typeof key === "string" && !fields[key]) fields[key] = issue.message;
    }
    return reply({ ok: false, code: "INVALID", message: "Revisa los datos del formulario.", fields }, 400);
  }

  const { customer, items } = parsed.data;
  const reference = createReference();
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("create_order", {
    p_reference: reference,
    p_customer: customer,
    p_items: items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity })),
    p_shipping_flat: site.shipping.flat,
    p_free_from: site.shipping.freeFrom,
  });

  if (error) {
    const [code, variantId, available] = error.message.split(":");
    if (code === "STOCK_INSUFICIENTE" || code === "VARIANTE_NO_DISPONIBLE") {
      return reply(
        {
          ok: false,
          code: code === "STOCK_INSUFICIENTE" ? "STOCK" : "UNAVAILABLE",
          message:
            code === "STOCK_INSUFICIENTE"
              ? "Una de las tallas de tu carrito ya no tiene suficiente stock."
              : "Uno de los productos de tu carrito ya no está disponible.",
          items: [{ variantId, available: Number(available ?? 0) }],
        },
        409,
      );
    }
    console.error("[checkout] create_order falló", error);
    return reply({ ok: false, code: "SERVER", message: "No pudimos crear tu pedido. Intenta de nuevo en un momento." }, 500);
  }

  const order = (Array.isArray(data) ? data[0] : data) as { total: number; subtotal: number; shipping: number };
  const amountInCents = order.total * 100;
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  return reply({
    ok: true,
    reference,
    amountInCents,
    currency: "COP",
    signature: integritySignature(reference, amountInCents, "COP"),
    publicKey: wompiPublicKey,
    redirectUrl: `${origin}/confirmacion/${reference}`,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
  });
}
