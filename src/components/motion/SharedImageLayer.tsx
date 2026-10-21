"use client";

import Image from "next/image";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { useLenis } from "@/components/motion/SmoothScroll";
import { ease } from "@/lib/motion";
import { useUi } from "@/store/ui";

/**
 * Transición compartida card → galería (FLIP entre rutas).
 * 1. La card registra su imagen y posición (startShared) y navega sin cortina.
 * 2. Aquí se pinta un clon fijo en esa posición sobre un fondo que oculta el cambio de página.
 * 3. La galería del producto informa su posición final (landShared) y el clon vuela hasta ella.
 * 4. Al terminar, la galería muestra su imagen real (endShared).
 */
export function SharedImageLayer() {
  const shared = useUi((s) => s.sharedImage);
  const endShared = useUi((s) => s.endShared);
  const pathname = usePathname();
  const lenis = useLenis();

  // La nueva ruta debe arrancar arriba para que la medición del destino sea correcta.
  useEffect(() => {
    if (!shared) return;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    // Solo al cambiar de ruta, no en cada actualización del estado compartido.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Si el destino nunca aparece (p. ej. producto inexistente), no dejar el clon colgado.
  useEffect(() => {
    if (!shared || shared.to) return;
    const id = setTimeout(endShared, 3000);
    return () => clearTimeout(id);
  }, [shared, endShared]);

  const box = shared?.to ?? shared?.from;

  return (
    <AnimatePresence>
      {shared && box && (
        <m.div key="shared" className="pointer-events-none fixed inset-0 z-70" exit={{ opacity: 0, transition: { duration: 0.25 } }}>
          <m.div
            className="absolute inset-0 bg-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: shared.to ? 0 : 1 }}
            transition={{ duration: shared.to ? 0.9 : 0.35, ease: ease.premium }}
          />
          <m.div
            className="absolute overflow-hidden bg-ink-raised"
            initial={shared.from}
            animate={box}
            transition={{ duration: 0.9, ease: ease.premium }}
            onAnimationComplete={() => shared.to && endShared()}
          >
            {/* Mismo `sizes` que la card: reutiliza la imagen ya descargada y aparece al instante. */}
            <Image src={shared.src} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
