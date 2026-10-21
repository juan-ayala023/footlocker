import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConfirmationView, type ConfirmationOrder } from "@/components/checkout/ConfirmationView";
import { getOrder } from "@/lib/orders";
import { isAdminClientConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Confirmación de pedido",
  robots: { index: false, follow: false },
};

export default async function ConfirmationPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  if (!isAdminClientConfigured || !/^FL-\d{8}-[A-F0-9]{10}$/.test(reference)) notFound();

  const order = await getOrder(reference);
  if (!order) notFound();

  // Solo datos no sensibles: la referencia viaja en la URL.
  const view: ConfirmationOrder = {
    reference: order.reference,
    status: order.status,
    firstName: order.customer_name.split(" ")[0] ?? "",
    city: order.city,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    items: order.items.map((i) => ({
      productId: i.variant.product.id,
      name: i.variant.product.name,
      brand: i.variant.product.brand,
      size: Number(i.variant.size),
      quantity: i.quantity,
      price: i.unit_price,
      image: i.variant.product.images[0] ?? null,
    })),
  };

  return <ConfirmationView order={view} />;
}
