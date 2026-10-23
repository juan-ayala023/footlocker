"use client";

import Image from "next/image";
import { useRef } from "react";
import { m, useReducedMotion } from "framer-motion";
import { hero } from "@/data/home";
import { useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { useUi } from "@/store/ui";

/**
 * Banner de entrada: imagen de marca sobre fondo blanco (el de la imagen), sin bordes visibles.
 * Entra con un leve zoom tras el preloader y se aleja suavemente al hacer scroll.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const introDone = useUi((s) => s.introDone);
  const reduced = useReducedMotion();

  useGsap(
    ({ gsap }) => {
      if (reduced) return;
      const scrub = {
        trigger: section.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };
      // fromTo con valores explícitos: al volver arriba siempre regresa a opacidad 1.
      gsap.fromTo(
        "[data-hero-banner]",
        { yPercent: 0, scale: 1, opacity: 1 },
        {
          yPercent: 14,
          scale: 0.94,
          opacity: 0.4,
          ease: "none",
          scrollTrigger: scrub,
        },
      );
    },
    section,
    [reduced],
  );

  return (
    <section ref={section} className="theme-light relative flex flex-col overflow-hidden bg-white pt-(--nav-h) text-bone md:min-h-svh">
      <h1 className="sr-only">{hero.title}</h1>

      {/* GSAP (scroll) va en el contenedor y Framer (entrada) en el hijo: si comparten elemento,
          GSAP toma la opacidad 0 previa a la entrada y la restaura al volver arriba. */}
      <div data-hero-banner className="flex flex-1 items-center justify-center px-4 py-10 md:py-0">
        <m.div
          initial={{ opacity: 0, scale: 1.08 }}
          animate={introDone ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.4, ease: ease.outSoft, delay: 0.15 }}
          // La imagen mide 1280 px: no se agranda más para que no pierda nitidez.
          className="relative aspect-2/1 w-full max-w-7xl"
        >
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-contain"
          />
        </m.div>
      </div>
    </section>
  );
}
