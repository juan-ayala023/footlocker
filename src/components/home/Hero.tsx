"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { m, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { MOUNTAIN_LAYERS, MountainLayer } from "@/components/brand/MountainRange";
import { Magnetic } from "@/components/motion/Magnetic";
import { TextReveal } from "@/components/motion/TextReveal";
import { Button } from "@/components/ui/Button";
import { hero } from "@/data/home";
import { useFinePointer } from "@/hooks/useMediaQuery";
import { useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { useUi } from "@/store/ui";

// Cuánto se desplaza cada capa: con el scroll (yPercent) y con el mouse (px).
const DEPTH = {
  back: { scroll: 8, mouse: 10 },
  mid: { scroll: 18, mouse: 22 },
  front: { scroll: 32, mouse: 38 },
} as const;

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const introDone = useUi((s) => s.introDone);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  // Posición del mouse normalizada a [-1, 1] con resorte.
  const mx = useSpring(0, { stiffness: 60, damping: 20 });
  const my = useSpring(0, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (!fine || reduced) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine, reduced, mx, my]);

  // Parallax de scroll con GSAP: capas, tenis y contenido a distinta velocidad.
  useGsap(
    ({ gsap }) => {
      if (reduced) return;
      const scrub = { trigger: section.current, start: "top top", end: "bottom top", scrub: true };
      for (const layer of MOUNTAIN_LAYERS) {
        gsap.to(`[data-layer="${layer.id}"]`, { yPercent: -DEPTH[layer.id].scroll, ease: "none", scrollTrigger: scrub });
      }
      gsap.to("[data-hero-shoe]", { yPercent: -22, rotate: -6, scale: 1.06, ease: "none", scrollTrigger: scrub });
      gsap.to("[data-hero-copy]", { yPercent: 30, opacity: 0, ease: "none", scrollTrigger: scrub });
    },
    section,
    [reduced],
  );

  return (
    <section
      ref={section}
      className="relative flex min-h-svh flex-col overflow-hidden pt-(--nav-h)"
    >
      {/* Montaña de fondo */}
      <ParallaxLayer mx={mx} my={my} depth={DEPTH.back.mouse} className="bottom-[8svh]">
        <div data-layer="back">
          <MountainLayer layer={MOUNTAIN_LAYERS[0]} snow className="h-[46svh] md:h-[58svh]" />
        </div>
      </ParallaxLayer>

      {/* Tenis protagonista */}
      <div className="pointer-events-none absolute inset-x-0 top-[18svh] bottom-[10svh] flex items-center justify-center md:top-[10svh] md:justify-end md:pr-[6vw]">
        <ShoeFloat mx={mx} my={my}>
          <m.div
            data-hero-shoe
            initial={{ scale: 1.12, y: 40 }}
            animate={introDone ? { scale: 1, y: 0 } : undefined}
            transition={{ duration: 1.4, ease: ease.outSoft, delay: 0.25 }}
            className="relative aspect-square w-[min(92vw,34rem)] md:w-[min(52vw,46rem)]"
          >
            <Image
              src={hero.image}
              alt={hero.imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 52vw, 92vw"
              fetchPriority="high"
              className="object-cover [mask-image:radial-gradient(closest-side,black_55%,transparent)]"
            />
          </m.div>
        </ShoeFloat>
      </div>

      <ParallaxLayer mx={mx} my={my} depth={DEPTH.mid.mouse} className="-bottom-[2svh]">
        <div data-layer="mid">
          <MountainLayer layer={MOUNTAIN_LAYERS[1]} className="h-[30svh] md:h-[40svh]" />
        </div>
      </ParallaxLayer>
      <ParallaxLayer mx={mx} my={my} depth={DEPTH.front.mouse} className="-bottom-[6svh]">
        <div data-layer="front">
          <MountainLayer layer={MOUNTAIN_LAYERS[2]} className="h-[22svh] md:h-[30svh]" />
        </div>
      </ParallaxLayer>

      {/* Texto */}
      <div data-hero-copy className="container-page relative z-10 flex flex-1 flex-col justify-between pt-8 pb-10 md:pt-16 md:pb-16">
        <div>
          <m.p
            className="eyebrow mb-6 text-sand"
            initial={{ opacity: 0 }}
            animate={introDone ? { opacity: 1 } : undefined}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {hero.eyebrow}
          </m.p>
          <TextReveal
            as="h1"
            text={hero.title}
            play={introDone}
            delay={0.15}
            stagger={0.08}
            className="text-display uppercase"
          />
        </div>

        <m.div
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 24 }}
          animate={introDone ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, ease: ease.outSoft, delay: 0.6 }}
        >
          <p className="text-lead max-w-sm text-mist">{hero.lead}</p>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
            <Magnetic className="w-full sm:w-auto">
              <Button href="/catalogo" size="lg" className="w-full px-4 sm:px-9">
                Ver catálogo
              </Button>
            </Magnetic>
            <Magnetic className="w-full sm:w-auto">
              <Button href="/#drop" variant="outline" size="lg" className="w-full px-4 sm:px-9">
                Próximo drop
              </Button>
            </Magnetic>
          </div>
        </m.div>
      </div>

      <ScrollCue show={introDone} />
    </section>
  );
}

function ParallaxLayer({
  mx,
  my,
  depth,
  className,
  children,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depth: number;
  className?: string;
  children: React.ReactNode;
}) {
  const x = useTransform(mx, (v) => v * -depth);
  const y = useTransform(my, (v) => v * -depth * 0.4);
  return (
    <m.div
      aria-hidden
      style={{ x, y }}
      className={`pointer-events-none absolute -inset-x-[6vw] will-change-transform ${className ?? ""}`}
    >
      {children}
    </m.div>
  );
}

function ShoeFloat({ mx, my, children }: { mx: MotionValue<number>; my: MotionValue<number>; children: React.ReactNode }) {
  const rotateY = useTransform(mx, (v) => v * 8);
  const rotateX = useTransform(my, (v) => v * -6);
  const x = useTransform(mx, (v) => v * 14);
  return (
    <m.div style={{ rotateX, rotateY, x, transformPerspective: 1200 }} className="will-change-transform">
      {children}
    </m.div>
  );
}

function ScrollCue({ show }: { show: boolean }) {
  return (
    <m.div
      aria-hidden
      className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      initial={{ opacity: 0 }}
      animate={show ? { opacity: 1 } : undefined}
      transition={{ delay: 1.2, duration: 0.8 }}
    >
      <span className="eyebrow text-stone">Desliza</span>
      <span className="relative block h-12 w-px overflow-hidden bg-line">
        <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.2s_cubic-bezier(0.76,0,0.24,1)_infinite] bg-bone" />
      </span>
    </m.div>
  );
}
