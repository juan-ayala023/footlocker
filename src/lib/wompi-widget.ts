"use client";

// Widget de Wompi: https://docs.wompi.co/docs/colombia/widget-checkout-web/

type WidgetConfig = {
  currency: "COP";
  amountInCents: number;
  reference: string;
  publicKey: string;
  signature: { integrity: string };
  redirectUrl?: string;
  customerData?: {
    email: string;
    fullName: string;
    phoneNumber: string;
    phoneNumberPrefix: string;
  };
  shippingAddress?: {
    addressLine1: string;
    city: string;
    phoneNumber: string;
    region: string;
    country: string;
  };
};

type WidgetResult = { transaction?: { id: string; status: string; reference: string } };

declare global {
  interface Window {
    WidgetCheckout?: new (config: WidgetConfig) => { open: (cb: (result: WidgetResult) => void) => void };
  }
}

const SRC = "https://checkout.wompi.co/widget.js";
let loading: Promise<void> | null = null;

/** Carga el script del widget solo cuando se va a pagar. */
export function loadWompiWidget() {
  if (typeof window !== "undefined" && window.WidgetCheckout) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = null;
      reject(new Error("No se pudo cargar el widget de Wompi"));
    };
    document.head.appendChild(script);
  });
  return loading;
}

export async function openWompiCheckout(config: WidgetConfig): Promise<WidgetResult> {
  await loadWompiWidget();
  if (!window.WidgetCheckout) throw new Error("Widget de Wompi no disponible");
  const checkout = new window.WidgetCheckout(config);
  return new Promise((resolve) => checkout.open(resolve));
}
