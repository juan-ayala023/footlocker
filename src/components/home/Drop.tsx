"use client";

import Image from "next/image";
import { useRef } from "react";
import { Countdown } from "@/components/home/Countdown";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { TextReveal } from "@/components/motion/TextReveal";
import { Button } from "@/components/ui/Button";
import { drop } from "@/data/home";
import { useGsap } from "@/lib/gsap";

// Formato manual: Intl produce espacios/abreviaturas distintas en Node y navegador
// (p. ej. "p. m." vs "p.m."), lo que rompe la hidratación.
const DAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function formatBogota(iso: string) {
  // Colombia es UTC-5 todo el año (sin horario de verano).
  const d = new Date(new Date(iso).getTime() - 5 * 3600 * 1000);
  const h = d.getUTCHours();
  const hour12 = h % 12 || 12;
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} de ${MONTHS[d.getUTCMonth()]}, ${hour12}:${min} ${h < 12 ? "a. m." : "p. m."}`;
}

const releaseLabel = formatBogota(drop.releaseAt);

export function Drop() {
  const section = useRef<HTMLElement>(null);

  // La imagen se desplaza más lento que la página y el número gigante más rápido.
  useGsap(
    ({ gsap }) => {
      const st = { trigger: section.current, start: "top bottom", end: "bottom top", scrub: true };
      gsap.fromTo("[data-drop-img]", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: st });
      gsap.fromTo("[data-drop-num]", { yPercent: 30 }, { yPercent: -30, ease: "none", scrollTrigger: st });
    },
    section,
  );

  return (
    <section
      ref={section}
      id="drop"
      aria-labelledby="drop-title"
      className="relative overflow-hidden border-y border-line bg-ink-raised py-28 md:py-40"
    >
      <span
        data-drop-num
        aria-hidden
        className="pointer-events-none absolute -right-[4vw] top-10 font-display text-[38vw] leading-none font-bold text-bone/[0.03] select-none md:text-[24vw]"
      >
        001
      </span>

      <div className="container-page relative grid gap-14 md:grid-cols-12 md:items-center md:gap-8">
        <ImageReveal className="aspect-[4/5] bg-ink md:col-span-6">
          <div data-drop-img className="absolute -inset-y-[10%] inset-x-0">
            <Image
              src={drop.image}
              alt={drop.imageAlt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <span className="eyebrow absolute top-5 left-5 rounded-full bg-ink/70 px-4 py-2 text-sand backdrop-blur">
            Edición limitada · 120 pares
          </span>
        </ImageReveal>

        <div className="md:col-span-5 md:col-start-8">
          <p className="eyebrow mb-6 text-sand">Próximo lanzamiento</p>
          <h2 id="drop-title" className="text-h1 uppercase">
            <TextReveal text={drop.name} />
          </h2>
          <p className="eyebrow mt-4 text-stone">{drop.colorway}</p>
          <p className="text-lead mt-8 max-w-md text-mist">{drop.description}</p>

          <div className="mt-12">
            <Countdown to={drop.releaseAt} />
            <p className="mt-4 text-sm text-stone first-letter:uppercase">{releaseLabel} · hora Colombia</p>
          </div>

          <Magnetic className="mt-12">
            <Button href="#newsletter" size="lg">
              Avísame del drop
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
