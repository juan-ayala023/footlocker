"use client";

import { useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useLenis } from "@/components/motion/SmoothScroll";
import { ease } from "@/lib/motion";

/** Hoja inferior para filtros en móvil. */
export function FilterSheet({
  open,
  onClose,
  onClear,
  resultCount,
  children,
}: {
  open: boolean;
  onClose: () => void;
  onClear: () => void;
  resultCount: number;
  children: React.ReactNode;
}) {
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-60 lg:hidden">
          <m.div
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
          />
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
            className="absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-2xl border-t border-line bg-ink"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.7, ease: ease.premium }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="eyebrow">Filtros</p>
              <button type="button" onClick={onClear} className="eyebrow text-stone hover:text-sand">
                Limpiar
              </button>
            </div>
            <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
              {children}
            </div>
            <div className="border-t border-line p-4">
              <button
                type="button"
                onClick={onClose}
                className="eyebrow h-14 w-full rounded-full bg-sand text-ink transition-colors duration-300 active:bg-bone"
              >
                Ver {resultCount} {resultCount === 1 ? "par" : "pares"}
              </button>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
