"use client";

import { useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { story } from "@/data/home";
import { useGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

// Tono apagado con contraste 3:1 sobre negro (mínimo AA para texto grande) en lugar de opacidad.
const DIM = "#616161";
const BRIGHT = "#FFFFFF";

/**
 * Historia de marca: el texto se ilumina palabra por palabra con el scroll
 * mientras el logo se dibuja y un altímetro sube hasta la cima.
 */
export function Story() {
  const section = useRef<HTMLElement>(null);
  const altitude = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const words = story.text.split(" ");

  useGsap(
    ({ gsap }) => {
      if (reduced) return;
      const st = { trigger: "[data-story-text]", start: "top 80%", end: "bottom 45%", scrub: true };

      gsap.fromTo("[data-word]", { color: DIM }, { color: BRIGHT, ease: "none", stagger: 0.1, scrollTrigger: st });
      // La montaña "se llena" de abajo hacia arriba a medida que avanza el texto.
      gsap.fromTo("[data-logo-fill]", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: st });

      const counter = { m: 0 };
      gsap.to(counter, {
        m: story.summit,
        ease: "none",
        scrollTrigger: st,
        onUpdate: () => {
          if (altitude.current) altitude.current.textContent = Math.round(counter.m).toLocaleString("es-CO");
        },
      });
    },
    section,
    [reduced],
  );

  return (
    <section ref={section} id="historia" aria-labelledby="historia-title" className="container-page pt-28 pb-8 md:pt-48 md:pb-16">
      <div className="grid gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-3">
          <div className="md:sticky md:top-32">
            <p id="historia-title" className="eyebrow mb-10 text-stone">
              {story.eyebrow}
            </p>
            <div className="relative w-40 md:w-48">
              <Logo title="" className="w-full opacity-15" />
              <div data-logo-fill className="absolute inset-0" style={{ clipPath: reduced ? "none" : "inset(100% 0% 0% 0%)" }}>
                <Logo title="" className="w-full" />
              </div>
            </div>
            <p className="mt-10 font-display text-h3 font-bold tabular-nums">
              <span ref={altitude}>{reduced ? story.summit.toLocaleString("es-CO") : "0"}</span>
              <span className="text-stone"> m.s.n.m.</span>
            </p>
            <p className="eyebrow mt-2 text-stone">Altitud del ascenso</p>
          </div>
        </div>

        <p
          data-story-text
          className="font-display text-h2 font-bold md:col-span-8 md:col-start-5"
        >
          <span className="sr-only">{story.text}</span>
          {words.map((w, i) => (
            <span key={i} aria-hidden data-word className="inline" style={{ color: reduced ? BRIGHT : DIM }}>
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
