"use client";

import Image from "next/image";
import { useRef } from "react";
import { m, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { hero } from "@/data/home";
import { useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { useUi } from "@/store/ui";
import logoColor from "../../../public/brand/logo-full-color.webp";

/**
 * Portada como la foto del logo: papel blanco con hojas en relieve (public/brand/hero-relieve.webp,
 * sacado de la foto original sin el logo) y encima el logo a color con su tapón plateado.
 * Entra con un leve zoom tras el preloader y se aleja suavemente al hacer scroll.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const introDone = useUi((s) => s.introDone);
  const reduced = useReducedMotion();

  useGsap(
    ({ gsap }) => {
      if (reduced) return;
      // fromTo con valores explícitos: al volver arriba siempre regresa a opacidad 1.
      gsap.fromTo(
        "[data-hero-banner]",
        { yPercent: 0, scale: 1, opacity: 1 },
        {
          yPercent: 14,
          scale: 0.94,
          opacity: 0.4,
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
        },
      );
    },
    section,
    [reduced],
  );

  const show = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: introDone ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: ease.outSoft, delay },
  });

  return (
    <section
      ref={section}
      className="theme-light relative flex flex-col overflow-hidden bg-white pt-(--nav-h) text-bone md:min-h-svh"
    >
      <Image src="/brand/hero-relieve.webp" alt="" fill priority sizes="100vw" className="object-cover" />

      <h1 className="sr-only">{hero.title}</h1>

      {/* GSAP (scroll) va en el contenedor y Framer (entrada) en los hijos: si comparten elemento,
          GSAP toma la opacidad 0 previa a la entrada y la restaura al volver arriba. */}
      <div data-hero-banner className="relative flex flex-1 flex-col items-center justify-center px-4 py-14 text-center md:py-10">
        <m.div
          initial={{ opacity: 0, scale: 1.06 }}
          animate={introDone ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.4, ease: ease.outSoft, delay: 0.15 }}
          className="w-[min(78vw,30rem)]"
        >
          <Image src={logoColor} alt="Perfumería By Maria" priority sizes="(min-width: 768px) 480px, 78vw" className="h-auto w-full" />
        </m.div>

        <m.p {...show(0.5)} className="eyebrow mt-10 text-sand">
          {hero.eyebrow}
        </m.p>
        <m.p {...show(0.6)} className="text-lead mt-4 max-w-md text-mist">
          {hero.lead}
        </m.p>
        <m.div {...show(0.7)} className="mt-10 flex flex-wrap justify-center gap-3">
          {hero.ctas.map((c, i) => (
            <Button key={c.href} href={c.href} variant={i === 0 ? "solid" : "outline"}>
              {c.label}
            </Button>
          ))}
        </m.div>
      </div>
    </section>
  );
}
