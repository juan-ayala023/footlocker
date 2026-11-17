"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, m } from "framer-motion";
import { CollectionsIntro } from "@/components/catalog/CollectionsIntro";
import { FilterPanel } from "@/components/catalog/FilterPanel";
import dynamic from "next/dynamic";
import { ProductCard } from "@/components/catalog/ProductCard";
import { TextReveal } from "@/components/motion/TextReveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
import {
  activeFilterCount,
  applyFilters,
  emptyFilters,
  getFacets,
  GENDERS,
  parseFilters,
  serializeFilters,
  SORTS,
  type Filters,
} from "@/lib/catalog-filters";
import { AVAILABILITY, NOTES, OCCASIONS } from "@/data/perfume";
import { ease } from "@/lib/motion";
import { cn, formatCOP } from "@/lib/utils";
import type { Collection, Product } from "@/types/catalog";

const FilterSheet = dynamic(() => import("@/components/catalog/FilterSheet").then((m) => m.FilterSheet), { ssr: false });

export function CatalogView({ products, collections }: { products: Product[]; collections: Collection[] }) {
  // La URL es la fuente de verdad: filtrar no recarga la página, solo reescribe la query.
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const results = useMemo(() => applyFilters(products, filters), [products, filters]);
  const facets = useMemo(() => getFacets(products, filters), [products, filters]);
  const activeCount = activeFilterCount(filters);

  const setFilters = useCallback(
    (patch: Partial<Filters>) => {
      const next = { ...filters, ...patch };
      window.history.replaceState(null, "", `${window.location.pathname}${serializeFilters(next)}`);
    },
    [filters],
  );
  const clear = useCallback(() => setFilters({ ...emptyFilters, orden: filters.orden }), [setFilters, filters.orden]);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  // Título contextual: búsqueda > colección > ofertas > sección (Hombre/Mujer) > todo.
  const single = filters.coleccion.length === 1 ? collections.find((c) => c.slug === filters.coleccion[0]) : undefined;
  const SECTION_TITLE = { hombre: "Perfumes para hombre", mujer: "Perfumes para mujer", unisex: "Perfumes unisex" } as const;
  const section = filters.genero.length === 1 ? SECTION_TITLE[filters.genero[0]] : undefined;
  const title = filters.q
    ? `“${filters.q}”`
    : (single?.name ?? (filters.oferta ? "Ofertas" : (section ?? "Todos los perfumes")));

  const panel = <FilterPanel filters={filters} facets={facets} onChange={setFilters} />;

  return (
    // Catálogo completo en zona clara (estilo editorial): .theme-light invierte los tokens.
    <div className="theme-light bg-ink text-bone">
      <header className="container-page pt-[calc(var(--nav-h)+2rem)] pb-8 md:pt-[calc(var(--nav-h)+3.5rem)] md:pb-12">
        <TransitionLink href="/" className="text-[0.9375rem] hover:underline">
          Inicio
        </TransitionLink>
        <TextReveal key={title} as="h1" text={title} play className="mt-6 font-display text-[2.25rem] leading-[1.05] font-bold tracking-tight md:text-h2" />
        <p className="mt-3 text-lg text-stone tabular-nums">
          Mostrando {results.length} {results.length === 1 ? "resultado" : "resultados"}
        </p>
      </header>

      <div className="pb-24">
        <div className="container-page">
          <CollectionsIntro />
          {/* Barra de herramientas */}
          <div className="sticky top-0 z-30 -mx-(--gutter) mb-6 flex items-center justify-between gap-4 border-b border-line bg-ink/90 px-(--gutter) py-3 backdrop-blur-xl md:mb-10">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="eyebrow flex h-10 items-center gap-2 rounded-full border border-line px-4 lg:hidden"
              >
                Filtros
                {activeCount > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-sand text-[0.625rem] tracking-normal text-ink">
                    {activeCount}
                  </span>
                )}
              </button>
              <p className="text-sm whitespace-nowrap text-stone tabular-nums" aria-live="polite">
                {results.length} {results.length === 1 ? "perfume" : "perfumes"}
              </p>
            </div>

            {/* El orden se elige en el panel de filtros ("Ordenar por"). */}
            {filters.orden !== "relevancia" && (
              <p className="text-sm text-stone">{SORTS.find((s) => s.value === filters.orden)?.label}</p>
            )}
          </div>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <aside className="hidden lg:col-span-3 lg:block" aria-label="Filtros">
              <div className="sticky top-24">
                {panel}
                {activeCount > 0 && (
                  <button type="button" onClick={clear} className="eyebrow mt-2 text-stone transition-colors hover:text-sand">
                    Limpiar filtros
                  </button>
                )}
              </div>
            </aside>

            <section className="lg:col-span-9" aria-labelledby="resultados-title">
              <h2 id="resultados-title" className="sr-only">
                Resultados
              </h2>
              <ActiveChips filters={filters} collections={collections} facets={facets} onChange={setFilters} onClear={clear} />

              <LayoutGroup>
                <m.ul layout className="-mx-(--gutter) grid grid-cols-2 gap-x-1.5 gap-y-8 sm:mx-0 sm:gap-x-4 md:gap-y-12 xl:grid-cols-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {results.map((p, i) => (
                      <m.li
                        key={p.id}
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.3 } }}
                        transition={{ duration: 0.8, ease: ease.premium, layout: { duration: 0.8, ease: ease.premium } }}
                      >
                        <ProductCard product={p} priority={i < 2} />
                      </m.li>
                    ))}
                  </AnimatePresence>
                </m.ul>
              </LayoutGroup>

              {results.length === 0 && (
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center border border-line px-6 py-24 text-center"
                >
                  <p className="font-display text-h3 font-bold">No encontramos perfumes con esos filtros</p>
                  <p className="mt-3 text-sm text-stone">Prueba quitando alguno o explora todo el catálogo.</p>
                  <button type="button" onClick={clear} className="eyebrow mt-8 h-12 rounded-full bg-sand px-8 text-ink">
                    Limpiar filtros
                  </button>
                </m.div>
              )}
            </section>
          </div>

          <FilterSheet open={sheetOpen} onClose={closeSheet} onClear={clear} resultCount={results.length}>
            {panel}
          </FilterSheet>
        </div>
      </div>
    </div>
  );
}

