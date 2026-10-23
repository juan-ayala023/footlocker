"use client";

import Image from "next/image";
import { useRef } from "react";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { TextReveal } from "@/components/motion/TextReveal";
import { Button } from "@/components/ui/Button";
import { useGsap } from "@/lib/gsap";
import { formatCOP } from "@/lib/utils";
import type { Product } from "@/types/catalog";

/** Sección "Edición limitada" de la home: destaca un producto real del catálogo (ver `drop` en data/home). */
export function Drop({ product }: { product?: Product }) {
  const section = useRef<HTMLElement>(null);

  // La imagen se desplaza más lento que la página.
  useGsap(
    ({ gsap }) => {
      const st = { trigger: section.current, start: "top bottom", end: "bottom top", scrub: true };
      gsap.fromTo("[data-drop-img]", { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: st });
    },
    section,
  );

  if (!product) return null;

  const href = `/producto/${product.slug}`;
  const sizes = product.variants.filter((v) => v.stock > 0).map((v) => v.size);
  const discount = product.compare_at_price ? Math.round((1 - product.price / product.compare_at_price) * 100) : 0;

  return (
    <section
      ref={section}
      id="drop"
      aria-labelledby="drop-title"
      className="relative overflow-hidden border-y border-line bg-ink-raised py-28 md:py-40"
    >
      <div className="container-page relative grid gap-14 md:grid-cols-12 md:items-center md:gap-8">
        {/* Fondo #efefef = el de las fotos del catálogo, para que el tenis no quede en un recuadro. */}
        <ImageReveal className="aspect-square bg-[#efefef] md:col-span-6">
          <div data-drop-img className="absolute inset-y-[-6%] inset-x-0">
            <Image
              src={product.images[0]}
              alt={`${product.brand} ${product.name}`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
        </ImageReveal>

        <div className="md:col-span-5 md:col-start-8">
          <p className="eyebrow mb-6 text-sand">Edición limitada</p>
          <p className="eyebrow mb-3 text-stone">{product.brand}</p>
          <h2 id="drop-title" className="text-h1 uppercase">
            <TextReveal text={product.name} />
          </h2>

          <div className="mt-8 flex items-baseline gap-3">
            <p className="font-display text-h3 font-bold tabular-nums">{formatCOP(product.price)}</p>
            {product.compare_at_price && (
              <>
                <p className="text-stone tabular-nums line-through">{formatCOP(product.compare_at_price)}</p>
                <span className="eyebrow rounded-full bg-sand px-3 py-1 text-[0.625rem] text-ink">-{discount}%</span>
              </>
            )}
          </div>
          {product.description && <p className="text-lead mt-8 max-w-md text-mist">{product.description}</p>}
          {sizes.length > 0 && (
            <p className="mt-6 text-sm text-stone">
              Tallas disponibles (EU): {sizes.join(" · ")}
            </p>
          )}

          <Magnetic className="mt-12">
            <Button href={href} size="lg">
              Comprar ahora
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
