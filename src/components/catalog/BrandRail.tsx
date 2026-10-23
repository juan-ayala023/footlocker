"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type BrandTile = { key: string; label: string; count: number; image: string | null };

/**
 * Fila deslizable de marcas (una tarjeta por marca con foto y "Marca →") con barra de progreso.
 * Tocar una marca filtra el catálogo; tocar la activa quita el filtro.
 */
export function BrandRail({ brands, active, onSelect }: { brands: BrandTile[]; active: string[]; onSelect: (key: string) => void }) {
  const track = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState({ start: 0, size: 1 });

  // Barra de progreso: tamaño = fracción visible; posición = cuánto se ha deslizado.
  const measure = () => {
    const el = track.current;
    if (!el) return;
    const size = Math.min(1, el.clientWidth / el.scrollWidth);
    const max = el.scrollWidth - el.clientWidth;
    setProgress({ size, start: max > 0 ? (el.scrollLeft / max) * (1 - size) : 0 });
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [brands.length]);

  const scrollBy = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });

  if (brands.length < 2) return null;

  return (
    <section aria-label="Comprar por marca" className="mb-8 md:mb-12">
      <div className="relative">
        <ul
          ref={track}
          onScroll={measure}
          data-lenis-prevent-touch
          className="-mx-(--gutter) flex snap-x snap-mandatory scroll-px-(--gutter) gap-3 overflow-x-auto px-(--gutter) [scrollbar-width:none] md:gap-4 [&::-webkit-scrollbar]:hidden"
        >
          {brands.map((b) => {
            const isActive = active.length === 1 && active[0] === b.key;
            return (
              <li key={b.key} className="w-[44vw] max-w-72 shrink-0 snap-start sm:w-64">
                <button
                  type="button"
                  onClick={() => onSelect(b.key)}
                  aria-pressed={isActive}
                  aria-label={`${b.label}, ${b.count} ${b.count === 1 ? "par" : "pares"}${isActive ? ", filtro activo" : ""}`}
                  className="group block w-full text-left"
                >
                  <span
                    className={cn(
                      "relative block aspect-[5/6] overflow-hidden rounded-md bg-ink-raised outline-offset-2 transition-[outline-color] duration-300",
                      isActive ? "outline-2 outline-bone" : "outline-2 outline-transparent",
                    )}
                    style={{ outlineStyle: "solid" }}
                  >
                    {b.image && (
                      <Image
                        src={b.image}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 224px, 44vw"
                        className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
                      />
                    )}
                  </span>
                  <span className="mt-4 flex items-center gap-2.5 px-1 font-sans text-xl font-semibold">
                    {b.label}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-6 transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M4 12h15M13 5.5l6.5 6.5-6.5 6.5" />
                    </svg>
                  </span>
                  {isActive && <span className="px-1 text-sm text-stone">Quitar filtro</span>}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Flechas (desktop) */}
        <div className="pointer-events-none absolute inset-x-0 top-[calc(50%-2.5rem)] hidden -translate-y-1/2 justify-between md:flex">
          <ArrowButton dir={-1} hidden={progress.start <= 0.001} onClick={() => scrollBy(-1)} />
          <ArrowButton dir={1} hidden={progress.start + progress.size >= 0.999} onClick={() => scrollBy(1)} />
        </div>
      </div>

      {progress.size < 1 && (
        <div aria-hidden className="mt-6 h-[3px] w-full rounded-full bg-line">
          <div
            className="h-full rounded-full bg-bone transition-[margin] duration-150"
            style={{ width: `${progress.size * 100}%`, marginLeft: `${progress.start * 100}%` }}
          />
        </div>
      )}
    </section>
  );
}

function ArrowButton({ dir, hidden, onClick }: { dir: 1 | -1; hidden: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 1 ? "Ver más marcas" : "Ver marcas anteriores"}
      tabIndex={hidden ? -1 : 0}
      className={cn(
        "pointer-events-auto flex size-11 items-center justify-center rounded-full bg-ink text-bone shadow-lg transition-opacity duration-300",
        dir === 1 ? "-mr-2" : "-ml-2",
        hidden && "pointer-events-none opacity-0",
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("size-5", dir === -1 && "rotate-180")}>
        <path d="m9 5 7 7-7 7" />
      </svg>
    </button>
  );
}
