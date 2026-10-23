"use client";

import Image from "next/image";
import { useRef } from "react";
import { m, useReducedMotion, useSpring } from "framer-motion";
import { Magnetic } from "@/components/motion/Magnetic";
import { usePageTransition } from "@/components/motion/PageTransition";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useFinePointer } from "@/hooks/useMediaQuery";
import { inStock, isNew, totalStock } from "@/lib/catalog-filters";
import { cn, formatCOP, productTitle } from "@/lib/utils";
import { rectOf, useUi } from "@/store/ui";
import type { Gender, Product } from "@/types/catalog";

const tiltSpring = { stiffness: 150, damping: 18, mass: 0.5 };

const GENDER_LABEL: Record<Gender, string> = {
  hombre: "Calzado para hombre",
  mujer: "Calzado para mujer",
  unisex: "Calzado unisex",
};

/**
 * Card estilo editorial: imagen cuadrada sobre fondo neutro y debajo
 * etiqueta (Más vendido / Agotado), nombre, tipo, tallas y precio con "Nuevo".
 * Usa tokens de color, así que funciona en zona oscura y en .theme-light.
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const media = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const { navigate } = usePageTransition();
  const startShared = useUi((s) => s.startShared);
  const tiltEnabled = fine && !reduced;
  const rotateX = useSpring(0, tiltSpring);
  const rotateY = useSpring(0, tiltSpring);

  const href = `/producto/${product.slug}`;
  const title = productTitle(product.brand, product.name);
  const available = inStock(product);
  const lowStock = available && totalStock(product) <= 4;
  const sizesLeft = product.variants.filter((v) => v.stock > 0).length;
  const discount = product.compare_at_price ? Math.round((1 - product.price / product.compare_at_price) * 100) : 0;
  const fresh = isNew(product);
  const [primary, secondary] = product.images;

  // Etiqueta superior: una sola, por prioridad.
  const label = !available
    ? { text: "Agotado", className: "text-stone" }
    : product.best_seller
      ? { text: "Más vendido", className: "text-hot" }
      : lowStock
        ? { text: "Últimas tallas", className: "text-stone" }
        : null;

  // Click normal: la imagen viaja hasta la galería en lugar de usar la cortina.
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const modified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    if (modified || reduced || !primary || !media.current) return;
    e.preventDefault();
    rotateX.jump(0);
    rotateY.jump(0);
    startShared({ slug: product.slug, src: primary, from: rectOf(media.current) });
    navigate(href, { overlay: false });
  };

  return (
    <article className="group">
      <TransitionLink href={href} onClick={onClick} className="block">
        <div style={{ perspective: 900 }}>
          <m.div
            ref={media}
            style={tiltEnabled ? { rotateX, rotateY } : undefined}
            onPointerMove={(e) => {
              if (!tiltEnabled || !media.current) return;
              const r = media.current.getBoundingClientRect();
              rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 8);
              rotateX.set(((e.clientY - r.top) / r.height - 0.5) * -8);
            }}
            onPointerLeave={() => {
              rotateX.set(0);
              rotateY.set(0);
            }}
            className="relative aspect-square overflow-hidden bg-ink-raised will-change-transform"
          >
            {primary && (
              <Image
                src={primary}
                alt={title}
                fill
                priority={priority}
                fetchPriority={priority ? "high" : undefined}
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
                className={cn(
                  "object-cover transition-[opacity,scale] duration-700 ease-premium group-hover:scale-[1.03]",
                  secondary && "group-hover:opacity-0",
                  !available && "opacity-60 grayscale",
                )}
              />
            )}
            {secondary && (
              <Image
                src={secondary}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
                className="scale-[1.06] object-cover opacity-0 transition-[opacity,scale] duration-700 ease-premium group-hover:scale-100 group-hover:opacity-100"
              />
            )}

            {/* CTA "Ver" magnético (solo desktop) */}
            {fine && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:pointer-events-auto group-hover:opacity-100">
                <Magnetic strength={0.5}>
                  <span aria-hidden className="eyebrow flex size-20 scale-75 items-center justify-center rounded-full bg-bone text-ink transition-transform duration-500 ease-premium group-hover:scale-100">
                    Ver
                  </span>
                </Magnetic>
              </div>
            )}
          </m.div>
        </div>

        <div className="px-2 pt-3 pb-1 text-[0.9375rem] leading-snug sm:px-0">
          {label && <p className={cn("mb-0.5 font-medium", label.className)}>{label.text}</p>}
          <h3 className="font-sans text-[0.9375rem] font-medium text-bone">{title}</h3>
          <p className="text-stone">{GENDER_LABEL[product.gender]}</p>
          <p className="text-stone">
            {available ? `${sizesLeft} ${sizesLeft === 1 ? "talla" : "tallas"}` : "Sin tallas disponibles"}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-medium text-bone tabular-nums">{formatCOP(product.price)}</span>
            {product.compare_at_price && (
              <span className="text-sm text-stone tabular-nums line-through">{formatCOP(product.compare_at_price)}</span>
            )}
            {fresh && (
              <span className="bg-bone px-1.5 py-0.5 text-[0.6875rem] font-semibold tracking-wide text-ink uppercase">Nuevo</span>
            )}
          </div>
          {discount > 0 && available && <p className="mt-0.5 text-sm font-medium text-bone">{discount}% de descuento</p>}
        </div>
      </TransitionLink>
    </article>
  );
}
