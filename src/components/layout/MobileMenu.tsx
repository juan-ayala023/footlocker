"use client";

import { TransitionLink as Link } from "@/components/motion/TransitionLink";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useLenis } from "@/components/motion/SmoothScroll";
import { menu, site, type MenuItem } from "@/config/site";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { selectCartCount, useCart } from "@/store/cart";

/**
 * Menú móvil a pantalla completa (estilo editorial claro): entra desde la derecha,
 * opciones grandes con flecha y submenús que se deslizan (Deporte → Fútbol, Basket).
 */
export function MobileMenu({ open, onClose, onSearch }: { open: boolean; onClose: () => void; onSearch: () => void }) {
  const lenis = useLenis();
  const [sub, setSub] = useState<MenuItem | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const count = useCart(selectCartCount);
  const openCart = useCart((s) => s.open);

  useEffect(() => {
    if (!open) {
      setSub(null);
      return;
    }
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => closeBtn.current?.focus());
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.6, ease: ease.premium }}
          className="theme-light fixed inset-0 z-60 flex flex-col overflow-hidden bg-ink text-bone md:hidden"
        >
          {/* Fila superior: buscar y cerrar */}
          <div className="container-page flex h-(--nav-row-h) shrink-0 items-center justify-end gap-2">
            <button
              type="button"
              onClick={onSearch}
              aria-label="Buscar"
              className="flex size-11 items-center justify-center rounded-full hover:bg-bone/8"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden className="size-6">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m15.5 15.5 5 5" />
              </svg>
            </button>
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              aria-label="Cerrar menú"
              className="-mr-2 flex size-11 items-center justify-center rounded-full hover:bg-bone/8"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden className="size-7">
                <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
              </svg>
            </button>
          </div>

          <div className="relative flex-1">
            {/* Nivel 1 */}
            <m.nav
              aria-label="Menú principal"
              animate={{ x: sub ? "-30%" : "0%", opacity: sub ? 0 : 1 }}
              transition={{ duration: 0.5, ease: ease.premium }}
              className="absolute inset-0 flex flex-col overflow-y-auto"
              data-lenis-prevent
              inert={sub ? true : undefined}
            >
              <ul className="container-page pt-6">
                {menu.map((item, i) => (
                  <m.li
                    key={item.label}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: ease.outSoft, delay: 0.15 + i * 0.05 }}
                  >
                    {item.children ? (
                      <button type="button" onClick={() => setSub(item)} className={rowClass(item)}>
                        <RowLabel item={item} />
                        <Chevron />
                      </button>
                    ) : (
                      <Link href={item.href} onClick={onClose} className={rowClass(item)}>
                        <RowLabel item={item} />
                        <Chevron />
                      </Link>
                    )}
                  </m.li>
                ))}
              </ul>

              <div className="container-page mt-auto space-y-4 border-t border-line py-8 text-base">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openCart();
                  }}
                  className="flex items-center gap-3"
                >
                  Bolsa de compras {count > 0 && <span className="text-stone">({count})</span>}
                </button>
                <Link href="/ayuda" onClick={onClose} className="block">
                  Ayuda
                </Link>
                <div className="flex gap-6 pt-2 text-sm text-stone">
                  <a href={site.social.instagram} target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                  <a href={site.social.tiktok} target="_blank" rel="noreferrer">
                    TikTok
                  </a>
                </div>
              </div>
            </m.nav>

            {/* Nivel 2 (submenú) */}
            <AnimatePresence>
              {sub && (
                <m.nav
                  key={sub.label}
                  aria-label={sub.label}
                  initial={{ x: "100%" }}
                  animate={{ x: "0%" }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.5, ease: ease.premium }}
                  className="absolute inset-0 overflow-y-auto bg-ink"
                  data-lenis-prevent
                >
                  <div className="container-page pt-2">
                    <button type="button" onClick={() => setSub(null)} className="-ml-1 flex items-center gap-1 py-2 text-base">
                      <Chevron className="rotate-180" />
                      Todo
                    </button>
                    <p className="mt-4 mb-2 font-sans text-[1.75rem] font-medium">{sub.label}</p>
                    <ul>
                      {sub.children?.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} onClick={onClose} className="flex items-center justify-between py-3.5 text-xl">
                            {child.label}
                            <Chevron />
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link href={sub.href} onClick={onClose} className="flex items-center justify-between py-3.5 text-xl text-stone">
                          Ver todo {sub.label}
                          <Chevron />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </m.nav>
              )}
            </AnimatePresence>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

const rowClass = (item: MenuItem) =>
  cn("flex w-full items-center justify-between py-3.5 text-left font-sans text-[1.75rem] font-medium", item.highlight && "text-[#e4002b]");

function RowLabel({ item }: { item: MenuItem }) {
  return (
    <span>
      {item.label}
      {item.emoji && (
        <span aria-hidden className="ml-2">
          {item.emoji}
        </span>
      )}
    </span>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("size-6 shrink-0 text-bone", className)}>
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}
