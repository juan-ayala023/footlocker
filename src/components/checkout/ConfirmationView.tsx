"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { SummitAnimation } from "@/components/checkout/SummitAnimation";
import { TextReveal } from "@/components/motion/TextReveal";
import { Button } from "@/components/ui/Button";
import { site } from "@/config/site";
import { trackPurchase } from "@/lib/analytics";
import { ease } from "@/lib/motion";
import { formatCOP } from "@/lib/utils";
import { useCart } from "@/store/cart";

export type ConfirmationOrder = {
  reference: string;
  status: "pendiente" | "pagado" | "enviado" | "entregado" | "cancelado";
  firstName: string;
  city: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: { productId: string; name: string; brand: string; size: number; quantity: number; price: number; image: string | null }[];
};

const POLL_MS = 3000;
const MAX_POLLS = 40; // ~2 minutos

export function ConfirmationView({ order }: { order: ConfirmationOrder }) {
  const txId = useSearchParams().get("id");
  const [status, setStatus] = useState(order.status);
  const clearCart = useCart((s) => s.clear);
  const paid = status === "pagado" || status === "enviado" || status === "entregado";
  const state = paid ? "success" : status === "cancelado" ? "failed" : "pending";

  // Mientras siga pendiente, consultar el estado (el webhook o la reconciliación lo actualizan).
  useEffect(() => {
    if (status !== "pendiente") return;
    let polls = 0;
    let stopped = false;
    const tick = async () => {
      if (stopped || polls++ >= MAX_POLLS) return;
      try {
        const qs = txId ? `?id=${encodeURIComponent(txId)}` : "";
        const res = await fetch(`/api/orders/${order.reference}${qs}`, { cache: "no-store" });
        const data = (await res.json()) as { status: ConfirmationOrder["status"] };
        if (data.status !== "pendiente") return setStatus(data.status);
      } catch {}
      if (!stopped) timer = setTimeout(tick, POLL_MS);
    };
    let timer = setTimeout(tick, 600);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [status, txId, order.reference]);

  useEffect(() => {
    if (!paid) return;
    clearCart();
    trackPurchase(
      order.reference,
      order.items.map((i) => ({ id: i.productId, name: `${i.brand} ${i.name}`, brand: i.brand, price: i.price, quantity: i.quantity, size: i.size })),
      order.total,
      order.shipping,
    );
    try {
      sessionStorage.removeItem("fl-checkout-draft");
    } catch {}
  }, [paid, clearCart, order]);

  const copy = {
    success: { eyebrow: "Pago confirmado", title: `Gracias, ${order.firstName}`, body: `Tu pedido va camino a ${order.city}. Te enviamos la confirmación a tu correo.` },
    pending: { eyebrow: "Confirmando tu pago", title: "Un momento", body: "Estamos esperando la confirmación de Wompi. Con PSE o Nequi puede tardar unos minutos." },
    failed: { eyebrow: "Pago no completado", title: "No se pudo procesar", body: "Tu pago fue rechazado o cancelado. Tu carrito sigue guardado para intentarlo de nuevo." },
  }[state];

  return (
    <div className="container-page relative isolate flex min-h-svh flex-col items-center pt-[calc(var(--nav-h)+3rem)] pb-[38svh] text-center">
      <SummitAnimation state={state} />

      <AnimatePresence mode="wait">
        <m.div
          key={state}
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: ease.premium }}
          aria-live="polite"
        >
          <p className="eyebrow mb-5 text-sand">{copy.eyebrow}</p>
          <TextReveal as="h1" text={copy.title} play delay={state === "success" ? 1.1 : 0.1} className="text-h1 uppercase" />
          <p className="mx-auto mt-6 max-w-md text-mist">{copy.body}</p>
          <p className="eyebrow mt-6 text-stone">Pedido {order.reference}</p>
        </m.div>
      </AnimatePresence>

      <m.div
        className="mt-14 w-full max-w-lg border border-line bg-ink/80 text-left backdrop-blur"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: ease.outSoft, delay: 0.6 }}
      >
        <ul className="divide-y divide-line px-5">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center gap-4 py-4">
              <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden bg-ink-raised">
                {item.image && <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">
                  {item.brand} {item.name}
                </p>
                <p className="text-xs text-stone">
                  Talla {item.size} · {item.quantity} {item.quantity === 1 ? "par" : "pares"}
                </p>
              </div>
              <p className="text-sm tabular-nums">{formatCOP(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="space-y-1.5 border-t border-line px-5 py-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-mist">Envío</dt>
            <dd className="tabular-nums">{order.shipping ? formatCOP(order.shipping) : "Gratis"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="eyebrow self-center">Total</dt>
            <dd className="font-display text-lg font-bold tabular-nums">{formatCOP(order.total)}</dd>
          </div>
        </dl>
      </m.div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {state === "failed" ? (
          <Button href="/checkout" size="lg">
            Intentar de nuevo
          </Button>
        ) : (
          <Button href="/catalogo" size="lg">
            Seguir explorando
          </Button>
        )}
        {site.whatsapp && (
          <Button
            href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hola, tengo una pregunta sobre mi pedido ${order.reference}`)}`}
            target="_blank"
            variant="outline"
            size="lg"
          >
            Escríbenos
          </Button>
        )}
      </div>
    </div>
  );
}
