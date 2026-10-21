"use client";

import { useState, useTransition } from "react";
import { setOrderStatus } from "@/lib/admin/actions";
import { NEXT_STATUS } from "@/lib/admin/status";
import type { OrderStatus } from "@/lib/orders-types";
import { cn } from "@/lib/utils";

/** Avanza el pedido al siguiente estado permitido, con confirmación. */
export function OrderStatusButton({ reference, status }: { reference: string; status: OrderStatus }) {
  const next = NEXT_STATUS[status];
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  if (!next) return null;

  const destructive = next.status === "cancelado";

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          const msg = destructive
            ? `¿Cancelar el pedido ${reference}? El cliente no ha pagado; esta acción no se puede deshacer.`
            : `¿${next.label} el pedido ${reference}?`;
          if (!window.confirm(msg)) return;
          setError(null);
          startTransition(async () => {
            const res = await setOrderStatus(reference, next.status);
            if (!res.ok) setError(res.error);
          });
        }}
        className={cn(
          "eyebrow h-10 rounded-full px-5 whitespace-nowrap transition-colors disabled:opacity-50",
          destructive ? "border border-line text-stone hover:border-bone hover:text-bone" : "bg-sand text-ink hover:bg-bone",
        )}
      >
        {pending ? "Guardando…" : next.label}
      </button>
      {error && (
        <p role="alert" className="text-xs text-sand">
          {error}
        </p>
      )}
    </div>
  );
}
