"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type Lenis from "lenis";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { registerLenis } from "@/lib/gsap";
import { whenIdle } from "@/lib/idle";

const LenisContext = createContext<Lenis | null>(null);

/** Instancia de Lenis (null si hay reduced-motion o aún no carga). */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Lenis se carga cuando el navegador queda libre (después del LCP) y corre su propio rAF.
 * Si alguna sección carga GSAP, registerLenis lo sincroniza con ScrollTrigger.
 */
export function SmoothScroll({ children, disabled = false }: { children: React.ReactNode; disabled?: boolean }) {
  const reducedMotion = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion || disabled) return;

    let instance: Lenis | null = null;
    let cancelled = false;

    const cancelIdle = whenIdle(async () => {
      const { default: LenisCtor } = await import("lenis");
      if (cancelled) return;
      instance = new LenisCtor({ lerp: 0.1, autoRaf: true });
      registerLenis(instance);
      setLenis(instance);
    });

    return () => {
      cancelled = true;
      cancelIdle();
      registerLenis(null);
      instance?.destroy();
      setLenis(null);
    };
  }, [reducedMotion, disabled]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
