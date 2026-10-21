"use client";

import { useSyncExternalStore } from "react";
import { useCart } from "@/store/cart";

/** true cuando el carrito ya se leyó de localStorage (evita mostrar "vacío" por un instante). */
export function useCartHydrated() {
  return useSyncExternalStore(
    (cb) => useCart.persist.onFinishHydration(cb),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}