function ActiveChips({
  filters,
  collections,
  facets,
  onChange,
  onClear,
}: {
  filters: Filters;
  collections: Collection[];
  facets: ReturnType<typeof getFacets>;
  onChange: (p: Partial<Filters>) => void;
  onClear: () => void;
}) {
  const chips: { key: string; label: string; remove: () => void }[] = [
    ...(filters.oferta ? [{ key: "oferta", label: "En oferta", remove: () => onChange({ oferta: false }) }] : []),
    ...(filters.q ? [{ key: "q", label: `Búsqueda: ${filters.q}`, remove: () => onChange({ q: "" }) }] : []),
    ...filters.coleccion.map((slug) => ({
      key: `c-${slug}`,
      label: collections.find((c) => c.slug === slug)?.name ?? slug,
      remove: () => onChange({ coleccion: filters.coleccion.filter((s) => s !== slug) }),
    })),
    ...filters.genero.map((g) => ({
      key: `g-${g}`,
      label: GENDERS.find((x) => x.value === g)?.label ?? g,
      remove: () => onChange({ genero: filters.genero.filter((s) => s !== g) }),
    })),
    ...filters.marca.map((m) => ({
      key: `m-${m}`,
      label: facets.brands.find((b) => b.key === m)?.label ?? m,
      remove: () => onChange({ marca: filters.marca.filter((s) => s !== m) }),
    })),
    ...filters.notas.map((n) => ({
      key: `n-${n}`,
      label: NOTES.find((x) => x.value === n)?.label ?? n,
      remove: () => onChange({ notas: filters.notas.filter((s) => s !== n) }),
    })),
    ...filters.ocasion.map((o) => ({
      key: `o-${o}`,
      label: OCCASIONS.find((x) => x.value === o)?.label ?? o,
      remove: () => onChange({ ocasion: filters.ocasion.filter((s) => s !== o) }),
    })),
    ...filters.disponibilidad.map((d) => ({
      key: `d-${d}`,
      label: AVAILABILITY.find((x) => x.value === d)?.label ?? d,
      remove: () => onChange({ disponibilidad: filters.disponibilidad.filter((s) => s !== d) }),
    })),
    ...filters.ml.map((t) => ({
      key: `t-${t}`,
      label: `${t} ml`,
      remove: () => onChange({ ml: filters.ml.filter((s) => s !== t) }),
    })),
    ...(filters.min !== null || filters.max !== null
      ? [
          {
            key: "precio",
            label: `${formatCOP(filters.min ?? facets.price.min)} – ${formatCOP(filters.max ?? facets.price.max)}`,
            remove: () => onChange({ min: null, max: null }),
          },
        ]
      : []),
  ];

  return (
    <AnimatePresence initial={false}>
      {chips.length > 0 && (
        <m.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: ease.premium }}
          className="overflow-hidden"
        >
          <ul className="flex flex-wrap items-center gap-2 pb-8">
            <AnimatePresence initial={false} mode="popLayout">
              {chips.map((chip) => (
                <m.li
                  key={chip.key}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    type="button"
                    onClick={chip.remove}
                    aria-label={`Quitar filtro ${chip.label}`}
                    className={cn(
                      "flex h-8 items-center gap-2 rounded-full border border-line pr-3 pl-4 text-xs text-mist",
                      "transition-colors duration-300 hover:border-sand hover:text-bone",
                    )}
                  >
                    {chip.label}
                    <span aria-hidden className="text-stone">
                      ×
                    </span>
                  </button>
                </m.li>
              ))}
            </AnimatePresence>
            <li>
              <button type="button" onClick={onClear} className="eyebrow ml-2 text-stone transition-colors hover:text-sand">
                Limpiar todo
              </button>
            </li>
          </ul>
        </m.div>
      )}
    </AnimatePresence>
  );
}
