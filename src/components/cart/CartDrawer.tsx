"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { useLenis } from "@/components/motion/SmoothScroll";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Button } from "@/components/ui/Button";
import { site } from "@/config/site";
import { ease } from "@/lib/motion";
import { formatCOP } from "@/lib/utils";
import { selectCartCount, selectSubtotal, useCart, type CartItem } from "@/store/cart";

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);
  const count = useCart(selectCartCount);
  const subtotal = useCart(selectSubtotal);
  const lenis = useLenis();
  const pathname = usePathname();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);

  // Cerrar al cambiar de página. Solo si está abierto: cualquier set() antes de la
  // rehidratación escribiría un carrito vacío en localStorage y lo borraría.
  useEffect(() => {
    if (useCart.getState().isOpen) close();
  }, [pathname, close]);

  useEffect(() => {
    if (!isOpen) return;
    opener.current = document.activeElement;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => closeBtn.current?.focus());
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [isOpen, lenis, close]);

  const remaining = Math.max(site.shipping.freeFrom - subtotal, 0);
  const progress = site.shipping.freeFrom ? Math.min(subtotal / site.shipping.freeFrom, 1) : 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-60">
          <m.div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: ease.premium }}
            onClick={close}
          />

          <m.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrito"
            className="absolute inset-y-0 right-0 flex w-full flex-col border-l border-line bg-ink sm:w-[28rem]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.8, ease: ease.premium }}
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <p className="eyebrow">
                Tu carrito <span className="text-stone">({count})</span>
              </p>
              <button ref={closeBtn} type="button" onClick={close} className="eyebrow flex items-center gap-2 text-stone hover:text-bone">
                Cerrar <span aria-hidden className="text-base leading-none">×</span>
              </button>
            </header>

            {items.length === 0 ? (
              <EmptyCart onClose={close} />
            ) : (
              <>
                {/* Progreso de envío gratis */}
                <div className="border-b border-line px-6 py-4">
                  <p className="text-xs text-mist">
                    {remaining > 0 ? (
                      <>
                        Te faltan <span className="text-sand tabular-nums">{formatCOP(remaining)}</span> para el envío gratis.
                      </>
                    ) : (
                      <span className="text-sand">Tu envío es gratis.</span>
                    )}
                  </p>
                  <div className="mt-3 h-px w-full bg-line">
                    <m.div
                      className="h-px origin-left bg-sand"
                      initial={false}
                      animate={{ scaleX: progress }}
                      transition={{ duration: 0.8, ease: ease.premium }}
                    />
                  </div>
                </div>

                <ul data-lenis-prevent className="flex-1 divide-y divide-line overflow-y-auto overscroll-contain px-6">
                  <AnimatePresence initial={false}>
                    {items.map((item, i) => (
                      <m.li
                        key={item.variantId}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0, transition: { duration: 0.6, ease: ease.premium, delay: 0.25 + i * 0.05 } }}
                        exit={{ opacity: 0, height: 0, transition: { duration: 0.4, ease: ease.premium } }}
                        className="overflow-hidden"
                      >
                        <Line item={item} />
                      </m.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <footer className="border-t border-line px-6 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-mist">Subtotal</dt>
                      <dd className="tabular-nums">{formatCOP(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-mist">Envío</dt>
                      <dd className="text-stone">{remaining > 0 ? formatCOP(site.shipping.flat) : "Gratis"}</dd>
                    </div>
                  </dl>
                  <Button href="/checkout" size="lg" className="mt-5 w-full">
                    Finalizar compra
                  </Button>
                  <button type="button" onClick={close} className="eyebrow mt-4 w-full py-2 text-stone hover:text-bone">
                    Seguir comprando
                  </button>
                </footer>
              </>
            )}
          </m.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function Line({ item }: { item: CartItem }) {
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);

  return (
    <div className="flex gap-4 py-5">
      <TransitionLink href={`/producto/${item.slug}`} className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-ink-raised">
        {item.image && <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />}
      </TransitionLink>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow text-stone">{item.brand}</p>
            <p className="mt-1 truncate text-sm">{item.name}</p>
            <p className="mt-1 text-xs text-stone">Talla {item.size}</p>
          </div>
          <p className="shrink-0 text-sm tabular-nums">{formatCOP(item.price * item.quantity)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center border border-line">
            <button
              type="button"
              aria-label="Quitar uno"
              disabled={item.quantity <= 1}
              onClick={() => setQuantity(item.variantId, item.quantity - 1)}
              className="flex size-8 items-center justify-center text-mist hover:text-bone disabled:text-stone/40"
            >
              −
            </button>
            <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Agregar uno"
              disabled={item.quantity >= item.maxStock}
              onClick={() => setQuantity(item.variantId, item.quantity + 1)}
              className="flex size-8 items-center justify-center text-mist hover:text-bone disabled:text-stone/40"
            >
              +
            </button>
          </div>
          <button type="button" onClick={() => remove(item.variantId)} className="text-xs text-stone underline-offset-4 hover:text-bone hover:underline">
            Quitar
          </button>
        </div>
        {item.quantity >= item.maxStock && <p className="mt-2 text-[0.6875rem] text-sand">Máximo disponible en esta talla.</p>}
      </div>
    </div>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <Logo className="w-28 opacity-40" title="" />
      <p className="font-display text-h3 mt-8 font-bold">Tu carrito está vacío</p>
      <p className="mt-3 text-sm text-stone">Cada ascenso empieza con un primer paso.</p>
      <Button href="/catalogo" size="lg" className="mt-10" onClick={onClose}>
        Ver catálogo
      </Button>
    </div>
  );
}
