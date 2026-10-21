"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useLenis } from "@/components/motion/SmoothScroll";
import { ease } from "@/lib/motion";

/** Visor a pantalla completa (se carga solo cuando se abre). */
export function Lightbox({
  images,
  alt,
  start,
  onClose,
}: {
  images: string[];
  alt: string;
  start: number | null;
  onClose: () => void;
}) {
  const lenis = useLenis();
  const scroller = useRef<HTMLDivElement>(null);
  const open = start !== null;

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => {
      scroller.current?.querySelectorAll("figure")[start]?.scrollIntoView({ block: "start" });
    });
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, start, lenis, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-label="Imágenes ampliadas"
          className="fixed inset-0 z-90 bg-ink"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: ease.premium }}
        >
          <div ref={scroller} data-lenis-prevent className="h-full overflow-y-auto">
            {images.map((src, i) => (
              <figure key={src} className="relative h-svh w-full">
                <Image src={src} alt={`${alt}, imagen ${i + 1}`} fill sizes="100vw" quality={90} className="object-contain" />
              </figure>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="eyebrow absolute top-5 right-5 flex h-11 items-center gap-2 rounded-full border border-line bg-ink/70 px-5 backdrop-blur"
          >
            Cerrar
            <span aria-hidden>×</span>
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}
