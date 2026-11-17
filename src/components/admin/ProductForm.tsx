"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageManager } from "@/components/admin/ImageManager";
import { Switch } from "@/components/admin/ProductToggles";
import { Panel } from "@/components/admin/ui";
import { inputClass } from "@/components/checkout/Field";
import { NOTES, OCCASIONS } from "@/data/perfume";
import { deleteProduct, saveProduct, type ProductInput } from "@/lib/admin/actions";
import { slugify } from "@/lib/slug";
import { cn, formatCOP } from "@/lib/utils";

type VariantRow = { key: string; id?: string; size: string; stock: string; sku: string };

export type ProductFormValue = {
  id?: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: number | null;
  compare_at_price: number | null;
  gender: "hombre" | "mujer" | "unisex";
  collection_id: string | null;
  images: string[];
  notes: string[];
  occasions: string[];
  featured: boolean;
  best_seller: boolean;
  active: boolean;
  variants: { id?: string; size: number; stock: number; sku: string }[];
};

const toggleIn = (list: string[], value: string) => (list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);

const PRESETS = [
  { label: "30 ml", sizes: [30] },
  { label: "50 ml", sizes: [50] },
  { label: "100 ml", sizes: [100] },
  { label: "200 ml", sizes: [200] },
];

let keySeq = 0;
const rowKey = () => `r${++keySeq}`;

