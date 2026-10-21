"use client";

import Image from "next/image";
import { useRef } from "react";
import { m, useReducedMotion, useSpring } from "framer-motion";
import { Magnetic } from "@/components/motion/Magnetic";
import { usePageTransition } from "@/components/motion/PageTransition";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useFinePointer } from "@/hooks/useMediaQuery";
import { inStock, totalStock } from "@/lib/catalog-filters";
import { cn, formatCOP } from "@/lib/utils";
import { rectOf, useUi } from "@/store/ui";
import type { Product } from "@/types/catalog";

const tiltSpring = { stiffness: 150, damping: 18, mass: 0.5 };

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
  const available = inStock(product);
  const lowStock = available && totalStock(product) <= 4;
  const sizesLeft = product.variants.filter((v) => v.stock > 0).length;
  const discount = product.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : 0;
  const [primary, secondary] = product.images;

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
              rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 10);
              rotateX.set(((e.clientY - r.top) / r.height - 0.5) * -10);
            }}
            onPointerLeave={() => {
              rotateX.set(0);
              rotateY.set(0);
            }}
            className="relative aspect-[4/5] overflow-hidden bg-ink-raised will-change-transform"
          >
            {primary && (
              <Image
                src={primary}
                alt={`${product.brand} ${product.name}`}
                fill
                priority={priority}
                fetchPriority={priority ? "high" : undefined}
                sizes="(min-width: 1024px) 25vw, 50vw"
                className={cn(
                  "object-cover transition-[opacity,scale] duration-700 ease-premium group-hover:scale-[1.04]",
                  secondary && "group-hover:opacity-0",
                  !available && "opacity-50 grayscale",
                )}
              />
            )}
            {secondary && (
              <Image
                src={secondary}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="scale-[1.08] object-cover opacity-0 transition-[opacity,scale] duration-700 ease-premium group-hover:scale-100 group-hover:opacity-100"
              />
            )}

            {/* Etiquetas */}
            <div className="absolute top-3 left-3 flex flex-col items-start gap-2">
              {!available && <Badge tone="muted">Agotado</Badge>}
              {lowStock && <Badge>Últimas tallas</Badge>}
              {discount > 0 && available && <Badge tone="sand">-{discount}%</Badge>}
            </div>

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

        <div className="mt-4 flex flex-col gap-1.5 md:flex-row md:items-start md:justify-between md:gap-3">
          <div className="min-w-0">
            <p className="eyebrow text-stone">{product.brand}</p>
            <h3 className="mt-1.5 truncate font-sans text-sm font-medium text-bone transition-colors duration-500 group-hover:text-sand md:text-base">
              {product.name}
            </h3>
          </div>
          <div className="flex shrink-0 items-baseline gap-2 md:block md:text-right">
            <p className="text-sm font-medium tabular-nums md:text-base">{formatCOP(product.price)}</p>
            {product.compare_at_price && (
              <p className="text-xs text-stone tabular-nums line-through">{formatCOP(product.compare_at_price)}</p>
            )}
          </div>
        </div>
        <p className="mt-1 text-xs text-stone">
          {available ? `${sizesLeft} ${sizesLeft === 1 ? "talla disponible" : "tallas disponibles"}` : "Sin stock por ahora"}
        </p>
      </TransitionLink>
    </article>
  );
}

function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "sand" | "muted" }) {
  return (
    <span
      className={cn(
        "eyebrow rounded-full px-3 py-1.5 text-[0.625rem] backdrop-blur",
        tone === "default" && "bg-ink/70 text-bone",
        tone === "sand" && "bg-sand text-ink",
        tone === "muted" && "bg-ink/80 text-stone",
      )}
    >
      {children}
    </span>
  );
}
