"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useLenis } from "@/components/motion/SmoothScroll";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { SIZE_CHART } from "@/data/sizes";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Guía de tallas en panel lateral (abajo en móvil), sin salir del producto.
 * Resalta las tallas que maneja el producto y la que esté seleccionada.
 */
export function SizeGuide({
  open,
  onClose,
  available,
  selected,
}: {
  open: boolean;
  onClose: () => void;
  available: number[];
  selected?: number;
}) {
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

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-60">
          <m.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
          />
          <m.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-guide-title"
            className="absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-2xl bg-ink text-bone md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[28rem] md:rounded-none"
            initial={{ y: "100%", x: 0 }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.7, ease: ease.premium }}
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 id="size-guide-title" className="font-sans text-lg font-medium">
                Guía de tallas
              </h2>
              <button ref={closeBtn} type="button" onClick={onClose} aria-label="Cerrar guía de tallas" className="flex size-10 items-center justify-center rounded-full hover:bg-bone/8">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden className="size-5">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </header>

            <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
              <h3 className="font-sans text-sm font-medium">Cómo medir tu pie</h3>
              <ol className="mt-3 space-y-2 text-sm text-mist">
                <li>1. Apoya el talón contra una pared, de pie y con medias.</li>
                <li>2. Marca en el piso la punta del dedo más largo.</li>
                <li>3. Mide en centímetros y busca tu talla en la tabla. Si quedas entre dos, elige la mayor.</li>
              </ol>

              <table className="mt-6 w-full text-left text-sm tabular-nums">
                <caption className="sr-only">Equivalencias de tallas EU (las de la tienda), US, Colombia y centímetros</caption>
                <thead>
                  <tr className="border-b border-line text-stone">
                    <th scope="col" className="py-2.5 font-normal">EU</th>
                    <th scope="col" className="py-2.5 font-normal">US</th>
                    <th scope="col" className="py-2.5 font-normal">Colombia</th>
                    <th scope="col" className="py-2.5 font-normal">Pie (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {SIZE_CHART.map((s) => {
                    // Las tallas de los productos están en EU.
                    const isSelected = s.eu === selected;
                    const inProduct = available.includes(s.eu);
                    return (
                      <tr key={s.eu} className={cn(isSelected && "bg-ink-raised font-medium", !inProduct && "text-stone")}>
                        <th scope="row" className="py-2.5 font-medium">
                          {s.eu}
                          {isSelected && <span className="ml-2 text-xs font-normal text-stone">tu selección</span>}
                        </th>
                        <td className="py-2.5">{s.us}</td>
                        <td className="py-2.5">{s.co}</td>
                        <td className="py-2.5">{s.cm}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="mt-4 text-xs text-stone">
                Las tallas en gris no están disponibles para este modelo. Las hormas varían según la marca: si tienes dudas, escríbenos.
              </p>
              <TransitionLink href="/ayuda?seccion=producto" className="mt-6 inline-block text-sm underline underline-offset-4">
                Ver guía completa
              </TransitionLink>
            </div>
          </m.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
