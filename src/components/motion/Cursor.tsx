"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useFinePointer } from "@/hooks/useMediaQuery";
import { ease } from "@/lib/motion";

const INTERACTIVE = "a, button, [role='button'], label, select, [data-cursor]";

/**
 * Cursor personalizado: punto que crece sobre elementos interactivos y muestra
 * una etiqueta cuando el elemento tiene data-cursor-label (p. ej. "Ver").
 * Solo en desktop y sin reduced-motion.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor-label]");
      setLabel(labelled?.dataset.cursorLabel ?? null);
      setHovering(Boolean(target?.closest(INTERACTIVE)));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = label ? 88 : hovering ? 48 : 10;

  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-100"
      style={{ x: sx, y: sy }}
    >
      <m.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor: label ? "rgba(224,224,220,1)" : hovering ? "rgba(255,255,255,0)" : "rgba(255,255,255,1)",
          borderColor: hovering && !label ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.45, ease: ease.outSoft }}
        style={{ borderWidth: 1, borderStyle: "solid" }}
      >
        <AnimatePresence>
          {label && (
            <m.span
              key={label}
              className="eyebrow text-ink"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.3 }}
            >
              {label}
            </m.span>
          )}
        </AnimatePresence>
      </m.div>
    </m.div>
  );
}
