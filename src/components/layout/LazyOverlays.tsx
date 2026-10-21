"use client";

import dynamic from "next/dynamic";

// Componentes que no se ven en el primer render: se cargan después de hidratar,
// fuera del bundle inicial (menos JS antes del LCP).
const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer").then((m) => m.CartDrawer), { ssr: false });
const WhatsAppButton = dynamic(() => import("@/components/layout/WhatsAppButton").then((m) => m.WhatsAppButton), { ssr: false });

export function LazyOverlays() {
  return (
    <>
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}
