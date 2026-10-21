// Estados de pedido para el panel (compartido cliente/servidor).
import type { OrderStatus } from "@/lib/orders-types";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const STATUS_TONE: Record<OrderStatus, string> = {
  pendiente: "border-stone/40 text-stone",
  pagado: "border-sand bg-sand text-ink",
  enviado: "border-bone/60 text-bone",
  entregado: "border-line text-mist",
  cancelado: "border-line text-stone/60 line-through",
};

/** Siguiente paso permitido desde el panel (igual que admin_set_order_status en SQL). */
export const NEXT_STATUS: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  pendiente: { status: "cancelado", label: "Cancelar pedido" },
  pagado: { status: "enviado", label: "Marcar como enviado" },
  enviado: { status: "entregado", label: "Marcar como entregado" },
};

export const ORDER_STATUSES = Object.keys(STATUS_LABEL) as OrderStatus[];
