"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import type { HelpSection } from "@/data/help";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Preguntas frecuentes en dos niveles (estilo Nike): categoría desplegable y,
 * dentro, cada pregunta se abre con su respuesta.
 */
export function HelpCenter({ sections, initialOpen }: { sections: HelpSection[]; initialOpen?: string }) {
  const [open, setOpen] = useState<string | null>(initialOpen ?? null);
  const id = useId();

  // Si llega ?seccion=…, llevar la categoría a la vista.
  useEffect(() => {
    if (!initialOpen) return;
    document.getElementById(`ayuda-${initialOpen}`)?.scrollIntoView({ block: "start" });
  }, [initialOpen]);

  return (
    <div id="preguntas" className="divide-y divide-line border-y border-line">
      {sections.map((s) => {
        const expanded = open === s.slug;
        return (
          <section key={s.slug} id={`ayuda-${s.slug}`} className="scroll-mt-[calc(var(--nav-h)+1rem)]">
            <h2>
              <button
                type="button"
                id={`${id}-${s.slug}`}
                aria-expanded={expanded}
                aria-controls={`${id}-${s.slug}-panel`}
                onClick={() => setOpen(expanded ? null : s.slug)}
                className="flex w-full items-center justify-between gap-4 py-6 text-left font-sans text-lg font-bold tracking-wide uppercase md:text-xl"
              >
                {s.title}
                <Chevron up={expanded} />
              </button>
            </h2>
            <AnimatePresence initial={false}>
              {expanded && (
                <m.div
                  id={`${id}-${s.slug}-panel`}
                  role="region"
                  aria-labelledby={`${id}-${s.slug}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: ease.premium }}
                  className="overflow-hidden"
                >
                  <ul className="pb-6">
                    {s.questions.map((qa) => (
                      <Question key={qa.q} qa={qa} />
                    ))}
                  </ul>
                </m.div>
              )}
            </AnimatePresence>
          </section>
        );
      })}
    </div>
  );
}

function Question({ qa }: { qa: HelpSection["questions"][number] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={cn("flex w-full items-start justify-between gap-4 py-3 text-left text-[1.0625rem] transition-colors", open ? "text-bone" : "text-mist hover:text-bone")}
      >
        {qa.q}
        <span aria-hidden className="mt-0.5 text-xl leading-none text-stone">
          {open ? "−" : "+"}
        </span>
      </button>
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
            <div className="space-y-3 pt-1 pb-5 text-[0.9375rem] leading-relaxed text-mist [&_a]:text-bone [&_a]:underline [&_a]:underline-offset-4">
              {qa.a}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function Chevron({ up }: { up: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("size-6 shrink-0 transition-transform duration-300", up && "rotate-180")}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
