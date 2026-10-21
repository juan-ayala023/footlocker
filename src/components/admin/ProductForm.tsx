"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageManager } from "@/components/admin/ImageManager";
import { Switch } from "@/components/admin/ProductToggles";
import { Panel } from "@/components/admin/ui";
import { inputClass } from "@/components/checkout/Field";
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
  featured: boolean;
  active: boolean;
  variants: { id?: string; size: number; stock: number; sku: string }[];
};

const PRESETS = [
  { label: "Hombre 38–44", sizes: [38, 39, 40, 41, 42, 43, 44] },
  { label: "Mujer 35–40", sizes: [35, 36, 37, 38, 39, 40] },
  { label: "Unisex 36–44", sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44] },
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
      featured: v.featured,
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
              <input id="brand" list="brands" required value={v.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Nike" className={inputClass()} />
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

        <Panel title={`Tallas y stock · ${totalStock} pares`}>
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
                  <span>Talla</span>
                  <span>Stock</span>
                  <span>SKU (opcional)</span>
                  <span />
                </div>
                {rows.map((r) => (
                  <div key={r.key} className="grid grid-cols-[4.5rem_5rem_1fr_2rem] items-center gap-3 py-1.5">
                    <input
                      aria-label="Talla"
                      inputMode="decimal"
                      value={r.size}
                      onChange={(e) => setRows((all) => all.map((x) => (x.key === r.key ? { ...x, size: e.target.value } : x)))}
                      className="h-10 border-b border-transparent bg-transparent text-sm tabular-nums focus:border-bone focus:outline-none"
                    />
                    <input
                      aria-label={`Stock talla ${r.size}`}
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={r.stock}
                      onChange={(e) => setRows((all) => all.map((x) => (x.key === r.key ? { ...x, stock: e.target.value } : x)))}
                      className={cn("h-10 border-b border-transparent bg-transparent text-sm tabular-nums focus:border-bone focus:outline-none", Number(r.stock) === 0 && "text-stone")}
                    />
                    <input
                      aria-label={`SKU talla ${r.size}`}
                      value={r.sku}
                      placeholder="Automático"
                      onChange={(e) => setRows((all) => all.map((x) => (x.key === r.key ? { ...x, sku: e.target.value } : x)))}
                      className="h-10 min-w-0 border-b border-transparent bg-transparent text-sm placeholder:text-stone/50 focus:border-bone focus:outline-none"
                    />
                    <button
                      type="button"
                      aria-label={`Quitar talla ${r.size}`}
                      onClick={() => setRows((all) => all.filter((x) => x.key !== r.key))}
                      className="text-stone hover:text-sand"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone">Sin tallas. Usa un rango rápido o agrega una manualmente.</p>
            )}

            <button
              type="button"
              onClick={() => setRows((r) => [...r, { key: rowKey(), size: "", stock: "0", sku: "" }])}
              className="eyebrow mt-4 text-stone hover:text-bone"
            >
              + Agregar talla
            </button>
            {rows.some((r) => r.id) && (
              <p className="mt-3 text-xs text-stone">Si quitas una talla que ya tiene pedidos, se conserva con stock 0 para no perder el historial.</p>
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
