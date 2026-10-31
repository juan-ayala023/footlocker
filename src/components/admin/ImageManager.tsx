"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

const MAX_MB = 15;
const BUCKET = "products";
/** Lado mayor de las fotos subidas (como las del catálogo, 1200 px). */
const MAX_SIDE = 1600;

/**
 * Reduce y convierte a webp en el navegador antes de subir: la tienda sirve las fotos tal cual
 * (sin optimizador), así que una foto de 2 MB se descargaría completa en cada tarjeta.
 */
async function compress(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No se pudo procesar la imagen"))), "image/webp", 0.85),
  );
}

/** Sube imágenes al bucket "products" de Supabase Storage (sesión del admin) y gestiona su orden. */
export function ImageManager({
  images,
  onChange,
  folder,
  max = 8,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  folder: string;
  max?: number;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    const list = [...files].slice(0, max - images.length);
    const bad = list.find((f) => !f.type.startsWith("image/") || f.size > MAX_MB * 1024 * 1024);
    if (bad) {
      setError(`"${bad.name}" no es una imagen o pesa más de ${MAX_MB} MB.`);
      return;
    }

    setUploading(list.length);
    const supabase = getBrowserClient();
    const urls: string[] = [];
    for (const file of list) {
      let body: Blob;
      try {
        body = await compress(file);
      } catch {
        setError(`No se pudo procesar "${file.name}". Prueba con una foto JPG o PNG.`);
        break;
      }
      const path = `${folder}/${crypto.randomUUID()}.webp`;
      const { error: upError } = await supabase.storage.from(BUCKET).upload(path, body, { cacheControl: "31536000", contentType: "image/webp" });
      if (upError) {
        setError(`No se pudo subir "${file.name}": ${upError.message}`);
        break;
      }
      urls.push(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
      setUploading((n) => n - 1);
    }
    setUploading(0);
    if (urls.length) onChange([...images, ...urls]);
    if (input.current) input.current.value = "";
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };

  return (
    <div>
      <ul className={cn("grid gap-3", max === 1 ? "grid-cols-1" : "grid-cols-3 sm:grid-cols-4")}>
        {images.map((src, i) => (
          <li key={src} className="group relative aspect-[4/5] overflow-hidden border border-line bg-ink-raised">
            <Image src={src} alt="" fill sizes="160px" className="object-cover" />
            {i === 0 && <span className="eyebrow absolute top-2 left-2 rounded-full bg-sand px-2 py-1 text-[0.5625rem] text-ink">Principal</span>}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/85 px-1 py-1 opacity-100 backdrop-blur transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
              <IconButton label="Mover a la izquierda" disabled={i === 0} onClick={() => move(i, i - 1)}>
                ←
              </IconButton>
              <IconButton label="Quitar imagen" onClick={() => onChange(images.filter((_, j) => j !== i))}>
                ×
              </IconButton>
              <IconButton label="Mover a la derecha" disabled={i === images.length - 1} onClick={() => move(i, i + 1)}>
                →
              </IconButton>
            </div>
          </li>
        ))}

        {images.length < max && (
          <li>
            <button
              type="button"
              onClick={() => input.current?.click()}
              disabled={uploading > 0}
              className={cn(
                "flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 border border-dashed border-line text-stone transition-colors hover:border-bone hover:text-bone",
                uploading > 0 && "animate-pulse",
              )}
            >
              <span className="text-2xl leading-none">+</span>
              <span className="eyebrow text-[0.5625rem]">{uploading ? `Subiendo ${uploading}…` : "Subir"}</span>
            </button>
          </li>
        )}
      </ul>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
      <p className="mt-3 text-xs text-stone">
        {max > 1 && "La primera es la principal; la segunda aparece al pasar el mouse en el catálogo. "}
        JPG, PNG o WebP hasta {MAX_MB} MB, idealmente 4:5.
      </p>
      {error && (
        <p role="alert" className="mt-2 text-xs text-sand">
          {error}
        </p>
      )}
    </div>
  );
}

function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick} className="flex size-7 items-center justify-center text-sm text-bone hover:text-sand disabled:opacity-30">
      {children}
    </button>
  );
}
