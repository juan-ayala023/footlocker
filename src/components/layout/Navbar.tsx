"use client";

import { TransitionLink as Link } from "@/components/motion/TransitionLink";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "framer-motion";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Logo } from "@/components/brand/Logo";
import { usePageTransition } from "@/components/motion/PageTransition";
import dynamic from "next/dynamic";
import { menu, site } from "@/config/site";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { selectCartCount, useCart } from "@/store/cart";

const MobileMenu = dynamic(() => import("@/components/layout/MobileMenu").then((m) => m.MobileMenu), { ssr: false });

/** Rutas con fondo claro: la barra pasa a blanca con iconos y logo negros. */
const LIGHT_ROUTES = ["/catalogo", "/producto", "/ayuda", "/proposito"];

const SUGGESTIONS = ["Jordan", "Air Force", "Running", "Retro"];

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const count = useCart(selectCartCount);
  const openCart = useCart((s) => s.open);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const light = LIGHT_ROUTES.some((r) => pathname.startsWith(r)) && !menuOpen;
  // En la home, mientras está sobre el banner blanco, la barra va clara con logo e iconos negros.
  const overHero = pathname === "/" && !pastHero && !menuOpen;

  // La barra siempre queda fija y sin fondo; solo cambia el color del texto según lo que haya detrás.
  useMotionValueEvent(scrollY, "change", (y) => setPastHero(y > window.innerHeight * 0.8));

  // Al cambiar de página se cierra el buscador.
  useEffect(() => setSearchOpen(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-premium",
          (light || overHero) && "theme-light text-bone",
          // Fondo solo con el buscador abierto, para que se lean los resultados.
          searchOpen && !menuOpen && "bg-ink",
        )}
      >
        <AnnouncementBar />
        <nav aria-label="Principal" className="container-page grid h-(--nav-row-h) grid-cols-[auto_1fr_auto] items-center gap-6">
          <Link href="/" aria-label={`${site.name}, inicio`} className="-ml-1 block p-1">
            <Logo priority tone={light || overHero ? "dark" : "light"} title="" className="w-16 md:w-20" />
          </Link>

          <ul className="hidden items-center justify-center gap-7 md:flex">
            {menu.map((item) => (
              <li key={item.label} className={cn(item.children && "group/menu relative")}>
                <NavLink href={item.href} highlight={item.highlight}>
                  {item.label}
                  {item.emoji && <span aria-hidden> {item.emoji}</span>}
                </NavLink>
                {item.children && (
                  // Desplegable al pasar el mouse o enfocar con teclado.
                  <div className="invisible absolute top-full left-1/2 z-10 -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-300 group-focus-within/menu:visible group-focus-within/menu:opacity-100 group-hover/menu:visible group-hover/menu:opacity-100">
                    <ul className="min-w-44 rounded-lg border border-line bg-ink p-2 text-bone shadow-xl">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} className="block rounded-md px-3 py-2 text-sm hover:bg-bone/8">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="col-start-3 -mr-2 flex items-center gap-1 sm:gap-2">
            <IconButton label={searchOpen ? "Cerrar búsqueda" : "Buscar"} expanded={searchOpen} onClick={() => setSearchOpen((v) => !v)}>
              <SearchIcon />
            </IconButton>

            <IconButton label={`Abrir carrito, ${count} ${count === 1 ? "producto" : "productos"}`} onClick={openCart}>
              <span className="relative flex">
                <BagIcon />
                {count > 0 && (
                  <m.span
                    key={count}
                    initial={{ scale: 1.6 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, ease: ease.outSoft }}
                    className="absolute inset-x-0 top-[0.6875rem] text-center text-[0.625rem] leading-none font-semibold tabular-nums"
                  >
                    {count}
                  </m.span>
                )}
              </span>
            </IconButton>

            <IconButton
              label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              expanded={menuOpen}
              controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden"
            >
              <span aria-hidden className="relative block h-4 w-6">
                <span className={cn("absolute left-0 h-[1.5px] w-6 bg-current transition-all duration-500 ease-premium", menuOpen ? "top-[7px] rotate-45" : "top-0")} />
                <span className={cn("absolute top-[7px] left-0 h-[1.5px] w-6 bg-current transition-opacity duration-300", menuOpen && "opacity-0")} />
                <span className={cn("absolute left-0 h-[1.5px] w-6 bg-current transition-all duration-500 ease-premium", menuOpen ? "top-[7px] -rotate-45" : "top-[14px]")} />
              </span>
            </IconButton>
          </div>
        </nav>

        <AnimatePresence>{searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}</AnimatePresence>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        onSearch={() => {
          setMenuOpen(false);
          setSearchOpen(true);
        }}
      />
    </>
  );
}

/** Buscador desplegable: envía a /catalogo?q=… (el catálogo filtra por nombre, marca y colección). */
function SearchPanel({ onClose }: { onClose: () => void }) {
  const { navigate } = usePageTransition();
  // Solo se monta en el cliente (tras un click), así que puede leer la URL directamente.
  const [q, setQ] = useState(() => new URLSearchParams(window.location.search).get("q") ?? "");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const go = (term: string) => {
    const t = term.trim();
    navigate(t ? `/catalogo?q=${encodeURIComponent(t)}` : "/catalogo");
    onClose();
  };

  return (
    <m.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.5, ease: ease.premium }}
      className="overflow-hidden border-t border-line"
    >
      <div className="container-page py-5">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            go(q);
          }}
          className="flex items-center gap-3 rounded-full bg-ink-raised px-4"
        >
          <SearchIcon className="size-5 shrink-0 text-stone" />
          <label htmlFor="site-search" className="sr-only">
            Buscar tenis
          </label>
          <input
            ref={input}
            id="site-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar tenis, marcas…"
            autoComplete="off"
            enterKeyHint="search"
            className="h-12 min-w-0 flex-1 bg-transparent text-base placeholder:text-stone focus:outline-none"
          />
          <button type="button" onClick={onClose} className="text-sm text-stone hover:text-bone">
            Cancelar
          </button>
        </form>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-stone">Populares:</span>
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" onClick={() => go(s)} className="rounded-full border border-line px-3 py-1.5 hover:border-bone">
              {s}
            </button>
          ))}
        </div>
      </div>
    </m.div>
  );
}

function IconButton({
  label,
  onClick,
  expanded,
  controls,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  expanded?: boolean;
  controls?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={controls}
      className={cn("flex size-11 items-center justify-center rounded-full transition-colors duration-300 hover:bg-bone/8", className)}
    >
      {children}
    </button>
  );
}

function NavLink({ href, highlight, children }: { href: string; highlight?: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={cn("group relative inline-block py-2 text-[0.9375rem] font-medium", highlight && "text-[#e4002b]")}>
      {children}
      <span className="absolute inset-x-0 bottom-1 h-px origin-right scale-x-0 bg-current transition-transform duration-500 ease-premium group-hover:origin-left group-hover:scale-x-100" />
    </Link>
  );
}

function SearchIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" aria-hidden className="size-6">
      <path d="M8 7.5V6a4 4 0 0 1 8 0v1.5" />
      <path d="M4.5 7.5h15v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11Z" />
    </svg>
  );
}
