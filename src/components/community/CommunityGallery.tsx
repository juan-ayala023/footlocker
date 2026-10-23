"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useLenis } from "@/components/motion/SmoothScroll";
import { TransitionLink } from "@/components/motion/TransitionLink";
import type { CommunityUploadResponse } from "@/app/api/community/route";
import { inputClass } from "@/components/checkout/Field";
import { site } from "@/config/site";
import { COMMUNITY_ACCEPT, COMMUNITY_MAX_BYTES } from "@/lib/community-upload";
import type { CommunityPhoto } from "@/lib/community";
import { ease } from "@/lib/motion";
import { cn, formatCOP, productTitle } from "@/lib/utils";

/**
 * "El estilo de otras personas": fotos de clientes (curadas desde el admin).
 * La lupa abre la foto con el producto que aparece; "Sube tu foto" abre un formulario
 * y la foto queda pendiente hasta que el admin la acepte en /admin/comunidad.
 */
export function CommunityGallery({ photos, className }: { photos: CommunityPhoto[]; className?: string }) {
  const [open, setOpen] = useState<CommunityPhoto | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const close = useCallback(() => setOpen(null), []);
  const closeUpload = useCallback(() => setUploadOpen(false), []);

  return (
    <section aria-labelledby="comunidad-title" className={cn("py-16 md:py-24", className)}>
      <div className="container-page">
        <h2 id="comunidad-title" className="font-sans text-[1.75rem] leading-tight font-medium md:text-4xl">
          El estilo de otras personas
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed">
          Carga tu foto o menciona a @{site.instagramHandle} en Instagram para tener la oportunidad de aparecer en nuestras redes.
        </p>
        <button
          type="button"
          onClick={() => setUploadOpen(true)}
          aria-haspopup="dialog"
          className="mt-7 h-14 rounded-full border border-line px-9 text-lg font-medium transition-colors hover:border-bone"
        >
          Sube tu foto
        </button>

        {photos.length > 0 && (
          <ul
            data-lenis-prevent-touch
            className="-mx-(--gutter) mt-10 flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto px-(--gutter) pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {photos.map((photo, i) => (
              <li key={photo.id} className="relative w-[64vw] max-w-80 shrink-0 snap-start sm:w-72">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-ink-raised">
                  <Image src={photo.image} alt={photoAlt(photo, i)} fill sizes="(min-width: 640px) 288px, 64vw" className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(photo)}
                  aria-label={`Ampliar foto${photo.product ? ` con ${productTitle(photo.product.brand, photo.product.name)}` : ""}`}
                  className="absolute bottom-4 left-4 flex size-14 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 hover:scale-105"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    aria-hidden
                    className="size-6"
                  >
                    <circle cx="10.5" cy="10.5" r="6" />
                    <path d="m15.5 15.5 4.5 4.5" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <PhotoViewer photo={open} onClose={close} />
      <UploadForm open={uploadOpen} onClose={closeUpload} />
    </section>
  );
}

const photoAlt = (p: CommunityPhoto, i: number) =>
  p.product ? `Cliente usando ${productTitle(p.product.brand, p.product.name)}` : `Foto de la comunidad ${i + 1}`;

function useDialog(open: boolean, onClose: () => void) {
  const lenis = useLenis();
  const closeBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => closeBtn.current?.focus());
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [open, lenis, onClose]);
  return closeBtn;
}

function CloseButton({ onClick, label, buttonRef }: { onClick: () => void; label: string; buttonRef: React.Ref<HTMLButtonElement> }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-full hover:bg-bone/8"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden className="size-5">
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    </button>
  );
}

