"use client";

import { useRef } from "react";
import { m, useReducedMotion, useSpring } from "framer-motion";
import { useFinePointer } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const spring = { stiffness: 180, damping: 14, mass: 0.2 };

/** Envuelve un CTA para que siga al cursor dentro de su área. Solo en desktop. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const enabled = fine && !reduced;

  return (
    <m.div
      ref={ref}
      className={cn("inline-block", className)}
      style={enabled ? { x, y } : undefined}
      onPointerMove={(e) => {
        if (!enabled || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </m.div>
  );
}
