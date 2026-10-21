"use client";

import { useOptimistic, useTransition } from "react";
import { toggleProduct } from "@/lib/admin/actions";
import { cn } from "@/lib/utils";

export function ProductToggles({ id, active, featured }: { id: string; active: boolean; featured: boolean }) {
  const [, startTransition] = useTransition();
  const [state, setState] = useOptimistic({ active, featured });

  const flip = (field: "active" | "featured") =>
    startTransition(async () => {
      setState((s) => ({ ...s, [field]: !s[field] }));
      const res = await toggleProduct(id, field, !state[field]);
      if (!res.ok) window.alert(res.error);
    });

  return (
    <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-4">
      <Switch label="Destacado" checked={state.featured} onChange={() => flip("featured")} />
      <Switch label="Activo" checked={state.active} onChange={() => flip("active")} />
    </div>
  );
}

export function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs text-stone">
      <span className="hidden sm:inline">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={cn("relative h-5 w-9 rounded-full border transition-colors", checked ? "border-sand bg-sand" : "border-line bg-transparent")}
      >
        <span className={cn("absolute top-0.5 left-0.5 size-3.5 rounded-full transition-transform", checked ? "translate-x-4 bg-ink" : "bg-stone")} />
      </button>
    </label>
  );
}
