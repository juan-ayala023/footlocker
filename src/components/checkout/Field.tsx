"use client";

import { AnimatePresence, m } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

/** Campo con etiqueta superior, línea inferior y error animado. */
export function Field({ id, label, error, hint, className, children }: Props) {
  return (
    <div className={cn("group", className)}>
      <label htmlFor={id} className={cn("eyebrow block transition-colors duration-300", error ? "text-sand" : "text-stone group-focus-within:text-bone")}>
        {label}
      </label>
      {children}
      <div className="min-h-5 pt-1.5 text-xs">
        <AnimatePresence mode="wait" initial={false}>
          {error ? (
            <m.p
              key="error"
              id={`${id}-error`}
              role="alert"
              className="text-sand"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {error}
            </m.p>
          ) : hint ? (
            <m.p key="hint" className="text-stone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {hint}
            </m.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export const inputClass = (error?: string) =>
  cn(
    "mt-2 h-12 w-full border-b bg-transparent text-base text-bone placeholder:text-stone/60 transition-colors duration-300 focus:outline-none",
    error ? "border-sand" : "border-line focus:border-bone",
  );
