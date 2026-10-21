"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, m } from "framer-motion";
import { FilterPanel } from "@/components/catalog/FilterPanel";
import dynamic from "next/dynamic";
import { ProductCard } from "@/components/catalog/ProductCard";
import { TextReveal } from "@/components/motion/TextReveal";
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
  type Sort,
} from "@/lib/catalog-filters";
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

  // Título contextual: una sola colección → su nombre.
  const single = filters.coleccion.length === 1 ? collections.find((c) => c.slug === filters.coleccion[0]) : undefined;
  const title = single?.name ?? "Todos los tenis";

  const panel = <FilterPanel filters={filters} facets={facets} collections={collections} onChange={setFilters} />;

  return (
    <div className="container-page pt-[calc(var(--nav-h)+3rem)] pb-24 md:pt-[calc(var(--nav-h)+5rem)]">
      <header className="mb-10 md:mb-16">
        <p className="eyebrow mb-5 text-stone">Catálogo</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <TextReveal key={title} as="h1" text={title} play className="text-h1 uppercase" />
          <p className="max-w-sm text-sm text-stone">
            {single?.description ?? "Pares seleccionados uno a uno. Envíos a toda Colombia y cambios sin costo."}
          </p>
        </div>
      </header>

      {/* Barra de herramientas */}
      <div className="sticky top-0 z-30 -mx-(--gutter) mb-8 flex items-center justify-between gap-4 border-y border-line bg-ink/85 px-(--gutter) py-3 backdrop-blur-xl">
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
            {results.length} {results.length === 1 ? "par" : "pares"}
          </p>
        </div>

        <label className="flex items-center gap-3">
          <span className="eyebrow hidden text-stone sm:inline">Ordenar</span>
          <select
            value={filters.orden}
            aria-label="Ordenar productos"
            onChange={(e) => setFilters({ orden: e.target.value as Sort })}
            className="h-10 w-36 cursor-pointer truncate rounded-full border border-line bg-ink px-4 text-sm text-bone focus:border-sand focus:outline-none sm:w-auto"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
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
            <m.ul layout className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-6 md:gap-y-14 xl:grid-cols-3">
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
              <p className="font-display text-h3 font-bold">No encontramos pares con esos filtros</p>
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
    ...filters.talla.map((t) => ({
      key: `t-${t}`,
      label: `Talla ${t}`,
      remove: () => onChange({ talla: filters.talla.filter((s) => s !== t) }),
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
