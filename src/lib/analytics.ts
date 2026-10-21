"use client";

// Eventos de e-commerce para Meta Pixel y GA4. Si un proveedor no está cargado, se ignora.
// IDs por entorno: NEXT_PUBLIC_META_PIXEL_ID, NEXT_PUBLIC_GA4_ID (ver components/analytics/Analytics.tsx).

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type AnalyticsItem = {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity?: number;
  size?: number;
};

const CURRENCY = "COP";

const ga4Items = (items: AnalyticsItem[]) =>
  items.map((i) => ({
    item_id: i.id,
    item_name: i.name,
    item_brand: i.brand,
    item_variant: i.size ? `Talla ${i.size}` : undefined,
    price: i.price,
    quantity: i.quantity ?? 1,
  }));

const value = (items: AnalyticsItem[]) => items.reduce((n, i) => n + i.price * (i.quantity ?? 1), 0);

function send(meta: [string, Record<string, unknown>, Record<string, unknown>?] | null, ga: [string, Record<string, unknown>] | null) {
  try {
    if (meta && window.fbq) window.fbq("track", ...meta);
    if (ga && window.gtag) window.gtag("event", ...ga);
  } catch {
    // La analítica nunca debe romper la compra.
  }
}

export function trackViewContent(item: AnalyticsItem) {
  send(
    ["ViewContent", { content_ids: [item.id], content_name: item.name, content_type: "product", value: item.price, currency: CURRENCY }],
    ["view_item", { currency: CURRENCY, value: item.price, items: ga4Items([item]) }],
  );
}

export function trackAddToCart(item: AnalyticsItem) {
  const items = [item];
  send(
    ["AddToCart", { content_ids: [item.id], content_name: item.name, content_type: "product", value: value(items), currency: CURRENCY }],
    ["add_to_cart", { currency: CURRENCY, value: value(items), items: ga4Items(items) }],
  );
}

export function trackInitiateCheckout(items: AnalyticsItem[]) {
  send(
    ["InitiateCheckout", { content_ids: items.map((i) => i.id), num_items: items.reduce((n, i) => n + (i.quantity ?? 1), 0), value: value(items), currency: CURRENCY }],
    ["begin_checkout", { currency: CURRENCY, value: value(items), items: ga4Items(items) }],
  );
}

/** Se envía una sola vez por referencia (recargar la confirmación no duplica la venta). */
export function trackPurchase(reference: string, items: AnalyticsItem[], total: number, shipping: number) {
  const key = `fl-purchase-${reference}`;
  try {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
  } catch {}
  send(
    // eventID permite deduplicar si luego se agrega la API de Conversiones de Meta.
    ["Purchase", { content_ids: items.map((i) => i.id), content_type: "product", value: total, currency: CURRENCY }, { eventID: reference }],
    ["purchase", { transaction_id: reference, currency: CURRENCY, value: total, shipping, items: ga4Items(items) }],
  );
}