export function ProductForm({
  initial,
  collections,
  brands,
}: {
  initial: ProductFormValue;
  collections: { id: string; name: string }[];
  brands: string[];
}) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [rows, setRows] = useState<VariantRow[]>(
    initial.variants.map((x) => ({ key: rowKey(), id: x.id, size: String(x.size), stock: String(x.stock), sku: x.sku })),
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const folder = useMemo(() => initial.id ?? `nuevo-${crypto.randomUUID().slice(0, 8)}`, [initial.id]);

  const set = <K extends keyof ProductFormValue>(k: K, value: ProductFormValue[K]) => {
    setSaved(false);
    setV((s) => ({ ...s, [k]: value }));
  };
  const autoSlug = slugify(`${v.brand} ${v.name}`);
  const totalStock = rows.reduce((n, r) => n + (Number(r.stock) || 0), 0);

  const addSizes = (sizes: number[]) => {
    const existing = new Set(rows.map((r) => Number(r.size)));
    setRows((r) => [
      ...r,
      ...sizes.filter((s) => !existing.has(s)).map((s) => ({ key: rowKey(), size: String(s), stock: "0", sku: "" })),
    ]);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload: ProductInput = {
      id: v.id,
      name: v.name,
      slug: slugTouched ? v.slug : autoSlug,
      brand: v.brand,
      description: v.description,
      price: v.price ?? 0,
      compare_at_price: v.compare_at_price || null,
      gender: v.gender,
      collection_id: v.collection_id || null,
      images: v.images,
      notes: v.notes as ProductInput["notes"],
      occasions: v.occasions as ProductInput["occasions"],
      featured: v.featured,
      best_seller: v.best_seller,
      active: v.active,
      variants: rows
        .filter((r) => r.size.trim() !== "")
        .map((r) => ({ id: r.id, size: Number(r.size.replace(",", ".")), stock: Math.max(0, Math.floor(Number(r.stock) || 0)), sku: r.sku || undefined })),
    };
    startTransition(async () => {
      const res = await saveProduct(payload);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSaved(true);
      if (!v.id && res.data) router.replace(`/admin/productos/${res.data.id}`);
      else router.refresh();
    });
  };

  const remove = () => {
    if (!v.id || !window.confirm(`¿Eliminar "${v.brand} ${v.name}"? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      const res = await deleteProduct(v.id!);
      if (!res.ok) setError(res.error);
      else router.replace("/admin/productos");
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-8 xl:grid-cols-[1fr_22rem]">
      <div className="space-y-8">
        <Panel title="Información">
          <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2">
            <Text label="Nombre" value={v.name} onChange={(x) => set("name", x)} required placeholder="Air Force 1 '07" />
            <div>
              <Label htmlFor="brand">Marca</Label>
              <input id="brand" list="brands" required value={v.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Dior" className={inputClass()} />
              <datalist id="brands">
                {brands.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="slug">URL</Label>
              <div className="flex items-center gap-1 border-b border-line focus-within:border-bone">
                <span className="text-sm text-stone">/producto/</span>
                <input
                  id="slug"
                  value={slugTouched ? v.slug : autoSlug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value));
                  }}
                  className="h-12 flex-1 bg-transparent text-base focus:outline-none"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                rows={4}
                value={v.description}
                onChange={(e) => set("description", e.target.value)}
                className="mt-2 w-full resize-y border border-line bg-transparent p-3 text-sm focus:border-bone focus:outline-none"
              />
            </div>
          </div>
        </Panel>

        <Panel title="Imágenes">
          <div className="p-5">
            <ImageManager images={v.images} onChange={(imgs) => set("images", imgs)} folder={folder} />
          </div>
        </Panel>

        <Panel title={`Presentaciones y stock · ${totalStock} unidades`}>
          <div className="p-5">
            <div className="mb-4 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button key={p.label} type="button" onClick={() => addSizes(p.sizes)} className="rounded-full border border-line px-3 py-1.5 text-xs text-mist hover:border-bone hover:text-bone">
                  + {p.label}
                </button>
              ))}
            </div>

            {rows.length > 0 ? (
              <div className="divide-y divide-line border-y border-line">
                <div className="grid grid-cols-[4.5rem_5rem_1fr_2rem] gap-3 py-2 text-xs text-stone">
                  <span>ml</span>
                  <span>Stock</span>
                  <span>SKU (opcional)</span>
                  <span />
                </div>
                {rows.map((r) => (
                  <div key={r.key} className="grid grid-cols-[4.5rem_5rem_1fr_2rem] items-center gap-3 py-1.5">
                    <input
                      aria-label="Presentación en ml"
                      inputMode="decimal"
                      value={r.size}
                      onChange={(e) => setRows((all) => all.map((x) => (x.key === r.key ? { ...x, size: e.target.value } : x)))}
                      className="h-10 border-b border-transparent bg-transparent text-sm tabular-nums focus:border-bone focus:outline-none"
                    />
                    <input
                      aria-label={`Stock de ${r.size} ml`}
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={r.stock}
                      onChange={(e) => setRows((all) => all.map((x) => (x.key === r.key ? { ...x, stock: e.target.value } : x)))}
                      className={cn("h-10 border-b border-transparent bg-transparent text-sm tabular-nums focus:border-bone focus:outline-none", Number(r.stock) === 0 && "text-stone")}
                    />
                    <input
                      aria-label={`SKU de ${r.size} ml`}
                      value={r.sku}
                      placeholder="Automático"
                      onChange={(e) => setRows((all) => all.map((x) => (x.key === r.key ? { ...x, sku: e.target.value } : x)))}
                      className="h-10 min-w-0 border-b border-transparent bg-transparent text-sm placeholder:text-stone/50 focus:border-bone focus:outline-none"
                    />
                    <button
                      type="button"
                      aria-label={`Quitar ${r.size} ml`}
                      onClick={() => setRows((all) => all.filter((x) => x.key !== r.key))}
                      className="text-stone hover:text-sand"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone">Sin presentaciones. Usa un tamaño rápido o agrega uno manualmente (en ml).</p>
            )}

            <button
              type="button"
              onClick={() => setRows((r) => [...r, { key: rowKey(), size: "", stock: "0", sku: "" }])}
              className="eyebrow mt-4 text-stone hover:text-bone"
            >
              + Agregar presentación
            </button>
            {rows.some((r) => r.id) && (
              <p className="mt-3 text-xs text-stone">Si quitas una presentación que ya tiene pedidos, se conserva con stock 0 para no perder el historial.</p>
            )}
          </div>
        </Panel>
      </div>

      <div className="space-y-8 xl:sticky xl:top-12 xl:self-start">
        <Panel title="Publicación">
          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between text-sm">
              <span>Visible en la tienda</span>
              <Switch label="Activo" checked={v.active} onChange={() => set("active", !v.active)} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Destacado</span>
              <Switch label="Destacado" checked={v.featured} onChange={() => set("featured", !v.featured)} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>
                Más vendido <span className="text-xs text-stone">· etiqueta naranja en el catálogo</span>
              </span>
              <Switch label="Más vendido" checked={v.best_seller} onChange={() => set("best_seller", !v.best_seller)} />
            </div>
            <p className="text-xs text-stone">“Nuevo” se muestra solo durante los primeros 30 días desde que se crea el producto.</p>
          </div>
        </Panel>

        <Panel title="Precio">
          <div className="space-y-5 p-5">
            <Money label="Precio (COP)" value={v.price} onChange={(x) => set("price", x)} required />
            <Money label="Precio antes (opcional)" value={v.compare_at_price} onChange={(x) => set("compare_at_price", x)} hint="Se muestra tachado con el % de descuento." />
          </div>
        </Panel>

        <Panel title="Organización">
          <div className="space-y-5 p-5">
            <div>
              <Label htmlFor="gender">Género</Label>
              <select id="gender" value={v.gender} onChange={(e) => set("gender", e.target.value as ProductFormValue["gender"])} className={cn(inputClass(), "cursor-pointer")}>
                <option value="unisex">Unisex</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
              </select>
            </div>
            <div>
              <Label htmlFor="collection">Colección</Label>
              <select id="collection" value={v.collection_id ?? ""} onChange={(e) => set("collection_id", e.target.value || null)} className={cn(inputClass(), "cursor-pointer")}>
                <option value="">Sin colección</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Panel>

        <Panel title="Notas olfativas y ocasión">
          <div className="space-y-5 p-5">
            <p className="text-xs text-stone">Son los filtros del catálogo. Marca todas las que apliquen.</p>
            <ChipGroup label="Notas olfativas" options={NOTES} value={v.notes} onToggle={(x) => set("notes", toggleIn(v.notes, x))} />
            <ChipGroup label="Ocasión" options={OCCASIONS} value={v.occasions} onToggle={(x) => set("occasions", toggleIn(v.occasions, x))} />
          </div>
        </Panel>

        <div className="space-y-3">
          {error && (
            <p role="alert" className="border border-sand/40 bg-sand/10 px-4 py-3 text-sm text-sand">
              {error}
            </p>
          )}
          <button type="submit" disabled={pending} className="eyebrow h-12 w-full rounded-full bg-sand text-ink transition-colors hover:bg-bone disabled:opacity-50">
            {pending ? "Guardando…" : saved ? "Guardado ✓" : v.id ? "Guardar cambios" : "Crear producto"}
          </button>
          {v.id && (
            <button type="button" onClick={remove} disabled={pending} className="eyebrow h-10 w-full text-stone hover:text-sand">
              Eliminar producto
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function ChipGroup({
  label,
  options,
  value,
  onToggle,
}: {
  label: string;
  options: readonly { value: string; label: string }[];
  value: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="eyebrow mb-3 text-stone">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(o.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                active ? "border-sand bg-sand text-ink" : "border-line text-mist hover:border-bone hover:text-bone",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="eyebrow block text-stone">
      {children}
    </label>
  );
}

function Text({ label, value, onChange, required, placeholder }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string }) {
  const id = slugify(label);
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input id={id} required={required} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputClass()} />
    </div>
  );
}

function Money({ label, value, onChange, required, hint }: { label: string; value: number | null; onChange: (v: number | null) => void; required?: boolean; hint?: string }) {
  const id = slugify(label);
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        inputMode="numeric"
        required={required}
        value={value ? value.toLocaleString("es-CO") : ""}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          onChange(digits ? Number(digits) : null);
        }}
        placeholder="0"
        className={cn(inputClass(), "tabular-nums")}
      />
      <p className="mt-1.5 text-xs text-stone">{value ? formatCOP(value) : hint}</p>
    </div>
  );
}
