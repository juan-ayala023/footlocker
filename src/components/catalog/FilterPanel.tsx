"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { SORTS, type Facets, type Filters, type Sort } from "@/lib/catalog-filters";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  filters: Filters;
  facets: Facets;
  onChange: (next: Partial<Filters>) => void;
};

const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

/**
 * Filtros del catálogo: Ordenar por, Casas de perfumes, Notas olfativas, Disponibilidad y Ocasión
 * (secciones desplegables) y, abajo, la búsqueda por nombre.
 */
export function FilterPanel({ filters, facets, onChange }: Props) {
  return (
    <div>
      <div className="divide-y divide-line border-b border-line">
        <Section title="Ordenar por" active={filters.orden !== "relevancia"}>
          <ul className="space-y-1">
            {SORTS.map((s) => (
              <li key={s.value}>
                <Option
                  type="radio"
                  name="orden"
                  checked={filters.orden === s.value}
                  onChange={() => onChange({ orden: s.value as Sort })}
                  label={s.label}
                />
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Casas de perfumes" active={filters.marca.length > 0}>
          <ul className="space-y-1">
            {facets.brands.map((b) => {
              const checked = filters.marca.includes(b.key);
              return (
                <li key={b.key}>
                  <Option
                    checked={checked}
                    disabled={!b.count && !checked}
                    onChange={() => onChange({ marca: toggle(filters.marca, b.key) })}
                    label={b.label}
                    count={b.count}
                  />
                </li>
              );
            })}
          </ul>
        </Section>

        <Section title="Notas olfativas" active={filters.notas.length > 0}>
          <ul className="space-y-1">
            {facets.notes.map((n) => {
              const checked = filters.notas.includes(n.value);
              return (
                <li key={n.value}>
                  <Option
                    checked={checked}
                    disabled={!n.count && !checked}
                    onChange={() => onChange({ notas: toggle(filters.notas, n.value) })}
                    label={n.label}
                    count={n.count}
                  />
                </li>
              );
            })}
          </ul>
        </Section>

        <Section title="Disponibilidad" active={filters.disponibilidad.length > 0}>
          <ul className="space-y-1">
            {facets.availability.map((a) => {
              const checked = filters.disponibilidad.includes(a.value);
              return (
                <li key={a.value}>
                  <Option
                    checked={checked}
                    disabled={!a.count && !checked}
                    onChange={() => onChange({ disponibilidad: toggle(filters.disponibilidad, a.value) })}
                    label={a.label}
                    count={a.count}
                  />
                </li>
              );
            })}
          </ul>
        </Section>

        <Section title="Ocasión" active={filters.ocasion.length > 0}>
          <ul className="space-y-1">
            {facets.occasions.map((o) => {
              const checked = filters.ocasion.includes(o.value);
              return (
                <li key={o.value}>
                  <Option
                    checked={checked}
                    disabled={!o.count && !checked}
                    onChange={() => onChange({ ocasion: toggle(filters.ocasion, o.value) })}
                    label={o.label}
                    count={o.count}
                  />
                </li>
              );
            })}
          </ul>
        </Section>
      </div>

      <SearchByName value={filters.q} onChange={(q) => onChange({ q })} />
    </div>
  );
}

/** Sección desplegable; arranca abierta si tiene un filtro activo. */
function Section({ title, active, children }: { title: string; active: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(active);
  const id = useId();
  return (
    <section>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2 py-5 text-left font-sans text-[0.9375rem] font-medium tracking-[0.16em] uppercase transition-colors hover:text-sand"
        >
          {title}
          {active && <span aria-hidden className="size-1.5 rounded-full bg-sand" />}
          <svg
            viewBox="0 0 12 12"
            aria-hidden
            className={cn("size-3 shrink-0 transition-transform duration-300", open && "rotate-180")}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
          >
            <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
          </svg>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: ease.premium }}
            className="overflow-hidden"
          >
            <div className="pb-5">{children}</div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Option({
  type = "checkbox",
  name,
  checked,
  disabled,
  onChange,
  label,
  count,
}: {
  type?: "checkbox" | "radio";
  name?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between py-1.5 text-sm transition-colors duration-300",
        disabled ? "cursor-not-allowed text-stone/50" : "text-mist hover:text-bone",
      )}
    >
      <span className="flex items-center gap-3">
        <input type={type} name={name} checked={checked} disabled={disabled} onChange={onChange} className="peer sr-only" />
        <span
          aria-hidden
          className={cn(
            "flex size-4 items-center justify-center border border-line transition-colors duration-300 peer-checked:border-sand peer-checked:bg-sand peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sand",
            type === "radio" && "rounded-full",
          )}
        >
          {checked && (
            <svg viewBox="0 0 12 12" className="size-2.5 text-ink" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M2 6.5 5 9l5-6" />
            </svg>
          )}
        </span>
        {label}
      </span>
      {count !== undefined && <span className="text-xs text-stone tabular-nums">{count}</span>}
    </label>
  );
}

/** Búsqueda por nombre o casa; se aplica mientras se escribe (con una pequeña pausa). */
function SearchByName({ value, onChange }: { value: string; onChange: (q: string) => void }) {
  const [text, setText] = useState(value);
  const id = useId();

  // Si la búsqueda cambia desde afuera (chips, "Limpiar"), el campo la refleja.
  useEffect(() => setText(value), [value]);

  useEffect(() => {
    if (text.trim() === value) return;
    const t = setTimeout(() => onChange(text.trim().slice(0, 60)), 350);
    return () => clearTimeout(t);
  }, [text, value, onChange]);

  return (
    <div className="flex items-center gap-4 py-6">
      <svg viewBox="0 0 24 24" aria-hidden className="size-6 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5 5" />
      </svg>
      <label htmlFor={id} className="sr-only">
        Buscar por nombre
      </label>
      <input
        id={id}
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Buscar por nombre"
        autoComplete="off"
        enterKeyHint="search"
        className="h-10 min-w-0 flex-1 bg-transparent text-sm tracking-[0.16em] uppercase placeholder:text-bone focus:outline-none"
      />
    </div>
  );
}
