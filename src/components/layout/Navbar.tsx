"use client";

import { TransitionLink as Link } from "@/components/motion/TransitionLink";
import { useCallback, useState } from "react";
import { m, useMotionValueEvent, useScroll } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import dynamic from "next/dynamic";
import { mainNav, site } from "@/config/site";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { selectCartCount, useCart } from "@/store/cart";

const MobileMenu = dynamic(() => import("@/components/layout/MobileMenu").then((m) => m.MobileMenu), { ssr: false });

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const count = useCart(selectCartCount);
  const openCart = useCart((s) => s.open);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Se oculta al bajar y reaparece al subir; gana fondo al salir del hero.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 80);
    setHidden(y > prev && y > 240 && !menuOpen);
  });

  return (
    <>
      <m.header
        initial={false}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.6, ease: ease.premium }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-700 ease-premium",
          scrolled && !menuOpen
            ? "border-b border-line bg-ink/70 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <nav
          aria-label="Principal"
          className="container-page grid h-(--nav-h) grid-cols-[1fr_auto_1fr] items-center"
        >
          {/* Izquierda: links en desktop, menú en móvil */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              className="relative -ml-2 flex size-11 items-center justify-center md:hidden"
            >
              <span
                className={cn(
                  "absolute h-px w-6 bg-bone transition-transform duration-500 ease-premium",
                  menuOpen ? "rotate-45" : "-translate-y-[4px]",
                )}
              />
              <span
                className={cn(
                  "absolute h-px w-6 bg-bone transition-transform duration-500 ease-premium",
                  menuOpen ? "-rotate-45" : "translate-y-[4px]",
                )}
              />
            </button>

            <ul className="hidden items-center gap-8 md:flex">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href}>{item.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/" aria-label={`${site.name}, inicio`} className="block">
            <Logo priority className="w-20 md:w-24" />
          </Link>

          <div className="flex items-center justify-end gap-6">
            <span className="eyebrow hidden text-stone lg:inline">Envíos a toda Colombia</span>
            <button
              type="button"
              onClick={openCart}
              className="eyebrow group flex h-11 items-center gap-2"
              aria-label={`Abrir carrito, ${count} productos`}
            >
              <span className="hidden transition-colors duration-500 group-hover:text-sand sm:inline">
                Carrito
              </span>
              <BagIcon className="size-5 sm:hidden" />
              <m.span
                key={count}
                initial={{ scale: count ? 1.5 : 1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, ease: ease.outSoft }}
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border text-[0.625rem] tracking-normal tabular-nums transition-colors duration-500",
                  count ? "border-sand bg-sand text-ink" : "border-line",
                )}
              >
                {count}
              </m.span>
            </button>
          </div>
        </nav>
      </m.header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="eyebrow group relative inline-block py-2">
      {children}
      <span className="absolute inset-x-0 bottom-1 h-px origin-right scale-x-0 bg-sand transition-transform duration-500 ease-premium group-hover:origin-left group-hover:scale-x-100" />
    </Link>
  );
}

function BagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden className={className}>
      <path d="M5 8h14l-1 13H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
