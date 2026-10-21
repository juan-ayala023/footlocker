"use client";

/**
 * Ejecuta `cb` cuando el navegador esté libre (tras el primer render y el LCP),
 * con un máximo de espera. Devuelve una función para cancelar.
 */
export function whenIdle(cb: () => void, timeout = 1500) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(cb, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(cb, 300);
  return () => window.clearTimeout(id);
}
