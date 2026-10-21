"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { m, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { useLenis } from "@/components/motion/SmoothScroll";
import { ease } from "@/lib/motion";

type Phase = "idle" | "cover" | "reveal";
type NavigateOptions = {
  /** false: navega sin cortina (p. ej. cuando una imagen compartida hace de transición). */
  overlay?: boolean;
};
type Ctx = { navigate: (href: string, options?: NavigateOptions) => void };

const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const RIDGE =
  "M0 120 L0 92 L90 58 L170 84 L260 28 L350 76 L430 46 L520 88 L610 18 L700 70 L790 40 L880 86 L970 34 L1060 78 L1150 50 L1240 90 L1330 30 L1440 72 L1440 120 Z";

/**
 * Overlay que barre de abajo hacia arriba con la silueta de la montaña como borde,
 * cubre la pantalla, navega y sigue subiendo para revelar la nueva página.
 */
export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const pending = useRef<string | null>(null);

  const scrollToHash = useCallback(
    (hash: string) => {
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { duration: 1.4 });
      else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    },
    [lenis, reduced],
  );

  const navigate = useCallback(
    (href: string, { overlay = true }: NavigateOptions = {}) => {
      const url = new URL(href, window.location.href);
      const samePath = url.pathname === window.location.pathname;

      // Misma página: ancla → scroll suave; cambio de query (filtros) → sin overlay.
      if (samePath) {
        if (url.hash) scrollToHash(url.hash);
        else if (url.search !== window.location.search) router.push(href, { scroll: false });
        return;
      }
      if (!overlay || reduced || phase !== "idle") return router.push(href);

      pending.current = href;
      setPhase("cover");
    },
    [phase, reduced, router, scrollToHash],
  );

  // La nueva ruta ya está renderizada: arriba del todo y revelar.
  useEffect(() => {
    if (phase !== "cover" || !pending.current) return;
    const target = new URL(pending.current, window.location.href);
    if (target.pathname !== pathname) return;

    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    pending.current = null;
    requestAnimationFrame(() => {
      setPhase("reveal");
      if (target.hash) setTimeout(() => scrollToHash(target.hash), 900);
    });
  }, [pathname, phase, lenis, scrollToHash]);

  const y = phase === "idle" ? "100%" : phase === "cover" ? "0%" : "-100%";

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-80 overflow-hidden"
        style={{ pointerEvents: phase === "idle" ? "none" : "auto" }}
      >
        {/* Capa gris que lidera */}
        <Sheet y={y} phase={phase} delay={phase === "reveal" ? 0.12 : 0} tone="#141414" />
        {/* Capa negra principal */}
        <Sheet
          y={y}
          phase={phase}
          delay={phase === "cover" ? 0.1 : 0}
          tone="#000000"
          onDone={() => {
            if (phase === "cover" && pending.current) router.push(pending.current);
            if (phase === "reveal") setPhase("idle");
          }}
        >
          <m.div
            className="flex h-svh items-center justify-center text-bone"
            animate={{ opacity: phase === "cover" ? 1 : 0 }}
            transition={{ duration: 0.4, delay: phase === "cover" ? 0.5 : 0 }}
          >
            <Logo title="" className="w-32" />
          </m.div>
        </Sheet>
      </div>
    </TransitionContext.Provider>
  );
}

function Sheet({
  y,
  phase,
  delay,
  tone,
  onDone,
  children,
}: {
  y: string;
  phase: Phase;
  delay: number;
  tone: string;
  onDone?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <m.div
      className="absolute inset-x-0 top-[-14vh] h-[114vh]"
      initial={false}
      animate={{ y }}
      // De "reveal" a "idle" se reposiciona abajo sin animación.
      transition={phase === "idle" ? { duration: 0 } : { duration: 0.9, ease: ease.premium, delay }}
      onAnimationComplete={onDone}
    >
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-[14vh] w-full">
        <path d={RIDGE} fill={tone} />
      </svg>
      <div className="h-svh" style={{ background: tone }}>
        {children}
      </div>
    </m.div>
  );
}
