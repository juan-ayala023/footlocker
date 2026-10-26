"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useAnimate } from "framer-motion";
import { Magnetic } from "@/components/motion/Magnetic";
import { TextReveal } from "@/components/motion/TextReveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Accordion } from "@/components/product/Accordion";
import dynamic from "next/dynamic";
import { site } from "@/config/site";
import { helpSections, type HelpQuestion } from "@/data/help";
import { inStock, isNew } from "@/lib/catalog-filters";
import { ease } from "@/lib/motion";
import { cn, formatCOP, productTitle } from "@/lib/utils";
import { trackAddToCart, trackViewContent } from "@/lib/analytics";
import { useCart } from "@/store/cart";
import { useUi } from "@/store/ui";
import type { Product, Variant } from "@/types/catalog";

// La guía solo se descarga cuando se abre.
const SizeGuide = dynamic(() => import("@/components/product/SizeGuide").then((mod) => mod.SizeGuide), { ssr: false });

const LOW_STOCK = 3;

export function ProductInfo({ product }: { product: Product }) {
  const [selected, setSelected] = useState<Variant | null>(null);
  const [error, setError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideUsed, setGuideUsed] = useState(false);
  const closeGuide = useCallback(() => setGuideOpen(false), []);
  const [sizesScope, animateSizes] = useAnimate<HTMLDivElement>();
  const addRef = useRef<HTMLDivElement>(null);
  const [addVisible, setAddVisible] = useState(true);
  const add = useCart((s) => s.add);
  const setViewing = useUi((s) => s.setViewing);

  const available = inStock(product);
  const hasLowStock = product.variants.some((v) => v.stock > 0 && v.stock <= LOW_STOCK);
  const discount = product.compare_at_price ? Math.round((1 - product.price / product.compare_at_price) * 100) : 0;

  const analyticsItem = { id: product.id, name: productTitle(product.brand, product.name), brand: product.brand, price: product.price };

  useEffect(() => {
    trackViewContent({ id: product.id, name: productTitle(product.brand, product.name), brand: product.brand, price: product.price });
  }, [product.id, product.brand, product.name, product.price]);

  // Contexto para el botón de WhatsApp (incluye la talla elegida).
  useEffect(() => {
    setViewing({ name: productTitle(product.brand, product.name), url: window.location.href, size: selected?.size });
    return () => setViewing(null);
  }, [setViewing, product.brand, product.name, selected?.size]);

  // Barra fija en móvil cuando el botón principal sale de pantalla.
  useEffect(() => {
    const el = addRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setAddVisible(entry.isIntersecting || entry.boundingClientRect.top > 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const addToCart = () => {
    if (!selected) {
      setError(true);
      sizesScope.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      animateSizes(sizesScope.current, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.45 });
      return;
    }
    add({
      variantId: selected.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      size: selected.size,
      price: product.price,
      image: product.images[0] ?? "",
      maxStock: selected.stock,
    });
    trackAddToCart({ ...analyticsItem, size: selected.size, quantity: 1 });
  };

  return (
    <div>
      <nav aria-label="Ruta" className="eyebrow mb-8 flex items-center gap-2 text-stone">
        <TransitionLink href="/catalogo" className="hover:text-bone">
          Catálogo
        </TransitionLink>
        {product.collection && (
          <>
            <span aria-hidden>/</span>
            <TransitionLink href={`/catalogo?coleccion=${product.collection.slug}`} className="hover:text-bone">
              {product.collection.name}
            </TransitionLink>
          </>
        )}
      </nav>

      <div className="flex flex-wrap items-center gap-3">
        <p className="eyebrow text-sand">{product.brand}</p>
        {product.best_seller && <span className="text-sm font-medium text-hot">Más vendido</span>}
        {isNew(product) && (
          <span className="bg-bone px-1.5 py-0.5 text-[0.6875rem] font-semibold tracking-wide text-ink uppercase">Nuevo</span>
        )}
      </div>
      <TextReveal as="h1" text={product.name} play delay={0.2} className="text-h2 mt-3 uppercase" />

      <div className="mt-6 flex items-baseline gap-3">
        <p className="font-display text-h3 font-bold tabular-nums">{formatCOP(product.price)}</p>
        {product.compare_at_price && (
          <>
            <p className="text-stone tabular-nums line-through">{formatCOP(product.compare_at_price)}</p>
            <span className="eyebrow rounded-full bg-sand px-3 py-1 text-[0.625rem] text-ink">-{discount}%</span>
          </>
        )}
      </div>
      <p className="mt-2 text-xs text-stone">Impuestos incluidos. Envío calculado al pagar.</p>

      {/* Tallas */}
      <div className="mt-10">
        <div className="mb-4 flex items-baseline justify-between">
          <p id="tallas-label" className="font-sans text-base font-medium">
            Selecciona la talla <span className="text-sm font-normal text-stone">(EU)</span>
          </p>
          <button
            type="button"
            onClick={() => {
              setGuideUsed(true);
              setGuideOpen(true);
            }}
            aria-haspopup="dialog"
            className="text-base text-stone transition-colors hover:text-bone"
          >
            Guía de tallas
          </button>
        </div>

        <div ref={sizesScope} role="radiogroup" aria-labelledby="tallas-label" className="grid grid-cols-5 gap-2 sm:gap-2.5">
          {product.variants.map((v) => {
            const soldOut = v.stock <= 0;
            const active = selected?.id === v.id;
            return (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={`Talla ${v.size}${soldOut ? ", agotada" : ""}`}
                disabled={soldOut}
                onClick={() => {
                  setSelected(v);
                  setError(false);
                }}
                className={cn(
                  "relative h-12 rounded-md border text-base tabular-nums transition-colors duration-200",
                  active ? "border-bone ring-1 ring-bone" : "border-line hover:border-bone",
                  soldOut && "cursor-not-allowed border-transparent bg-ink-raised text-stone/60 line-through hover:border-transparent",
                  error && !active && !soldOut && "border-hot",
                )}
              >
                {v.size}
                {!soldOut && v.stock <= LOW_STOCK && (
                  <span aria-hidden className="absolute top-1.5 right-1.5 size-1 rounded-full bg-sand" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-3 min-h-5 text-xs" aria-live="polite">
          <AnimatePresence mode="wait">
            {error ? (
              <m.p key="err" role="alert" className="text-hot" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                Elige tu talla para continuar.
              </m.p>
            ) : selected && selected.stock <= LOW_STOCK ? (
              <m.p key="low" className="text-sand" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {selected.stock === 1 ? "Queda solo 1 par" : `Quedan solo ${selected.stock} pares`} en talla {selected.size}.
              </m.p>
            ) : hasLowStock ? (
              <m.p key="hint" className="text-stone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <span className="mr-1.5 inline-block size-1 rounded-full bg-sand align-middle" /> Pocas unidades
              </m.p>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Agregar */}
      <div ref={addRef} className="mt-8">
        {available ? (
          <Magnetic strength={0.1} className="w-full">
            <button
              type="button"
              onClick={addToCart}
              className="h-16 w-full rounded-full bg-bone text-lg font-medium text-ink transition-opacity duration-300 hover:opacity-80 active:opacity-70"
            >
              Agregar a la bolsa de compras
            </button>
          </Magnetic>
        ) : (
          <button type="button" disabled className="h-16 w-full cursor-not-allowed rounded-full bg-ink-raised text-lg font-medium text-stone">
            Agotado
          </button>
        )}
      </div>

      <ul className="mt-8 grid gap-3 text-sm text-mist">
        <li className="flex gap-3">
          <Dot /> Envío gratis a toda Colombia. Entrega en {site.shipping.eta}.
        </li>
        <li className="flex gap-3">
          <Dot /> Garantía legal de 15 días por defectos de fábrica.
        </li>
        <li className="flex gap-3">
          <Dot /> Paga con tarjeta, PSE o Nequi a través de Wompi.
        </li>
      </ul>

      <div className="mt-10">
        <Accordion
          items={[
            { title: "Descripción", content: product.description ?? "Pronto agregaremos más detalles de este par." },
            { title: "Talla y ajuste", content: <HelpAnswers questions={help("producto", 0, 1)} single /> },
            { title: "Envíos y entregas", content: <HelpAnswers questions={[...help("envios"), ...help("pedidos")]} /> },
            { title: "Garantía y devoluciones", content: <HelpAnswers questions={help("devoluciones")} /> },
          ]}
        />
      </div>

      {/* Barra fija en móvil */}
      <AnimatePresence>
        {available && !addVisible && (
          <m.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5, ease: ease.premium }}
            className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-line bg-ink/90 px-4 py-3 backdrop-blur-xl lg:hidden"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{product.name}</p>
              <p className="text-xs text-stone tabular-nums">
                {formatCOP(product.price)}
                {selected && ` · Talla ${selected.size}`}
              </p>
            </div>
            <button type="button" onClick={addToCart} className="eyebrow h-12 shrink-0 rounded-full bg-sand px-6 text-ink active:bg-bone">
              {selected ? "Agregar" : "Elegir talla"}
            </button>
          </m.div>
        )}
      </AnimatePresence>

      {guideUsed && (
        <SizeGuide
          open={guideOpen}
          onClose={closeGuide}
          available={product.variants.filter((v) => v.stock > 0).map((v) => v.size)}
          selected={selected?.size}
        />
      )}
    </div>
  );
}

// Mismos textos del centro de ayuda (src/data/help.tsx), para no tener dos versiones de las políticas.
const help = (slug: string, from?: number, to?: number) =>
  (helpSections.find((s) => s.slug === slug)?.questions ?? []).slice(from, to);

function HelpAnswers({ questions, single }: { questions: HelpQuestion[]; single?: boolean }) {
  return (
    <div className="space-y-6 [&_a]:underline [&_a]:underline-offset-2 [&_ol]:mt-2 [&_ol+*]:mt-3 [&_p+p]:mt-3 [&_ul+*]:mt-3 [&_table]:mt-3 [&_ul]:mt-2">
      {questions.map((item) => (
        <section key={item.q}>
          {!single && <h3 className="mb-2 font-sans text-sm font-medium text-bone">{item.q}</h3>}
          {item.a}
        </section>
      ))}
    </div>
  );
}

function Dot() {
  return <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-sand" />;
}
