"use client";

import { useEffect, type DependencyList, type RefObject } from "react";
import type Lenis from "lenis";
import { whenIdle } from "@/lib/idle";

type GsapModules = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

let modules: Promise<GsapModules> | null = null;
let loaded: GsapModules | null = null;
let lenis: Lenis | null = null;
let unsubscribe: (() => void) | null = null;

// Lenis y ScrollTrigger se conectan cuando ambos existen (cada uno carga por su lado).
function connect() {
  unsubscribe?.();
  unsubscribe = lenis && loaded ? lenis.on("scroll", loaded.ScrollTrigger.update) : null;
}

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
  connect();
}

/** Carga GSAP + ScrollTrigger una sola vez y fuera del bundle inicial. */
export function loadGsap() {
  modules ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger);
    loaded = { gsap, ScrollTrigger };
    connect();
    return loaded;
  });
  return modules;
}

/**
 * Ejecuta animaciones GSAP dentro de un gsap.context acotado a `scope`;
 * todo (tweens y ScrollTriggers) se revierte al desmontar o cambiar deps.
 * GSAP se descarga cuando el navegador queda libre, para no competir con el LCP.
 */
export function useGsap(
  setup: (m: GsapModules) => void,
  scope: RefObject<HTMLElement | null>,
  deps: DependencyList = [],
) {
  useEffect(() => {
    let cancelled = false;
    let ctx: gsap.Context | undefined;

    const cancelIdle = whenIdle(() => {
      loadGsap().then((m) => {
        if (cancelled || !scope.current) return;
        ctx = m.gsap.context(() => setup(m), scope.current);
      });
    });

    return () => {
      cancelled = true;
      cancelIdle();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
