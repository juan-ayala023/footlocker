"use client";

import { useState, useTransition } from "react";
import { setProductPrice } from "@/lib/admin/actions";
import { cn, formatCOP } from "@/lib/utils";

const toNumber = (s: string) => {
  const digits = s.replace(/\D/g, "");
  return digits ? Number(digits) : null;
};
const fmt = (n: number | null) => (n ? n.toLocaleString("es-CO") : "");

const clearedNote = (n: number) =>
  n ? ` Se quitó el precio antes en ${n === 1 ? "1 producto" : `${n} productos`} porque ya no era mayor que el nuevo precio.` : "";

/** Precio editable en la lista de productos: se guarda con Enter o al salir del campo. */
export function InlinePrice({ id, price }: { id: string; price: number }) {
  const [value, setValue] = useState(fmt(price));
  const [saved, setSaved] = useState(price);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [pending, startTransition] = useTransition();

  const save = () => {
    const next = toNumber(value);
    if (!next || next === saved) {
      setValue(fmt(saved));
      return;
    }
    startTransition(async () => {
      const res = await setProductPrice(id, next);
      if (!res.ok) {
        setStatus("error");
        setValue(fmt(saved));
        window.alert(res.error);
        return;
      }
      setSaved(next);
      setStatus("ok");
      if (res.data?.clearedCompare) window.alert(clearedNote(res.data.clearedCompare).trim());
    });
  };

  return (
    <label className="flex shrink-0 items-center gap-1 border-b border-line text-sm focus-within:border-bone">
      <span className="text-stone">$</span>
      <input
        inputMode="numeric"
        aria-label="Precio (COP)"
        value={value}
        disabled={pending}
        onChange={(e) => {
          setValue(fmt(toNumber(e.target.value)));
          setStatus("idle");
        }}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") {
            setValue(fmt(saved));
            e.currentTarget.blur();
          }
        }}
        className={cn("h-9 w-20 bg-transparent tabular-nums focus:outline-none sm:w-24", pending && "opacity-50")}
      />
      <span aria-live="polite" className={cn("w-3 text-xs", status === "ok" ? "text-sand" : "text-hot")}>
        {status === "ok" ? "✓" : status === "error" ? "!" : ""}
      </span>
    </label>
  );
}

/** Mismo precio para todos los productos (activos e inactivos). */
export function BulkPrice({ count }: { count: number }) {
  const [price, setPrice] = useState("");
  const [compare, setCompare] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = toNumber(price);
    const c = toNumber(compare);
    if (!p) return setMessage({ ok: false, text: "Escribe el precio." });
    if (c !== null && c <= p) return setMessage({ ok: false, text: "El precio antes debe ser mayor que el precio nuevo." });

    const detail = c ? ` con precio antes de ${formatCOP(c)}` : "";
    if (!window.confirm(`¿Poner ${formatCOP(p)}${detail} a los ${count} productos?`)) return;

    startTransition(async () => {
      // Sin "precio antes" se deja el de cada producto (si sigue siendo mayor).
      const res = await setProductPrice(null, p, c ?? undefined);
      if (!res.ok) return setMessage({ ok: false, text: res.error });
      setMessage({
        ok: true,
        text: `Listo: ${res.data?.updated ?? 0} productos quedaron en ${formatCOP(p)}.${clearedNote(res.data?.clearedCompare ?? 0)}`,
      });
      setPrice("");
      setCompare("");
    });
  };

  return (
    <form onSubmit={submit} className="px-5 py-5">
      <p className="text-sm text-stone">Pone el mismo precio a todos los productos. Para cambiar uno solo, edita su precio en la lista.</p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
        <MoneyField label="Precio nuevo (COP)" value={price} onChange={setPrice} />
        <MoneyField label="Precio antes (opcional)" value={compare} onChange={setCompare} placeholder="Dejar el actual" />
        <button
          type="submit"
          disabled={pending}
          className="eyebrow inline-flex h-11 items-center justify-center rounded-full bg-sand px-6 text-ink hover:bg-bone disabled:opacity-50"
        >
          {pending ? "Aplicando…" : "Aplicar a todos"}
        </button>
      </div>
      {message && (
        <p role="status" className={cn("mt-3 text-sm", message.ok ? "text-sand" : "text-hot")}>
          {message.text}
        </p>
      )}
    </form>
  );
}

function MoneyField({ label, value, onChange, placeholder = "0" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="flex-1 sm:max-w-56">
      <span className="eyebrow mb-2 block text-stone">{label}</span>
      <span className="flex items-center gap-1 border-b border-line focus-within:border-bone">
        <span className="text-stone">$</span>
        <input
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(fmt(toNumber(e.target.value)))}
          placeholder={placeholder}
          className="h-11 flex-1 bg-transparent tabular-nums placeholder:text-stone focus:outline-none"
        />
      </span>
    </label>
  );
}
