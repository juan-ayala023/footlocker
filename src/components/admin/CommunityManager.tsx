"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageManager } from "@/components/admin/ImageManager";
import { Switch } from "@/components/admin/ProductToggles";
import { Empty, Panel } from "@/components/admin/ui";
import { inputClass } from "@/components/checkout/Field";
import {
  approveCommunityPhoto,
  deleteCommunityPhoto,
  rejectCommunityPhoto,
  saveCommunityPhoto,
  toggleCommunityPhoto,
} from "@/lib/admin/actions";
import { cn } from "@/lib/utils";

type Photo = {
  id: string;
  image: string;
  handle: string | null;
  active: boolean;
  productName: string | null;
};
type Pending = {
  id: string;
  url: string | null;
  handle: string | null;
  /** Ya formateada en el servidor (Intl difiere entre Node y el navegador e hidrata mal). */
  createdAt: string;
};
type ProductOption = { id: string; label: string };

export function CommunityManager({ pending, photos, products }: { pending: Pending[]; photos: Photo[]; products: ProductOption[] }) {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [handle, setHandle] = useState("");
  const [productId, setProductId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!image) return setError("Sube una foto primero.");
    startTransition(async () => {
      const res = await saveCommunityPhoto({
        image,
        handle,
        product_id: productId || null,
      });
      if (!res.ok) return setError(res.error);
      setImage(null);
      setHandle("");
      setProductId("");
      router.refresh();
    });
  };

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) window.alert(res.error);
      router.refresh();
    });

  return (
    <div className="space-y-8">
      <Panel title={`Por revisar · ${pending.length}`}>
        {pending.length ? (
          <ul className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 lg:grid-cols-4">
            {pending.map((p) => (
              <PendingCard key={p.id} photo={p} products={products} pending={busy} onRun={run} />
            ))}
          </ul>
        ) : (
          <Empty>No hay fotos nuevas de clientes por revisar.</Empty>
        )}
      </Panel>

      <div className="grid gap-8 xl:grid-cols-[22rem_1fr]">
        <Panel title="Agregar foto">
          <form onSubmit={add} className="space-y-5 p-5">
            <ImageManager images={image ? [image] : []} onChange={(imgs) => setImage(imgs[0] ?? null)} folder="comunidad" max={1} />
            <div>
              <label htmlFor="cm-handle" className="eyebrow text-stone">
                Usuario de Instagram (opcional)
              </label>
              <input
                id="cm-handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@usuario"
                className={inputClass()}
              />
            </div>
            <div>
              <label htmlFor="cm-product" className="eyebrow text-stone">
                Producto en la foto (opcional)
              </label>
              <select
                id="cm-product"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className={cn(inputClass(), "cursor-pointer")}
              >
                <option value="">Ninguno</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-stone">Si eliges un producto, la foto sale primero en su página.</p>
            </div>
            {error && (
              <p role="alert" className="text-sm text-sand">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="eyebrow h-11 w-full rounded-full bg-sand text-ink hover:bg-bone disabled:opacity-50"
            >
              {busy ? "Guardando…" : "Publicar foto"}
            </button>
          </form>
        </Panel>

        <Panel title={`Fotos publicadas · ${photos.length}`}>
          {photos.length ? (
            <ul className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((p) => (
                <li key={p.id} className={cn(!p.active && "opacity-50")}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-ink-raised">
                    <Image src={p.image} alt="" fill sizes="200px" className="object-cover" />
                  </div>
                  <p className="mt-2 truncate text-sm">{p.handle ? `@${p.handle}` : "Sin usuario"}</p>
                  <p className="truncate text-xs text-stone">{p.productName ?? "Sin producto"}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <Switch label="Visible" checked={p.active} onChange={() => run(() => toggleCommunityPhoto(p.id, !p.active))} />
                    <button
                      type="button"
                      onClick={() => window.confirm("¿Eliminar esta foto?") && run(() => deleteCommunityPhoto(p.id))}
                      className="text-xs text-stone hover:text-sand"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>Aún no hay fotos. Agrega la primera.</Empty>
          )}
        </Panel>
      </div>
    </div>
  );
}

/** Foto enviada por un cliente: el admin la acepta (con producto opcional) o la rechaza. */
function PendingCard({
  photo,
  products,
  pending,
  onRun,
}: {
  photo: Pending;
  products: ProductOption[];
  pending: boolean;
  onRun: (fn: () => Promise<{ ok: boolean; error?: string }>) => void;
}) {
  const [productId, setProductId] = useState("");
  return (
    <li>
      <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-ink-raised">
        {photo.url ? (
          // URL firmada del bucket privado: se muestra tal cual, sin el optimizador de imágenes.
          <Image src={photo.url} alt="Foto enviada por un cliente" fill unoptimized className="object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-xs text-stone">Sin vista previa</span>
        )}
      </div>
      <p className="mt-2 truncate text-sm">{photo.handle ? `@${photo.handle}` : "Sin usuario"}</p>
      <p className="text-xs text-stone">{photo.createdAt}</p>
      <label htmlFor={`cm-p-${photo.id}`} className="sr-only">
        Producto en la foto
      </label>
      <select
        id={`cm-p-${photo.id}`}
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        className={cn(inputClass(), "mt-2 h-9 cursor-pointer text-xs")}
      >
        <option value="">Producto (opcional)</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => onRun(() => approveCommunityPhoto(photo.id, productId || null))}
          className="h-9 rounded-full bg-sand text-xs font-medium text-ink hover:bg-bone disabled:opacity-50"
        >
          Aceptar
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => window.confirm("¿Rechazar y borrar esta foto?") && onRun(() => rejectCommunityPhoto(photo.id))}
          className="h-9 rounded-full border border-line text-xs font-medium hover:border-bone disabled:opacity-50"
        >
          Rechazar
        </button>
      </div>
    </li>
  );
}
