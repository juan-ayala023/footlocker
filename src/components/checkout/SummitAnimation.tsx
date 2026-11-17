"use client";

import { m } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { ease } from "@/lib/motion";

/**
 * Animación de la confirmación de compra: un resplandor vino sube desde abajo y el logo
 * se revela de la base al tapón. En estado pendiente el logo respira.
 */
export function SummitAnimation({ state }: { state: "pending" | "success" | "failed" }) {
  const success = state === "success";

  return (
    <div>
      {/* Anclado al contenedor de la página (posicionado), detrás del contenido. */}
      <m.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[60svh] bg-[radial-gradient(ellipse_at_bottom,rgb(107_2_19/0.55)_0%,transparent_70%)]"
        initial={{ opacity: 0, y: "30%" }}
        animate={{ opacity: success ? 1 : 0.5, y: success ? "0%" : "15%" }}
        transition={{ duration: 1.6, ease: ease.premium }}
      />

      <m.div
        aria-hidden
        className="mx-auto w-28 md:w-36"
        initial={{ clipPath: "inset(100% 0% 0% 0%)", y: 40 }}
        animate={
          state === "pending"
            ? { clipPath: "inset(0% 0% 0% 0%)", y: 20, opacity: [1, 0.35, 1] }
            : { clipPath: "inset(0% 0% 0% 0%)", y: 0, opacity: state === "failed" ? 0.35 : 1 }
        }
        transition={
          state === "pending"
            ? { clipPath: { duration: 1.2, ease: ease.premium }, y: { duration: 1.2 }, opacity: { duration: 2.2, repeat: Infinity, ease: "easeInOut" } }
            : { duration: 1.4, ease: ease.premium, delay: 0.3 }
        }
      >
        <Logo title="" className="w-full" />
      </m.div>
    </div>
  );
}
