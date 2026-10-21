"use client";

import { PriceRange } from "@/components/catalog/PriceRange";
import type { Facets, Filters } from "@/lib/catalog-filters";
import { cn } from "@/lib/utils";
import type { Collection } from "@/types/catalog";

type Props = {
  filters: Filters;
  facets: Facets;
  collections: Collection[];
  onChange: (next: Partial<Filters>) => void;
};

const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

export function FilterPanel({ filters, facets, collections, onChange }: Props) {
  return (
    <div className="divide-y divide-line">
      <Group title="Colección">
        <div className="flex flex-wrap gap-2">
          {collections.map((c) => (
            <Pill
              key={c.slug}
              active={filters.coleccion.includes(c.slug)}
              disabled={!facets.collections[c.slug] && !filters.coleccion.includes(c.slug)}
              onClick={() => onChange({ coleccion: toggle(filters.coleccion, c.slug) })}
            >
              {c.name}
            </Pill>
          ))}
        </div>
      </Group>

      <Group title="Género">
        <div className="flex flex-wrap gap-2">
          {facets.genders.map((g) => (
            <Pill
              key={g.value}
              active={filters.genero.includes(g.value)}
              disabled={!g.count && !filters.genero.includes(g.value)}
              onClick={() => onChange({ genero: toggle(filters.genero, g.value) })}
            >
              {g.label}
            </Pill>
          ))}
        </div>
      </Group>

      <Group title="Marca">
        <ul className="space-y-1">
          {facets.brands.map((b) => {
            const checked = filters.marca.includes(b.key);
            return (
              <li key={b.key}>
                <label
                  className={cn(
                    "flex cursor-pointer items-center justify-between py-1.5 text-sm transition-colors duration-300",
                    !b.count && !checked ? "text-stone/50" : "text-mist hover:text-bone",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={!b.count && !checked}
                      onChange={() => onChange({ marca: toggle(filters.marca, b.key) })}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className="flex size-4 items-center justify-center border border-line transition-colors duration-300 peer-checked:border-sand peer-checked:bg-sand peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sand"
                    >
                      {checked && (
                        <svg viewBox="0 0 12 12" className="size-2.5 text-ink" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M2 6.5 5 9l5-6" />
                        </svg>
                      )}
                    </span>
                    {b.label}
                  </span>
                  <span className="text-xs text-stone tabular-nums">{b.count}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </Group>

      <Group title="Talla (CO)">
        <div className="grid grid-cols-5 gap-1.5">
          {facets.sizes.map(({ size, available }) => {
            const active = filters.talla.includes(size);
            return (
              <button
                key={size}
                type="button"
                aria-pressed={active}
                disabled={!available && !active}
                onClick={() => onChange({ talla: toggle(filters.talla, size) })}
                className={cn(
                  "h-10 border text-sm tabular-nums transition-colors duration-300",
                  active ? "border-sand bg-sand text-ink" : "border-line text-mist hover:border-bone hover:text-bone",
                  "disabled:cursor-not-allowed disabled:text-stone/40 disabled:line-through disabled:hover:border-line",
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Precio">
        <PriceRange
          bounds={facets.price}
          value={{ min: filters.min, max: filters.max }}
          onCommit={(min, max) => onChange({ min, max })}
        />
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="py-6 first:pt-0">
      <legend className="eyebrow float-left mb-4 w-full text-stone">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

function Pill({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-9 rounded-full border px-4 text-sm transition-colors duration-300",
        active ? "border-sand bg-sand text-ink" : "border-line text-mist hover:border-bone hover:text-bone",
        "disabled:cursor-not-allowed disabled:text-stone/40 disabled:hover:border-line",
      )}
    >
      {children}
    </button>
  );
}
