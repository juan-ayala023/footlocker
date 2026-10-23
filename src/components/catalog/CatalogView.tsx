"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, m } from "framer-motion";
import { BrandRail, type BrandTile } from "@/components/catalog/BrandRail";
import { FilterPanel } from "@/components/catalog/FilterPanel";
import dynamic from "next/dynamic";
import { ProductCard } from "@/components/catalog/ProductCard";
import { TextReveal } from "@/components/motion/TextReveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { brandImages, multiBrand } from "@/config/site";
import {
  activeFilterCount,
  applyFilters,
  brandKey,
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

  // Título contextual: búsqueda > colección > ofertas > sección (Hombre/Mujer) > todo.
  const single = filters.coleccion.length === 1 ? collections.find((c) => c.slug === filters.coleccion[0]) : undefined;
  const SECTION_TITLE = { hombre: "Tenis para hombre", mujer: "Tenis para mujer", unisex: "Tenis unisex" } as const;
  const section = filters.genero.length === 1 ? SECTION_TITLE[filters.genero[0]] : undefined;
  const title = filters.q
    ? `“${filters.q}”`
    : (single?.name ?? (filters.oferta ? "Ofertas" : (section ?? "Todos los tenis")));

  // Una tarjeta por marca disponible en la vista actual (ignorando el filtro de marca),
  // con la foto de su producto mejor ubicado.
  const brandTiles = useMemo<BrandTile[]>(() => {
    const ranked = applyFilters(products, { ...filters, marca: [] });
    const available = facets.brands.filter((b) => b.count > 0);
    const tiles: BrandTile[] = available
      .filter((b) => !multiBrand.brands.includes(b.key))
      .map((b) => ({
        ...b,
        image: brandImages[b.key] ?? ranked.find((p) => brandKey(p.brand) === b.key)?.images[0] ?? null,
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    // Las marcas agrupadas van juntas en una sola tarjeta, al final.
    const grouped = available.filter((b) => multiBrand.brands.includes(b.key));
    if (grouped.length) {
      tiles.push({
        key: multiBrand.key,
        label: multiBrand.label,
        count: grouped.reduce((n, b) => n + b.count, 0),
        image: multiBrand.image,
      });
    }
    return tiles;
  }, [products, filters, facets.brands]);

  // Marcas reales que cubre la tarjeta Multimarca en la vista actual.
  const groupedKeys = useMemo(
    () => facets.brands.filter((b) => b.count > 0 && multiBrand.brands.includes(b.key)).map((b) => b.key),
    [facets.brands],
  );
  const multiActive =
    groupedKeys.length > 0 &&
    filters.marca.length === groupedKeys.length &&
    groupedKeys.every((k) => filters.marca.includes(k));

  const toggleBrand = useCallback(
    (key: string) => {
      if (key === multiBrand.key) return setFilters({ marca: multiActive ? [] : groupedKeys });
      setFilters({ marca: filters.marca.length === 1 && filters.marca[0] === key ? [] : [key] });
    },
    [filters.marca, setFilters, multiActive, groupedKeys],
  );

  const panel = <FilterPanel filters={filters} facets={facets} collections={collections} onChange={setFilters} />;

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
          <BrandRail brands={brandTiles} active={multiActive ? [multiBrand.key] : filters.marca} onSelect={toggleBrand} />
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
