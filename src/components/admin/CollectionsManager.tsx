"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageManager } from "@/components/admin/ImageManager";
import { Panel } from "@/components/admin/ui";
import { inputClass } from "@/components/checkout/Field";
import { deleteCollection, saveCollection } from "@/lib/admin/actions";

type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  count: number;
};

export function CollectionsManager({ collections }: { collections: Collection[] }) {
  const [editing, setEditing] = useState<string | "new" | null>(null);

  return (
    <div className="space-y-4">
      <Panel>
        <ul className="divide-y divide-line">
          {collections.map((c) => (
            <li key={c.id}>
              {editing === c.id ? (
                <CollectionEditor value={c} onDone={() => setEditing(null)} />
              ) : (
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="relative aspect-[4/5] w-12 shrink-0 overflow-hidden bg-ink-raised">
                    {c.image && <Image src={c.image} alt="" fill sizes="48px" className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      {c.name} <span className="text-stone">· /{c.slug}</span>
                    </p>
                    <p className="truncate text-xs text-stone">
                      {c.count} {c.count === 1 ? "producto" : "productos"} · orden {c.sort_order}
                      {c.description && ` · ${c.description}`}
                    </p>
                  </div>
                  <button type="button" onClick={() => setEditing(c.id)} className="eyebrow text-stone hover:text-bone">
                    Editar
                  </button>
                </div>
              )}
            </li>
          ))}
          {collections.length === 0 && editing !== "new" && <li className="px-5 py-10 text-center text-sm text-stone">Aún no hay colecciones.</li>}
          {editing === "new" && (
            <li>
              <CollectionEditor
                value={{ id: "", name: "", slug: "", description: "", image: null, sort_order: collections.length + 1, count: 0 }}
                onDone={() => setEditing(null)}
              />
            </li>
          )}
        </ul>
      </Panel>
      {editing !== "new" && (
        <button type="button" onClick={() => setEditing("new")} className="eyebrow h-11 rounded-full bg-sand px-6 text-ink hover:bg-bone">
          Nueva colección
        </button>
      )}
    </div>
  );
}

function CollectionEditor({ value, onDone }: { value: Collection; onDone: () => void }) {
  const router = useRouter();
  const [c, setC] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await saveCollection({
        id: c.id || undefined,
        name: c.name,
        slug: c.slug,
        description: c.description ?? "",
        image: c.image,
        sort_order: Number(c.sort_order) || 0,
      });
      if (!res.ok) return setError(res.error);
      router.refresh();
      onDone();
    });
  };

  const remove = () => {
    const warn = c.count ? ` Sus ${c.count} productos quedarán sin colección.` : "";
    if (!window.confirm(`¿Eliminar la colección "${c.name}"?${warn}`)) return;
    startTransition(async () => {
      const res = await deleteCollection(c.id);
      if (!res.ok) return setError(res.error);
      router.refresh();
      onDone();
    });
  };

  return (
    <form onSubmit={save} className="grid gap-6 bg-ink-raised/50 px-5 py-6 md:grid-cols-[10rem_1fr]">
      <ImageManager images={c.image ? [c.image] : []} onChange={(imgs) => setC({ ...c, image: imgs[0] ?? null })} folder="colecciones" max={1} />
      <div className="grid content-start gap-x-6 gap-y-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`cn-${c.id}`} className="eyebrow text-stone">
            Nombre
          </label>
          <input id={`cn-${c.id}`} required value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} className={inputClass()} />
        </div>
        <div>
          <label htmlFor={`cs-${c.id}`} className="eyebrow text-stone">
            Slug (opcional)
          </label>
          <input id={`cs-${c.id}`} value={c.slug} placeholder="Se genera del nombre" onChange={(e) => setC({ ...c, slug: e.target.value })} className={inputClass()} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`cd-${c.id}`} className="eyebrow text-stone">
            Descripción corta
          </label>
          <input id={`cd-${c.id}`} value={c.description ?? ""} onChange={(e) => setC({ ...c, description: e.target.value })} className={inputClass()} />
        </div>
        <div>
          <label htmlFor={`co-${c.id}`} className="eyebrow text-stone">
            Orden
          </label>
          <input id={`co-${c.id}`} type="number" min={0} value={c.sort_order} onChange={(e) => setC({ ...c, sort_order: Number(e.target.value) })} className={inputClass()} />
        </div>
        <div className="flex flex-wrap items-end justify-end gap-3 sm:col-span-2">
          {error && (
            <p role="alert" className="mr-auto text-xs text-sand">
              {error}
            </p>
          )}
          {c.id && (
            <button type="button" onClick={remove} disabled={pending} className="eyebrow h-10 px-3 text-stone hover:text-sand">
              Eliminar
            </button>
          )}
          <button type="button" onClick={onDone} className="eyebrow h-10 px-3 text-stone hover:text-bone">
            Cancelar
          </button>
          <button type="submit" disabled={pending} className="eyebrow h-10 rounded-full bg-sand px-6 text-ink hover:bg-bone disabled:opacity-50">
            {pending ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </form>
  );
}
