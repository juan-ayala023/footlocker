"use client";

import { useEffect, useState } from "react";
import { formatCOP } from "@/lib/utils";

const STEP = 10_000;

/**
 * Slider doble de precio. Mantiene un borrador local mientras se arrastra y
 * solo confirma (y toca la URL) al soltar, para no saturar el historial.
 */
export function PriceRange({
  bounds,
  value,
  onCommit,
}: {
  bounds: { min: number; max: number };
  value: { min: number | null; max: number | null };
  onCommit: (min: number | null, max: number | null) => void;
}) {
  const [draft, setDraft] = useState({ min: value.min ?? bounds.min, max: value.max ?? bounds.max });

  useEffect(() => {
    setDraft({ min: value.min ?? bounds.min, max: value.max ?? bounds.max });
  }, [value.min, value.max, bounds.min, bounds.max]);

  const span = Math.max(bounds.max - bounds.min, 1);
  const pct = (v: number) => ((v - bounds.min) / span) * 100;

  const commit = () =>
    onCommit(draft.min <= bounds.min ? null : draft.min, draft.max >= bounds.max ? null : draft.max);

  const thumb =
    "price-range pointer-events-none absolute inset-x-0 top-1/2 h-0 w-full -translate-y-1/2 appearance-none bg-transparent";

  return (
    <div>
      <div className="relative h-8" onPointerUp={commit} onKeyUp={commit} onTouchEnd={commit}>
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
        <div
          className="absolute top-1/2 h-px -translate-y-1/2 bg-sand"
          style={{ left: `${pct(draft.min)}%`, right: `${100 - pct(draft.max)}%` }}
        />
        <input
          type="range"
          aria-label="Precio mínimo"
          min={bounds.min}
          max={bounds.max}
          step={STEP}
          value={draft.min}
          onChange={(e) => setDraft((d) => ({ ...d, min: Math.min(Number(e.target.value), d.max - STEP) }))}
          className={thumb}
        />
        <input
          type="range"
          aria-label="Precio máximo"
          min={bounds.min}
          max={bounds.max}
          step={STEP}
          value={draft.max}
          onChange={(e) => setDraft((d) => ({ ...d, max: Math.max(Number(e.target.value), d.min + STEP) }))}
          className={thumb}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-mist tabular-nums">
        <span>{formatCOP(draft.min)}</span>
        <span>{formatCOP(draft.max)}</span>
      </div>
    </div>
  );
}
