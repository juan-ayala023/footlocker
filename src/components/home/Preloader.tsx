"use client";

import { useEffect, useState } from "react";
import { stagger, useAnimate } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { site } from "@/config/site";
import { ease } from "@/lib/motion";
import { INTRO_KEY } from "@/lib/preloader";
import { useUi } from "@/store/ui";

/**
 * Intro al abrir la tienda (primera página de la sesión):
 * 1. La montaña del logo emerge de abajo hacia arriba.
 * 2. El nombre aparece letra por letra.
 * 3. Una cortina sube y revela la página.
 * Total ≈ 2 s. Visible desde el primer paint gracias a preloaderScript (sin parpadeo).
 */
export function Preloader() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [gone, setGone] = useState(false);
  const setIntroDone = useUi((s) => s.setIntroDone);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.dataset.preload) {
      setIntroDone();
      setGone(true);
      return;
    }

    let cancelled = false;
    (async () => {
      // Montaña que sube + nombre letra por letra (se solapan).
      animate("[data-intro-logo]", { clipPath: ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"], y: [24, 0] }, { duration: 0.9, ease: ease.premium });
      animate("[data-intro-line]", { scaleX: [0, 1] }, { duration: 0.9, ease: ease.premium, delay: 0.25 });
      await animate("[data-intro-letter]", { y: ["110%", "0%"] }, { duration: 0.6, ease: ease.premium, delay: stagger(0.04, { startDelay: 0.45 }) });
      if (cancelled) return;

      setIntroDone();
      await animate(scope.current, { clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"] }, { duration: 0.75, ease: ease.premium, delay: 0.15 });
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {}
      delete root.dataset.preload;
      setGone(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [animate, scope, setIntroDone]);

  if (gone) return null;

  return (
    <div ref={scope} aria-hidden className="preloader fixed inset-0 z-90 flex-col items-center justify-center gap-8 bg-ink text-bone">
      <div data-intro-logo style={{ clipPath: "inset(100% 0% 0% 0%)" }}>
        <Logo title="" priority className="w-56 md:w-80" />
      </div>
      <div className="flex flex-col items-center gap-4">
        <span data-intro-line className="block h-px w-24 origin-center bg-sand/60" style={{ transform: "scaleX(0)" }} />
        <p className="font-display text-xl font-bold tracking-[0.42em] uppercase md:text-2xl">
          {site.name.split("").map((ch, i) => (
            <span key={i} className="mask inline-block align-top">
              <span data-intro-letter className="inline-block" style={{ transform: "translateY(110%)" }}>
                {ch}
              </span>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
