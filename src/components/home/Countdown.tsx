"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ease } from "@/lib/motion";

type Parts = { d: number; h: number; m: number; s: number };

function diff(target: number): Parts | null {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

const units: { key: keyof Parts; label: string }[] = [
  { key: "d", label: "Días" },
  { key: "h", label: "Horas" },
  { key: "m", label: "Min" },
  { key: "s", label: "Seg" },
];

export function Countdown({ to }: { to: string }) {
  const target = new Date(to).getTime();
  // undefined = aún sin montar (evita desajuste de hidratación); null = ya salió.
  const [parts, setParts] = useState<Parts | null | undefined>(undefined);

  useEffect(() => {
    const tick = () => setParts(diff(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (parts === null) {
    return <p className="font-display text-h2 font-bold uppercase text-sand">Disponible ahora</p>;
  }

  return (
    <dl className="grid grid-cols-4 gap-3 md:gap-6" aria-live="off">
      {units.map(({ key, label }) => (
        <div key={key} className="flex flex-col-reverse border-t border-line pt-4">
          <dt className="eyebrow mt-2 text-stone">{label}</dt>
          <dd className="mask font-display text-h2 font-bold tabular-nums">
            <AnimatePresence mode="popLayout" initial={false}>
              <m.span
                key={parts ? parts[key] : "--"}
                className="inline-block"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.6, ease: ease.premium }}
              >
                {parts ? String(parts[key]).padStart(2, "0") : "--"}
              </m.span>
            </AnimatePresence>
          </dd>
        </div>
      ))}
    </dl>
  );
}
