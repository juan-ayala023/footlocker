"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useFinePointer } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { rectOf, useUi } from "@/store/ui";

const Lightbox = dynamic(() => import("@/components/product/Lightbox").then((m) => m.Lightbox), { ssr: false });

/**
 * Galería del producto:
 *  · Carrusel con scroll-snap (swipe en móvil, miniaturas en desktop).
 *  · Zoom al pasar el mouse en desktop; click/tap abre el visor a pantalla completa.
 *  · Destino de la transición compartida desde la card del catálogo.
 */
export function ProductGallery({ slug, images, alt }: { slug: string; images: string[]; alt: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  // Una vez abierto se mantiene montado para conservar la animación de salida.
  const [lightboxUsed, setLightboxUsed] = useState(false);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const fine = useFinePointer();

  const shared = useUi((s) => s.sharedImage);
  const landShared = useUi((s) => s.landShared);
  const waitingShared = shared?.slug === slug;

  // Informar la posición final a la capa compartida (tras el scroll al inicio).
  useLayoutEffect(() => {
    if (!waitingShared || shared?.to) return;
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => stage.current && landShared(slug, rectOf(stage.current)));
    });
    return () => cancelAnimationFrame(raf);
  }, [waitingShared, shared?.to, landShared, slug]);

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="lg:grid lg:grid-cols-[4.5rem_1fr] lg:gap-4">
      {/* Miniaturas (desktop) */}
      <div className="hidden flex-col gap-3 lg:flex">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ver imagen ${i + 1}`}
            aria-current={i === index}
            className={cn(
              "relative aspect-[4/5] overflow-hidden border transition-colors duration-300",
              i === index ? "border-sand" : "border-transparent opacity-60 hover:opacity-100",
            )}
          >
            <Image src={src} alt="" fill sizes="72px" className="object-cover" />
          </button>
        ))}
      </div>

      <div ref={stage} className="relative aspect-[4/5] overflow-hidden bg-ink-raised">
        <div
          ref={track}
          data-lenis-prevent-touch
          onScroll={(e) => {
            const el = e.currentTarget;
            setIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className={cn(
            "flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "transition-opacity duration-300",
            waitingShared ? "opacity-0" : "opacity-100",
          )}
        >
          {images.map((src, i) => (
            <ZoomSlide key={src} src={src} alt={`${alt}, imagen ${i + 1}`} priority={i === 0} zoom={fine} onOpen={() => {
                setLightboxUsed(true);
                setLightbox(i);
              }} />
          ))}
        </div>

        {/* Indicadores (móvil) */}
        {images.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-1.5 lg:hidden">
            {images.map((src, i) => (
              <span key={src} className={cn("h-px w-6 transition-colors duration-300", i === index ? "bg-bone" : "bg-bone/30")} />
            ))}
          </div>
        )}
      </div>

      {lightboxUsed && <Lightbox images={images} alt={alt} start={lightbox} onClose={closeLightbox} />}
    </div>
  );
}

function ZoomSlide({
  src,
  alt,
  priority,
  zoom,
  onOpen,
}: {
  src: string;
  alt: string;
  priority: boolean;
  zoom: boolean;
  onOpen: () => void;
}) {
  const [origin, setOrigin] = useState<string | null>(null);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${alt}. Ampliar`}
      data-cursor-label={zoom ? "Zoom" : undefined}
      className="relative h-full w-full shrink-0 snap-center overflow-hidden"
      onPointerMove={(e) => {
        if (!zoom) return;
        const r = e.currentTarget.getBoundingClientRect();
        setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
      }}
      onPointerLeave={() => setOrigin(null)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="object-cover transition-transform duration-500 ease-out-soft"
        style={{ transform: origin ? "scale(1.9)" : "scale(1)", transformOrigin: origin ?? "50% 50%" }}
      />
    </button>
  );
}