/** Foto ampliada con el producto etiquetado. */
function PhotoViewer({ photo, onClose }: { photo: CommunityPhoto | null; onClose: () => void }) {
  const closeBtn = useDialog(Boolean(photo), onClose);

  return (
    <AnimatePresence>
      {photo && (
        <div className="theme-light fixed inset-0 z-60 flex items-end justify-center sm:items-center sm:p-6">
          <m.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Foto de la comunidad"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.5, ease: ease.premium }}
            className="relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-2xl bg-ink text-bone sm:max-w-md sm:rounded-2xl"
          >
            <div className="flex items-center justify-between px-5 py-3">
              <p className="text-sm text-stone">{photo.handle ? `@${photo.handle}` : "Comunidad"}</p>
              <CloseButton onClick={onClose} label="Cerrar foto" buttonRef={closeBtn} />
            </div>
            <div className="relative aspect-[3/4] w-full shrink bg-ink-raised">
              <Image src={photo.image} alt={photoAlt(photo, 0)} fill sizes="(min-width: 640px) 448px, 100vw" className="object-cover" />
            </div>
            {photo.product && (
              <TransitionLink
                href={`/producto/${photo.product.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 px-5 py-4 hover:bg-ink-raised"
              >
                <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-ink-raised">
                  {photo.product.image && <Image src={photo.product.image} alt="" fill sizes="56px" className="object-cover" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.9375rem] font-medium">
                    {productTitle(photo.product.brand, photo.product.name)}
                  </span>
                  <span className="block text-sm text-stone tabular-nums">{formatCOP(photo.product.price)}</span>
                </span>
                <span className="text-sm font-medium underline underline-offset-4">Ver producto</span>
              </TransitionLink>
            )}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}

type UploadState = { kind: "idle" } | { kind: "sending" } | { kind: "done" } | { kind: "error"; message: string };

/** Formulario para que el cliente suba su foto; queda pendiente hasta que el admin la acepte. */
function UploadForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeBtn = useDialog(open, onClose);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<UploadState>({ kind: "idle" });
  const handle = site.instagramHandle;

  // Vista previa local de la foto elegida.
  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Al cerrar se limpia para el próximo envío.
  useEffect(() => {
    if (open) return;
    setFile(null);
    setState({ kind: "idle" });
  }, [open]);

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > COMMUNITY_MAX_BYTES) {
      setState({
        kind: "error",
        message: "La foto pesa más de 8 MB. Elige una más liviana.",
      });
      e.target.value = "";
      return;
    }
    setState({ kind: "idle" });
    setFile(f);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!file) return setState({ kind: "error", message: "Elige una foto." });
    if (data.get("consent") !== "on")
      return setState({
        kind: "error",
        message: "Debes autorizar la publicación de tu foto.",
      });
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/community", { method: "POST", body: data });
      const body = (await res.json()) as CommunityUploadResponse;
      setState(body.ok ? { kind: "done" } : { kind: "error", message: body.message });
    } catch {
      setState({
        kind: "error",
        message: "No pudimos enviar tu foto. Revisa tu conexión e intenta de nuevo.",
      });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="theme-light fixed inset-0 z-60 flex items-end justify-center sm:items-center sm:p-6">
          <m.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <m.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-title"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.5, ease: ease.premium }}
            data-lenis-prevent
            className="relative max-h-[92svh] w-full overflow-y-auto rounded-t-2xl bg-ink p-6 text-bone sm:max-w-md sm:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 id="upload-title" className="font-sans text-xl font-medium">
                {state.kind === "done" ? "¡Gracias por compartir tu estilo!" : "Comparte tu estilo"}
              </h3>
              <CloseButton onClick={onClose} label="Cerrar" buttonRef={closeBtn} />
            </div>

            {state.kind === "done" ? (
              <>
                <p role="status" className="mt-3 text-[0.9375rem] text-mist">
                  Recibimos tu foto. La revisaremos y, si es seleccionada, aparecerá aquí con tu usuario.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 h-14 w-full rounded-full bg-bone text-base font-medium text-ink hover:opacity-85"
                >
                  Listo
                </button>
              </>
            ) : (
              <form onSubmit={submit} onChange={() => state.kind === "error" && setState({ kind: "idle" })} noValidate className="mt-2">
                <p className="text-[0.9375rem] text-mist">Sube una foto con tus tenis. La revisamos antes de publicarla.</p>

                <label
                  className={cn(
                    "relative mt-5 flex aspect-4/3 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed text-center transition-colors",
                    file ? "border-transparent" : "border-line hover:border-bone",
                  )}
                >
                  {preview ? (
                    // Vista previa local (blob:): no pasa por el optimizador de imágenes.
                    <Image src={preview} alt="Vista previa de tu foto" fill unoptimized className="object-cover" />
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                        className="size-8 text-stone"
                      >
                        <path d="M4 16.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5" />
                      </svg>
                      <span className="mt-3 text-base font-medium">Elige tu foto</span>
                      <span className="mt-1 text-xs text-stone">JPG, PNG o WebP · máx. 8 MB</span>
                    </>
                  )}
                  <input type="file" name="photo" accept={COMMUNITY_ACCEPT} onChange={pick} className="sr-only" />
                </label>
                {file && <p className="mt-2 truncate text-xs text-stone">{file.name} · toca la foto para cambiarla</p>}

                <label htmlFor="cm-handle" className="mt-5 block text-sm font-medium">
                  Tu usuario de Instagram <span className="font-normal text-stone">(opcional)</span>
                </label>
                <input id="cm-handle" name="handle" autoComplete="off" maxLength={31} placeholder="@usuario" className={inputClass()} />

                {/* Trampa para bots: oculta para las personas. */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

                <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-mist">
                  <input type="checkbox" name="consent" className="mt-0.5 size-4 shrink-0 accent-current" />
                  Autorizo a {site.name} a publicar esta foto en su página web y redes sociales con mi usuario.
                </label>

                {state.kind === "error" && (
                  <p role="alert" className="mt-4 text-sm text-hot">
                    {state.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={state.kind === "sending"}
                  className="mt-6 h-14 w-full rounded-full bg-bone text-base font-medium text-ink transition-opacity hover:opacity-85 disabled:opacity-50"
                >
                  {state.kind === "sending" ? "Enviando…" : "Enviar foto"}
                </button>
                <a
                  href={`https://instagram.com/${handle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block text-center text-sm text-stone underline underline-offset-4 hover:text-bone"
                >
                  O etiquétanos en Instagram @{handle}
                </a>
              </form>
            )}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
