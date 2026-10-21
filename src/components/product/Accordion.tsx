"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ease } from "@/lib/motion";

export function Accordion({ items }: { items: { title: string; content: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <div key={item.title}>
            <h2>
              <button
                type="button"
                id={`${id}-h-${i}`}
                aria-expanded={expanded}
                aria-controls={`${id}-p-${i}`}
                onClick={() => setOpen(expanded ? null : i)}
                className="eyebrow flex w-full items-center justify-between py-5 text-left"
              >
                {item.title}
                <span aria-hidden className="relative size-3">
                  <span className="absolute top-1/2 left-0 h-px w-3 bg-bone" />
                  <span
                    className="absolute top-1/2 left-0 h-px w-3 bg-bone transition-transform duration-500 ease-premium"
                    style={{ transform: expanded ? "rotate(0deg)" : "rotate(90deg)" }}
                  />
                </span>
              </button>
            </h2>
            <AnimatePresence initial={false}>
              {expanded && (
                <m.div
                  id={`${id}-p-${i}`}
                  role="region"
                  aria-labelledby={`${id}-h-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: ease.premium }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 text-sm leading-relaxed text-mist">{item.content}</div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
